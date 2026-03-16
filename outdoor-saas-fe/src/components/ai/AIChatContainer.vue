<template>
  <div :class="['h-full flex flex-col bg-background-light dark:bg-background-dark', className]">
    <!-- Header - 简化版，只有模式切换和关闭 -->
    <AIChatHeader
      v-if="showHeader"
      :title="title"
      :subtitle="subtitle"
      :current-mode="streamingState.currentMode.value"
      :disabled="streamingState.isStreaming.value"
      @clear="handleClear"
      @change-mode="handleModeChange"
    />

    <!-- 模式切换提示 -->
    <div
      v-if="showModeChangeTip"
      class="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-border-light dark:border-border-dark"
    >
      <p class="text-sm text-blue-600 dark:text-blue-400 text-center">
        已切换到 {{ streamingState.currentMode.value === 'DIFY' ? 'Dify' : '智能体' }} 模式
        <button
          @click="showModeChangeTip = false"
          class="ml-2 text-blue-400 hover:text-blue-600"
        >
          ×
        </button>
      </p>
    </div>

    <!-- 加载状态提示 -->
    <div
      v-if="singleConvState.isLoading.value && !singleConvState.messages.value.length"
      class="flex items-center justify-center py-4 text-gray-500"
    >
      <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
      <span>加载历史记录...</span>
    </div>

    <!-- Quick Commands - 仅在首次使用且无消息时显示 -->
    <AIQuickCommands
      v-if="!hasMessages && !singleConvState.isLoading.value"
      :commands="quickCommands"
      @select="handleQuickCommand"
      :disabled="streamingState.isStreaming.value"
    />

    <!-- Message List - 支持向上滚动加载更多历史 -->
    <div 
      ref="messageContainerRef"
      class="flex-1 overflow-y-auto px-6 py-6"
      @scroll="handleMessageScroll"
    >
      <!-- 加载更多历史消息 -->
      <div v-if="singleConvState.isLoadingMore.value" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-sm text-gray-500">加载历史消息...</span>
      </div>
      
      <div v-if="!singleConvState.hasMoreMessages.value && singleConvState.messages.value.length > 0" 
           class="text-center py-4 text-gray-400 text-sm">
        ── 以上是历史消息 ──
      </div>

      <AIChatMessageList
        :messages="messages"
        :current-tool="streamingState.currentTool.value"
        @action="handleAction"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center h-full text-center">
            <div class="w-20 h-20 mb-6 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
              <span class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-purple-600">智</span>
            </div>
            <h2 class="text-xl font-medium text-text-light dark:text-text-dark mb-3">
              你好，我是投小智
            </h2>
            <p class="text-sm text-subtext-light dark:text-subtext-dark max-w-md">
              您的专属AI员工，可以帮您查询和管理社区、道闸、框架、方案等信息。
              <br />
              点击上方快捷指令或输入您想了解的内容。
            </p>
          </div>
        </template>
      </AIChatMessageList>
      <div ref="messagesEndRef" />
    </div>

    <!-- Suggested Topics -->
    <SuggestedTopics
      v-if="lastMessage && !streamingState.isStreaming.value"
      :suggestions="suggestedTopics"
      @select="handleSuggestion"
    />

    <!-- Input -->
    <AIChatInput
      v-model="input"
      @send="handleSend"
      @stop="streamingState.stopStreaming"
      :is-streaming="streamingState.isStreaming.value"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAiStreaming } from '@/src/hooks/useAiStreaming';
import { useSingleConversation } from '@/src/composables/useSingleConversation';
import type { NavigationAction, QuickCommand } from '@/src/components/ai/types';
import type { ActionButton, ChatMessage } from '@/src/hooks/useAiStreaming.types';
import type { AiMode, ConversationMessage } from '@/src/types/aiAssistant';
import AIChatHeader from './AIChatHeader.vue';
import AIChatMessageList from './AIChatMessageList.vue';
import AIChatInput from './AIChatInput.vue';
import AIQuickCommands from './AIQuickCommands.vue';
import SuggestedTopics from './SuggestedTopics.vue';

const showToast = (type: string, message: string, duration: number = 3000) => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    type === 'warning' ? 'bg-yellow-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
};

interface Props {
  title?: string;
  subtitle?: string;
  quickCommands?: QuickCommand[];
  placeholder?: string;
  className?: string;
  showHeader?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '投小智',
  subtitle: '你的AI员工',
  placeholder: '输入指令，例如：查询所有社区...',
  className: '',
  showHeader: true,
  quickCommands: () => [
    { label: '查今天跟进', command: '今天有哪些客户需要跟进', icon: '📞' },
    { label: '查本月业绩', command: '查看本月业绩完成情况', icon: '💰' },
    { label: '查逾期应收', command: '查看有哪些逾期未收款', icon: '⚠️' },
    { label: '新建方案', command: '帮我新建一个投放方案', icon: '📝' },
    { label: '查空位资源', command: '查询杭州5月份有哪些空位', icon: '📍' },
    { label: '查上刊进度', command: '查看在投方案的上刊进度', icon: '📊' },
    { label: '安排上刊任务', command: '安排明天的上刊任务', icon: '🚚' },
    { label: '报修登记', command: '我要登记一个点位故障', icon: '🔧' },
  ],
});

const router = useRouter();
const input = ref('');
const messagesEndRef = ref<HTMLDivElement>();
const messageContainerRef = ref<HTMLDivElement>();
const showModeChangeTip = ref(false);

// 当前AI模式
const currentMode = ref<AiMode>('DIFY');

// AI Streaming hook
const streamingState = useAiStreaming({
  onNavigation: handleNavigation,
  onError: (error: string) => showToast('error', error),
});

// 同步 streamingState 的模式到 currentMode
watch(() => streamingState.currentMode.value, (newMode) => {
  currentMode.value = newMode;
}, { immediate: true });

// 单会话管理（简化版）
const singleConvState = useSingleConversation(currentMode);

// 组合消息：历史消息 + 当前流消息
const messages = computed((): ChatMessage[] => {
  // 转换历史消息格式
  const historyMsgs: ChatMessage[] = singleConvState.messages.value.map((msg: ConversationMessage) => ({
    id: String(msg.id),
    role: msg.role,
    content: msg.content,
    thinking: msg.thinking,
    isStreaming: false,
  }));
  
  // 合并当前流消息
  return [...historyMsgs, ...streamingState.messages.value];
});

const hasMessages = computed(() => messages.value.length > 0);

// 获取最后一条助手消息
const lastMessage = computed(() => {
  const msgs = messages.value;
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].role === 'assistant' && !msgs[i].isStreaming) {
      return msgs[i];
    }
  }
  return null;
});

// 建议话题
const suggestedTopics = computed(() => {
  const topics: string[] = [];
  const msg = lastMessage.value;
  if (!msg) return topics;
  
  const content = msg.content || '';
  
  if (content.includes('方案')) topics.push('查看方案详情', '复制此方案', '锁定点位避免被抢');
  if (content.includes('客户')) topics.push('查看客户联系方式', '记录本次沟通', '查看客户历史方案');
  if (content.includes('资源') || content.includes('点位') || content.includes('社区') || content.includes('空位')) {
    topics.push('这些资源的价格是多少', '帮我筛选高端社区', '查这些点位的档期');
  }
  if (content.includes('上刊') || content.includes('执行') || content.includes('任务')) {
    topics.push('查看上刊完成率', '安排工程人员', '查看上刊照片');
  }
  if (content.includes('款') || content.includes('钱') || content.includes('收') || content.includes('财务')) {
    topics.push('查看应收款明细', '生成对账单', '查看客户回款记录');
  }
  if (content.includes('故障') || content.includes('坏') || content.includes('维修') || content.includes('报修')) {
    topics.push('查看维修进度', '联系维修人员', '评估对客户的影响');
  }
  if (content.includes('业绩') || content.includes('销售') || content.includes('完成率')) {
    topics.push('查看本月回款情况', '查看在跟商机', '查看团队排名');
  }
  
  if (topics.length === 0) {
    topics.push('我今天有哪些跟进任务', '本月业绩完成情况', '有哪些逾期未收款', '查询杭州空位资源');
  }
  
  return topics.slice(0, 4);
});

// 有效的内部路由列表
const validRoutes = ['/', '/plans', '/plan', '/communities', '/community', '/frames', '/frame', '/barrier-gates', '/barrier-gate', '/plan-communities', '/plan-frames', '/plan-barriers', '/ai-assistant'];

// Navigation handler
function handleNavigation(nav: NavigationAction) {
  if (nav.message) showToast('info', nav.message);
  
  if (nav.action === 'navigate' && nav.target) {
    if (nav.target.startsWith('http') || nav.target.startsWith('//')) {
      showToast('error', '不支持跳转到外部链接');
      return;
    }
    
    const isValidRoute = validRoutes.some(route => nav.target.startsWith(route));
    if (!isValidRoute) {
      showToast('error', '无效的页面跳转');
      return;
    }
    
    const routeLocation: { path: string; query?: Record<string, string> } = { path: nav.target };
    if (nav.params && Object.keys(nav.params).length > 0) {
      routeLocation.query = {};
      for (const [key, value] of Object.entries(nav.params)) {
        if (value !== null && value !== undefined) routeLocation.query[key] = String(value);
      }
    }
    
    router.push(routeLocation);
  }
  
  if (nav.toast) showToast(nav.toast.type, nav.toast.message, nav.toast.duration);
}

// 处理模式切换
const handleModeChange = async (mode: AiMode) => {
  if (streamingState.isStreaming.value) {
    showToast('warning', '对话进行中，请稍后再切换模式');
    return;
  }

  streamingState.setMode(mode);
  showModeChangeTip.value = true;
  setTimeout(() => showModeChangeTip.value = false, 3000);
  
  // 清空当前消息
  streamingState.clearMessages();
  
  // 单会话 Hook 会自动处理模式切换
};

// 清空消息
const handleClear = () => {
  streamingState.clearMessages();
  singleConvState.clearMessages();
};

// 消息区域滚动加载更多
const handleMessageScroll = () => {
  if (!messageContainerRef.value) return;
  const { scrollTop } = messageContainerRef.value;
  if (scrollTop < 50 && !singleConvState.isLoadingMore.value) {
    singleConvState.loadMoreMessages();
  }
};

// 发送消息
const handleSend = () => {
  if (!input.value.trim() || streamingState.isStreaming.value) return;
  
  const conversationId = singleConvState.getCurrentConversationId();
  
  if (!conversationId) {
    // 没有会话ID时，让后端自动创建会话
    console.log('[Send] 没有现有会话，后端将自动创建');
  }
  
  streamingState.sendMessage(input.value, conversationId || undefined);
  input.value = '';
};

// 快速指令
const handleQuickCommand = (command: string) => {
  if (streamingState.isStreaming.value) return;
  streamingState.sendMessage(command);
};

// 建议话题
const handleSuggestion = (suggestion: string) => {
  streamingState.sendMessage(suggestion);
};

// 处理按钮点击
const handleAction = (action: ActionButton) => {
  switch (action.action) {
    case 'navigate':
      if (action.payload?.target) router.push(action.payload.target);
      break;
    case 'confirm':
      if (action.payload?.message) streamingState.sendMessage(action.payload.message);
      break;
    case 'create':
    case 'update':
    case 'delete':
      showToast('success', action.payload?.successMessage || '操作成功');
      break;
  }
};

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    messagesEndRef.value?.scrollIntoView({ behavior: 'smooth' });
  });
}, { deep: true });

// 初始化 - 自动获取单会话
onMounted(async () => {
  console.log('[AIChatContainer] 初始化单会话模式');
  await singleConvState.ensureSingleConversation();
  if (singleConvState.currentConversation.value) {
    await singleConvState.loadMessages(true);
  }
});
</script>
