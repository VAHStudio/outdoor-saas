# API Key 鉴权说明

## 概述

系统支持两种鉴权方式：
1. **JWT Token 鉴权** - 用于前端用户登录后的接口调用
2. **API Key 鉴权** - 用于 Dify 自定义工具等外部系统的接口调用

## API Key 使用方式

### 1. 配置 API Key

在 `outdoor-saas-be/.env` 文件中设置：

```bash
API_KEY=2Tr9KQOgiPM3quemAWXNkEnh1LsHIjcY
```

或在环境变量中设置：
```bash
export API_KEY=2Tr9KQOgiPM3quemAWXNkEnh1LsHIjcY
```

### 2. 请求头设置

调用接口时，在 HTTP 请求头中添加：

```
X-API-Key: 2Tr9KQOgiPM3quemAWXNkEnh1LsHIjcY
```

### 3. Dify 自定义工具配置

在 Dify 中创建自定义工具时：

1. **鉴权方式**：选择 "API Key"
2. **鉴权字段**：`X-API-Key`
3. **API Key 值**：填写配置的 API Key

#### Dify 工具配置示例

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Outdoor SaaS API",
    "description": "户外广告投放管理系统接口",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://your-domain:16000/api"
    }
  ],
  "paths": {
    "/plan/list": {
      "get": {
        "summary": "获取方案列表",
        "operationId": "getPlanList",
        "responses": {
          "200": {
            "description": "成功",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlanListResponse"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## 支持的接口

API Key 鉴权支持所有 `/api/**` 路径（除了 `/api/auth/**` 登录相关接口）。

常用接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/plan/list` | GET | 获取所有方案 |
| `/api/plan/{id}` | GET | 根据ID查询方案 |
| `/api/plan` | POST | 新增方案 |
| `/api/plan` | PUT | 更新方案 |
| `/api/plan/{id}` | DELETE | 删除方案 |
| `/api/community/list` | GET | 获取所有社区 |
| `/api/frame/list` | GET | 获取所有框架 |
| `/api/barrier-gate/list` | GET | 获取所有道闸 |

## 示例请求

### cURL 示例

```bash
# 获取方案列表
curl -X GET http://localhost:16000/api/plan/list \
  -H "X-API-Key: your-secure-api-key-for-dify-tools"

# 新增方案
curl -X POST http://localhost:16000/api/plan \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-for-dify-tools" \
  -d '{
    "planNo": "PLAN-2024-001",
    "customer": "测试客户",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }'
```

### Python 示例

```python
import requests

api_key = "your-secure-api-key-for-dify-tools"
base_url = "http://localhost:16000/api"

headers = {
    "X-API-Key": api_key,
    "Content-Type": "application/json"
}

# 获取方案列表
response = requests.get(f"{base_url}/plan/list", headers=headers)
plans = response.json()
print(plans)
```

## 安全建议

1. **使用强密码**：API Key 应该使用足够复杂的随机字符串
2. **定期更换**：建议定期更换 API Key
3. **HTTPS 传输**：生产环境务必使用 HTTPS
4. **访问控制**：根据需要限制 API Key 的访问权限
5. **环境变量**：不要将 API Key 硬编码在代码中

## 错误处理

当 API Key 无效或缺失时，接口返回：

```json
{
  "code": 401,
  "message": "Invalid API Key",
  "data": null
}
```

## 注意事项

1. API Key 鉴权优先级低于 JWT Token 鉴权
2. 如果请求中同时包含有效的 JWT Token 和 API Key，优先使用 JWT Token
3. API Key 鉴权通过后，用户角色默认为 `ROLE_USER`
