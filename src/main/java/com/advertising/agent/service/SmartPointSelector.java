package com.advertising.agent.service;

import com.advertising.agent.dto.PointSelectionResult;
import com.advertising.entity.BarrierGate;
import com.advertising.entity.Community;
import com.advertising.mapper.BarrierGateMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 智能点位选择服务
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class SmartPointSelector {
    
    private final BarrierGateMapper barrierGateMapper;
    
    /**
     * 选择空闲道闸点位
     * 
     * @param city 城市
     * @param beginDate 开始日期
     * @param endDate 结束日期
     * @param requiredCount 需要数量
     * @return 选择结果
     */
    public PointSelectionResult selectBarriers(
            String city, 
            LocalDate beginDate, 
            LocalDate endDate, 
            Integer requiredCount) {
        
        // 1. 查询所有空闲道闸
        List<BarrierGate> availableBarriers = barrierGateMapper.selectAvailableBarriers(
                city, null, beginDate, endDate, null);
        
        int totalAvailable = availableBarriers.size();
        
        if (totalAvailable == 0) {
            return PointSelectionResult.builder()
                    .autoSelected(new ArrayList<>())
                    .alternatives(new ArrayList<>())
                    .totalAvailable(0)
                    .requestedCount(requiredCount)
                    .actualCount(0)
                    .isSatisfied(false)
                    .message("该时间段内没有空闲道闸，请选择其他时间或城市。")
                    .communityStats(new ArrayList<>())
                    .build();
        }
        
        // 2. 按社区分组
        Map<Integer, List<BarrierGate>> barriersByCommunity = availableBarriers.stream()
                .collect(Collectors.groupingBy(BarrierGate::getCommunityId));
        
        // 3. 智能选择策略：均匀分布
        List<BarrierGate> selected = new ArrayList<>();
        List<BarrierGate> remaining = new ArrayList<>(availableBarriers);
        
        // 获取所有社区ID
        List<Integer> communityIds = new ArrayList<>(barriersByCommunity.keySet());
        int communityIndex = 0;
        
        // 轮询选择，确保均匀分布
        while (selected.size() < requiredCount && !remaining.isEmpty()) {
            Integer currentCommunityId = communityIds.get(communityIndex % communityIds.size());
            List<BarrierGate> communityBarriers = barriersByCommunity.getOrDefault(currentCommunityId, new ArrayList<>());
            
            // 从当前社区选择一个
            if (!communityBarriers.isEmpty()) {
                BarrierGate selectedBarrier = communityBarriers.remove(0);
                selected.add(selectedBarrier);
                remaining.remove(selectedBarrier);
                
                // 如果该社区没有更多点位，从列表中移除
                if (communityBarriers.isEmpty()) {
                    barriersByCommunity.remove(currentCommunityId);
                    communityIds.remove(currentCommunityId);
                    // 调整索引
                    if (communityIds.isEmpty()) break;
                }
            }
            
            communityIndex++;
        }
        
        // 4. 准备候选点位（剩余未选的）
        List<BarrierGate> alternatives = remaining.stream()
                .limit(Math.min(20, remaining.size()))
                .collect(Collectors.toList());
        
        // 5. 生成社区统计
        Map<Integer, Long> selectedCountByCommunity = selected.stream()
                .collect(Collectors.groupingBy(BarrierGate::getCommunityId, Collectors.counting()));
        
        List<PointSelectionResult.CommunityStat> stats = selectedCountByCommunity.entrySet().stream()
                .map(entry -> {
                    Integer communityId = entry.getKey();
                    Long count = entry.getValue();
                    BarrierGate firstBarrier = selected.stream()
                            .filter(b -> b.getCommunityId().equals(communityId))
                            .findFirst()
                            .orElse(null);
                    
                    return PointSelectionResult.CommunityStat.builder()
                            .communityId(communityId)
                            .communityName(firstBarrier != null && firstBarrier.getCommunity() != null 
                                    ? firstBarrier.getCommunity().getBuildingName() : "未知社区")
                            .city(firstBarrier != null && firstBarrier.getCommunity() != null 
                                    ? firstBarrier.getCommunity().getCity() : city)
                            .selectedCount(count.intValue())
                            .availableCount(barriersByCommunity.getOrDefault(communityId, new ArrayList<>()).size() + count.intValue())
                            .build();
                })
                .collect(Collectors.toList());
        
        // 6. 构建结果
        boolean isSatisfied = selected.size() >= requiredCount;
        String message;
        if (isSatisfied) {
            message = String.format("已为您选择%d个空闲道闸点位，覆盖%d个社区。", 
                    selected.size(), stats.size());
        } else {
            message = String.format("该时间段内只有%d个空闲道闸（需要%d个），已为您全部选中。", 
                    selected.size(), requiredCount);
        }
        
        return PointSelectionResult.builder()
                .autoSelected(selected)
                .alternatives(alternatives)
                .totalAvailable(totalAvailable)
                .requestedCount(requiredCount)
                .actualCount(selected.size())
                .isSatisfied(isSatisfied)
                .message(message)
                .communityStats(stats)
                .build();
    }
    
    /**
     * 统计空闲道闸数量
     */
    public Integer countAvailableBarriers(String city, LocalDate beginDate, LocalDate endDate) {
        return barrierGateMapper.countAvailableBarriers(city, beginDate, endDate);
    }
}
