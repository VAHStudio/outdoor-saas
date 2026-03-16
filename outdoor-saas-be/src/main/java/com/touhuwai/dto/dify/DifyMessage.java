package com.touhuwai.dto.dify;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

/**
 * Dify 消息 DTO
 * 用于解析 Dify API 返回的消息历史
 */
@Data
public class DifyMessage {
    
    /**
     * 消息 ID
     */
    private String id;
    
    /**
     * 会话 ID
     */
    @JsonProperty("conversation_id")
    private String conversationId;
    
    /**
     * 输入参数
     */
    private Map<String, Object> inputs;
    
    /**
     * 用户查询（问题）
     */
    private String query;
    
    /**
     * AI 回答
     */
    private String answer;
    
    /**
     * 消息创建时间戳
     */
    @JsonProperty("created_at")
    private Long createdAt;
    
    /**
     * 用于区分消息来源
     */
    private String event;
    
    /**
     * 消息序号
     */
    @JsonProperty("message_id")
    private String messageId;
}
