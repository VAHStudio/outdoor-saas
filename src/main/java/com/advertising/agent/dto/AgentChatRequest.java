package com.advertising.agent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Agent 聊天请求
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgentChatRequest {
    
    /**
     * 用户消息
     */
    private String message;
    
    /**
     * 会话ID（首次为空，后续携带）
     */
    private String sessionId;
    
    /**
     * 用户选择的选项值
     */
    private String selectedValue;
    
    /**
     * 额外的上下文数据
     */
    private Map<String, Object> context;
}
