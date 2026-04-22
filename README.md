# Goal Radar Demo

面向大学生学业与升学场景的前端演示项目，核心展示 **信息聚合工作台 + 日程详情 + 订阅配置 + 常驻 Agent 抽屉** 的产品形态。

## 在线预览

直接访问线上版本：

> <https://aistudio.google.com/apps/332d005c-27fb-4e04-922f-b26ec8873b2d?showAssistant=true&showPreview=true>

## 项目简介

Goal Radar 是一个用于比赛演示的视频化前端 Demo，强调三件事：

- **信息聚合**：统一展示考研、竞赛、课程作业、考试、学校通知等来源
- **AI 助理**：通过 3 个 Agent 提供信息研判、日程规划与策略支持
- **产品感**：以 Bento 工作台为中心，形成完整可讲述的交互闭环

当前仓库为 **Vite + React + TypeScript** 的纯前端演示项目。

## 页面结构

- **聚合工作台**：首页主视觉，展示 AI 简报、高优预警、倒计时、时间轴与多源信息卡片
- **日程详情页**：展示本周重点事项、月历视图与单条事件详情
- **订阅配置页**：展示信息源接入、关注词与配置管理
- **常驻 Agent 抽屉**：跨页面存在的右侧交互区

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
│  │  └─ SettingsView.tsx
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ types.ts
├─ docs/
│  └─ superpowers/
│     └─ spec.md
├─ skills/
├─ .env.example
├─ index.html
├─ package.json
├─ start.ps1
├─ tsconfig.json
└─ vite.config.ts
```

## 环境要求

- Node.js 18+（推荐 Node.js 20+）
- npm 9+

## 本地开发启动

### 一键启动（推荐）

Windows 用户直接双击运行：

```text
start.ps1
```

脚本会自动检查 Node.js 环境、安装依赖并启动开发服务器。

> 如果提示"无法运行脚本"，请先在 PowerShell 中执行：`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

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

构建产物默认输出到 `dist/`。

### 本地预览构建结果

```bash
npm run preview
```

默认预览地址：

```text
http://localhost:4173
```

## 可用命令

```bash
npm run dev      # 启动开发环境（3000 端口）
npm run build    # 构建生产版本
npm run preview  # 预览 dist 构建结果（4173 端口）
npm run lint     # TypeScript 类型检查
npm run clean    # 清理 dist 目录
```

## 环境变量说明

仓库中提供了 `.env.example`。当前 Demo 以前端静态展示为主，默认启动流程**不依赖真实后端**。

已出现的环境变量包括：

- `GEMINI_API_KEY`：保留的 AI Studio / Gemini 相关变量
- `APP_URL`：保留的部署环境变量

如果只是本地查看当前 Demo 界面，通常不需要额外配置真实服务。

## 适合演示的操作路径

推荐演示顺序：

1. 打开 **聚合工作台**，先讲 AI 简报与高优预警
2. 切换到 **日程详情页**，展示事项详情与月历
3. 打开 **订阅配置页**，展示信息源与关注词管理
4. 结合右侧 **Agent 抽屉** 演示不同页面下的上下文变化

## 说明

- 当前项目以比赛展示为目标，偏重界面、叙事和产品感
- `docs/superpowers/spec.md` 为前端设计与演示 spec
- 若后续继续扩展，可在 `src/views` 和 `src/components` 下按页面与组件继续拆分
