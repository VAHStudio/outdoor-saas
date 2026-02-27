-- Agent 会话表
CREATE TABLE IF NOT EXISTS agent_session (
    id VARCHAR(64) PRIMARY KEY COMMENT '会话ID',
    current_step VARCHAR(50) NOT NULL COMMENT '当前步骤：intent/city/date/selection/completed',
    intent_json TEXT COMMENT '意图JSON数据',
    context_json TEXT COMMENT '上下文JSON数据',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    expire_at DATETIME NOT NULL COMMENT '过期时间',
    status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态：active/completed/expired'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Agent会话表';

-- 创建索引
CREATE INDEX idx_agent_session_expire_at ON agent_session(expire_at);
CREATE INDEX idx_agent_session_status ON agent_session(status);
