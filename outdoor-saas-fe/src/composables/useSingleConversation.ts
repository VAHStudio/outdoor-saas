import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import type { Conversation, ConversationMessage, AiMode } from '@/src/types/aiAssistant';
import {
  getConversations,
  getConversationMessages,
} from '@/src/services/aiAssistantService';

const PAGE_SIZE = 10;

/**
 * 单会话管理 Hook
 * 每个用户每个模式只有一个单会话，所有历史记录保存在该会话中
 */
export function useSingleConversation(mode: Ref<AiMode>) {
  // 状态 - 只保留当前单会话
  const currentConversation = ref<Conversation | null>(null);
  const messages = ref<ConversationMessage[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const hasMoreMessages = ref(true);

  // 分页状态
  const messagePage = ref(0);

  /**
   * 确保单会话存在
   * 如果不存在则自动创建（静默创建，不提示用户）
   */
  const ensureSingleConversation = async (): Promise<Conversation | null> => {
    isLoading.value = true;
    try {
      // 尝试获取该模式的单会话（取第一个）
      const { conversations } = await getConversations(mode.value, 0);
      
      if (conversations.length > 0) {
        // 使用现有的单会话
        currentConversation.value = conversations[0];
        console.log(`[SingleConversation] 使用现有 ${mode.value} 单会话:`, conversations[0].conversationId);
        return conversations[0];
      } else {
        // 没有会话，说明是新用户或数据已清空
        // 在实际使用时，当用户发送第一条消息时后端会自动创建会话
        console.log(`[SingleConversation] 暂无 ${mode.value} 会话，等待首次对话创建`);
        currentConversation.value = null;
        return null;
      }
    } catch (error) {
      console.error('[SingleConversation] 获取单会话失败:', error);
      currentConversation.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载消息历史
   */
  const loadMessages = async (reset = false) => {
    if (!currentConversation.value) {
      console.log('[SingleConversation] 没有当前会话，无法加载消息');
      return;
    }

    if (reset) {
      messagePage.value = 0;
      messages.value = [];
      hasMoreMessages.value = true;
    }

    if (!hasMoreMessages.value && !reset) return;

    isLoading.value = reset;

    try {
      console.log(`[SingleConversation] 加载消息: conversationId=${currentConversation.value.conversationId}, page=${messagePage.value}`);
      
      const { messages: newMsgs, hasMore } = await getConversationMessages(
        currentConversation.value.conversationId,
        messagePage.value
      );

      console.log(`[SingleConversation] 加载到 ${newMsgs.length} 条消息`);

      // prepend 到消息列表（因为分页加载历史消息）
      if (reset) {
        messages.value = newMsgs;
      } else {
        messages.value.unshift(...newMsgs);
      }

      hasMoreMessages.value = hasMore;

      if (hasMore) {
        messagePage.value++;
      }
    } catch (error) {
      console.error('[SingleConversation] 加载消息失败:', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载更多消息（向上滚动）
   */
  const loadMoreMessages = async () => {
    if (isLoadingMore.value || !hasMoreMessages.value) return;
    isLoadingMore.value = true;
    await loadMessages(false);
    isLoadingMore.value = false;
  };

  /**
   * 清空当前消息列表
   */
  const clearMessages = () => {
    messages.value = [];
    messagePage.value = 0;
    hasMoreMessages.value = true;
  };

  /**
   * 获取当前会话ID（用于发送消息）
   */
  const getCurrentConversationId = (): string | null => {
    return currentConversation.value?.conversationId || null;
  };

  // 监听模式变化，自动切换到对应模式的单会话
  watch(mode, async (newMode, oldMode) => {
    if (newMode !== oldMode) {
      console.log(`[SingleConversation] 模式切换: ${oldMode} -> ${newMode}`);
      clearMessages();
      await ensureSingleConversation();
      if (currentConversation.value) {
        await loadMessages(true);
      }
    }
  });

  return {
    // 状态
    currentConversation,
    messages,
    isLoading,
    isLoadingMore,
    hasMoreMessages,
    
    // 方法
    ensureSingleConversation,
    loadMessages,
    loadMoreMessages,
    clearMessages,
    getCurrentConversationId,
  };
}
