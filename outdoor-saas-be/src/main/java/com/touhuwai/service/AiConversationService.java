package com.touhuwai.service;

import com.touhuwai.entity.AiConversation;
import com.touhuwai.mapper.AiConversationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * AI 对话会话服务
 * 管理用户与 Dify 会话的关联关系
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiConversationService {
    
    private final AiConversationMapper conversationMapper;
    
    /**
     * 获取或创建会话
     * 
     * @param userId 用户ID
     * @param conversationId 可选的 Dify 会话ID
     * @return Dify 会话ID，如果是新会话则返回 null（让 Dify 生成）
     */
    @Transactional
    public String getOrCreateConversation(String userId, String conversationId) {
        if (conversationId != null && !conversationId.isEmpty()) {
            // 验证会话是否属于当前用户
            AiConversation existing = conversationMapper.selectByUserAndConversation(userId, conversationId);
            if (existing != null) {
                // 更新最后消息时间
                conversationMapper.updateLastMessageTime(existing.getId());
                log.info("使用现有会话: userId={}, conversationId={}", userId, conversationId);
                return conversationId;
            }
            log.warn("会话ID {} 不属于用户 {}，将创建新会话", conversationId, userId);
        }
        
        // 尝试获取用户的活跃会话
        AiConversation activeConversation = conversationMapper.selectActiveByUserId(userId);
        if (activeConversation != null) {
            log.info("获取用户活跃会话: userId={}, conversationId={}", userId, activeConversation.getConversationId());
            conversationMapper.updateLastMessageTime(activeConversation.getId());
            return activeConversation.getConversationId();
        }
        
        // 新会话：返回 null，让 Dify 生成 conversation_id
        // 我们会在 Dify 返回后保存这个 ID
        log.info("创建新会话，等待 Dify 生成 conversation_id: userId={}", userId);
        return null;
    }
    
    /**
     * 创建新会话
     */
    @Transactional
    public String createNewConversation(String userId) {
        String newConversationId = generateConversationId();
        
        AiConversation conversation = new AiConversation();
        conversation.setUserId(userId);
        conversation.setConversationId(newConversationId);
        conversation.setTitle("新对话");
        conversation.setStatus(1);
        conversation.setLastMessageAt(LocalDateTime.now());
        
        conversationMapper.insert(conversation);
        
        log.info("创建新会话: userId={}, conversationId={}", userId, newConversationId);
        return newConversationId;
    }
    
    /**
     * 保存 Dify 返回的会话ID
     * Dify 可能会返回新的 conversation_id，需要更新映射
     */
    @Transactional
    public void saveConversationMapping(String userId, String conversationId) {
        if (conversationId == null || conversationId.isEmpty()) {
            return;
        }
        
        AiConversation existing = conversationMapper.selectByUserAndConversation(userId, conversationId);
        if (existing == null) {
            AiConversation conversation = new AiConversation();
            conversation.setUserId(userId);
            conversation.setConversationId(conversationId);
            conversation.setTitle("新对话");
            conversation.setStatus(1);
            conversation.setLastMessageAt(LocalDateTime.now());
            
            conversationMapper.insert(conversation);
            log.info("保存新会话映射: userId={}, conversationId={}", userId, conversationId);
        }
    }
    
    /**
     * 获取用户的所有会话
     */
    public List<AiConversation> getUserConversations(String userId) {
        return conversationMapper.selectByUserId(userId);
    }
    
    /**
     * 归档会话
     */
    @Transactional
    public void archiveConversation(String userId, String conversationId) {
        conversationMapper.archiveConversation(userId, conversationId);
        log.info("归档会话: userId={}, conversationId={}", userId, conversationId);
    }
    
    /**
     * 删除会话
     */
    @Transactional
    public void deleteConversation(String userId, String conversationId) {
        conversationMapper.deleteByUserAndConversation(userId, conversationId);
        log.info("删除会话: userId={}, conversationId={}", userId, conversationId);
    }
    
    /**
     * 生成唯一的会话ID
     */
    private String generateConversationId() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
