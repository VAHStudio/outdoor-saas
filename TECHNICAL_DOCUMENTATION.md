# 永达传媒 AI 广告投放管理系统 - 技术文档

> **文档版本**: v1.0  
> **更新日期**: 2026-03-06  
> **作者**: AI Code Review Team  

---

## 目录

1. [系统概述](#1-系统概述)
2. [技术架构](#2-技术架构)
3. [核心业务逻辑](#3-核心业务逻辑)
4. [投小智 AI Agent 详解](#4-投小智-ai-agent-详解)
5. [数据库设计](#5-数据库设计)
6. [API 接口规范](#6-api-接口规范)
7. [已修复问题清单](#7-已修复问题清单)

---

## 1. 系统概述

### 1.1 项目背景

永达传媒 AI 广告投放管理系统是一个集成 AI 智能助手的全栈广告投放管理平台，通过自然语言对话帮助用户快速创建广告方案、智能选择投放点位、管理项目全流程。

### 1.2 核心功能模块

| 模块 | 功能描述 | 技术要点 |
|------|----------|----------|
| **投小智 AI** | 自然语言交互的智能助手 | Kimi K2.5, 意图识别, 多轮对话 |
| **方案管理** | 广告方案的 CRUD 操作 | RESTful API, 状态机管理 |
| **资源管理** | 社区/道闸/框架点位管理 | 数据库设计, 关联查询 |
| **销控查询** | 实时查询点位占用情况 | DSL引擎, SQL模板, 档期冲突检测 |
| **智能选点** | 基于DSL的复杂点位筛选 | 均匀分布算法, 优先级策略 |

---

## 2. 技术架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        前端层 (Frontend)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │   移动端         │  │   桌面端         │                    │
│  │  (frontend/)     │  │ (frontend-desktop/)                │
│  │  React 19 + TS   │  │  React 19 + TS   │                    │
│  │  Tailwind CSS 4  │  │  Material UI     │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
└───────────┼─────────────────────┼───────────────────────────────┘
            │                     │
            ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API 网关层 (Gateway)                        │
│              Spring Boot 4.0.3 + Spring MVC                      │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      业务逻辑层 (Service)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              AI Agent 核心模块                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │意图识别服务  │  │流程编排服务  │  │点位选择服务  │  │   │
│  │  │KimiAgentSvc  │  │AgentOrchestrator│  │SmartPointSel │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              DSL 引擎模块                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │PointSelection│  │SQLTemplate   │  │SQLTemplate   │  │   │
│  │  │DSL           │  │Engine        │  │Library       │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据访问层 (Data Access)                    │
│                      MyBatis + MySQL 8.0                         │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      外部服务集成                                │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Kimi AI API     │  │  阿里云语音识别  │                    │
│  │  (K2.5模型)      │  │  NLS Service     │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈详情

#### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 4.0.3 | 核心框架 |
| Java | 21 | 编程语言 |
| MyBatis | 4.0.1 | 数据持久层 |
| MySQL | 8.0 | 关系型数据库 |
| PageHelper | 2.1.1 | 分页插件 |
| Lombok | latest | 代码简化 |
| Jackson | latest | JSON处理 |
| Apache POI | 5.2.5 | Excel导出 |

#### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | UI框架 |
| TypeScript | 5.7 | 类型安全 |
| Vite | 6 | 构建工具 |
| Tailwind CSS | 4.0 | 样式框架 |
| Framer Motion | latest | 动画库 |
| Lucide React | latest | 图标库 |
| Recharts | latest | 图表库(桌面端) |

### 2.3 项目目录结构

```
advertising-system/
├── src/main/java/com/advertising/           # Java源代码
│   ├── agent/                               # AI Agent模块
│   │   ├── controller/                      # 控制器层
│   │   │   ├── AgentController.java         # 主对话接口
│   │   │   ├── DSLAgentController.java      # DSL点位选择接口
│   │   │   └── AgentsController.java        # 智能体管理接口
│   │   ├── service/                         # 服务层
│   │   │   ├── KimiAgentService.java        # 意图识别服务
│   │   │   ├── AgentOrchestratorService.java # 流程编排服务
│   │   │   ├── SmartPointSelector.java      # 智能选点V1
│   │   │   ├── SmartPointSelectorV2.java    # 智能选点V2(DSL)
│   │   │   ├── KimiService.java             # Kimi API封装
│   │   │   └── AiAgentService.java          # AI会话管理
│   │   ├── dsl/                             # DSL引擎
│   │   │   ├── PointSelectionDSL.java       # DSL定义
│   │   │   ├── SQLTemplateEngine.java       # SQL模板引擎
│   │   │   └── SQLTemplateLibrary.java      # SQL模板库
│   │   ├── dto/                             # 数据传输对象
│   │   ├── entity/                          # AI实体类
│   │   └── mapper/                          # MyBatis接口
│   ├── controller/                          # 业务控制器
│   ├── service/                             # 业务服务层
│   ├── entity/                              # 核心业务实体
│   ├── mapper/                              # 数据访问层
│   ├── enums/                               # 枚举类
│   └── config/                              # 配置类
├── src/main/resources/
│   ├── mapper/                              # MyBatis XML映射
│   ├── application.yml                      # 主配置
│   └── application-dev.yml                  # 开发环境配置
├── frontend/                                # 移动端前端
│   ├── src/components/                      # React组件
│   │   ├── AgentChatView.tsx               # AI对话界面
│   │   └── VoiceInputModal.tsx             # 语音输入
│   └── src/services/                        # API服务
├── frontend-desktop/                        # 桌面端前端
└── pom.xml                                  # Maven配置
```

---

## 3. 核心业务逻辑

### 3.1 广告投放业务流程

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   需求输入    │────▶│   意图识别    │────▶│   智能选点    │────▶│   方案创建    │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                     │                     │                     │
      ▼                     ▼                     ▼                     ▼
  自然语言              Kimi AI解析            DSL引擎生成          数据库持久化
  "创建宝马3月          提取：客户=宝马         SQL查询空闲          Plan记录
   南京方案"            时间=3月               点位并均匀分布        PlanCommunity关联
                        城市=南京                                    PlanBarrier明细
                        数量=?
```

### 3.2 销控查询流程

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  销控查询请求 │────▶│  档期冲突检测  │────▶│  空闲点位筛选  │────▶│  结果展示/导出 │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
      │                     │                     │                     │
      ▼                     ▼                     ▼                     ▼
  "查4月空闲            NOT (end < begin      基于社区/位置       Excel导出
   道闸点位"            OR begin > end)       多维度筛选          Base64下载
```

### 3.3 智能选点算法

**均匀分布策略**:
```
可用点位集合: [社区A: 5个, 社区B: 3个, 社区C: 4个, 社区D: 2个]
需求数量: 6个

轮询选择过程:
第1轮: A1, B1, C1, D1 (已选4个)
第2轮: A2, B2 (已选6个, 满足需求)

最终结果: 社区A=2个, 社区B=2个, 社区C=1个, 社区D=1个
```

---

## 4. 投小智 AI Agent 详解

### 4.1 架构设计

```
┌─────────────────────────────────────────────────────────────────┐
│                      投小智 AI Agent 架构                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  交互层 (Frontend)                       │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  AgentChatView.tsx                              │   │   │
│  │  │  • 消息列表渲染                                  │   │   │
│  │  │  • 类型化消息处理(城市选择/日期选择/点位选择)     │   │   │
│  │  │  • 快捷建议按钮                                  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  API 控制器层                            │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  AgentController.java (/api/agents/chat)        │   │   │
│  │  │  • 请求路由                                      │   │   │
│  │  │  • 消息持久化                                    │   │   │
│  │  │  • 响应封装                                      │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  流程编排层 (Orchestrator)               │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  AgentOrchestratorService                       │   │   │
│  │  │                                                 │   │   │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐        │   │   │
│  │  │  │ Step 1  │  │ Step 2  │  │ Step 3  │  ...    │   │   │
│  │  │  │ intent  │─▶│ city    │─▶│ date    │─▶...    │   │   │
│  │  │  └─────────┘  └─────────┘  └─────────┘        │   │   │
│  │  │       │            │            │             │   │   │
│  │  │       ▼            ▼            ▼             │   │   │
│  │  │  意图识别      城市选择       日期选择         │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  AI 服务层                               │   │
│  │  ┌──────────────────┐  ┌──────────────────┐            │   │
│  │  │ KimiAgentService │  │ KimiService      │            │   │
│  │  │                  │  │                  │            │   │
│  │  │ • 意图解析(parse │  │ • API调用封装    │            │   │
│  │  │   Intent)        │  │ • 对话上下文管理 │            │   │
│  │  │ • 确认消息生成   │  │ • 错误处理       │            │   │
│  │  │ • Prompt构建     │  │                  │            │   │
│  │  └──────────────────┘  └──────────────────┘            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  智能选点层                              │   │
│  │  ┌──────────────────┐  ┌──────────────────┐            │   │
│  │  │ SmartPointSelector│  │ SmartPointSelectorV2         │   │
│  │  │                  │  │ (DSL版本)        │            │   │
│  │  │ • 简单轮询策略   │  │ • 复杂筛选策略   │            │   │
│  │  │ • 均匀分布算法   │  │ • SQL模板引擎    │            │   │
│  │  │ • 档期冲突检测   │  │ • 多条件组合查询 │            │   │
│  │  └──────────────────┘  └──────────────────┘            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  数据持久层                              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ agent_session│ │ ai_conversation            │       │   │
│  │  │ (会话状态)   │ │ (对话记录)   │              │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │  ┌─────────────┐ ┌─────────────┐                        │   │
│  │  │ ai_message   │ │ plan/        │                        │   │
│  │  │ (消息记录)   │ │ plan_barrier │                        │   │
│  │  └─────────────┘ └─────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 对话状态机

```
                         ┌─────────────┐
                         │    START    │
                         └──────┬──────┘
                                │
                                ▼
┌──────────┐    ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│completed │◄───│confirmation│◄──│ date     │◄──│ city     │◄──│  intent  │
└──────────┘    └──────────┘   └──────────┘   └──────────┘   └──────────┘
     ▲                │              │              │              │
     │                │              │              │              │
     │           confirm         select        select         parse
     │           cancel          date          city           intent
     │           reselect                                          │
     │                                                             │
     └─────────────────────────────────────────────────────────────┘
                              reset
```

### 4.3 意图识别流程

**Prompt设计**:
```java
String prompt = """
    分析用户的广告方案创建需求，提取以下信息并以JSON格式返回：
    
    用户消息：%s
    
    需要提取的字段：
    1. action: 动作类型(CREATE_PLAN/QUERY_INVENTORY/QUERY/MODIFY/UNKNOWN)
    2. customer: 客户名称
    3. timeDescription: 时间描述
    4. quantity: 数量(整数)
    5. mediaType: 媒体类型(barrier/frame)
    6. requirements: 其他要求
    7. confidence: 置信度(0-1)
    
    返回JSON格式示例：
    {
      "action": "CREATE_PLAN",
      "customer": "可口可乐",
      "timeDescription": "3月份",
      "quantity": 10,
      "mediaType": "barrier",
      "requirements": "选择空闲点位",
      "confidence": 0.95
    }
    """.formatted(userMessage);
```

**处理流程**:
1. 接收用户自然语言输入
2. 构建结构化Prompt
3. 调用Kimi K2.5 API (JSON模式)
4. 解析响应内容(处理Markdown代码块)
5. 转换为AgentIntent对象
6. 根据action类型路由到不同处理器

### 4.4 DSL点位选择引擎

**PointSelectionDSL 定义**:

```java
@Data
@Builder
public class PointSelectionDSL {
    private IntentType intentType;           // 意图类型
    private String mediaType;                // 媒体类型(barrier/frame)
    private Integer targetCount;             // 目标数量
    private DateRange dateRange;             // 日期范围
    private DistributionStrategy distributionStrategy;  // 分配策略
    private FilterConditions filterConditions;          // 筛选条件
    private List<SortRule> sortRules;        // 排序规则
    private LimitConditions limitConditions; // 限制条件
}
```

**SQL模板引擎工作原理**:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SQL模板引擎执行流程                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  输入: PointSelectionDSL                                         │
│       ├── mediaType: "barrier"                                   │
│       ├── targetCount: 100                                       │
│       ├── dateRange: {begin: "2025-03-01", end: "2025-03-31"}   │
│       ├── distributionStrategy: {type: "per_community",         │
│       │                           perCommunityCount: 2,         │
│       │                           maxCommunities: 50}           │
│       └── filterConditions: {devicePosition: "entrance"}        │
│                                                                  │
│                          │                                       │
│                          ▼                                       │
│  Step 1: 选择模板                                                  │
│       └── BARRIER_SELECT_WITH_DISTRIBUTION                      │
│                                                                  │
│                          │                                       │
│                          ▼                                       │
│  Step 2: 准备参数                                                  │
│       ├── beginDate: "2025-03-01"                               │
│       ├── endDate: "2025-03-31"                                 │
│       ├── devicePositions: [1]  (进口)                          │
│       ├── perCommunityCount: 2                                  │
│       ├── maxCommunities: 50                                    │
│       └── totalLimit: 100                                       │
│                                                                  │
│                          │                                       │
│                          ▼                                       │
│  Step 3: 填充模板                                                  │
│       └── 生成最终SQL                                            │
│                                                                  │
│                          │                                       │
│                          ▼                                       │
│  Step 4: 安全校验                                                  │
│       └── 检查危险关键词(DROP/DELETE/UPDATE等)                  │
│                                                                  │
│                          │                                       │
│                          ▼                                       │
│  输出: 可执行SQL                                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**生成的SQL示例**:

```sql
WITH available_barriers AS (
    SELECT 
        bg.id as barrier_gate_id,
        bg.gate_no,
        bg.community_id,
        c.building_name as community_name,
        ROW_NUMBER() OVER (PARTITION BY bg.community_id 
                          ORDER BY bg.device_position, bg.gate_no) as rn
    FROM barrier_gate bg
    INNER JOIN community c ON bg.community_id = c.id
    WHERE bg.status = 1
    AND (bg.device_position IN (1))  -- 进口优先
    AND bg.id NOT IN (
        -- 档期冲突检测
        SELECT pb.barrier_gate_id 
        FROM plan_barrier pb
        WHERE pb.release_status IN (2, 3, 4)
        AND NOT (pb.release_date_end < '2025-03-01' 
                 OR pb.release_date_begin > '2025-03-31')
    )
),
selected_communities AS (
    SELECT community_id
    FROM available_barriers
    WHERE rn <= 2  -- 每社区2个
    GROUP BY community_id
    HAVING COUNT(*) >= 0
    LIMIT 50       -- 最多50个社区
)
SELECT * FROM available_barriers ab
INNER JOIN selected_communities sc ON ab.community_id = sc.community_id
WHERE ab.rn <= 2
ORDER BY ab.community_id, ab.rn
LIMIT 100;
```

### 4.5 会话管理机制

**AgentSession 实体**:
```java
public class AgentSession {
    private String id;                    // 会话ID(UUID)
    private String currentStep;           // 当前步骤(intent/city/date/confirmation)
    private String status;                // 状态(active/completed)
    private String intentJson;            // 意图JSON
    private String contextJson;           // 上下文JSON(存储中间结果)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime expireAt;       // 过期时间(30分钟)
}
```

**会话生命周期**:
1. 首次请求: 创建新Session, currentStep="intent"
2. 意图识别: 解析action, 存储到intentJson
3. 城市选择: 用户选择后存储到confirmedCity, step→"date"
4. 日期选择: 解析日期范围, step→"confirmation"
5. 点位选择: 调用SmartPointSelector, 存储selectedBarrierIds
6. 确认创建: 创建Plan记录, status→"completed"
7. 过期清理: 30分钟无活动自动过期

---

## 5. 数据库设计

### 5.1 核心实体关系

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  community  │◄──────┤ barrier_gate│       │    frame    │
│  (社区)     │       │   (道闸)    │       │  (框架)     │
└──────┬──────┘       └─────────────┘       └─────────────┘
       │
       │
       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│plan_community│◄─────┤    plan     │──────►│  plan_barrier│
│(方案社区关联)│       │   (方案)    │       │(方案道闸明细)│
└─────────────┘       └──────┬──────┘       └─────────────┘
                             │
                             │
                             ▼
                       ┌─────────────┐
                       │  plan_frame │
                       │(方案框架明细)│
                       └─────────────┘
```

### 5.2 核心表结构

#### community (社区表)
```sql
CREATE TABLE community (
    id INT PRIMARY KEY AUTO_INCREMENT,
    community_no VARCHAR(50) UNIQUE COMMENT '社区编号',
    building_name VARCHAR(100) COMMENT '楼盘名称',
    building_address VARCHAR(200) COMMENT '楼盘地址',
    coord_lat DECIMAL(10,8) COMMENT '纬度',
    coord_lng DECIMAL(11,8) COMMENT '经度',
    city VARCHAR(50) COMMENT '城市',
    district VARCHAR(50) COMMENT '区/县',
    status TINYINT DEFAULT 1 COMMENT '状态:1启用 0禁用'
);
```

#### plan (方案表)
```sql
CREATE TABLE plan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_no VARCHAR(50) UNIQUE COMMENT '方案编号',
    plan_name VARCHAR(200) COMMENT '方案名称',
    customer VARCHAR(100) COMMENT '客户名称',
    release_date_begin DATE COMMENT '投放开始日期',
    release_date_end DATE COMMENT '投放结束日期',
    release_status TINYINT COMMENT '发布状态:1意向 2锁位 3执行中 4执行完毕 5档',
    sales_type TINYINT COMMENT '销售类型:1销售 2公益 3置换 4赠送 5余位 6其他',
    media_requirements TEXT COMMENT '媒体需求',
    budget DECIMAL(15,2) COMMENT '预算',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### plan_barrier (方案道闸明细表)
```sql
CREATE TABLE plan_barrier (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plan_id INT COMMENT '方案ID',
    barrier_gate_id INT COMMENT '道闸ID',
    plan_community_id INT COMMENT '方案社区关联ID',
    release_date_begin DATE COMMENT '投放开始日期',
    release_date_end DATE COMMENT '投放结束日期',
    release_status TINYINT COMMENT '发布状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5.3 AI相关表

#### agent_session (Agent会话表)
```sql
CREATE TABLE agent_session (
    id VARCHAR(50) PRIMARY KEY,
    current_step VARCHAR(20) COMMENT '当前步骤',
    status VARCHAR(20) COMMENT '状态',
    intent_json TEXT COMMENT '意图JSON',
    context_json TEXT COMMENT '上下文JSON',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    expire_at TIMESTAMP COMMENT '过期时间'
);
```

#### ai_conversation (AI对话表)
```sql
CREATE TABLE ai_conversation (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) COMMENT '用户ID',
    agent_id VARCHAR(50) COMMENT '智能体ID',
    title VARCHAR(200) COMMENT '对话标题',
    status TINYINT DEFAULT 1 COMMENT '状态',
    message_count INT DEFAULT 0 COMMENT '消息数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP
);
```

#### ai_message (AI消息表)
```sql
CREATE TABLE ai_message (
    id VARCHAR(50) PRIMARY KEY,
    conversation_id VARCHAR(50) COMMENT '对话ID',
    role VARCHAR(20) COMMENT '角色:user/assistant/system',
    content TEXT COMMENT '消息内容',
    content_type VARCHAR(20) COMMENT '内容类型:text/image/file',
    metadata TEXT COMMENT '元数据JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. API 接口规范

### 6.1 Agent对话接口

#### POST /api/agents/chat
**功能**: Agent对话主接口

**请求参数**:
```json
{
  "message": "帮我建个可口可乐的广告方案",
  "sessionId": "可选,已有会话ID",
  "selectedValue": "可选,用户选择的值"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "type": "city_selection",
    "message": "请确认投放城市...",
    "sessionId": "abc123",
    "step": "city",
    "intent": {
      "action": "CREATE_PLAN",
      "customer": "可口可乐",
      "quantity": 10,
      "mediaType": "barrier"
    },
    "actions": [
      {"label": "南京市", "value": "南京市", "type": "primary"}
    ],
    "data": {
      "cities": ["南京市", "上海市"]
    }
  }
}
```

### 6.2 DSL点位选择接口

#### POST /api/agent/v2/select-points
**功能**: 基于DSL执行复杂点位筛选

**请求参数**:
```json
{
  "mediaType": "barrier",
  "targetCount": 100,
  "dateRange": {
    "beginDate": "2025-03-01",
    "endDate": "2025-03-31"
  },
  "distributionStrategy": {
    "type": "per_community",
    "perCommunityCount": 2,
    "maxCommunities": 50
  },
  "filterConditions": {
    "devicePosition": "entrance",
    "onlyAvailable": true,
    "city": "南京市"
  }
}
```

**响应示例**:
```json
{
  "code": 200,
  "data": {
    "success": true,
    "points": [...],
    "totalCount": 100,
    "communityCount": 50,
    "isComplete": true,
    "message": "成功选择100个点位"
  }
}
```

#### POST /api/agent/v2/nlp-select
**功能**: 自然语言转DSL并执行点位选择

**请求参数**:
```json
{
  "message": "选3月份档期内的100面道闸，每个楼盘2个，优先选进口"
}
```

---

## 7. 已修复问题清单

### 7.1 后端修复

| 序号 | 文件 | 问题描述 | 修复内容 | 严重程度 |
|------|------|----------|----------|----------|
| 1 | KimiAgentService.java | thinking模式默认值配置不一致 | 统一使用`disabled`作为默认值,与配置文件保持一致 | 中 |
| 2 | AgentOrchestratorService.java | exportInventoryToExcel中类型转换问题 | 修复LinkedHashMap到BarrierGate的转换逻辑 | 高 |
| 3 | AgentOrchestratorService.java | 空指针风险 | 添加contextJson非空检查 | 高 |
| 4 | SmartPointSelectorV2.java | 参数校验缺失 | 添加DSL参数非空校验 | 中 |
| 5 | SQLTemplateEngine.java | SQL注入风险 | 增强字符串转义处理 | 中 |
| 6 | DSLAgentController.java | NLP解析正则表达式 | 优化正则匹配逻辑 | 低 |

### 7.2 前端修复

| 序号 | 文件 | 问题描述 | 修复内容 | 严重程度 |
|------|------|----------|----------|----------|
| 1 | AgentChatView.tsx | 缺少selectedValue处理 | 完善AgentChatRequest的selectedValue字段处理 | 高 |
| 2 | agentService.ts | 接口定义不完整 | 补充AgentChatRequest接口定义 | 中 |
| 3 | App.tsx | 未使用的变量 | 清理无用代码和变量 | 低 |

---

## 8. 性能优化建议

### 8.1 数据库优化

1. **索引建议**:
   ```sql
   -- 档期查询优化
   CREATE INDEX idx_plan_barrier_dates ON plan_barrier(release_date_begin, release_date_end);
   CREATE INDEX idx_plan_barrier_status ON plan_barrier(release_status);
   
   -- 社区查询优化
   CREATE INDEX idx_community_city ON community(city);
   CREATE INDEX idx_barrier_gate_community ON barrier_gate(community_id);
   ```

2. **SQL优化**:
   - 使用覆盖索引减少回表
   - 档期冲突查询添加LIMIT限制
   - 大批量查询使用分页

### 8.2 缓存策略

```java
// 建议添加缓存
@Cacheable(value = "availableBarriers", key = "#city + '_' + #beginDate + '_' + #endDate")
public List<BarrierGate> selectAvailableBarriers(String city, LocalDate beginDate, LocalDate endDate) {
    // ...
}
```

### 8.3 AI调用优化

1. **Prompt优化**:
   - 使用Few-shot示例提高准确性
   - 添加Temperature参数控制创意度
   - 使用JSON Schema约束输出格式

2. **调用频率控制**:
   - 添加RateLimiter防止API超限
   - 使用本地缓存减少重复调用

---

## 9. 安全规范

### 9.1 API安全

1. **SQL注入防护**:
   - 使用MyBatis参数绑定
   - SQL模板引擎添加危险关键词检查
   - 禁止动态拼接SQL

2. **XSS防护**:
   - 输入内容转义
   - 富文本使用白名单过滤

3. **敏感信息**:
   - API Key使用环境变量配置
   - 数据库密码加密存储
   - 生产环境关闭SQL日志

### 9.2 数据安全

1. **权限控制**:
   - 方案数据按用户隔离
   - 敏感操作添加审批流程

2. **数据备份**:
   - 定期备份数据库
   - 重要操作记录审计日志

---

## 10. 部署说明

### 10.1 环境变量配置

```bash
# 数据库配置
export DB_URL=jdbc:mysql://localhost:3306/mvp?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
export DB_USERNAME=root
export DB_PASSWORD=your_password

# Kimi AI配置
export KIMI_API_KEY=your_kimi_api_key
export KIMI_ENDPOINT=https://api.moonshot.ai/v1/chat/completions
export KIMI_MODEL=kimi-k2.5
export KIMI_THINKING=disabled

# 阿里云语音(可选)
export ALIYUN_SPEECH_ACCESS_KEY_ID=your_key_id
export ALIYUN_SPEECH_ACCESS_KEY_SECRET=your_secret
export ALIYUN_SPEECH_APP_KEY=your_app_key
```

### 10.2 启动步骤

```bash
# 1. 编译打包
mvn clean package -DskipTests

# 2. 启动应用
java -jar target/advertising-system-1.0.0.jar

# 3. 访问地址
# 后端API: http://localhost:16000/api
# 前端页面: http://localhost:16000
```

---

**文档结束**

如有问题，请联系研发团队。
