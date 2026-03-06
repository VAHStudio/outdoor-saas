# Outdoor SaaS - 户外广告投放管理系统

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Boot-4.0.3-brightgreen" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-21-orange" alt="Java">
  <img src="https://img.shields.io/badge/React-19-blue" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.0-purple" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/MySQL-8.0-yellow" alt="MySQL">
</p>

全栈广告投放管理系统，集成 AI 智能助手。

## 项目结构

```
outdoor-saas/
├── outdoor-saas-be/    # 后端 (be)
└── outdoor-saas-fe/    # 前端 (fe)
```

## 技术栈

### 后端 (be)
- **Spring Boot 4.0.3** - 核心框架
- **Java 21** - 编程语言
- **MyBatis** - ORM 框架
- **MySQL 8.0** - 数据库
- **Flyway** - 数据库迁移
- **Spring Security + JWT** - 认证授权
- **Kimi AI** - AI 助手集成
- **Apache POI** - Excel 处理

### 前端 (fe)
- **React 19** - UI 框架
- **TypeScript 5.8** - 类型安全
- **Vite 6** - 构建工具
- **Tailwind CSS 4** - 样式框架
- **React Router 7** - 路由管理
- **Framer Motion** - 动画效果
- **Lucide React** - 图标库
- **Recharts** - 图表组件

## 快速开始

### 环境要求
- Java 21+
- Node.js 18+
- MySQL 8.0+
- Maven 3.9+

### 1. 克隆项目

```bash
git clone <repository-url>
cd outdoor-saas
```

### 2. 配置环境变量

**后端 (outdoor-saas-be/.env)**：

```bash
DB_URL=jdbc:mysql://localhost:3306/mvp?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=your_password
KIMI_API_KEY=your_kimi_api_key
```

### 3. 启动开发服务器

**后端**：

```bash
cd outdoor-saas-be
mvn spring-boot:run
```

后端服务运行在 http://localhost:16000

**前端**：

```bash
cd outdoor-saas-fe
npm install
npm run dev
```

前端服务运行在 http://localhost:3000

## 常用命令

### 后端 (be)

```bash
cd outdoor-saas-be

# 开发模式
mvn spring-boot:run

# 构建 JAR
mvn clean package -DskipTests

# 运行单个测试类
mvn test -Dtest=ClassNameTest

# 运行单个测试方法
mvn test -Dtest=ClassNameTest#methodName

# 运行所有测试
mvn test

# 代码检查
mvn checkstyle:check
```

### 前端 (fe)

```bash
cd outdoor-saas-fe

# 开发模式
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 类型检查
npm run lint
```

## 功能特性

- 🤖 AI 智能助手 - 基于 Kimi AI 的自然语言交互
- 📊 广告投放管理 - 完整的广告项目管理流程
- 📍 智能点位选择 - 自动匹配最佳投放点位
- 📈 数据可视化 - 投放效果实时统计
- 🎨 现代化 UI - 支持暗黑模式
- 🔐 JWT 认证 - 安全的用户认证机制

## 开发指南

请参考 [AGENTS.md](./AGENTS.md) 了解代码规范和开发指南。

本项目已集成 Claude Code 插件，支持：
- `/plan` - 创建实施计划
- `/tdd` - 测试驱动开发
- `/code-review` - 代码审查
- `/e2e` - E2E 测试生成

更多信息请参考 [CLAUDE.md](./CLAUDE.md)。

## 数据库

- MySQL 8.0
- Flyway 自动迁移
- 迁移文件位于 `outdoor-saas-be/src/main/resources/db/migration/`

## 目录结构

```
outdoor-saas-be/src/main/java/com/touhuwai/outdoor/saas/
├── controller/    # REST API 端点
├── service/       # 业务逻辑
├── mapper/        # MyBatis 数据访问
├── entity/        # 实体类
├── dto/           # 数据传输对象
├── config/        # 配置类
└── common/        # 工具类

outdoor-saas-fe/src/
├── components/    # React 组件
├── pages/         # 页面组件
├── services/      # API 服务
├── hooks/         # 自定义 Hooks
├── types/         # TypeScript 类型
└── utils/         # 工具函数
```

## API 文档

后端 API 前缀：`/api`

响应格式：
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

## 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/xxx`)
3. 提交更改 (`git commit -m 'Add xxx'`)
4. 推送到分支 (`git push origin feature/xxx`)
5. 创建 Pull Request

