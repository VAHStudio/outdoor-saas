package com.touhuwai.dto.converter;

import com.touhuwai.dto.dify.DifyMessage;
import com.touhuwai.entity.AiConversationMessage;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class DifyMessageConverter {
    
    public static List<AiConversationMessage> convertToConversationMessages(DifyMessage difyMessage) {
        List<AiConversationMessage> messages = new ArrayList<>();
        if (difyMessage == null) return messages;
        
        String conversationId = difyMessage.getConversationId();
        LocalDateTime createdAt = convertTimestamp(difyMessage.getCreatedAt());
        
        if (difyMessage.getQuery() != null && !difyMessage.getQuery().isEmpty()) {
            AiConversationMessage userMsg = new AiConversationMessage();
            userMsg.setConversationId(conversationId);
            userMsg.setRole("user");
            userMsg.setContent(difyMessage.getQuery());
            userMsg.setCreatedAt(createdAt);
            userMsg.setId(Math.abs((long)(difyMessage.getId() + "_user").hashCode()));
            messages.add(userMsg);
        }
        
        if (difyMessage.getAnswer() != null && !difyMessage.getAnswer().isEmpty()) {
            AiConversationMessage assistantMsg = new AiConversationMessage();
            assistantMsg.setConversationId(conversationId);
            assistantMsg.setRole("assistant");
            assistantMsg.setContent(difyMessage.getAnswer());
            assistantMsg.setCreatedAt(createdAt);
            assistantMsg.setId(Math.abs((long)(difyMessage.getId() + "_assistant").hashCode()));
            messages.add(assistantMsg);
        }
        
        return messages;
    }
    
    public static List<AiConversationMessage> convertList(List<DifyMessage> difyMessages) {
        List<AiConversationMessage> result = new ArrayList<>();
        if (difyMessages == null) return result;
        for (DifyMessage msg : difyMessages) {
            result.addAll(convertToConversationMessages(msg));
        }
        return result;
    }
    
    private static LocalDateTime convertTimestamp(Long timestamp) {
        if (timestamp == null) return LocalDateTime.now();
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneId.systemDefault());
    }
}
