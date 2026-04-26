# 知途（ZhiTu）

面向大学生学业规划、成长决策与任务协同场景的前端项目。

当前版本聚焦于学业规划、成长决策与任务协同场景的前端产品化表达，已完成页面结构、协同面板、流程可视化、能力分析与信息源管理等核心模块的统一设计与实现。

## 在线预览

正式部署版本：

> <https://good-morning-henna.vercel.app/>

## 当前版本说明

- **5 个主页面**：聚合工作台、学业规划、日程编排、成长档案、信息源与策略
- **常驻协同面板**：按页面切换默认协同角色，保留输入区、配置区、可调宽抽屉等结构
- **虚拟助手**：负责时间问候、页面摘要、模块 hover 提示与拖拽交互反馈
- **集中内容层**：主要展示文案与统一内容配置由 `src/content/submissionContent.ts` 管理
- **结构化产品界面**：聚焦信息聚合、策略说明、流程可视化与协同交互的一体化呈现

## 页面结构

按导航顺序：

1. **聚合工作台**（Dashboard）
   - 展示系统摘要、推荐动作、指标卡、时间线、成长档案摘要与协同流程入口
2. **学业规划**（Academic）
   - 展示 GPA、学分进度、课程状态、知识拓扑、能力雷达等学业分析结构
3. **日程编排**（Schedule）
   - 展示事项详情、月历视图、本地时间线与清单区域
4. **成长档案**（Profile）
   - 展示长期目标、阶段进展、里程碑与能力基线对照
5. **信息源与策略**（Settings）
   - 展示信息源状态、Skill 能力手册、提醒策略与异常状态说明

并行区域：

- **协同面板**：页面级协同角色切换、输入框、说明配置、键盘可访问抽屉缩放
- **虚拟助手**：常驻左下角，负责问候、说明、提示和拖拽反馈

## 技术栈

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- motion / motion/react
- lucide-react

## 目录结构

```text
project/
├─ public/
│  └─ pet.png                         虚拟助手贴图资源
├─ src/
│  ├─ App.tsx                         应用壳层、页面切换、Provider 装配、全局 hover hint
│  ├─ main.tsx                        React / Vite 入口
│  ├─ index.css                       全局样式与自定义滚动条
│  ├─ types.ts                        PageType / AgentType / EventItem / SkillDef 等核心类型
│  ├─ content/
│  │  └─ submissionContent.ts         集中式展示内容配置
│  ├─ components/
│  │  ├─ Sidebar.tsx                  左侧导航
│  │  ├─ AgentDrawer.tsx              常驻协同面板、配置层、可调宽抽屉
│  │  ├─ WorkflowVisualizer.tsx       协同流程可视化（完整 / compact）
│  │  ├─ RadarChart.tsx               能力雷达图组件
│  │  ├─ SkillCard.tsx                Skill 说明卡片与详情弹窗
│  │  └─ PetMascot.tsx                虚拟助手与气泡反馈
│  ├─ context/
│  │  ├─ ScheduleContext.tsx          日程选择、事项状态与时间线上下文
│  │  └─ PetContext.tsx               助手气泡、可见性与交互反馈上下文
│  ├─ data/
│  │  ├─ academic.ts                  学业域内容适配导出
│  │  ├─ events.ts                    日程域内容适配导出
│  │  └─ skills.ts                    Skill 内容适配导出
│  ├─ lib/
│  │  ├─ scheduleCalendar.ts          由事件数据推导月历模型
│  │  └─ utils.ts                     `cn()` 等通用工具
│  └─ views/
│     ├─ DashboardView.tsx            聚合工作台
│     ├─ AcademicView.tsx             学业规划
│     ├─ ScheduleView.tsx             日程编排
│     ├─ ProfileView.tsx              成长档案
│     └─ SettingsView.tsx             信息源与策略
├─ skills/
│  ├─ metadata.json                   Skill 元数据
│  └─ SKILL.md                        Skill 说明
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

仓库中提供 `.env.example`。当前前端可以独立运行，后续如需接入服务端或外部能力，可按需要补充环境变量。

示例变量包括：

- `GEMINI_API_KEY`
- `APP_URL`

## 推荐查看顺序

1. 进入 **聚合工作台**，查看系统摘要、指标卡、推荐动作和协同流程
2. 切换到 **学业规划**，查看 GPA、学分、课程、知识拓扑和能力雷达等分析模块
3. 打开 **日程编排**，查看事项详情、月历视图和本地时间线在空数据时的展示策略
4. 切换到 **成长档案**，查看长期目标、阶段进展、里程碑与能力基线
5. 进入 **信息源与策略**，查看来源管理、Skill 手册、提醒规则与异常状态说明
6. 观察右侧 **协同面板** 与左下角 **虚拟助手** 的常驻交互能力

## 备注

- 当前分支的主要展示值统一收敛到 `src/content/submissionContent.ts`
- `src/data/*` 负责把集中内容层适配为各模块消费的数据导出
- `src/lib/scheduleCalendar.ts` 负责把事件数据转换为月历展示模型
- 当前版本重点是稳定展示结构、页面协同关系与统一内容组织方式，可继续在现有基础上扩展服务端接入与业务数据流
