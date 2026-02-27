/**
 * Agent 服务 - 与后端 Agent API 交互
 */

export interface AgentChatRequest {
  message: string;
  sessionId?: string;
  selectedValue?: string;
  context?: Record<string, any>;
}

export interface AgentChatResponse {
  type: string;
  message: string;
  sessionId: string;
  step: string;
  intent?: AgentIntent;
  data?: Record<string, any>;
  actions?: Action[];
  requireConfirmation?: boolean;
}

export interface AgentIntent {
  action: string;
  customer?: string;
  timeDescription?: string;
  dateRange?: DateRange;
  quantity?: number;
  mediaType?: string;
  confirmedCity?: string;
  requirements?: string;
}

export interface DateRange {
  beginDate: string;
  endDate: string;
}

export interface Action {
  label: string;
  value: string;
  type: 'primary' | 'secondary' | 'danger';
}

// 响应类型常量
export const AgentResponseType = {
  TEXT: 'text',
  INTENT_CONFIRM: 'intent_confirm',
  CITY_SELECTION: 'city_selection',
  DATE_SELECTION: 'date_selection',
  POINT_SELECTION: 'point_selection',
  PLAN_CREATED: 'plan_created',
  ERROR: 'error',
  LOADING: 'loading',
} as const;

/**
 * 发送消息到 Agent
 */
export const sendAgentMessage = async (
  request: AgentChatRequest
): Promise<AgentChatResponse> => {
  const response = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Agent 请求失败');
  }

  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '请求失败');
  }

  return result.data;
};

/**
 * 获取可用城市列表
 */
export const getAvailableCities = async (): Promise<string[]> => {
  const response = await fetch('/api/agent/cities');
  const result = await response.json();
  
  if (result.code === 200) {
    return result.data;
  }
  
  return ['南京']; // 默认城市
};

/**
 * 智能创建方案
 */
export const createSmartPlan = async (planData: {
  customer: string;
  beginDate: string;
  endDate: string;
  city: string;
  barrierCount: number;
  mediaRequirements?: string;
}): Promise<any> => {
  const response = await fetch('/api/agent/plan/create-smart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData),
  });

  const result = await response.json();
  
  if (result.code !== 200) {
    throw new Error(result.message || '创建方案失败');
  }

  return result.data;
};
