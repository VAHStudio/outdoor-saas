/**
 * Dashboard 统计数据服务
 * 由于后端暂时没有专门的统计数据API，这里使用模拟数据
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

// 模拟数据
const mockStats: DashboardStats = {
  totalCommunities: 156,
  totalBarrierGates: 468,
  totalFrames: 1240,
  availableResources: 890,
  monthlyRevenue: 89400,
  revenueChange: -2.1,
  activePlans: 12,
  pendingTasks: 8,
  resourceUtilization: 75,
  topCommunities: [
    { name: '万科翡翠公园', barrierCount: 3, frameCount: 12 },
    { name: '中海国际社区', barrierCount: 2, frameCount: 8 },
    { name: '保利罗兰春天', barrierCount: 2, frameCount: 10 },
    { name: '碧桂园凤凰城', barrierCount: 4, frameCount: 15 },
    { name: '龙湖春江郦城', barrierCount: 3, frameCount: 9 },
  ],
  recentPlans: [
    { id: 1, planName: '可口可乐夏季促销方案', customer: '可口可乐', status: '进行中', date: '2025-06-01' },
    { id: 2, planName: '华为Mate系列新品发布', customer: '华为', status: '待确认', date: '2025-06-15' },
    { id: 3, planName: '小米智能家居全场景投放', customer: '小米', status: '已完成', date: '2025-05-20' },
  ],
};

export const dashboardService = {
  // 获取Dashboard统计数据
  getStats: async (): Promise<DashboardStats> => {
    // 实际项目中应该从后端获取
    // return request<DashboardStats>('/dashboard/stats');
    
    // 现在返回模拟数据
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStats), 500);
    });
  },
  
  // 获取营收趋势数据
  getRevenueTrend: async () => {
    return {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      data: [65000, 72000, 68000, 85000, 91300, 89400],
    };
  },
  
  // 获取资源利用率趋势
  getResourceUtilization: async () => {
    return {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: [72, 75, 73, 78, 76, 74, 75],
    };
  },
};

export default dashboardService;
