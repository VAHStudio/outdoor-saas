package com.advertising.entity.agent;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Agent 会话实体
 */
@Data
public class AgentSession {
    
    /**
     * 会话ID
     */
    private String id;
    
    /**
     * 当前步骤
     */
    private String currentStep;
    
    /**
     * 意图JSON
     */
    private String intentJson;
    
    /**
     * 上下文数据JSON
     */
    private String contextJson;
    
    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
    
    /**
     * 最后更新时间
     */
    private LocalDateTime updatedAt;
    
    /**
     * 过期时间
     */
    private LocalDateTime expireAt;
    
    /**
     * 状态：active, completed, expired
     */
    private String status;
}
