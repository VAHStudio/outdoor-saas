# 永达传媒 AI 广告投放管理系统

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.3-brightgreen" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange" alt="Java">
  <img src="https://img.shields.io/badge/React-19-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-purple" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MySQL-8.0-yellow" alt="MySQL">
</p>

## 🎯 项目概述

**永达传媒 AI 广告投放管理系统**是一个集成了 AI 智能助手的全栈广告投放管理平台。通过自然语言对话，用户可以快速创建广告方案、智能选择投放点位、管理项目全流程。

### 核心特性

- 🤖 **AI 智能对话** - 基于 Kimi AI 的自然语言交互，自动理解需求
- 🎙️ **语音输入** - 支持语音转文字，长按投小智图标即可语音输入
- 🧠 **智能领域匹配** - 自动识别问题领域（销售/媒介/工程/财务），匹配对应 AI 助理
- 📍 **智能选点** - 根据时间范围自动选择空闲道闸/框架点位
- 🎨 **个性化问候** - 根据时间、节日、生日显示文雅问候语
- 📱 **移动端优先** - 响应式设计，完美适配手机端

## 🏗️ 技术架构

### 后端技术栈
- **Spring Boot 4.0.3** - 核心框架
- **Java 21** - 编程语言
- **MyBatis** - 数据持久层
- **MySQL 8.0** - 数据库
- **Kimi AI** - 大语言模型 API
- **Maven** - 构建工具

### 前端技术栈
- **React 19** - UI 框架
- **TypeScript 5.7** - 类型安全
- **Vite 6** - 构建工具
- **Tailwind CSS 4** - 样式框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

## 🚀 快速开始

### 环境要求
- Java 21+
- Node.js 18+
- MySQL 8.0+

### 1. 克隆项目

```bash
git clone <repository-url>
cd advertising-system
```

### 2. 配置数据库

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE mvp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 执行初始化脚本（如果有）
mysql -u root -p mvp < src/main/resources/db/migration/*.sql
```

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mvp?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password
```

### 3. 配置 Kimi AI（可选）

如果需要 AI 对话功能，配置 Kimi API Key：

```yaml
kimi:
  api:
    key: your_kimi_api_key_here
    endpoint: https://api.moonshot.cn/v1/chat/completions
    model: moonshot-v1-8k
```

### 4. 开发模式运行

**启动后端：**

```bash
mvn spring-boot:run
```

**启动前端（新终端）：**

```bash
cd frontend
npm install
npm run dev
```

**访问地址：**
- 前端开发服务器: http://localhost:3000
- 后端 API: http://localhost:16000/api

### 5. 生产模式部署

```bash
# 构建前端
cd frontend
npm install
npm run build
cd ..

# 打包后端（自动包含前端）
mvn clean package

# 运行
java -jar target/advertising-system-1.0.0.jar
```

**访问地址：** http://localhost:16000

## 📁 项目结构

```
advertising-system/
├── frontend/                          # 前端 React 应用
│   ├── src/
│   │   ├── App.tsx                   # 主应用组件
│   │   ├── components/
│   │   │   ├── AgentChatView.tsx    # AI 对话界面
│   │   │   └── VoiceInputModal.tsx  # 语音输入弹窗
│   │   ├── services/
│   │   │   ├── agentService.ts      # Agent API 服务
│   │   │   └── speechService.ts     # 语音识别服务
│   │   ├── types.ts                 # TypeScript 类型
│   │   └── index.css                # 全局样式
│   └── package.json
├── src/
│   ├── main/
│   │   ├── java/com/advertising/
│   │   │   ├── AdvertisingSystemApplication.java
│   │   │   ├── agent/                 # AI Agent 模块
│   │   │   │   ├── controller/
│   │   │   │   │   └── AgentController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── KimiAgentService.java
│   │   │   │   │   ├── AgentOrchestratorService.java
│   │   │   │   │   └── SmartPointSelector.java
│   │   │   │   └── dto/
│   │   │   ├── controller/            # REST API 控制器
│   │   │   ├── entity/                # 实体类
│   │   │   ├── enums/                 # 枚举类
│   │   │   ├── mapper/                # MyBatis 接口
│   │   │   └── service/               # 业务逻辑层
│   │   └── resources/
│   │       ├── mapper/                # MyBatis XML
│   │       ├── static/                # 前端构建产物
│   │       └── application.yml        # 配置文件
│   └── test/
├── pom.xml
└── README.md
```

## ✨ 核心功能

### 1. AI 智能对话

用户可以通过自然语言与 AI 助手对话：

```
用户: "帮我建个可口可乐的3月份广告方案，选择10个空闲道闸广告位"

AI: 1. 理解意图 → 2. 询问日期 → 3. 智能选点 → 4. 创建方案 → 5. 自动关联点位
```

**支持的对话类型：**
- 智能创建广告方案
- 查询空闲点位
- 管理项目流程
- 数据统计分析

### 2. 语音输入

- **长按投小智图标** 0.5秒触发语音输入
- 支持**阿里云语音识别**（需配置）
- 自动降级到 **Web Speech API**
- 识别结果自动带入对话

### 3. 智能领域匹配

系统根据问题关键词自动匹配专业 AI 助理：

| 领域 | 关键词 | AI 助理 |
|------|--------|---------|
| 销售 | 方案、客户、投放、广告、合同 | 销售 AI 助理 |
| 媒介 | 点位、库存、资源、位置、社区 | 媒介 AI 助理 |
| 工程 | 维护、验收、安装、设备、维修 | 工程 AI 助理 |
| 财务 | 预算、发票、付款、报销、成本 | 财务 AI 助理 |

### 4. 智能选点

- **时间冲突检测** - 自动排除已被占用的点位
- **均匀分布算法** - 点位均匀分布在不同社区
- **混合模式** - 系统自动选择 + 用户确认调整

### 5. 文雅问候语

根据时间、节日、员工生日显示个性化问候：

```
早晨 (5-11点): "晨光熹微，惠风和畅，愿今日诸事顺遂"
中午 (11-14点): "午时将至，日正当中，愿前程似锦"
下午 (14-18点): "午后时光，宁静致远，愿身体康泰"
晚上 (18-24点): "暮色四合，华灯初上，愿阖家欢乐"

生日: "生辰吉乐，福寿康宁，愿步步高升"
```

## 📱 功能模块

### 投小智（首页）
- 智能输入框（支持打字/语音）
- AI 主动业务资讯
- 永达传媒 AI 团队（销售/媒介/工程/财务）
- 长按投小智图标语音输入

### AI 对话
- 多轮对话上下文
- 方案创建流程引导
- 日期选择交互
- 点位确认展示

### 工作台
- 常用应用快捷入口
- 待办事项提醒
- 最近访问记录

### 方案管理
- 方案列表查看
- 方案详情（点位地图）
- 方案创建与编辑

### 任务管理
- 工程任务列表
- 任务详情与验收
- 拍照上传

## 🔌 API 接口

### Agent 对话接口

**发送消息**
```http
POST /api/agent/chat
Content-Type: application/json

{
  "message": "帮我建个可口可乐的广告方案",
  "sessionId": "optional-session-id"
}
```

**响应示例**
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "type": "date_selection",
    "message": "请确认投放日期范围",
    "sessionId": "abc123",
    "step": "date",
    "actions": [
      { "label": "3月1日-3月31日", "value": "2025-03-01,2025-03-31" }
    ]
  }
}
```

### 其他 REST API

详见 [API 文档](#api-documentation) 部分

## 🗄️ 数据库表

### 核心表

- `community` - 社区信息
- `barrier_gate` - 道闸信息
- `frame` - 框架信息
- `plan` - 广告方案
- `plan_community` - 方案-社区关联
- `plan_barrier` - 方案-道闸明细
- `plan_frame` - 方案-框架明细
- `agent_session` - AI 对话会话

## 🔧 配置说明

### application.yml

```yaml
server:
  port: 16000

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/mvp?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
    username: root
    password: your_password
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      connection-timeout: 60000

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.advertising.entity
  configuration:
    map-underscore-to-camel-case: true

# Kimi AI 配置（可选）
kimi:
  api:
    key: your_kimi_api_key
    endpoint: https://api.moonshot.cn/v1/chat/completions
    model: moonshot-v1-8k
```

## 🐛 常见问题

### 1. 前端构建失败

```bash
# 清除缓存重新安装
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### 2. 数据库连接失败

- 检查 MySQL 服务是否启动
- 检查用户名密码是否正确
- 检查数据库是否存在
- 检查 `allowPublicKeyRetrieval=true` 是否配置

### 3. AI 对话无响应

- 检查 Kimi API Key 是否配置正确
- 检查网络连接
- 查看后端日志是否有错误

### 4. 语音识别失败

- 检查麦克风权限是否允许
- 阿里云语音识别需要正确配置密钥
- 会自动降级到浏览器 Web Speech API

## 📝 开发指南

### 添加新的 AI 意图

编辑 `AgentOrchestratorService.java`：

```java
private Result<AgentChatResponse> processIntentStep(...) {
    // 在 intent 解析后添加新的处理逻辑
    switch (intent.getAction()) {
        case "CREATE_PLAN":
            return processCreatePlan(session, intent);
        case "QUERY":
            return processQuery(session, intent);
        // 添加新的意图处理
    }
}
```

### 修改问候语

编辑 `App.tsx` 中的 `generateGreeting` 函数：

```typescript
const generateGreeting = () => {
  // 添加新的问候语或节日
  const festivalGreetings: Record<string, string> = {
    '1-1': '新年伊始，万象更新',
    // 添加新的节日
  };
};
```

## 📄 许可证

[Apache License 2.0](LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请联系项目维护者。

---

**Made with ❤️ by 永达传媒技术团队**
