<template>
  <div class="max-w-5xl mx-auto space-y-6 pb-12">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-slate-500 dark:text-slate-400">加载选点数据中...</p>
      </div>
    </div>

    <template v-else>
      <!-- Header Info -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ plan.title }}</h1>
              <span :class="['text-xs px-2.5 py-1 rounded-full font-medium', getStatusColor(plan.status)]">
                {{ getStatusText(plan.status) }}
              </span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-mono">{{ plan.id }} · 更新于 {{ plan.updatedAt }}</p>
          </div>
          <button 
            @click="$router.push(`/plans/${numericId}`)"
            class="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-colors flex items-center gap-2"
          >
            <Icon name="arrow_forward" :size="18" />
            查看完整详情
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">客户</span>
            <p class="font-medium text-slate-900 dark:text-white flex items-center gap-2">
              <Icon name="business" class="text-slate-400" :size="18" />
              {{ plan.customer }}
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">预算</span>
            <p class="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Icon name="payments" class="text-emerald-500" :size="18" />
              ¥ {{ plan.budget.toLocaleString() }}
            </p>
          </div>
          <div class="space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">媒体类型</span>
            <div class="flex flex-wrap gap-2 mt-1">
              <span 
                v-for="(type, idx) in plan.mediaTypes" 
                :key="idx" 
                class="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-800/50"
              >
                {{ type }}
              </span>
            </div>
          </div>
          <div class="md:col-span-3 space-y-1">
            <span class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">需求说明</span>
            <p class="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-border-light dark:border-border-dark leading-relaxed">
              {{ plan.requirements }}
            </p>
          </div>
        </div>
      </div>

      <!-- 社区列表 -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
        <div class="p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/30">
          <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="apartment" class="text-primary" :size="20" />
            关联社区 ({{ communities.length }})
          </h2>
        </div>
        <div v-if="communities.length === 0" class="p-8 text-center text-slate-500 dark:text-slate-400">
          暂无关联社区
        </div>
        <div v-else class="divide-y divide-border-light dark:divide-border-dark">
          <div v-for="community in communities" :key="community.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-slate-900 dark:text-white">{{ community.community?.buildingName || '-' }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ community.community?.communityNo || '-' }}</p>
              </div>
              <div class="text-right text-sm text-slate-500">
                <p>道闸: {{ community.barrierRequiredQty || 0 }} | 框架: {{ community.frameRequiredQty || 0 }}</p>
                <p class="text-xs">{{ community.releaseDateBegin || '-' }} ~ {{ community.releaseDateEnd || '-' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 道闸列表 -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
        <div class="p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/30">
          <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="gate" class="text-primary" :size="20" />
            关联道闸 ({{ barriers.length }})
          </h2>
        </div>
        <div v-if="barriers.length === 0" class="p-8 text-center text-slate-500 dark:text-slate-400">
          暂无关联道闸
        </div>
        <div v-else class="divide-y divide-border-light dark:divide-border-dark">
          <div v-for="barrier in barriers" :key="barrier.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-slate-900 dark:text-white">{{ barrier.barrierGate?.gateNo || '-' }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ barrier.planCommunity?.community?.buildingName || '-' }}</p>
              </div>
              <span :class="['px-2 py-1 rounded text-xs', getReleaseStatusColor(barrier.releaseStatus)]">
                {{ getReleaseStatusText(barrier.releaseStatus) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 框架列表 -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
        <div class="p-4 border-b border-border-light dark:border-border-dark bg-slate-50/50 dark:bg-slate-800/30">
          <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Icon name="ad_units" class="text-primary" :size="20" />
            关联框架 ({{ frames.length }})
          </h2>
        </div>
        <div v-if="frames.length === 0" class="p-8 text-center text-slate-500 dark:text-slate-400">
          暂无关联框架
        </div>
        <div v-else class="divide-y divide-border-light dark:divide-border-dark">
          <div v-for="frame in frames" :key="frame.id" class="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-slate-900 dark:text-white">{{ frame.frame?.frameNo || '-' }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ frame.planCommunity?.community?.buildingName || '-' }}</p>
              </div>
              <span :class="['px-2 py-1 rounded text-xs', getReleaseStatusColor(frame.releaseStatus)]">
                {{ getReleaseStatusText(frame.releaseStatus) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mockups -->
      <div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-border-light dark:border-border-dark p-6">
        <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
          <Icon name="image" class="text-primary" :size="20" />
          设计小样图
        </h2>
        <div v-if="plan.mockups.length === 0" class="h-32 flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark rounded-xl text-slate-400 text-sm">
          暂无设计图
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(url, idx) in plan.mockups" 
            :key="idx" 
            class="aspect-video rounded-lg overflow-hidden border border-border-light dark:border-border-dark group relative cursor-pointer"
          >
            <img :src="url" :alt="`Mockup ${idx + 1}`" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerpolicy="no-referrer" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Icon name="zoom_in" class="text-white" :size="20" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Icon from '@/src/components/Icon.vue';
import { planCommunityService } from '@/src/services/planCommunityService';
import { planBarrierService } from '@/src/services/planBarrierService';
import { planFrameService } from '@/src/services/planFrameService';

interface DisplayPlan {
  id: string;
  title: string;
  customer: string;
  status: 'draft' | 'communicating' | 'pending' | 'signed';
  budget: number;
  requirements: string;
  mediaTypes: string[];
  points: any[];
  mockups: string[];
  updatedAt: string;
}

interface PlanCommunity {
  id: number;
  planId: number;
  communityId: number;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  barrierRequiredQty?: number;
  frameRequiredQty?: number;
  releaseStatus?: number;
  community?: {
    id: number;
    communityNo: string;
    buildingName: string;
  };
}

interface PlanBarrier {
  id: number;
  planId: number;
  barrierGateId: number;
  planCommunityId?: number;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
  barrierGate?: {
    id: number;
    gateNo: string;
    deviceNo?: string;
    doorLocation?: string;
  };
  planCommunity?: {
    id: number;
    communityId: number;
    community?: {
      buildingName: string;
    };
  };
}

interface PlanFrame {
  id: number;
  planId: number;
  frameId: number;
  planCommunityId?: number;
  releaseDateBegin?: string;
  releaseDateEnd?: string;
  releaseStatus?: number;
  frame?: {
    id: number;
    frameNo: string;
    building?: string;
    unit?: string;
    elevator?: string;
  };
  planCommunity?: {
    id: number;
    communityId: number;
    community?: {
      buildingName: string;
    };
  };
}

const props = defineProps<{
  plan: DisplayPlan;
  numericId: number;
}>();

const router = useRouter();

const communities = ref<PlanCommunity[]>([]);
const barriers = ref<PlanBarrier[]>([]);
const frames = ref<PlanFrame[]>([]);
const loading = ref(false);
const error = ref('');

const loadPlanDetail = async () => {
  if (!props.numericId) return;
  
  try {
    loading.value = true;
    error.value = '';
    
    // 并行加载关联数据
    const [communitiesData, barriersData, framesData] = await Promise.all([
      planCommunityService.getByPlan(props.numericId),
      planBarrierService.getByPlan(props.numericId),
      planFrameService.getByPlan(props.numericId),
    ]);

    communities.value = communitiesData;
    barriers.value = barriersData;
    frames.value = framesData;
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载失败';
    console.error('加载方案详情失败:', err);
  } finally {
    loading.value = false;
  }
};

// 监听 numericId 变化，重新加载数据
watch(() => props.numericId, (newId) => {
  if (newId) {
    loadPlanDetail();
  }
}, { immediate: true });

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    draft: '草稿',
    communicating: '沟通中',
    pending: '待确认',
    signed: '已签约'
  };
  return map[status] || status;
};

const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    draft: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    communicating: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
    pending: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    signed: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
  };
  return map[status] || '';
};

const getReleaseStatusText = (status?: number) => {
  const statusMap: Record<number, string> = {
    1: '未发布',
    2: '已发布',
    3: '执行中',
    4: '已完成',
    5: '已取消',
  };
  return statusMap[status || 1] || '未知';
};

const getReleaseStatusColor = (status?: number) => {
  switch (status) {
    case 1: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 2: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 3: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 4: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 5: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
</script>
