import type { NavigationAction } from '@/src/types/aiAssistant';

export interface ActionButton {
  id: string;
  label: string;
  type?: 'primary' | 'secondary' | 'danger';
  icon?: string;
  action: string;
  payload?: Record<string, any>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  toolCalls?: ToolCallInfo[];
  thinking?: string; // 思考过程内容
  thinkingTime?: number; // 思考耗时（秒）
  actions?: ActionButton[]; // 操作按钮
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
