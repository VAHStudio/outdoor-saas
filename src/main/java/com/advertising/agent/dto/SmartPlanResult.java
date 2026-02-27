package com.advertising.agent.dto;

import com.advertising.entity.Plan;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * 智能创建方案结果
 */
@Data
@Builder
public class SmartPlanResult {
    
    /**
     * 是否成功
     */
    private Boolean success;
    
    /**
     * 消息
     */
    private String message;
    
    /**
     * 创建的方案
     */
    private Plan plan;
    
    /**
     * 关联的社区数量
     */
    private Integer communityCount;
    
    /**
     * 关联的道闸数量
     */
    private Integer barrierCount;
    
    /**
     * 选中的道闸详情
     */
    private List<SelectedBarrierInfo> selectedBarriers;
    
    @Data
    @Builder
    public static class SelectedBarrierInfo {
        private Integer barrierId;
        private String gateNo;
        private String communityName;
        private String doorLocation;
        private String city;
    }
}
