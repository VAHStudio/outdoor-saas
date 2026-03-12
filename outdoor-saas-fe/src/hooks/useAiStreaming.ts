import { ref } from 'vue';
import type { Ref } from 'vue';
import { createEventSource, saveConversationId, getCurrentUserId, saveUserId } from '@/src/services/aiAssistantService';
import type { SseEvent, NavigationAction } from '@/src/types/aiAssistant';
import type { ChatMessage, ToolCallInfo } from './useAiStreaming.types';

export interface UseAiStreamingOptions {
  onNavigation?: (nav: any) => void;
  onToolCall?: (tool: ToolCallInfo) => void;
  onError?: (error: string) => void;
}

export interface UseAiStreamingReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  currentTool: ToolCallInfo | null;
  currentConversationId: string | null;
  sendMessage: (content: string, conversationId?: string) => void;
  stopStreaming: () => void;
  clearMessages: () => void;
  setConversationId: (id: string | null) => void;
}

/**
 * AI 助手流式对话 Composable (Vue 3 版本)
 */
export function useAiStreaming(options: UseAiStreamingOptions = {}) {
  const messages = ref<ChatMessage[]>([]);
  const isStreaming = ref(false);
  const currentTool = ref<ToolCallInfo | null>(null);
  const currentConversationId = ref<string | null>(null);

  // Refs for internal state
  let eventSource: EventSource | null = null;
  let assistantMessageId = '';
  let pendingMessage: string | null = null;
  
  // 设置当前会话ID
  const setConversationId = (id: string | null) => {
    currentConversationId.value = id;
    if (id) {
      saveConversationId(id);
    }
  };

  const sendMessage = (content: string, conversationId?: string) => {
    if (isStreaming.value) {
      console.log('[AI] Cannot send while streaming');
      return;
    }

    console.log('[AI] Sending message:', content);

    // Create message IDs
    const userMessageId = Date.now().toString();
    assistantMessageId = (Date.now() + 1).toString();

    // Add messages to state
    messages.value = [
      ...messages.value,
      { id: userMessageId, role: 'user', content },
      { id: assistantMessageId, role: 'assistant', content: '', isStreaming: true },
    ];

    // Store pending message
    pendingMessage = content;
    isStreaming.value = true;

    // Close existing connection
    if (eventSource) {
      eventSource.close();
    }

    // 获取当前用户ID
    const userId = getCurrentUserId();
    if (userId) {
      saveUserId(userId);
    }

    // Create new EventSource
    console.log('[AI] Creating EventSource...');
    eventSource = createEventSource({ 
      message: content, 
      userId: userId || undefined,
      conversationId 
    });
    console.log('[AI] EventSource created, URL:', eventSource.url);

    // Event handlers
    eventSource.onopen = () => {
      console.log('[AI] EventSource opened');
    };

    // 处理所有类型的事件（使用通用处理器）
    const handleEvent = (event: MessageEvent) => {
      console.log('[AI] ========== SSE Event ==========');
      console.log('[AI] Event type:', event.type);
      console.log('[AI] Event data:', event.data);
      console.log('[AI] Last event ID:', event.lastEventId);
      console.log('[AI] =================================');
      
      if (!event.data) {
        console.log('[AI] Empty event data, skipping');
        return;
      }

      let data: SseEvent;
      try {
        data = JSON.parse(event.data) as SseEvent;
      } catch (e) {
        console.error('[AI] Parse error:', e);
        console.error('[AI] Failed to parse:', event.data);
        return;
      }

      // 从事件数据中获取会话ID
      if (data.conversationId) {
        console.log('[AI] Saving conversation ID from data:', data.conversationId);
        saveConversationId(data.conversationId);
        currentConversationId.value = data.conversationId;
      } else if (event.lastEventId) {
        // 备选：从 event.lastEventId 获取
        console.log('[AI] Saving conversation ID from lastEventId:', event.lastEventId);
        saveConversationId(event.lastEventId);
        currentConversationId.value = event.lastEventId;
      }

      handleSseData(data);
    };

    // 监听所有可能的事件类型
    eventSource.addEventListener('agent_message', handleEvent);
    eventSource.addEventListener('agent_thought', handleEvent);
    eventSource.addEventListener('message_end', handleEvent);
    eventSource.addEventListener('tool_call', handleEvent);
    eventSource.addEventListener('error', handleEvent);
    eventSource.addEventListener('end', handleEvent);
    
    // 也监听默认的 message 事件
    eventSource.onmessage = handleEvent;

    eventSource.onerror = (error: Event) => {
      console.error('[AI] EventSource error:', error);
      options.onError?.('连接错误，请重试');
      cleanup();
    };
  };

  /**
   * 从消息内容中提取 navigation 信息
   * 解析 Markdown JSON 代码块中的 tool_response.navigation
   */
  const extractNavigationFromContent = (content: string): NavigationAction | null => {
    if (!content) return null;
    
    // 匹配 ```json ... ``` 代码块
    const jsonBlockRegex = /```json\n([\s\S]*?)```/;
    const match = content.match(jsonBlockRegex);
    
    if (!match) return null;
    
    try {
      const jsonStr = match[1].trim();
      const parsed = JSON.parse(jsonStr);
      
      // 检查是否有 tool_response.navigation
      if (parsed.tool_response?.navigation) {
        return parsed.tool_response.navigation as NavigationAction;
      }
      
      // 直接检查 navigation
      if (parsed.navigation) {
        return parsed.navigation as NavigationAction;
      }
      
      return null;
    } catch (error) {
      console.error('[AI] 解析内容中的 JSON 失败:', error);
      return null;
    }
  };

  const handleSseData = (data: SseEvent) => {
    const targetId = assistantMessageId;
    
    // 打印完整数据用于调试
    console.log('[AI] Full SSE data:', JSON.stringify(data, null, 2));
    
    // 检查所有可能包含内容的字段（包括嵌套）
    let content = data.content || data.answer || '';
    
    // 检查嵌套结构
    if (!content && (data as any).data) {
      content = (data as any).data.content || (data as any).data.answer || (data as any).data.text || '';
    }
    
    // 检查其他可能的字段名
    if (!content) {
      content = (data as any).text || (data as any).message || (data as any).body || '';
    }

    console.log('[AI] Extracted content:', JSON.stringify(content).substring(0, 100));
    console.log('[AI] Content length:', content.length);

    switch (data.type) {
      case 'agent_message':
      case 'message':
      case 'agent_thought':
        // 更新消息内容（即使是空字符串也更新，以触发UI刷新）
        console.log('[AI] Updating message, targetId:', targetId, 'content:', content);
        console.log('[AI] Current messages:', messages.value.map(m => ({ id: m.id, role: m.role, contentLen: m.content.length })));
        messages.value = messages.value.map((msg) =>
          msg.id === targetId
            ? { ...msg, content: msg.content + content, isStreaming: true }
            : msg
        );
        console.log('[AI] Updated messages:', messages.value.map(m => ({ id: m.id, role: m.role, contentLen: m.content.length, isStreaming: m.isStreaming })));
        break;

      case 'tool_call':
      case 'tool_calls':
        if (data.toolCall) {
          const toolInfo: ToolCallInfo = { name: data.toolCall.toolName || 'unknown', params: {} };
          currentTool.value = toolInfo;
          options.onToolCall?.(toolInfo);
          messages.value = messages.value.map((msg) =>
            msg.id === targetId
              ? { ...msg, toolCalls: [...(msg.toolCalls || []), toolInfo] }
              : msg
          );
        }
        break;

      case 'tool_response':
      case 'tool_responses':
        currentTool.value = null;
        if (data.navigation) {
          try {
            options.onNavigation?.(data.navigation);
            console.log('[AI] 导航执行成功:', data.navigation);
          } catch (error) {
            console.error('[AI] 导航执行失败:', error);
            options.onError?.('页面跳转失败');
          }

          // Record navigation in message for history
          messages.value = messages.value.map((msg) =>
            msg.id === targetId
              ? { ...msg, navigation: data.navigation, isStreaming: false }
              : msg
          );
        }
        break;

      case 'error':
        options.onError?.(data.error || '未知错误');
        messages.value = messages.value.map((msg) =>
          msg.id === targetId ? { ...msg, isStreaming: false } : msg
        );
        cleanup();
        break;

      case 'end':
      case 'workflow_finished':
      case 'message_end':
        console.log('[AI] Stream ended');
        
        // 在流结束时解析消息内容中的 navigation
        const targetMessage = messages.value.find(msg => msg.id === targetId);
        if (targetMessage && targetMessage.role === 'assistant') {
          const navigation = extractNavigationFromContent(targetMessage.content);
          if (navigation) {
            console.log('[AI] 从内容中提取到导航:', navigation);
            try {
              options.onNavigation?.(navigation);
              console.log('[AI] 导航执行成功:', navigation);
            } catch (error) {
              console.error('[AI] 导航执行失败:', error);
              options.onError?.('页面跳转失败');
            }
          }
        }
        
        messages.value = messages.value.map((msg) =>
          msg.id === targetId ? { ...msg, isStreaming: false } : msg
        );
        cleanup();
        break;

      default:
        console.log('[AI] Unknown event type:', data.type);
    }
  };

  const cleanup = () => {
    console.log('[AI] Cleanup');
    isStreaming.value = false;
    currentTool.value = null;
    eventSource?.close();
    eventSource = null;
    assistantMessageId = '';
  };

  const stopStreaming = () => {
    const targetId = assistantMessageId;
    messages.value = messages.value.map((msg) =>
      msg.id === targetId ? { ...msg, isStreaming: false } : msg
    );
    cleanup();
  };

  const clearMessages = () => {
    messages.value = [];
    // 清除对话ID，下次将创建新会话
    localStorage.removeItem('ai_conversation_id');
  };

  return {
    messages,
    isStreaming,
    currentTool,
    currentConversationId,
    sendMessage,
    stopStreaming,
    clearMessages,
    setConversationId,
  };
}

export default useAiStreaming;
