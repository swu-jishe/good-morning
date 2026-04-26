# 知途（ZhiTu）Demo

面向大学生学业规划、成长决策与任务协同场景的前端演示项目。

当前版本完整呈现 **5 主页面 + 常驻 Agent 抽屉 + 小知虚拟助手** 的产品闭环：从信息聚合 → 多智能体协同编排 → 用户确认 → 多平台回写 → 反馈可见，对应《作品报告》第三章四大关键技术（RAG 长期记忆、Skill 封装、多智能体协同工作流、OpenClaw 平台联动）的完整可视化。

## 在线预览

正式部署版本（推荐）：

> <https://good-morning-henna.vercel.app/>

> 

知途是一个用于比赛演示的前端 Demo，核心强调四件事：

- **信息聚合**：聚合竞赛、课程、考试、通知等多源信息
- **任务协同**：通过 Multi-Agent（信息研判 / 日程规划 / 策略支持）对复杂信息进行理解、编排与确认回写
- **成长主线**：通过成长档案页承接长期目标、阶段进展、多维能力画像与里程碑
- **可感知的 Agent**：通过常驻"小知"虚拟助手把 Agent 思考、模块语义、行动反馈外显为肉眼可见的气泡和动画

当前仓库为 **Vite + React + TypeScript** 的纯前端演示项目，所有数据为 mock，无真实后端依赖。

## 当前页面结构

按导航顺序：

1. **聚合工作台**（Dashboard）：高优预警与任务理解、协同决策网（Agent Flow 可视化）、今日执行流、核心成长档案、系统上下文嗅探
2. **学业规划**（Academic）：实时 GPA 测算、毕业学分进度、学分预警与选课建议、本学期在修课程、专业知识点拓扑图
3. **日程编排**（Schedule）：本周重点清单、详情面板（含智能任务拆解 + OpenClaw 多平台联动时间线）、月视日历
4. **成长档案**（Profile）：主干长期目标、四学科阶段进展、多维能力雷达（当前 vs 目标差距）、横向里程碑时间轴、Agent 长期记忆摘要
5. **信息源与策略**（Settings）：信息源接入与"立即抓取"动效、Skill 能力手册（Anthropic Agent Skills 规范，每张卡可查看 .md 源文件）、提醒策略、异常控制与回执

并行能力：

- **常驻 Agent 抽屉**：跨页面存在，三个 Agent（研判 / 规划 / 策略）可多选；支持拖拽预警卡触发协同；ModCard 编排回写；左缘可拖拽调宽（288–640 px，宽度本地持久化）
- **小知虚拟助手**：像素风形象，常驻左下角；提供时间问候、页面切换摘要、模块 hover 解释、Agent 思考态联动、ModCard 确认庆祝、立即抓取联动等多种气泡反馈；支持拖拽移动 + 5 连击彩蛋

## 技术栈

- React 19
- TypeScript（strict）
- Vite 6
- Tailwind CSS 4
- motion / motion/react（动画）
- lucide-react（图标）

## 目录结构

```text
project/
├─ public/
│  └─ pet.png                       小知像素贴图
├─ src/
│  ├─ App.tsx                       页面路由 + Provider 装载 + 响应式 padding + 全局 hover hint 监听
│  ├─ main.tsx                      Vite 入口
│  ├─ index.css                     Tailwind + 自定义 scrollbar
│  ├─ types.ts                      PageType / AgentType / EventItem / WritebackStep / SkillDef 等类型
│  ├─ components/
│  │  ├─ Sidebar.tsx                左侧悬浮导航（5 项）
│  │  ├─ AgentDrawer.tsx            抽屉 + ModCardBlock + CitationBlock + 可调宽
│  │  ├─ WorkflowVisualizer.tsx     Agent Flow 4 层协同工作流（完整 / compact 两种模式）
│  │  ├─ RadarChart.tsx             能力雷达 SVG（双层多边形 + 差距红点）
│  │  ├─ SkillCard.tsx              Skill 卡 + .md 预览 Modal
│  │  └─ PetMascot.tsx              小知虚拟助手（像素形象 + 气泡 + 动画 + 拖拽）
│  ├─ context/
│  │  ├─ ScheduleContext.tsx        全局事件 + writeback（编排回写闭环）
│  │  └─ PetContext.tsx             小知气泡 / 思考 / 可见 / 庆祝
│  ├─ data/
│  │  ├─ events.ts                  事件初始数据（含 writebackTimeline）
│  │  ├─ skills.ts                  4 项 Skill 完整定义（含 mdPreview）
│  │  └─ academic.ts                GPA / 学分 / 课程 / 拓扑 / 雷达 mock
│  ├─ lib/
│  │  └─ utils.ts                   cn() 工具
│  └─ views/
│     ├─ DashboardView.tsx          聚合工作台
│     ├─ AcademicView.tsx           学业规划
│     ├─ ScheduleView.tsx           日程编排
│     ├─ ProfileView.tsx            成长档案
│     └─ SettingsView.tsx           信息源与策略
├─ docs/
│  └─ superpowers/
│     └─ specs/                     spec 迭代版本（YYYY-MM-DD-HHMM-<topic>.md）
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
npm run lint     # TypeScript 类型检查（tsc --noEmit）
npm run clean    # 清理 dist 目录
```

## 环境变量说明

仓库中提供 `.env.example`。当前前端演示页面本身以静态 mock 为主，默认启动流程**不依赖真实后端服务**。

示例变量包括：

- `GEMINI_API_KEY`
- `APP_URL`

如果只是本地打开并演示当前页面，通常无需额外配置真实密钥。

## 推荐演示链路

完整 5–6 分钟演示脚本可参考 `docs/` 下相应说明，要点顺序：

1. 进入 **聚合工作台**：小知自动问候 → 介绍 Bento 栅格 + Agent Flow 协同决策网
2. **核心闭环**：拖拽高优预警卡到右侧 Agent 抽屉 → 小知主动解释 → 多 Agent 协同对话 → ModCard 出现 → 点击「确认变更并写入日程」 → 小知 360° 旋转庆祝
3. 切到 **日程编排** 验证回写：OpenClaw 多平台联动时间线出现 3 条新步骤（带"新"脉冲徽章）
4. **学业规划**：GPA 柱图（非零基线突出差异）、学分进度、知识点拓扑图依赖 DAG
5. **成长档案**：长期目标 + 阶段进展四学科 + 雷达图差距分析 + 横向里程碑 + Agent 长期记忆摘要
6. **信息源与策略**：点击「立即抓取」→ 小知思考 4 秒 → 新源接入 + 旧源更新 + indigo 高亮 → 翻 Skill 手册卡查看 `.md` 源文件
7. 收尾：拖拽 Agent 抽屉调宽 → 拖拽小知到任意位置 → 5 连击触发彩蛋

## 比赛说明

- 当前项目以计算机设计大赛演示为目标
- 强调前端产品感、交互叙事与页面闭环
- `docs/superpowers/specs/` 下保存所有迭代版本的产品 spec，每份对应一个里程碑的"现在是什么样"

## 备注

- 当前已稳定为 **5 页面 + 抽屉 + 小知** 的最终形态
- 所有数据均为前端 mock，无后端依赖；`.env` 文件并非必需
- 如需扩展，参考 `docs/superpowers/specs/` 下最新的 spec 文档；新增组件按现有目录约定（`components/` / `views/` / `context/` / `data/`）放置
