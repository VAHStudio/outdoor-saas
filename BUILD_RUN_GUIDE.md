# 广告系统后端编译运行指南

## 方式一：使用 IntelliJ IDEA（推荐）

### 1. 打开项目
- 打开 IntelliJ IDEA
- File -> Open -> 选择 `C:\project\advertising-system` 目录
- 等待 Maven 自动导入依赖

### 2. 配置 JDK
- File -> Project Structure -> Project SDK
- 选择 Java 21（如果没有，点击 Add SDK -> Download JDK）

### 3. 运行项目
- 找到 `AdvertisingSystemApplication.java` 文件
- 点击 main 方法左侧的绿色三角形
- 选择 "Run 'AdvertisingSystemApplication.main()'"

### 4. 验证运行
服务启动后，控制台会显示：
```
Started AdvertisingSystemApplication in x.x seconds
服务地址: http://localhost:16000
```

---

## 方式二：使用 Maven 命令行

### 1. 确保环境
- 安装 Java 21：https://www.oracle.com/java/technologies/downloads/
- 安装 Maven：https://maven.apache.org/download.cgi

### 2. 编译项目
```bash
cd C:\project\advertising-system
mvn clean compile
```

### 3. 运行项目
```bash
# 方式A：使用 Spring Boot 插件
mvn spring-boot:run

# 方式B：打包后运行
mvn clean package -DskipTests
java -jar target/advertising-system-1.0.0.jar
```

---

## 方式三：使用 Windows 批处理脚本

双击运行项目目录下的 `start_backend.bat`：
```
C:\project\advertising-system\start_backend.bat
```

---

## 常见问题

### Q1: 编译报错 "找不到符号"
**解决：** 在 IDEA 中点击 Maven 面板 -> Reload All Maven Projects

### Q2: 端口被占用
**解决：** 修改 `application.yml` 中的端口：
```yaml
server:
  port: 16001  # 修改为其他端口
```

### Q3: 数据库连接失败
**解决：** 检查 `application.yml` 中的数据库配置：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mvp
    username: root
    password: your_password
```

### Q4: Flyway 迁移失败
**解决：** 手动执行数据库脚本或禁用 Flyway：
```yaml
spring:
  flyway:
    enabled: false
```

---

## 验证认证系统

服务启动后，测试认证接口：

```bash
# 登录测试
curl -X POST http://localhost:16000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 预期响应：
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

---

## 演示账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| sales | sales123 | 销售经理 |
| media | media123 | 媒介专员 |
| engineering | engineering123 | 工程主管 |
| finance | finance123 | 财务经理 |

---

**启动成功后，前端登录地址：** http://localhost:3000/login
