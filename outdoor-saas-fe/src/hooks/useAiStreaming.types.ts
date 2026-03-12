import type { NavigationAction } from '@/src/types/aiAssistant';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolCalls?: ToolCallInfo[];
  navigation?: NavigationAction;
  thinkContent?: string[]; // 思考内容数组
}

export interface ToolCallInfo {
  name: string;
  params?: Record<string, any>;
}

export interface UseAiStreamingOptions {
  onNavigation?: (nav: NavigationAction) => void;
  onToolCall?: (tool: ToolCallInfo) => void;
  onError?: (error: string) => void;
}

import type { Ref } from 'vue';

export interface UseAiStreamingReturn {
  messages: Ref<ChatMessage[]> | ChatMessage[];
  isStreaming: Ref<boolean> | boolean;
  currentTool: Ref<ToolCallInfo | null> | ToolCallInfo | null;
  sendMessage: (content: string) => void;
  stopStreaming: () => void;
  clearMessages: () => void;
}
