package com.advertising.agent.controller;

import com.advertising.agent.dto.AgentChatRequest;
import com.advertising.agent.dto.AgentChatResponse;
import com.advertising.agent.dto.SmartPlanRequest;
import com.advertising.agent.dto.SmartPlanResult;
import com.advertising.agent.service.AgentOrchestratorService;
import com.advertising.common.Result;
import com.advertising.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Agent 控制器
 */
@RestController
@RequestMapping("/api/agent")
@RequiredArgsConstructor
public class AgentController {
    
    private final AgentOrchestratorService orchestratorService;
    private final CommunityService communityService;
    
    /**
     * Agent 对话接口
     */
    @PostMapping("/chat")
    public Result<AgentChatResponse> chat(@RequestBody AgentChatRequest request) {
        return orchestratorService.processChat(request);
    }
    
    /**
     * 获取可用城市列表
     */
    @GetMapping("/cities")
    public Result<List<String>> getCities() {
        // 从社区服务获取所有城市
        // TODO: 需要添加 getAllCities 方法到 CommunityService
        return Result.success(List.of("南京"));
    }
    
    /**
     * 智能创建方案（一键创建）
     */
    @PostMapping("/plan/create-smart")
    public Result<SmartPlanResult> createSmartPlan(@RequestBody SmartPlanRequest request) {
        // TODO: 实现智能创建方案
        return Result.error("功能开发中");
    }
}
