#!/bin/bash

# Claude Code 插件测试脚本
# 运行 everything-claude-code 插件的测试套件

set -e

echo "🧪 运行 everything-claude-code 插件测试..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TESTS_PASSED=0
TESTS_FAILED=0

# 测试函数
run_test() {
    local test_name="$1"
    local test_cmd="$2"
    
    echo -n "  测试 $test_name... "
    
    if eval "$test_cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}通过${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}失败${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo ""
echo -e "${BLUE}=== 插件结构测试 ===${NC}"

run_test "目录结构" "[ -d '$PROJECT_ROOT/.claude-plugin' ] && [ -d '$PROJECT_ROOT/agents' ]"
run_test "插件清单" "[ -f '$PROJECT_ROOT/.claude-plugin/plugin.json' ]"
run_test "CLAUDE.md" "[ -f '$PROJECT_ROOT/CLAUDE.md' ]"
run_test "AGENTS.md" "[ -f '$PROJECT_ROOT/AGENTS.md' ]"

echo ""
echo -e "${BLUE}=== 配置文件测试 ===${NC}"

run_test "plugin.json 格式" "python3 -m json.tool '$PROJECT_ROOT/.claude-plugin/plugin.json' > /dev/null"
run_test "MCP 配置格式" "python3 -m json.tool '$PROJECT_ROOT/mcp-configs/mcp-servers.json' > /dev/null"

echo ""
echo -e "${BLUE}=== Agents 测试 ===${NC}"

# 检查关键 agent 文件
key_agents=("planner" "code-reviewer" "tdd-guide" "e2e-runner" "security-reviewer")
for agent in "${key_agents[@]}"; do
    run_test "agent: $agent" "[ -f '$PROJECT_ROOT/agents/$agent.md' ]"
done

echo ""
echo -e "${BLUE}=== Commands 测试 ===${NC}"

# 检查关键命令
key_commands=("plan" "code-review" "tdd" "e2e" "verify")
for cmd in "${key_commands[@]}"; do
    run_test "command: /$cmd" "[ -f '$PROJECT_ROOT/commands/$cmd.md' ]"
done

echo ""
echo -e "${BLUE}=== Contexts 测试 ===${NC}"

key_contexts=("dev" "research" "review")
for ctx in "${key_contexts[@]}"; do
    run_test "context: $ctx" "[ -f '$PROJECT_ROOT/contexts/$ctx.md' ]"
done

echo ""
echo -e "${BLUE}=== 项目特定测试 ===${NC}"

# 后端测试
if [ -d "$PROJECT_ROOT/outdoor-saas-be" ]; then
    run_test "后端项目结构" "[ -f '$PROJECT_ROOT/outdoor-saas-be/pom.xml' ]"
    
    if command -v mvn &> /dev/null; then
        echo -e "${YELLOW}  跳过 Maven 编译测试（需要 Java 环境）${NC}"
    fi
fi

# 前端测试
if [ -d "$PROJECT_ROOT/outdoor-saas-fe" ]; then
    run_test "前端项目结构" "[ -f '$PROJECT_ROOT/outdoor-saas-fe/package.json' ]"
    
    if command -v npm &> /dev/null && [ -f "$PROJECT_ROOT/outdoor-saas-fe/package.json" ]; then
        echo -n "  测试前端依赖... "
        if [ -d "$PROJECT_ROOT/outdoor-saas-fe/node_modules" ]; then
            echo -e "${GREEN}通过${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${YELLOW}跳过 (未安装)${NC}"
        fi
    fi
fi

echo ""
echo -e "${BLUE}=== 集成测试 ===${NC}"

# 测试 CLI 可用性
if command -v claude &> /dev/null; then
    run_test "Claude CLI" "command -v claude"
else
    echo -e "${YELLOW}  跳过 Claude CLI 测试 (未安装)${NC}"
fi

# 测试脚本可执行性
echo -n "  测试脚本可执行性... "
if [ -x "$PROJECT_ROOT/scripts/setup.sh" ] && \
   [ -x "$PROJECT_ROOT/scripts/validate.sh" ] && \
   [ -x "$PROJECT_ROOT/scripts/test.sh" ]; then
    echo -e "${GREEN}通过${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}失败${NC}"
    ((TESTS_FAILED++))
fi

# 总结
echo ""
echo -e "${BLUE}=== 测试结果 ===${NC}"
echo -e "  通过: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "  失败: ${RED}${TESTS_FAILED}${NC}"
echo -e "  总计: $((TESTS_PASSED + TESTS_FAILED))"

echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 ${TESTS_FAILED} 个测试失败${NC}"
    echo -e "${YELLOW}   请查看失败项并修复问题${NC}"
    exit 1
fi
