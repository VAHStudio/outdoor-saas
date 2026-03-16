package com.touhuwai.dto.dify;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * Dify 消息列表响应 DTO
 * 用于解析 /messages API 的响应
 */
public class DifyMessagesResponse {
    
    /**
     * 消息列表
     */
    private List<DifyMessage> data;
    
    /**
     * 是否还有更多消息
     */
    @JsonProperty("has_more")
    private Boolean hasMore;
    
    /**
     * 本次返回的限制条数
     */
    private Integer limit;
    
    // Getters and Setters
    public List<DifyMessage> getData() {
        return data;
    }
    
    public void setData(List<DifyMessage> data) {
        this.data = data;
    }
    
    public Boolean getHasMore() {
        return hasMore;
    }
    
    public void setHasMore(Boolean hasMore) {
        this.hasMore = hasMore;
    }
    
    public Integer getLimit() {
        return limit;
    }
    
    public void setLimit(Integer limit) {
        this.limit = limit;
    }
}
