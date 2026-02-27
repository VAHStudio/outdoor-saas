package com.advertising.mapper;

import com.advertising.entity.agent.AgentSession;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Agent 会话数据访问层
 */
@Mapper
public interface AgentSessionMapper {
    
    /**
     * 根据ID查询会话
     */
    AgentSession selectById(String id);
    
    /**
     * 插入会话
     */
    int insert(AgentSession session);
    
    /**
     * 更新会话
     */
    int update(AgentSession session);
    
    /**
     * 删除过期会话
     */
    int deleteExpired(@Param("now") LocalDateTime now);
    
    /**
     * 查询所有过期会话
     */
    List<AgentSession> selectExpired(@Param("now") LocalDateTime now);
}
