<template>
  <div class="mt-3 flex flex-wrap gap-2">
    <button
      v-for="action in actions"
      :key="action.id"
      @click="handleClick(action)"
      :class="[
        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        'border focus:outline-none focus:ring-2 focus:ring-offset-2',
        action.type === 'primary'
          ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 focus:ring-blue-500'
          : action.type === 'danger'
          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 focus:ring-red-500'
          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-gray-500'
      ]"
    >
      <span class="flex items-center gap-1.5">
        <span v-if="action.icon" class="text-base">{{ action.icon }}</span>
        <span>{{ action.label }}</span>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ActionButton } from '@/src/hooks/useAiStreaming.types';

interface Props {
  actions: ActionButton[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'action', action: ActionButton): void;
}>();

const handleClick = (action: ActionButton) => {
  emit('action', action);
};
</script>
