<template>
  <div v-if="commands.length > 0" class="px-6 py-4 border-b border-border-light dark:border-border-dark">
    <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">快捷指令</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="cmd in commands"
        :key="cmd.command"
        @click="$emit('select', cmd.command)"
        :disabled="disabled"
        class="px-3 py-1.5 bg-surface-light dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span class="mr-1">{{ cmd.icon }}</span>
        <span class="font-medium">{{ cmd.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickCommand } from './types';

interface Props {
  commands: QuickCommand[];
  disabled?: boolean;
}

defineProps<Props>();
defineEmits(['select']);
</script>
