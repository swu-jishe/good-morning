# 知途（ZhiTu）Demo

面向大学生学业规划、成长决策与任务协同场景的前端演示项目。当前版本重点展示 **信息聚合工作台 + 日程编排 + 订阅规则 + 成长档案 + 常驻 Agent 抽屉** 的闭环产品形态。

## 在线预览

直接访问线上版本：

> <https://aistudio.google.com/apps/332d005c-27fb-4e04-922f-b26ec8873b2d?showAssistant=true&showPreview=true>

## 项目简介

知途是一个用于比赛演示的前端 Demo，核心强调三件事：

- **信息聚合**：聚合竞赛、课程、考试、通知等多源信息
- **任务协同**：通过 Agent 对复杂信息进行理解、编排与确认回写
- **成长主线**：通过成长档案页承接长期目标、阶段进展与能力画像

当前仓库为 **Vite + React + TypeScript** 的前端演示项目，页面内容以产品展示与交互叙事为主。

## 当前页面结构

- **聚合工作台**：展示 AI 简报、高优预警、今日重点与多源信息入口
- **日程编排**：展示清单、月历、任务详情与执行结果
- **订阅规则**：展示信息源接入、关注词与规则管理
- **成长档案**：展示长期目标、阶段进展、能力画像与里程碑
- **常驻 Agent 抽屉**：跨页面存在，用于信息研判、任务编排与策略支持

## 技术栈

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
- Lucide React

## 目录结构

```text
project/
├─ src/
│  ├─ components/
│  │  ├─ AgentDrawer.tsx
│  │  └─ Sidebar.tsx
│  ├─ lib/
│  │  └─ utils.ts
│  ├─ views/
│  │  ├─ DashboardView.tsx
│  │  ├─ ScheduleView.tsx
│  │  ├─ SettingsView.tsx
│  │  └─ ProfileView.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ types.ts
├─ docs/
├─ .env.example
├─ index.html
├─ metadata.json
├─ package.json
├─ start.ps1
├─ tsconfig.json
└─ vite.config.ts
```

## 环境要求

- Node.js 18+（推荐 Node.js 20+）
- npm 9+

## 本地启动

### 一键启动（推荐）

Windows 用户可直接运行：

```powershell
.\start.ps1
```

脚本会自动：

- 检查 Node.js / npm
- 在缺少依赖时执行 `npm install`
- 启动本地开发服务器

默认访问地址：

```text
http://localhost:3000
```

如果 PowerShell 提示脚本无法执行，可先运行：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 手动启动

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 浏览器访问：

```text
http://localhost:3000
```

## 构建与预览

### 生产构建

```bash
npm run build
```

### 本地预览构建结果

```bash
npm run preview
```

默认预览地址：

```text
http://localhost:4173
```

## 常用命令

```bash
npm run dev      # 启动开发环境（3000 端口）
npm run build    # 构建生产版本
npm run preview  # 预览 dist 构建结果
npm run lint     # TypeScript 类型检查
npm run clean    # 清理 dist 目录
```

## 环境变量说明

仓库中提供 `.env.example`。当前前端演示页面本身以静态展示为主，默认启动流程**不依赖真实后端服务**。

示例变量包括：

- `GEMINI_API_KEY`
- `APP_URL`

如果只是本地打开并演示当前页面，通常无需额外配置真实密钥。

## 推荐演示链路

推荐按下面顺序演示：

1. 在 **聚合工作台** 展示 AI 简报与高优预警
2. 通过右侧 **Agent 抽屉** 说明信息研判、任务编排与策略支持
3. 切到 **日程编排** 展示任务清单、月历与状态结果
4. 切到 **订阅规则** 展示信息源与规则配置
5. 最后进入 **成长档案**，展示长期目标、能力画像与主线成长记录

## 比赛说明

- 当前项目以计算机设计大赛演示为目标
- 强调前端产品感、交互叙事与页面闭环
- `docs/` 下保留作品报告、spec 与相关设计文档

## 备注

- 当前代码已同步为 4 页面结构版本
- README 保留了比赛说明、在线预览地址与 `start.ps1` 启动方式
- 如需继续扩展，可优先从 `src/views` 与 `src/components` 拆分细化
