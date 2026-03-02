/**
 * 方案管理服务
 */
import request from './api';

export interface Plan {
  id: number;
  planNo: string;
  planName: string;
  customer: string;
  releaseDateBegin: string;
  releaseDateEnd: string;
  releaseStatus: number;
  salesType: number;
  mediaRequirements?: string;
  createdAt?: string;
  updatedAt?: string;
  barrierCount?: number;
  frameCount?: number;
  communityCount?: number;
}

export interface CreatePlanRequest {
  planNo: string;
  planName: string;
  customer: string;
  releaseDateBegin: string;
  releaseDateEnd: string;
  mediaRequirements?: string;
  salesType?: number;
}

export interface UpdatePlanRequest extends Partial<CreatePlanRequest> {
  id: number;
}

export const planService = {
  // 获取所有方案
  getAllPlans: () => request<Plan[]>('/plan/list'),

  // 根据ID获取方案
  getPlanById: (id: number) => request<Plan>(`/plan/${id}`),

  // 根据方案编号获取
  getPlanByPlanNo: (planNo: string) => request<Plan>(`/plan/planNo/${planNo}`),

  // 创建方案
  createPlan: (data: CreatePlanRequest) =>
    request<Plan>('/plan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新方案
  updatePlan: (id: number, data: Partial<CreatePlanRequest>) =>
    request<Plan>(`/plan`, {
      method: 'PUT',
      body: JSON.stringify({ id, ...data }),
    }),

  // 删除方案
  deletePlan: (id: number) =>
    request<void>(`/plan/${id}`, {
      method: 'DELETE',
    }),

  // 获取方案详情（包含社区、道闸、框架）
  getPlanDetail: (id: number) => request<any>(`/plan/${id}/detail`),

  // 添加社区到方案
  addCommunity: (planId: number, communityId: number, data: any) =>
    request<any>(`/plan-community`, {
      method: 'POST',
      body: JSON.stringify({ planId, communityId, ...data }),
    }),

  // 添加道闸到方案
  addBarrier: (planId: number, barrierId: number, data: any) =>
    request<any>(`/plan-barrier`, {
      method: 'POST',
      body: JSON.stringify({ planId, barrierId, ...data }),
    }),

  // 添加框架到方案
  addFrame: (planId: number, frameId: number, data: any) =>
    request<any>(`/plan-frame`, {
      method: 'POST',
      body: JSON.stringify({ planId, frameId, ...data }),
    }),
};

export default planService;
