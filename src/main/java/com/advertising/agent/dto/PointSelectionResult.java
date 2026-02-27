package com.advertising.agent.dto;

import com.advertising.entity.BarrierGate;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 点位选择结果
 */
@Data
@Builder
public class PointSelectionResult {
    
    /**
     * 自动选择的点位
     */
    private List<BarrierGate> autoSelected;
    
    /**
     * 候选替代点位
     */
    private List<BarrierGate> alternatives;
    
    /**
     * 可用总数
     */
    private Integer totalAvailable;
    
    /**
     * 请求数量
     */
    private Integer requestedCount;
    
    /**
     * 实际选择数量
     */
    private Integer actualCount;
    
    /**
     * 是否满足需求
     */
    private Boolean isSatisfied;
    
    /**
     * 提示消息
     */
    private String message;
    
    /**
     * 按社区分组的统计
     */
    private List<CommunityStat> communityStats;
    
    @Data
    @Builder
    public static class CommunityStat {
        private Integer communityId;
        private String communityName;
        private String city;
        private Integer selectedCount;
        private Integer availableCount;
    }
}
