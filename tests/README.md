# 测试套件

everything-claude-code 插件的测试套件目录。

## 目录结构

```
tests/
├── unit/                   # 单元测试
├── integration/            # 集成测试
├── e2e/                    # 端到端测试
└── fixtures/               # 测试数据和夹具
```

## 运行测试

```bash
# 运行所有测试
./scripts/test.sh

# 运行特定测试类别
./scripts/test.sh unit
./scripts/test.sh integration
./scripts/test.sh e2e
```

## 测试类型

### 单元测试
测试单个组件、函数或类的功能。

### 集成测试
测试多个组件之间的交互。

### E2E 测试
测试完整的工作流程和用户场景。

## 测试数据

测试数据存储在 `fixtures/` 目录下，包括：
- 示例代码片段
- 配置文件模板
- 模拟响应数据

## 添加新测试

1. 在适当的目录创建测试文件
2. 使用命名约定：`*.test.sh` 或 `*.spec.sh`
3. 确保测试可独立运行
4. 更新本 README 文档
