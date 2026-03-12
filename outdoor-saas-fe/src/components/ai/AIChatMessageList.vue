<template>
  <div class="space-y-4">
    <template v-if="messages.length === 0">
      <slot name="empty" />
    </template>
    
    <template v-else>
      <div
        v-for="(message, msgIndex) in processedMessages"
        :key="message.id"
        :class="['flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '']"
      >
        <!-- Avatar -->
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
            message.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark'
          ]"
        >
          <span v-if="message.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>

        <!-- Message Content -->
        <div
          :class="[
            'max-w-[80%] rounded-2xl px-4 py-3',
            message.role === 'user'
              ? 'bg-primary text-white'
              : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark'
          ]"
        >
          <!-- Thinking Blocks -->
          <div v-if="message.thinkBlocks && message.thinkBlocks.length > 0" class="mb-3 space-y-2">
            <div
              v-for="(block, blockIndex) in message.thinkBlocks"
              :key="blockIndex"
              class="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden"
            >
              <button
                @click="toggleThinkBlock(msgIndex, blockIndex)"
                class="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
              >
                <svg
                  :class="['w-4 h-4 transition-transform', isThinkBlockExpanded(msgIndex, blockIndex) ? 'rotate-90' : '']"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                <span class="text-xs text-gray-500 dark:text-gray-400">已深度思考</span>
              </button>
              <div
                v-show="isThinkBlockExpanded(msgIndex, blockIndex)"
                class="px-3 pb-3 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap border-t border-gray-200 dark:border-gray-700 pt-2"
              >
                {{ block }}
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="text-sm prose prose-sm dark:prose-invert max-w-none" v-html="renderMarkdown(message.displayContent)"></div>
          
          <div v-if="message.isStreaming" class="mt-2 flex gap-1">
            <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 0ms" />
            <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 150ms" />
            <span class="w-2 h-2 bg-current rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>

      <!-- Current Tool Indicator -->
      <div v-if="currentTool" class="flex gap-3">
        <div class="w-8 h-8 rounded-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center flex-shrink-0">
          <span>🔧</span>
        </div>
        <div class="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl px-4 py-3">
          <p class="text-sm text-subtext-light dark:text-subtext-dark">
            正在{{ currentTool.name }}...
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ChatMessage, ToolCallInfo } from '@/src/hooks/useAiStreaming.types';

interface Props {
  messages: ChatMessage[];
  currentTool?: ToolCallInfo | null;
}

const props = defineProps<Props>();

// Track expanded state of think blocks
const expandedThinkBlocks = ref<Set<string>>(new Set());

const toggleThinkBlock = (msgIndex: number, blockIndex: number) => {
  const key = `${msgIndex}-${blockIndex}`;
  if (expandedThinkBlocks.value.has(key)) {
    expandedThinkBlocks.value.delete(key);
  } else {
    expandedThinkBlocks.value.add(key);
  }
};

const isThinkBlockExpanded = (msgIndex: number, blockIndex: number) => {
  return expandedThinkBlocks.value.has(`${msgIndex}-${blockIndex}`);
};

// Extended message type with display properties
interface ProcessedMessage extends ChatMessage {
  displayContent: string;
  thinkBlocks?: string[];
}

// Process messages to extract think blocks
const processedMessages = computed<ProcessedMessage[]>(() => {
  return props.messages.map(message => {
    if (message.role === 'user') {
      return {
        ...message,
        displayContent: message.content,
      };
    }

    const thinkBlocks: string[] = [];
    let displayContent = message.content;

    // Extract <think> blocks
    const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
    let match;
    while ((match = thinkRegex.exec(message.content)) !== null) {
      thinkBlocks.push(match[1].trim());
    }

    // Remove think blocks from display content
    displayContent = displayContent.replace(/<think>[\s\S]*?<\/think>/g, '');

    // Remove JSON code blocks (tool_response)
    displayContent = displayContent.replace(/```json\n[\s\S]*?```/g, '');

    // Clean up extra whitespace
    displayContent = displayContent.replace(/\n{3,}/g, '\n\n').trim();

    return {
      ...message,
      displayContent,
      thinkBlocks: thinkBlocks.length > 0 ? thinkBlocks : undefined,
    };
  });
});

// Simple markdown renderer
const renderMarkdown = (content: string): string => {
  if (!content) return '';
  
  return content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:underline" target="_blank">$1</a>')
    // Lists
    .replace(/^\s*[-*+]\s+(.+)$/gim, '<li class="ml-4">$1</li>')
    // Line breaks
    .replace(/\n/g, '<br>');
};
</script>

<style scoped>
.prose :deep(h1), .prose :deep(h2), .prose :deep(h3) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5em;
}

.prose :deep(li) {
  margin: 0.25em 0;
}
</style>
