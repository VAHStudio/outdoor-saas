/**
 * 方案框架明细服务
 */
import request from './api';
import type { PageResult } from '../types/query';

export interface PlanFrame {
  id: number;
  planId: number;
  frameId: number;
  planCommunityId: number;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
  plan?: {
    id: number;
    planNo: string;
    planName: string;
  };
  frame?: {
    id: number;
    frameNo: string;
    building: string;
  };
  planCommunity?: {
    id: number;
    communityId: number;
  };
}

export interface PlanFrameQueryParam {
  pageNum?: number;
  pageSize?: number;
  planId?: number;
  frameId?: number;
  releaseStatus?: number;
}

export const planFrameService = {
  // 获取所有方案框架明细
  getAll: () => request<PlanFrame[]>('/plan-frame/list'),

  // 根据ID获取
  getById: (id: number) => request<PlanFrame>(`/plan-frame/${id}`),

  // 分页查询（带过滤参数）
  filterPage: (params: PlanFrameQueryParam) =>
    request<PageResult<PlanFrame>>('/plan-frame/filter/page', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // 根据方案ID获取
  getByPlan: (planId: number) =>
    request<PlanFrame[]>(`/plan-frame/plan/${planId}`),

  // 根据框架ID获取
  getByFrame: (frameId: number) =>
    request<PlanFrame[]>(`/plan-frame/frame/${frameId}`),

  // 根据方案社区ID获取
  getByPlanCommunity: (planCommunityId: number) =>
    request<PlanFrame[]>(`/plan-frame/plan-community/${planCommunityId}`),

  // 根据发布状态获取
  getByStatus: (releaseStatus: number) =>
    request<PlanFrame[]>(`/plan-frame/status/${releaseStatus}`),

  // 创建
  create: (data: Partial<PlanFrame>) =>
    request<PlanFrame>('/plan-frame', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 批量创建
  createBatch: (data: Partial<PlanFrame>[]) =>
    request<PlanFrame[]>('/plan-frame/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 更新
  update: (data: Partial<PlanFrame>) =>
    request<PlanFrame>('/plan-frame', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // 删除
  delete: (id: number) =>
    request<void>(`/plan-frame/${id}`, { method: 'DELETE' }),

  // 批量删除
  deleteBatch: (ids: number[]) =>
    request<void>('/plan-frame/batch', {
      method: 'DELETE',
      body: JSON.stringify(ids),
    }),
};

export default planFrameService;
