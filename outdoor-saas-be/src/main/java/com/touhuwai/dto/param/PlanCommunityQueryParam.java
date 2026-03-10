package com.touhuwai.dto.param;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * 方案社区关联查询参数
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PlanCommunityQueryParam extends BaseQueryParam implements Serializable {

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
     * 社区ID（精确匹配）
     */
    private Integer communityId;

    /**
     * 社区ID列表（IN查询）
     */
    private List<Integer> communityIdList;

    /**
     * 发布状态（精确匹配）
     */
    private Integer releaseStatus;

    /**
     * 发布状态列表（IN查询）
     */
    private List<Integer> releaseStatusList;

    /**
     * 道闸需求数量（精确匹配）
     */
    private Integer barrierRequiredQty;

    /**
     * 框架需求数量（精确匹配）
     */
    private Integer frameRequiredQty;

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
