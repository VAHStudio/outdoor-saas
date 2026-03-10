package com.touhuwai.mapper;

import com.touhuwai.entity.AiConversation;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * AI 对话会话数据访问层
 */
@Mapper
public interface AiConversationMapper {
    
    /**
     * 插入新会话
     */
    @Insert("INSERT INTO ai_conversation (user_id, conversation_id, title, status, last_message_at) " +
            "VALUES (#{userId}, #{conversationId}, #{title}, #{status}, #{lastMessageAt})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(AiConversation conversation);
    
    /**
     * 根据用户ID和Dify会话ID查询
     */
    @Select("SELECT * FROM ai_conversation WHERE user_id = #{userId} AND conversation_id = #{conversationId}")
    AiConversation selectByUserAndConversation(@Param("userId") String userId, @Param("conversationId") String conversationId);
    
    /**
     * 获取用户活跃的会话
     */
    @Select("SELECT * FROM ai_conversation WHERE user_id = #{userId} AND status = 1 " +
            "ORDER BY last_message_at DESC LIMIT 1")
    AiConversation selectActiveByUserId(String userId);
    
    /**
     * 获取用户的所有会话
     */
    @Select("SELECT * FROM ai_conversation WHERE user_id = #{userId} ORDER BY last_message_at DESC")
    List<AiConversation> selectByUserId(String userId);
    
    /**
     * 更新最后消息时间
     */
    @Update("UPDATE ai_conversation SET last_message_at = NOW() WHERE id = #{id}")
    int updateLastMessageTime(Long id);
    
    /**
     * 归档会话
     */
    @Update("UPDATE ai_conversation SET status = 0 WHERE user_id = #{userId} AND conversation_id = #{conversationId}")
    int archiveConversation(@Param("userId") String userId, @Param("conversationId") String conversationId);
    
    /**
     * 删除会话
     */
    @Delete("DELETE FROM ai_conversation WHERE user_id = #{userId} AND conversation_id = #{conversationId}")
    int deleteByUserAndConversation(@Param("userId") String userId, @Param("conversationId") String conversationId);
}
