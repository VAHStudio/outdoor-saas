#!/bin/bash

# Claude Code 插件验证脚本
# 验证 everything-claude-code 插件配置是否正确

set -e

echo "🔍 验证 everything-claude-code 插件配置..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ERRORS=0
WARNINGS=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        local count=$(ls -1 "$1" 2>/dev/null | wc -l)
        echo -e "${GREEN}✓${NC} $2 (${count} 项)"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        ((ERRORS++))
        return 1
    fi
}

echo ""
echo -e "${BLUE}=== 核心文件检查 ===${NC}"
check_file "$PROJECT_ROOT/CLAUDE.md" "CLAUDE.md"
check_file "$PROJECT_ROOT/AGENTS.md" "AGENTS.md"
check_file "$PROJECT_ROOT/.claude-plugin/plugin.json" "插件清单"

echo ""
echo -e "${BLUE}=== 目录结构检查 ===${NC}"
check_dir "$PROJECT_ROOT/agents" "agents/"
check_dir "$PROJECT_ROOT/commands" "commands/"
check_dir "$PROJECT_ROOT/contexts" "contexts/"
check_dir "$PROJECT_ROOT/hooks" "hooks/"
check_dir "$PROJECT_ROOT/mcp-configs" "mcp-configs/"
check_dir "$PROJECT_ROOT/rules" "rules/"
check_dir "$PROJECT_ROOT/skills" "skills/"
check_dir "$PROJECT_ROOT/tests" "tests/"
check_dir "$PROJECT_ROOT/scripts" "scripts/"

echo ""
echo -e "${BLUE}=== 配置文件检查 ===${NC}"

# 检查插件清单
if [ -f "$PROJECT_ROOT/.claude-plugin/plugin.json" ]; then
    if python3 -m json.tool "$PROJECT_ROOT/.claude-plugin/plugin.json" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} plugin.json 格式正确"
    else
        echo -e "${RED}✗${NC} plugin.json JSON 格式错误"
        ((ERRORS++))
    fi
fi

# 检查 MCP 配置
if [ -f "$PROJECT_ROOT/mcp-configs/mcp-servers.json" ]; then
    if python3 -m json.tool "$PROJECT_ROOT/mcp-configs/mcp-servers.json" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} mcp-servers.json 格式正确"
    else
        echo -e "${RED}✗${NC} mcp-servers.json JSON 格式错误"
        ((ERRORS++))
    fi
fi

# 检查用户级 Claude 配置
CLAUDE_CONFIG="$HOME/.claude/.claude.json"
if [ -f "$CLAUDE_CONFIG" ]; then
    echo -e "${GREEN}✓${NC} 用户 Claude 配置存在"
    
    # 检查是否有占位符
    if grep -q "YOUR_.*_HERE" "$CLAUDE_CONFIG" 2>/dev/null; then
        echo -e "${YELLOW}⚠${NC} MCP 配置中包含未替换的占位符"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} 用户 Claude 配置不存在 (~/.claude/.claude.json)"
    echo -e "   运行 ./scripts/setup.sh 进行配置"
    ((WARNINGS++))
fi

# 检查 scripts 权限
echo ""
echo -e "${BLUE}=== 脚本权限检查 ===${NC}"
scripts=("setup.sh" "validate.sh" "test.sh")
for script in "${scripts[@]}"; do
    if [ -f "$PROJECT_ROOT/scripts/$script" ]; then
        if [ -x "$PROJECT_ROOT/scripts/$script" ]; then
            echo -e "${GREEN}✓${NC} $script 可执行"
        else
            echo -e "${YELLOW}⚠${NC} $script 缺少执行权限"
            ((WARNINGS++))
        fi
    fi
done

echo ""
echo -e "${BLUE}=== 文档检查 ===${NC}"

# 检查关键文档是否存在
if [ -f "$PROJECT_ROOT/README.md" ]; then
    echo -e "${GREEN}✓${NC} README.md"
else
    echo -e "${YELLOW}⚠${NC} README.md 不存在"
    ((WARNINGS++))
fi

echo ""
echo -e "${BLUE}=== 项目特定检查 ===${NC}"

# 检查后端项目
if [ -d "$PROJECT_ROOT/outdoor-saas-be" ]; then
    echo -e "${GREEN}✓${NC} 后端项目存在 (outdoor-saas-be/)"
    
    if [ -f "$PROJECT_ROOT/outdoor-saas-be/pom.xml" ]; then
        echo -e "  ${GREEN}✓${NC} Maven 配置 (pom.xml)"
    fi
else
    echo -e "${YELLOW}⚠${NC} 后端项目不存在"
fi

# 检查前端项目
if [ -d "$PROJECT_ROOT/outdoor-saas-fe" ]; then
    echo -e "${GREEN}✓${NC} 前端项目存在 (outdoor-saas-fe/)"
    
    if [ -f "$PROJECT_ROOT/outdoor-saas-fe/package.json" ]; then
        echo -e "  ${GREEN}✓${NC} NPM 配置 (package.json)"
    fi
else
    echo -e "${YELLOW}⚠${NC} 前端项目不存在"
fi

# 总结
echo ""
echo -e "${BLUE}=== 验证结果 ===${NC}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ 所有检查通过！插件配置完整。${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  配置基本正确，但有 ${WARNINGS} 个警告${NC}"
    echo -e "${YELLOW}   建议处理警告以确保最佳体验${NC}"
    exit 0
else
    echo -e "${RED}❌ 发现 ${ERRORS} 个错误和 ${WARNINGS} 个警告${NC}"
    echo -e "${RED}   请先修复错误，然后重新运行验证${NC}"
    exit 1
fi
