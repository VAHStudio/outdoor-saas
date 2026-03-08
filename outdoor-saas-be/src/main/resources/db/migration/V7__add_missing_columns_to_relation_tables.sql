-- 添加关联表缺失的字段
-- 包括数量字段和时间字段

-- ==================== plan_community 表 ====================
-- 使用多条 ALTER 语句，兼容性更好

-- barrier_required_qty
ALTER TABLE plan_community 
ADD COLUMN barrier_required_qty INT DEFAULT 10 COMMENT '所需道闸数量';

-- frame_required_qty  
ALTER TABLE plan_community 
ADD COLUMN frame_required_qty INT DEFAULT 10 COMMENT '所需框架数量';

-- 更新现有数据
UPDATE plan_community SET barrier_required_qty = 10 WHERE barrier_required_qty IS NULL;
UPDATE plan_community SET frame_required_qty = 10 WHERE frame_required_qty IS NULL;

-- 添加索引
ALTER TABLE plan_community ADD INDEX idx_pc_release_status (release_status);

-- ==================== plan_barrier 表 ====================
ALTER TABLE plan_barrier 
ADD COLUMN plan_community_id BIGINT COMMENT '方案社区关联ID';

-- 添加索引
ALTER TABLE plan_barrier ADD INDEX idx_pb_plan_community_id (plan_community_id);

-- ==================== plan_frame 表 ====================
ALTER TABLE plan_frame 
ADD COLUMN plan_community_id BIGINT COMMENT '方案社区关联ID';

-- 添加索引
ALTER TABLE plan_frame ADD INDEX idx_pf_plan_community_id (plan_community_id);
