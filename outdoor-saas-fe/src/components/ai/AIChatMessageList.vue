<template>
  <div class="space-y-4">
    <template v-if="messages.length === 0">
      <slot name="empty" />
    </template>
    
    <template v-else>
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '']"
      >
        <!-- Avatar -->
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
            message.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
          ]"
        >
          <span v-if="message.role === 'user'">👤</span>
          <span v-else class="text-sm font-bold">智</span>
        </div>

        <!-- Message Content -->
        <div class="max-w-[85%] flex flex-col gap-2">
          <!-- 思考过程折叠区域 - 仅对助手消息显示 -->
          <div
            v-if="message.role === 'assistant' && (message.thinking || message.thinkingTime !== undefined)"
            class="flex flex-col"
          >
            <button
              @click="toggleThinking(message.id)"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
            >
              <span class="text-xs text-gray-600 dark:text-gray-300">
                <span v-if="message.isStreaming && !message.content" class="flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  深度思考中...
                </span>
                <span v-else>
                  已深度思考({{ formatThinkingTime(message.thinkingTime || 0) }})
                </span>
              </span>
              <svg
                :class="['w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform duration-200', isExpanded(message.id) ? 'rotate-180' : '']"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- 思考过程内容 -->
            <div
              v-show="isExpanded(message.id)"
              class="mt-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
            >
              <p class="text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {{ message.thinking || '正在思考中...' }}
              </p>
            </div>
          </div>

          <!-- 正式回复内容 -->
          <div
            v-if="cleanContent(message.content)"
            :class="[
              'rounded-2xl px-4 py-3',
              message.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark'
            ]"
          >
            <!-- 消息文本 -->
            <p 
              :class="[
                'text-sm whitespace-pre-wrap leading-relaxed',
                message.role === 'user' 
                  ? 'text-white' 
                  : 'text-gray-800 dark:text-gray-100'
              ]"
              v-html="formatContent(cleanContent(message.content))"
            />
            
            <!-- 流式加载动画 -->
            <div v-if="message.isStreaming && message.content" class="mt-2 flex gap-1">
              <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0ms" />
              <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 150ms" />
              <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 300ms" />
            </div>

            <!-- 操作按钮组 - 从消息actions或智能识别生成 -->
            <ActionButtons 
              v-if="getMessageActions(message).length > 0"
              :actions="getMessageActions(message)"
              @action="handleAction"
            />
          </div>
        </div>
      </div>

      <!-- Current Tool Indicator -->
      <div v-if="currentTool" class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
          智
        </div>
        <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl px-4 py-3">
          <p class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            正在{{ currentTool.name }}...
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ChatMessage, ToolCallInfo, ActionButton } from '@/src/hooks/useAiStreaming.types';
import ActionButtons from './ActionButtons.vue';

interface Props {
  messages: ChatMessage[];
  currentTool?: ToolCallInfo | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'action', action: ActionButton): void;
}>();

// 思考过程展开状态管理
const expandedThinking = ref<Set<string>>(new Set());

const toggleThinking = (messageId: string) => {
  if (expandedThinking.value.has(messageId)) {
    expandedThinking.value.delete(messageId);
  } else {
    expandedThinking.value.add(messageId);
  }
};

const isExpanded = (messageId: string) => {
  return expandedThinking.value.has(messageId);
};

// 格式化思考时间
const formatThinkingTime = (seconds: number) => {
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`;
  }
  return `${seconds.toFixed(1)}s`;
};

// 清理内容 - 移除代码块和工具响应
const cleanContent = (content: string | undefined): string => {
  if (!content) return '';
  
  // 移除 ```json ... ``` 代码块
  let cleaned = content.replace(/```json\s*[\s\S]*?```/g, '');
  // 移除 ``` ... ``` 代码块
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
  // 移除 tool_response JSON
  cleaned = cleaned.replace(/\{[\s\S]*"tool_response"[\s\S]*\}/g, '');
  // 移除多余的空行
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
};

// 格式化内容 - 处理加粗等Markdown
const formatContent = (content: string): string => {
  if (!content) return '';
  
  // 将 **文本** 转换为加粗标签
  let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // 处理列表项样式（在暗黑模式下确保可读性）
  formatted = formatted.replace(/^-\s+(.*)$/gm, '<span class="flex items-start gap-2"><span class="text-blue-500 mt-1.5">•</span><span>$1</span></span>');
  
  return formatted;
};

// 处理按钮点击
const handleAction = (action: ActionButton) => {
  emit('action', action);
};

// 智能识别消息意图并生成操作按钮
const getMessageActions = (message: ChatMessage): ActionButton[] => {
  // 如果消息已有actions，直接返回
  if (message.actions && message.actions.length > 0) {
    return message.actions;
  }
  
  // 只处理助手消息且非流式状态
  if (message.role !== 'assistant' || message.isStreaming) {
    return [];
  }
  
  const content = message.content || '';
  const actions: ActionButton[] = [];
  
  // 识别方案创建成功后的操作
  if (content.includes('方案') && (content.includes('创建成功') || content.includes('已创建'))) {
    // 提取方案ID或方案编号
    const planIdMatch = content.match(/方案ID[：:]\s*(\d+)/i) || content.match(/ID[：:]\s*(\d+)/);
    const planNoMatch = content.match(/方案编号[：:]\s*([A-Z0-9-]+)/i);
    
    const planId = planIdMatch ? planIdMatch[1] : null;
    const planNo = planNoMatch ? planNoMatch[1] : null;
    
    if (planId || planNo) {
      actions.push({
        id: 'view_plan',
        label: '👁️ 查看方案详情',
        type: 'primary',
        action: 'navigate',
        payload: { target: `/plans/${planId || ''}`, planNo }
      });
      
      actions.push({
        id: 'lock_resources',
        label: '🔒 锁定点位',
        type: 'secondary',
        action: 'confirm',
        payload: { 
          message: `锁定方案${planNo || planId}的点位`,
          planId,
          planNo,
          actionType: 'lock'
        }
      });
    }
  }
  
  // 识别需要确认创建的场景
  if (content.includes('确认') && content.includes('创建') && !content.includes('成功')) {
    actions.push({
      id: 'confirm_create',
      label: '✅ 确认创建',
      type: 'primary',
      action: 'confirm',
      payload: { message: '确认创建', actionType: 'create' }
    });
    
    actions.push({
      id: 'cancel',
      label: '❌ 取消',
      type: 'secondary',
      action: 'cancel'
    });
  }
  
  // 识别方案相关的查看操作
  if (content.includes('方案') && (content.includes('详情') || content.includes('信息'))) {
    const planIdMatch = content.match(/方案ID[：:]\s*(\d+)/i) || content.match(/ID[：:]\s*(\d+)/);
    if (planIdMatch) {
      actions.push({
        id: 'view_plan_detail',
        label: '👁️ 查看详情',
        type: 'primary',
        action: 'navigate',
        payload: { target: `/plans/${planIdMatch[1]}` }
      });
    }
  }
  
  // 识别客户相关的操作
  if (content.includes('客户') && (content.includes('创建成功') || content.includes('已添加'))) {
    actions.push({
      id: 'view_customers',
      label: '📋 查看客户列表',
      type: 'secondary',
      action: 'navigate',
      payload: { target: '/customers' }
    });
    
    actions.push({
      id: 'add_followup',
      label: '📝 添加跟进记录',
      type: 'secondary',
      action: 'confirm',
      payload: { message: '添加跟进记录', actionType: 'followup' }
    });
  }
  
  // 识别资源查询后的操作
  if (content.includes('资源') || content.includes('点位') || content.includes('社区')) {
    if (content.includes('空位') || content.includes('可用') || content.includes('空闲')) {
      actions.push({
        id: 'view_resources',
        label: '📍 查看资源地图',
        type: 'secondary',
        action: 'navigate',
        payload: { target: '/communities' }
      });
    }
  }
  
  // 识别上刊/执行相关
  if (content.includes('上刊') || content.includes('执行') || content.includes('任务')) {
    actions.push({
      id: 'view_execution',
      label: '📊 查看执行进度',
      type: 'secondary',
      action: 'navigate',
      payload: { target: '/execution' }
    });
    
    actions.push({
      id: 'arrange_task',
      label: '🚚 安排任务',
      type: 'primary',
      action: 'confirm',
      payload: { message: '安排上刊任务', actionType: 'task' }
    });
  }
  
  // 识别财务相关
  if (content.includes('应收') || content.includes('回款') || content.includes('款项')) {
    actions.push({
      id: 'view_receivable',
      label: '💰 查看应收明细',
      type: 'secondary',
      action: 'navigate',
      payload: { target: '/finance/receivable' }
    });
    
    actions.push({
      id: 'export_statement',
      label: '📄 导出对账单',
      type: 'secondary',
      action: 'confirm',
      payload: { message: '导出对账单', actionType: 'export' }
    });
  }
  
  // 识别故障/报修相关
  if (content.includes('故障') || content.includes('维修') || content.includes('报修')) {
    actions.push({
      id: 'view_repair_status',
      label: '🔧 查看维修进度',
      type: 'secondary',
      action: 'navigate',
      payload: { target: '/maintenance' }
    });
  }
  
  // 识别业绩相关
  if (content.includes('业绩') || content.includes('销售')) {
    actions.push({
      id: 'view_performance',
      label: '📈 查看业绩详情',
      type: 'secondary',
      action: 'navigate',
      payload: { target: '/analytics/performance' }
    });
  }
  
  return actions.slice(0, 3); // 最多显示3个按钮
};
</script>
