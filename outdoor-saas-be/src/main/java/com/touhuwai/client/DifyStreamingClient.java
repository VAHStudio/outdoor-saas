package com.touhuwai.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.touhuwai.config.DifyConfig;
import com.touhuwai.dto.dify.DifyChatRequest;
import com.touhuwai.dto.dify.DifyStreamEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.function.Consumer;

/**
 * Dify 流式客户端
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DifyStreamingClient {
    
    private final DifyConfig difyConfig;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    /**
     * 流式发送消息到 Dify Agent
     * 
     * @param query 用户查询
     * @param inputs 上下文输入
     * @param consumer 流式数据消费者
     */
    public void streamChat(String query, Map<String, Object> inputs, 
                          Consumer<DifyStreamEvent> consumer) {
        
        // 确保 user 字段有值（Dify 必需）
        // Todo 从token获取用户ID
        String user = inputs != null && inputs.get("userId") != null
                ? (String) inputs.get("userId")
                : "user_" + 1;
        
        // 获取会话 ID
        String conversationId = inputs != null 
            ? (String) inputs.get("conversationId") 
            : null;
        
        // 创建请求 builder，用于重试时重建请求
        java.util.function.Function<String, DifyChatRequest> buildRequest = (convId) -> 
            DifyChatRequest.builder()
                .query(query)
                .inputs(inputs != null ? inputs : Map.of())
                .responseMode("streaming")
                .user(user)
                .conversationId(convId)
                .build();
        
        DifyChatRequest request = buildRequest.apply(conversationId);
        
        log.info("Sending request to Dify: query={}, user={}, conversationId={}", 
            query, user, conversationId);
        log.debug("Request body: {}", request);
        
        String apiUrl = difyConfig.getBaseUrl() + "/chat-messages";
        log.info("Dify API URL: {}", apiUrl);

        // 构建请求流，支持重试
        Flux<DifyStreamEvent> eventStream = createEventStream(apiUrl, request)
            .onErrorResume(e -> {
                // 检查是否是会话不存在的错误
                if (e.getMessage() != null && 
                    e.getMessage().contains("Conversation Not Exists") &&
                    conversationId != null) {
                    log.warn("Conversation {} not found on Dify, retrying with new conversation", 
                        conversationId);
                    // 重试：不带 conversationId
                    DifyChatRequest newRequest = buildRequest.apply(null);
                    return createEventStream(apiUrl, newRequest);
                }
                // 其他错误，继续传播
                return Mono.error(e);
            });
        
        // 订阅并消费事件
        eventStream.subscribe(
            consumer,
            error -> log.error("Dify streaming fatal error", error),
            () -> log.debug("Dify streaming completed")
        );
    }
    
    /**
     * 创建事件流
     */
    private Flux<DifyStreamEvent> createEventStream(String apiUrl, DifyChatRequest request) {
        return webClient.post()
            .uri(apiUrl)
            .header("Authorization", "Bearer " + difyConfig.getApiKey())
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.TEXT_EVENT_STREAM)
            .bodyValue(request)
            .retrieve()
            .onStatus(
                status -> status.isError(),
                response -> response.bodyToMono(String.class)
                    .flatMap(errorBody -> {
                        log.error("Dify API error: {} - {}", response.statusCode(), errorBody);
                        return Mono.error(new RuntimeException(
                            "Dify API error: " + response.statusCode() + " - " + errorBody));
                    })
            )
            .bodyToFlux(String.class)
            .filter(line -> line != null && !line.isEmpty())
            .flatMap(line -> {
                try {
                    DifyStreamEvent event = parseEvent(line);
                    if (event != null) {
                        return Mono.just(event);
                    } else {
                        return Mono.empty();
                    }
                } catch (Exception e) {
                    log.warn("Error parsing line: {}", line, e);
                    return Mono.empty();
                }
            });
    }
    
    /**
     * 同步发送消息（用于测试）
     * 
     * @param query 用户查询
     * @param inputs 上下文输入
     * @return Dify 响应字符串
     */
    public String sendMessageSync(String query, Map<String, Object> inputs) {
        String user = inputs != null && inputs.get("userId") != null 
            ? (String) inputs.get("userId") 
            : "user_" + 1;
        
        String conversationId = inputs != null 
            ? (String) inputs.get("conversationId") 
            : null;
        
        String apiUrl = difyConfig.getBaseUrl() + "/chat-messages";
        log.info("Sending sync request to Dify: URL={}, query={}", apiUrl, query);
        
        try {
            return executeSyncRequest(apiUrl, query, inputs, user, conversationId, false);
        } catch (Exception e) {
            // 检查是否是会话不存在的错误
            if (e.getMessage() != null && 
                e.getMessage().contains("Conversation Not Exists") &&
                conversationId != null) {
                log.warn("Conversation {} not found on Dify, retrying with new conversation", 
                    conversationId);
                // 重试时不传 conversationId，让 Dify 创建新会话
                return executeSyncRequest(apiUrl, query, inputs, user, null, true);
            }
            log.error("Dify sync request failed", e);
            throw e;
        }
    }
    
    /**
     * 执行同步请求
     */
    private String executeSyncRequest(String apiUrl, String query, Map<String, Object> inputs,
                                     String user, String conversationId, boolean isRetry) {
        DifyChatRequest request = DifyChatRequest.builder()
            .query(query)
            .inputs(inputs != null ? inputs : Map.of())
            .responseMode("blocking")
            .user(user)
            .conversationId(conversationId)
            .build();
        
        String response = webClient.post()
            .uri(apiUrl)
            .header("Authorization", "Bearer " + difyConfig.getApiKey())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .onStatus(
                status -> status.isError(),
                clientResponse -> clientResponse.bodyToMono(String.class)
                    .flatMap(errorBody -> {
                        log.error("Dify API error: {} - {}", clientResponse.statusCode(), errorBody);
                        return Mono.error(new RuntimeException(
                            "Dify API error: " + clientResponse.statusCode() + " - " + errorBody));
                    })
            )
            .bodyToMono(String.class)
            .block();
        
        if (isRetry) {
            log.info("Dify sync retry response: {}", response);
        } else {
            log.info("Dify sync response: {}", response);
        }
        return response;
    }

    /**
     * 解析 SSE 事件
     * 处理多种 SSE 格式：
     * - data: {...}
     * - event: message
     * - id: xxx
     * - 空行
     */
    private DifyStreamEvent parseEvent(String line) {
        try {
            if (line == null || line.isEmpty()) {
                return null;
            }

            // 处理 SSE data: 格式
            if (line.startsWith("data: ")) {
                String json = line.substring(6).trim();

                // 忽略 [DONE] 标记
                if ("[DONE]".equals(json)) {
                    log.debug("Received [DONE] marker");
                    return null;
                }

                if (!json.isEmpty()) {
                    DifyStreamEvent event = objectMapper.readValue(json, DifyStreamEvent.class);
                    log.debug("Parsed event: type={}, id={}", event.getEvent(), event.getMessageId());
                    return event;
                }
            }

            // 处理其他 SSE 字段（event, id, retry 等）
            if (line.startsWith("event:") || line.startsWith("id:") ||
                line.startsWith("retry:") || line.startsWith(":")) {
                log.debug("Skipping SSE control line: {}", line);
                return null;
            }

            // 尝试直接解析 JSON（某些情况下可能没有 data: 前缀）
            if (line.startsWith("{")) {
                DifyStreamEvent event = objectMapper.readValue(line, DifyStreamEvent.class);
                log.debug("Parsed JSON event: type={}", event.getEvent());
                return event;
            }

            return null;
        } catch (Exception e) {
            log.warn("Failed to parse event: {}", line, e);
            return null;
        }
    }
}
