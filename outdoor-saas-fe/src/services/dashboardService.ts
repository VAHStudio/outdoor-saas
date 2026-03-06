/**
 * Dashboard 统计数据服务
 * 调用后端真实API获取数据
 */
import request from './api';

export interface DashboardStats {
  totalCommunities: number;
  totalBarrierGates: number;
  totalFrames: number;
  availableResources: number;
  monthlyRevenue: number;
  revenueChange: number;
  activePlans: number;
  pendingTasks: number;
  resourceUtilization: number;
  topCommunities: Array<{
    name: string;
    barrierCount: number;
    frameCount: number;
  }>;
  recentPlans: Array<{
    id: number;
    planName: string;
    customer: string;
    status: string;
    date: string;
  }>;
}

export const dashboardService = {
  // 获取Dashboard统计数据
  getStats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>('/dashboard/stats');
  },
  
  // 获取营收趋势数据
  getRevenueTrend: async () => {
    return request<{ labels: string[]; data: number[] }>('/dashboard/revenue-trend');
  },
  
  // 获取资源利用率趋势
  getResourceUtilization: async () => {
    return request<{ labels: string[]; data: number[] }>('/dashboard/resource-utilization');
  },

  // 获取最近的方案列表
  getRecentPlans: async () => {
    return request<Array<{
      id: number;
      planName: string;
      customer: string;
      status: string;
      date: string;
    }>>('/dashboard/recent-plans');
  },

  // 获取社区排行榜
  getTopCommunities: async () => {
    return request<Array<{
      name: string;
      barrierCount: number;
      frameCount: number;
    }>>('/dashboard/top-communities');
  },
};

export default dashboardService;
