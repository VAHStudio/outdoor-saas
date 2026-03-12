#!/bin/bash

# Claude Code 插件安装脚本
# 用于设置 everything-claude-code 插件

set -e

echo "🚀 安装 everything-claude-code 插件..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Claude Code 是否安装
if ! command -v claude &> /dev/null; then
    echo -e "${RED}错误: Claude Code 未安装${NC}"
    echo "请先安装 Claude Code: https://claude.ai/code"
    exit 1
fi

echo -e "${GREEN}✓ Claude Code 已安装${NC}"

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}项目目录: $PROJECT_ROOT${NC}"

# 检查必要目录
directories=(
    ".claude-plugin"
    "agents"
    "commands"
    "contexts"
    "hooks"
    "mcp-configs"
    "rules"
    "scripts"
    "skills"
    "tests"
)

echo -e "${YELLOW}检查目录结构...${NC}"
for dir in "${directories[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        echo -e "  ${GREEN}✓${NC} $dir"
    else
        echo -e "  ${RED}✗${NC} $dir (缺失)"
    fi
done

# 创建 .claude 配置目录
CLAUDE_DIR="$HOME/.claude"
if [ ! -d "$CLAUDE_DIR" ]; then
    echo -e "${YELLOW}创建 Claude 配置目录...${NC}"
    mkdir -p "$CLAUDE_DIR"
fi

# 检查或创建 .claude.json
echo -e "${YELLOW}配置 MCP 服务器...${NC}"
if [ -f "$CLAUDE_DIR/.claude.json" ]; then
    echo -e "${BLUE}已存在 .claude.json，跳过复制${NC}"
    echo -e "${YELLOW}提示: 如需更新 MCP 配置，请手动编辑 $CLAUDE_DIR/.claude.json${NC}"
else
    if [ -f "$PROJECT_ROOT/mcp-configs/mcp-servers.json" ]; then
        cp "$PROJECT_ROOT/mcp-configs/mcp-servers.json" "$CLAUDE_DIR/.claude.json"
        echo -e "${GREEN}✓ 已复制 MCP 配置到 ~/.claude/.claude.json${NC}"
        echo -e "${YELLOW}⚠️  请编辑 ~/.claude/.claude.json 替换 YOUR_*_HERE 占位符${NC}"
    else
        echo -e "${RED}✗ 未找到 MCP 配置文件${NC}"
    fi
fi

# 设置文件权限
echo -e "${YELLOW}设置脚本权限...${NC}"
chmod +x "$PROJECT_ROOT/scripts/"*.sh 2>/dev/null || true
chmod +x "$PROJECT_ROOT/scripts/"*.py 2>/dev/null || true
echo -e "${GREEN}✓ 权限设置完成${NC}"

# 安装依赖（如果有 package.json）
if [ -f "$PROJECT_ROOT/package.json" ]; then
    echo -e "${YELLOW}检查 Node.js 依赖...${NC}"
    if command -v npm &> /dev/null; then
        cd "$PROJECT_ROOT"
        npm install --silent 2>/dev/null || echo -e "${BLUE}无需安装或已安装${NC}"
        echo -e "${GREEN}✓ 依赖检查完成${NC}"
    fi
fi

# 验证安装
echo -e "${YELLOW}验证安装...${NC}"
echo ""
echo -e "${BLUE}可用命令:${NC}"
ls -1 "$PROJECT_ROOT/commands/" | head -10 | while read cmd; do
    echo "  /$(basename "$cmd" .md)"
done
if [ "$(ls -1 "$PROJECT_ROOT/commands/" | wc -l)" -gt 10 ]; then
    echo "  ... 等 $(ls -1 "$PROJECT_ROOT/commands/" | wc -l) 个命令"
fi

echo ""
echo -e "${BLUE}可用 Agents:${NC}"
ls -1 "$PROJECT_ROOT/agents/" | head -5 | while read agent; do
    echo "  - $(basename "$agent" .md)"
done
if [ "$(ls -1 "$PROJECT_ROOT/agents/" | wc -l)" -gt 5 ]; then
    echo "  ... 等 $(ls -1 "$PROJECT_ROOT/agents/" | wc -l) 个 agents"
fi

echo ""
echo -e "${BLUE}可用 Skills:${NC}"
ls -1 "$PROJECT_ROOT/skills/" | head -5 | while read skill; do
    echo "  - $(basename "$skill")"
done
if [ "$(ls -1 "$PROJECT_ROOT/skills/" | wc -l)" -gt 5 ]; then
    echo "  ... 等 $(ls -1 "$PROJECT_ROOT/skills/" | wc -l) 个 skills"
fi

echo ""
echo -e "${GREEN}✅ everything-claude-code 插件安装完成!${NC}"
echo ""
echo -e "${BLUE}使用说明:${NC}"
echo "  1. 启动 Claude Code: claude"
echo "  2. 在项目目录中使用 /命令 触发功能"
echo "  3. 查看 CLAUDE.md 了解完整功能列表"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "  1. 编辑 ~/.claude/.claude.json 配置 API 密钥"
echo "  2. 运行 ./scripts/validate.sh 验证配置"
echo "  3. 运行测试: ./scripts/test.sh"
echo ""
