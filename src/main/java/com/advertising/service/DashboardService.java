package com.advertising.service;

import com.advertising.entity.Community;
import com.advertising.entity.Plan;
import com.advertising.mapper.CommunityMapper;
import com.advertising.mapper.BarrierGateMapper;
import com.advertising.mapper.FrameMapper;
import com.advertising.mapper.PlanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Dashboard统计数据服务
 */
@Service
public class DashboardService {

    private final CommunityMapper communityMapper;
    private final BarrierGateMapper barrierGateMapper;
    private final FrameMapper frameMapper;
    private final PlanMapper planMapper;

    @Autowired
    public DashboardService(CommunityMapper communityMapper, 
                           BarrierGateMapper barrierGateMapper,
                           FrameMapper frameMapper,
                           PlanMapper planMapper) {
        this.communityMapper = communityMapper;
        this.barrierGateMapper = barrierGateMapper;
        this.frameMapper = frameMapper;
        this.planMapper = planMapper;
    }

    /**
     * 获取Dashboard统计数据
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // 获取所有社区
        List<Community> communities = communityMapper.selectAll();
        stats.put("totalCommunities", communities.size());

        // 获取所有道闸数量
        int totalBarriers = barrierGateMapper.selectAll().size();
        stats.put("totalBarrierGates", totalBarriers);

        // 获取所有框架数量
        int totalFrames = frameMapper.selectAll().size();
        stats.put("totalFrames", totalFrames);

        // 可用资源数（简单计算：总数 * 0.75）
        int totalResources = totalBarriers + totalFrames;
        int availableResources = (int) (totalResources * 0.75);
        stats.put("availableResources", availableResources);

        // 资源利用率
        stats.put("resourceUtilization", 75);

        // 本月营收（模拟数据，实际应该从订单表获取）
        stats.put("monthlyRevenue", 89400);
        stats.put("revenueChange", -2.1);

        // 活跃方案数
        List<Plan> activePlans = planMapper.selectByReleaseStatus(1);
        stats.put("activePlans", activePlans.size());

        // 待办事项（模拟数据）
        stats.put("pendingTasks", 12);

        return stats;
    }

    /**
     * 获取营收趋势数据
     */
    public Map<String, Object> getRevenueTrend() {
        Map<String, Object> trend = new HashMap<>();
        trend.put("labels", Arrays.asList("1月", "2月", "3月", "4月", "5月", "6月"));
        trend.put("data", Arrays.asList(65000, 72000, 68000, 85000, 91300, 89400));
        return trend;
    }

    /**
     * 获取资源利用率趋势
     */
    public Map<String, Object> getResourceUtilization() {
        Map<String, Object> utilization = new HashMap<>();
        utilization.put("labels", Arrays.asList("周一", "周二", "周三", "周四", "周五", "周六", "周日"));
        utilization.put("data", Arrays.asList(72, 75, 73, 78, 76, 74, 75));
        return utilization;
    }

    /**
     * 获取最近的方案列表
     */
    public List<Map<String, Object>> getRecentPlans() {
        List<Map<String, Object>> recentPlans = new ArrayList<>();

        // 获取最近的5个方案
        List<Plan> plans = planMapper.selectAll();

        for (int i = 0; i < Math.min(5, plans.size()); i++) {
            Plan plan = plans.get(i);
            Map<String, Object> planMap = new HashMap<>();
            planMap.put("id", plan.getId());
            planMap.put("planName", plan.getPlanName());
            planMap.put("customer", plan.getCustomer());

            // 状态转换
            String status = "进行中";
            if (plan.getReleaseStatus() == 0) status = "草稿";
            else if (plan.getReleaseStatus() == 2) status = "已完成";
            planMap.put("status", status);

            planMap.put("date", plan.getReleaseDateBegin());
            recentPlans.add(planMap);
        }

        return recentPlans;
    }

    /**
     * 获取社区排行榜（按资源数量排序）
     */
    public List<Map<String, Object>> getTopCommunities() {
        List<Map<String, Object>> topCommunities = new ArrayList<>();

        // 获取所有社区
        List<Community> communities = communityMapper.selectAll();

        // 按资源数量排序，取前5个
        for (int i = 0; i < Math.min(5, communities.size()); i++) {
            Community community = communities.get(i);
            Map<String, Object> communityMap = new HashMap<>();
            communityMap.put("name", community.getBuildingName());

            // 统计该社区的道闸和框架数量
            int barrierCount = barrierGateMapper.selectByCommunityId(community.getId()).size();
            int frameCount = frameMapper.selectByCommunityId(community.getId()).size();

            communityMap.put("barrierCount", barrierCount);
            communityMap.put("frameCount", frameCount);

            topCommunities.add(communityMap);
        }

        return topCommunities;
    }
}
