-- 创建 AI 对话会话表
CREATE TABLE IF NOT EXISTS ai_conversation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '自增ID',
    user_id VARCHAR(64) NOT NULL COMMENT '用户ID',
    conversation_id VARCHAR(128) NOT NULL COMMENT 'Dify 会话ID',
    title VARCHAR(255) DEFAULT NULL COMMENT '会话标题',
    status TINYINT DEFAULT 1 COMMENT '状态：1-活跃 0-已归档',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '最后消息时间',
    UNIQUE KEY uk_user_conversation (user_id, conversation_id),
    INDEX idx_user_status (user_id, status),
    INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI对话会话表';
