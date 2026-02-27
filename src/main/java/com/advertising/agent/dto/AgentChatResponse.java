package com.advertising.agent.dto;

import com.advertising.entity.BarrierGate;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Agent 聊天响应
 */
@Data
@Builder
public class AgentChatResponse {
    
    /**
     * 响应类型
     */
    private String type;
    
    /**
     * 响应消息内容
     */
    private String message;
    
    /**
     * 会话ID
     */
    private String sessionId;
    
    /**
     * 当前步骤
     */
    private String step;
    
    /**
     * 意图信息
     */
    private AgentIntent intent;
    
    /**
     * 数据载荷（根据类型不同而变化）
     */
    private Map<String, Object> data;
    
    /**
     * 可执行的操作
     */
    private List<Action> actions;
    
    /**
     * 是否需要用户确认
     */
    private Boolean requireConfirmation;
    
    /**
     * 操作按钮
     */
    @Data
    @Builder
    public static class Action {
        private String label;
        private String value;
        private String type;  // primary, secondary, danger
    }
    
    // 响应类型常量
    public static final String TYPE_TEXT = "text";
    public static final String TYPE_INTENT_CONFIRM = "intent_confirm";
    public static final String TYPE_CITY_SELECTION = "city_selection";
    public static final String TYPE_DATE_SELECTION = "date_selection";
    public static final String TYPE_POINT_SELECTION = "point_selection";
    public static final String TYPE_PLAN_CREATED = "plan_created";
    public static final String TYPE_ERROR = "error";
    public static final String TYPE_LOADING = "loading";
    
    // 步骤常量
    public static final String STEP_INTENT = "intent";
    public static final String STEP_CITY = "city";
    public static final String STEP_DATE = "date";
    public static final String STEP_SELECTION = "selection";
    public static final String STEP_CONFIRMATION = "confirmation";
    public static final String STEP_COMPLETED = "completed";
}
