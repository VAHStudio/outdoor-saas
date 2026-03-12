<template>
  <div 
    v-if="suggestions.length > 0" 
    class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30"
  >
    <p class="text-xs text-gray-600 dark:text-gray-300 mb-2 font-medium">您可以继续问：</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="handleClick(suggestion)"
        class="px-3 py-1.5 rounded-full text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-medium"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  suggestions: string[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', suggestion: string): void;
}>();

const handleClick = (suggestion: string) => {
  emit('select', suggestion);
};
</script>
