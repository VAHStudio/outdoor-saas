package com.advertising.controller;

import com.advertising.common.Result;
import com.advertising.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Dashboard统计数据控制器
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * 获取Dashboard统计数据
     */
    @GetMapping("/stats")
    public Result<Map<String, Object>> getStats() {
        Map<String, Object> stats = dashboardService.getDashboardStats();
        return Result.success(stats);
    }

    /**
     * 获取营收趋势数据
     */
    @GetMapping("/revenue-trend")
    public Result<Map<String, Object>> getRevenueTrend() {
        Map<String, Object> trend = dashboardService.getRevenueTrend();
        return Result.success(trend);
    }

    /**
     * 获取资源利用率趋势
     */
    @GetMapping("/resource-utilization")
    public Result<Map<String, Object>> getResourceUtilization() {
        Map<String, Object> utilization = dashboardService.getResourceUtilization();
        return Result.success(utilization);
    }

    /**
     * 获取最近的方案列表
     */
    @GetMapping("/recent-plans")
    public Result<List<Map<String, Object>>> getRecentPlans() {
        List<Map<String, Object>> plans = dashboardService.getRecentPlans();
        return Result.success(plans);
    }

    /**
     * 获取社区排行榜
     */
    @GetMapping("/top-communities")
    public Result<List<Map<String, Object>>> getTopCommunities() {
        List<Map<String, Object>> communities = dashboardService.getTopCommunities();
        return Result.success(communities);
    }
}
