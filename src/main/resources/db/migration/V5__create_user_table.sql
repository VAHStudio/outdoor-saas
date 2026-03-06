-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '加密密码',
    real_name VARCHAR(50) COMMENT '真实姓名',
    email VARCHAR(100) COMMENT '邮箱',
    phone VARCHAR(20) COMMENT '手机号',
    avatar VARCHAR(500) COMMENT '头像URL',
    role VARCHAR(20) DEFAULT 'USER' COMMENT '角色：ADMIN/SALES/MEDIA/ENGINEERING/FINANCE/USER',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    last_login_at DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 插入默认管理员账号（密码：admin123）
INSERT INTO users (username, password, real_name, email, role, status) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '管理员', 'admin@example.com', 'ADMIN', 1);

-- 插入默认销售账号（密码：sales123）
INSERT INTO users (username, password, real_name, email, role, status) VALUES
('sales', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '销售经理', 'sales@example.com', 'SALES', 1);

-- 插入媒介账号（密码：media123）
INSERT INTO users (username, password, real_name, email, role, status) VALUES
('media', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '媒介专员', 'media@example.com', 'MEDIA', 1);

-- 插入工程账号（密码：engineering123）
INSERT INTO users (username, password, real_name, email, role, status) VALUES
('engineering', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '工程主管', 'engineering@example.com', 'ENGINEERING', 1);

-- 插入财务账号（密码：finance123）
INSERT INTO users (username, password, real_name, email, role, status) VALUES
('finance', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EO', '财务经理', 'finance@example.com', 'FINANCE', 1);
