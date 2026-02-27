package com.advertising.agent.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * 智能创建方案请求
 */
@Data
@Builder
public class SmartPlanRequest {
    
    /**
     * 客户名称
     */
    private String customer;
    
    /**
     * 方案名称（可选，不传则自动生成）
     */
    private String planName;
    
    /**
     * 开始日期
     */
    private LocalDate beginDate;
    
    /**
     * 结束日期
     */
    private LocalDate endDate;
    
    /**
     * 城市
     */
    private String city;
    
    /**
     * 需要的道闸数量
     */
    private Integer barrierCount;
    
    /**
     * 媒体要求
     */
    private String mediaRequirements;
    
    /**
     * 用户确认的点位ID列表（可选，不传则自动选择）
     */
    private List<Integer> confirmedBarrierIds;
}
