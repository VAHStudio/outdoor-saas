/**
 * 社区/资源管理服务
 */
import request from './api';

export interface Community {
  id: number;
  communityNo: string;
  buildingName: string;
  buildingAddress: string;
  city: string;
  district?: string;
  province?: string;
  mediaType?: string;
  houseCount?: number;
  rent?: number;
  signTime?: string;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
}

export interface BarrierGate {
  id: number;
  gateNo: string;
  deviceNo: string;
  doorLocation: string;
  communityId: number;
  communityName?: string;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
}

export interface Frame {
  id: number;
  frameNo: string;
  building: string;
  unit: string;
  elevator: string;
  communityId: number;
  communityName?: string;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
}

export const communityService = {
  // 获取所有社区
  getAllCommunities: () => request<Community[]>('/community/list'),

  // 根据ID获取社区
  getCommunityById: (id: number) => request<Community>(`/community/${id}`),

  // 获取社区列表（分页）
  getCommunities: (page: number = 1, size: number = 10) =>
    request<Community[]>(`/community/list?page=${page}&size=${size}`),

  // 获取道闸列表
  getBarrierGates: () => request<BarrierGate[]>('/barrier-gate/list'),

  // 获取框架列表
  getFrames: () => request<Frame[]>('/frame/list'),

  // 根据社区获取道闸
  getBarriersByCommunity: (communityId: number) =>
    request<BarrierGate[]>(`/barrier-gates/community/${communityId}`),

  // 根据社区获取框架
  getFramesByCommunity: (communityId: number) =>
    request<Frame[]>(`/frames/community/${communityId}`),
};

export default communityService;
