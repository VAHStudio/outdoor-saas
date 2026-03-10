package com.touhuwai.dto.param;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * 方案道闸明细查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PlanBarrierQueryParam extends BaseQueryParam implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 方案ID（精确匹配）
     */
    private Integer planId;

    /**
     * 方案ID列表（IN查询）
     */
    private List<Integer> planIdList;

    /**
     * 道闸ID（精确匹配）
     */
    private Integer barrierGateId;

    /**
     * 道闸ID列表（IN查询）
     */
    private List<Integer> barrierGateIdList;

    /**
     * 方案社区ID（精确匹配）
     */
    private Integer planCommunityId;

    /**
     * 方案社区ID列表（IN查询）
     */
    private List<Integer> planCommunityIdList;

    /**
     * 发布状态（精确匹配）
     */
    private Integer releaseStatus;

    /**
     * 发布状态列表（IN查询）
     */
    private List<Integer> releaseStatusList;

    /**
     * 发布开始日期（大于等于）
     */
    private LocalDate releaseDateBeginFrom;

    /**
     * 发布开始日期（小于等于）
     */
    private LocalDate releaseDateBeginTo;

    /**
     * 发布结束日期（大于等于）
     */
    private LocalDate releaseDateEndFrom;

    /**
     * 发布结束日期（小于等于）
     */
    private LocalDate releaseDateEndTo;
}
