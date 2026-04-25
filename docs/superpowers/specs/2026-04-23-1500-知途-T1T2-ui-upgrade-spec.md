# 知途（ZhiTu）Demo 产品 Spec

- 日期：2026-04-23
- 前序：
  - [2026-04-21-1500-goal-radar-initial-spec.md](./2026-04-21-1500-goal-radar-initial-spec.md) — 最早期"Goal Radar"三页版构想
  - [2026-04-22-1500-知途-iteration-spec.md](./2026-04-22-1500-知途-iteration-spec.md) — 知途改名 + 四页骨架 + 产品闭环结构
- 关联比赛文档：根目录 `2026049224作品报告-0423-1.docx`

本文件描述**演示 Demo 的最终产品形态**，面向队友、后续接手人以及想了解页面细节的读者。不记录迭代日志，只写"现在是什么样"。

---

## 1. 产品概述

### 1.1 产品定义

**知途（ZhiTu）** 是一个面向大学生学业与升学场景的**任务理解与行动闭环工作台**。它不是信息展示页，也不是泛聊天机器人——核心价值在于把分散多源信息转化为**可执行、可确认、可回写、可追踪**的任务流。

### 1.2 目标用户

大三计算机专业学生，当前主干目标为**考研升学**（演示人物：南京大学软件工程专业，目标分 385+）。同一套结构可自然扩展到保研、竞赛、求职等其他主线。

### 1.3 叙事主线

> 多源信息 → 重点识别与风险判断 → 多 Agent 形成任务理解与行动建议 → 用户对话编排与确认 → 系统回写日程/提醒/执行队列 → 后续页面可见结果反馈

### 1.4 Demo 演示要点

现场答辩时希望评委在短时间内感受：

1. 《作品报告》第三章关键技术（RAG 长期记忆 / Skill 封装 / 多智能体协同 MAS-GPT / OpenClaw 平台联动）的**前端可视化**
2. 从"看到预警"到"写入日程"的**完整闭环**
3. 产品级视觉完成度（Bento 栅格、Material Design 3 Expressive 风格）

---

## 2. 信息架构

### 2.1 主导航

**5 主页面 + 右侧常驻 Agent 抽屉**。主页面按"业务功能 → 配置"从上到下排布（设置类沉底）：

| 序 | 页面 | 作用 |
|---|---|---|
| 1 | 聚合工作台（Dashboard） | 全局入口，一眼看到今日重点与风险 |
| 2 | 学业规划（Academic） | GPA 测算、学分追踪、知识点依赖 |
| 3 | 日程编排（Schedule） | 任务详情、执行确认、多平台回写 |
| 4 | 成长档案（Profile） | 长期目标、阶段进展、能力画像、里程碑 |
| 5 | 订阅规则（Settings） | 信息源、Skill 手册、提醒策略 |

右侧 Agent 抽屉跨所有页面常驻。

### 2.2 默认 Agent 上下文

访问不同页面时，抽屉默认激活的 Agent 不同（用户可随时多选）：

| 页面 | 默认 Agent | 原因 |
|---|---|---|
| Dashboard | 信息研判 | 首页偏信息整理、重点提炼 |
| Schedule | 日程规划 | 日程页偏排期、冲突处理 |
| Academic / Profile / Settings | 策略支持 | 长期上下文页偏优先级与方向建议 |

### 2.3 全局版心与响应式留白

所有主页面**不**自己控制宽度（不使用 `max-w-Xxl mx-auto`），由 `App.tsx` 的 `<main>` 容器统一控制左右留白：

| 断点 | 单侧 padding |
|---|---|
| 默认（< 768px） | 16 px |
| md（≥ 768px） | 32 px |
| lg（≥ 1024px） | 48 px |
| xl（≥ 1280px） | 64 px |
| 2xl（≥ 1536px） | 80 px |

这样 5 个页面的左右边距完全一致，且随视口等比伸缩。

### 2.4 Agent 抽屉可调宽

抽屉宽度由用户控制：

- 区间：**288 – 640 px**，默认 **376 px**
- 抽屉最左缘有 1.5 px 拖拽把手，悬停 indigo 高亮
- **双击把手瞬间重置**默认宽度
- 宽度写入 `localStorage`（key：`zhitu-agent-drawer-width`），刷新保留

---

## 3. 页面设计

### 3.1 聚合工作台（Dashboard）

**定位**：全局入口页，支持从卡片一键进入后续流程。

**布局**：Bento 6 列栅格，两行：

```
Row 1: [高优预警与任务理解 span-3]   [协同决策网 span-3]
Row 2: [执行流（今日）span-2] [核心成长档案 span-2] [系统上下文嗅探 span-2]
```

#### 高优预警与任务理解（Row 1 左）

- 顶部 **3 格状态统计条**：`12 已清洗 / 3 待评估 / 1 阻断级`
- 下方 1 张**可交互的高优预警卡**："考研报名确认预期冲突"
  - 单击卡片 → 跳转 Schedule 并自动聚焦研招网事项
  - 拖拽卡片到右侧 Agent 抽屉 → 触发多智能体编排
  - 拖拽过程中源卡片有 indigo ring + 轻微放大的视觉反馈
  - 右上角两个 pill 引导："点击查看" / "或拖至右侧"

#### 协同决策网（Row 1 右）

- 嵌入完整版 `WorkflowVisualizer`（详见 §5）
- 呈现 MAS-GPT 4 层流水线：意图拆解 → 3 子 Agent 并行（研判/规划/策略）→ 主控裁决 → 结构化输出
- 底部紫色 **"主控裁决 · 当前推荐动作"** 卡：`调剂至「今晚 19:00」，同步拦截周五 30 分钟`
- 右上角脉冲胶囊：`正在处理：报名确认冲突`

#### 执行流（今日）（Row 2 左）

暗色时间轴卡，显示今日三个时间区块：

1. `10:00–11:30` 执行中：专业课强化训练 · 图的历年真题选做
2. `14:00–17:00` 空闲区块：无硬性日程绑定
3. `19:00 开始` 编排槽位：数据库原理上机实验（已建议调剂至此）

#### 核心成长档案（Row 2 中）

作为 Profile 页的 quick-glance 入口：

- 主干目标："2026 初试"
- 阶段 + 完成度 + 进度条（45%）
- 三个特质标签（数据结构达优 / 马原进度滞后 / 夜间高能）

#### 系统上下文嗅探（Row 2 右）

显示当前活跃的信息源监控：研招网动态监控（实时）、学习通/教务处轮询（依频率）。

---

### 3.2 学业规划（Academic）

**定位**：对应《作品报告》1.3 学业规划模块的前端呈现。

**布局（自上而下）**：

1. Bento 三卡（grid-cols-3）
2. 本学期在修课程表格
3. 专业知识点拓扑图

#### 实时 GPA 测算

- 当前 GPA 大字：`3.82 / 4.0`（45 px）
- 专业排名：`前 8%`
- 标识：由 `gpa-early-warning` Skill 驱动
- **5 学期走势柱图**：
  - 使用 HTML Flex 布局（非 SVG），5 根柱 `flex-1` 等分容器宽度
  - 柱固定宽 **56 px**（`w-14`），柱间距 **8 px**（`gap-2`）
  - **Y 轴缩放基线 3.4 – 4.0**（非 0 起始），让 GPA 差异（3.62 – 3.84，仅 0.22 差距）的视觉差别放大约 7 倍
  - 最新学期柱 indigo + glow，其他柱 slate-200

#### 毕业学分进度

- 左侧环形进度条 `65%` + 大字 `108 / 160`
- 4 条分类进度条：专业必修 52/64 / 专业选修 18/24 / 公共必修 28/32 / 通识教育 10/16

#### 学分预警与选课建议

- 2 条预警：`通识教育学分不足` / `专业选修结构建议`
- 底部黑色 **Agent 建议卡**：`下学期建议选《高级算法分析》+《科技史导论》`

#### 本学期在修课程表

5 门课程：操作系统 / 计算机网络 / 机器学习 / 软件工程 / 马原。列：课程 / 授课 / 学分 / 时间 / 预测分 / 风险（稳定/需关注/高风险三档彩色徽章）。

#### 专业知识点拓扑图

SVG DAG 图，12 个核心课程节点，用箭头表达依赖关系：

- 节点：离散数学 / 数据结构 / 算法设计 / 操作系统 / 计网 / 数据库 / 软工 / AI 基础 / 机器学习 / 编译原理 / 分布式系统 / 深度学习
- 三色掌握度：绿（已掌握）/ 黄（在学）/ 灰（未开始）
- 关键尺寸：viewBox 约 955 × 380，节点 100 × 40，字号 13 px
- **SVG 设 `maxWidth: 955px`**，外层 `flex justify-center`：
  - 大屏（卡片 ≥ 955 px）1:1 居中渲染，两侧留白
  - 小屏（卡片 < 955 px）按 `preserveAspectRatio="xMidYMid meet"` 等比缩小
  - 杜绝被横向拉伸放大导致节点和字号失真

---

### 3.3 日程编排（Schedule）

**定位**：承接首页重点事项的执行与反馈主页面。

**布局**：左 1/3 本周清单 + 右 2/3 详情 / 月历可切换

#### 本周清单

每项显示：来源标签（考试/课程/竞赛/活动/系统 五色系）+ 优先级 + 标题 + 时间。点击切换右侧详情。

#### 详情面板

- 顶部徽章：来源 + 紧急待办 + **"被 Agent 重新排期"** 标识
- 任务大标题
- 两栏：修改后执行时间 + 动作要求/来源系统
- **智能任务拆解区**：2-3 个子任务，每个带预计时间和勾选状态
- **OpenClaw 多平台联动时间线**（见 §6.3）
- 底部两按钮：`生成强提醒（电话）` / `跳转外部执行 ↗`

**纵向滚动规则**：详情面板内容可能因事件的 timeline 长度不同而超过视口高度，面板采用 `overflow-y-auto` + `custom-scrollbar` 启用**独立纵向滚动条**（仅右侧详情可滚，左侧清单和页面头部保持固定）。装饰 blur 圆置于外层 `overflow-hidden` 卡壳内不受滚动影响。

#### 月历视图

2026 年 10 月 日历栅格，每天格子显示当日所属事件的迷你标签。点击事件标签切回详情视图。

#### 时间格式统一规范

所有 timeline、日期展示遵循：

| 场景 | 格式 |
|---|---|
| 今日事件 | `今天 HH:MM`（例：`今天 10:17`） |
| 昨日事件 | `昨天 HH:MM`（例：`昨天 21:00`） |
| 跨日事件 | `M 月 D 日` 或 `M 月 D 日 HH:MM`（例：`10 月 25 日 16:30`） |
| 未定时间 | `待定`（不使用 `—` 等占位符） |

---

### 3.4 成长档案（Profile）

**定位**：承接《作品报告》"个人成长档案区"，呈现长期目标与学习主线数据。

**布局**：3 行栅格（每行内部严格对齐）

```
Row 1: [ 主干长期目标（全宽）]
Row 2: [ 当前阶段进展 span-2 ]   [ 多维能力雷达 span-1 ]
Row 3: [ 阶段里程碑时间轴 span-2 ] [ Agent 长期记忆摘要 span-1 ]
```

#### 主干长期目标（Row 1，全宽）

- 标题：`主干长期目标 · 2026 年双一流初试` + 副标题 `由策略 Agent 持续护航`
- 右上角大徽章：`距离初试 248 天`
- 4 格状态卡：`报考院校：南京大学` / `报考专业：软件工程` / `目标分数：385+` / `当前胜率评估：62% 提升期`
- 总复习进度条 `45%`
- 进度条下 4 段阶段标记：`基础期` → **`强化期（当前）`** → `冲刺期` → `初试`

#### 当前阶段进展（Row 2 左）

10 月强化冲刺期 · 四大学科对照，2 × 2 网格：

| 科目 | 细分 | 状态徽章 | mini 进度条 |
|---|---|---|---|
| 专业课 | 数据结构与算法 | 领先 5%（emerald） | 72% |
| 数学 | 高等数学 + 线性代数 | 符合规划（slate） | 55% |
| 英语 | 英语一 | 落后 3%（amber） | 48% |
| 政治 | 主观题背诵 | 落后 15%（rose） | 32% |

每项下方一行 2 行摘要描述。

#### 多维能力雷达（Row 2 右）

`RadarChart` 组件（详见 §7.2），6 维度双层多边形叠加：

- 维度：专业课基础 / 数学能力 / 英语能力 / 政治 · 公共课 / 竞赛 · 项目 / 信息素养
- 实线 indigo = 当前能力；虚线浅色 = 目标院校要求
- 差距 > 15 的顶点用红色大点标注（政治 / 英语 / 数学三处）
- 右上角 `target-gap` 紫色 Skill 徽章

#### 阶段里程碑 · 主线时间轴（Row 3 左）

**横向时间轴**，6 节点水平排布：

```
✓ 蓝桥杯  →  ✓ 暑期专业  →  ✓ 政治一轮  →  ⚐ 全国网报  →  ○ 初试  →  ○ 复试准备
  国赛一等         课一轮             过境         (即将到来)     (未来)      (未来)
 2025/6        2025/8           2025/9          2025/10/25   2025/12/21  2026/2-3
```

- 已完成节点：绿 CheckCircle2
- 即将到来节点：indigo Flag 图标 + 脉冲光圈 + "即将到来" 徽章
- 未来节点：灰色小点
- 水平连接线：灰底，从左到"即将到来"位置填充为 indigo

#### Agent 长期记忆摘要（Row 3 右）

暗色卡，**3 类分组**（对应报告 3.2.1 RAG 长期记忆分层）：

- **学科偏好**：数学一 / 英语一 / 408 专业课
- **行为规律**：偏好夜间复习 / 需强制番茄钟
- **个人特质**：抗压能力中等 / 对截止日敏感

底部说明：这些标签由研判、规划、策略三个 Agent 在底层上下文共享，保证建议与用户特质拟合。

---

### 3.5 订阅规则（Settings）

**定位**：信息源与能力规则管理页。

**布局（自上而下）**：

1. 已连接的原始信息源卡片网格
2. Skill 能力手册
3. 高优预警与提醒策略 + 异常控制与回执（两栏）

#### 信息源卡片网格

3 张信息源卡：研招网与目标院校信息 / 计算机学院教务通知 / 超星学习通课程作业抓取。每张显示图标、名称、域名链接、上次同步时间、最新原始抓取摘要、已收录条数，+ 一张"新增信息源"虚线添加卡。

点击任一卡或"查看聚合池"按钮 → **drill-down** 到该信息源的原始抓取池页面（带返回键）。

#### Skill 能力手册

4 张 Skill 卡，`xl:grid-cols-3` 布局，对应《作品报告》3.2.2 的 Anthropic Agent Skills 规范。详见 §7.3。

4 项 Skill：

| Skill Code | 所属 Agent | 作用 |
|---|---|---|
| `competition-scanner` | 研判 | 竞赛信息抓取与结构化 |
| `schedule-conflict-resolver` | 规划 | 任务冲突检测与重排 |
| `target-gap-analyzer` | 策略 | 目标差距分析 |
| `gpa-early-warning` | 策略 | GPA 动态测算与学分预警 |

#### 高优预警与提醒策略

时间阈值（死线前 48 小时）+ 冲突判定（强物理占用重叠）+ 最高触达（自动电话 / 强音效）。

#### 异常控制与回执

暗色卡，3 条状态条：Pending（等待用户确认）/ Read-Only（仅建议不回写）/ Failed（API 拉取断连）。

---

## 4. 右侧 Agent 抽屉

### 4.1 三个 Agent 角色

| Agent | 主色 | 职责 | 报告章节 |
|---|---|---|---|
| 信息研判 | blue | 识别事件性质、重要度、来源可信度 | 3.2.3 |
| 日程规划 | emerald | 任务拆解、时间安排、排期 | 3.2.3 |
| 策略支持 | violet | 结合长期目标提供优先级、取舍 | 3.2.3 |

顶部以 checkbox 风格按钮切换，支持 1–3 个 Agent 同时激活（最少保留 1 个）。

### 4.2 核心交互

#### 拖拽引用

Dashboard 预警卡拖入抽屉（抽屉出现虚线边框吸附 overlay）→ 自动激活研判 + 规划 Agent → 两轮对话 → 输出 ModCard。

#### 建议词胶囊

每个 Agent 预置 3 个建议词：

- 研判：`解读今日高优预警` / `总结近期院校通知` / `过滤低迷信息`
- 规划：`帮我规划本周节奏` / `推迟低优活动` / `为模拟考预留时间`
- 策略：`评估当前备考进度` / `分析目标院校报录比` / `推荐适合的复习资料`

点击胶囊直接发送（保证现场演示不需用户手打字）。

#### ModCard 编排回写

Agent 返回的修改预览卡包含：

- 原任务（line-through 灰）
- 新任务（indigo 加粗）
- 影响范围说明
- `确认变更并写入日程` 按钮

点击确认后：

- 按钮变绿 "已回写至日程时间线"
- **dispatch 到 ScheduleContext**（§6）
- ScheduleView 对应事项 timeline 立即追加新步骤（带 6 秒 "新" 徽章脉冲）

### 4.3 配置抽屉

右上齿轮图标打开覆盖层配置面板，为每个激活 Agent 编辑 system prompt（mock 文本，未接真实模型）。

---

## 5. 多智能体协同机制（MAS-GPT）

对应《作品报告》3.2.3 小节。

### 5.1 设计理念

参考 MAS-GPT：把"如何针对当前用户需求组织合适的执行结构"本身视为生成任务。前端用 `WorkflowVisualizer` 呈现这个过程。

### 5.2 WorkflowVisualizer 4 层流水线

```
Stage 1: 意图拆解 & Plan 生成（主控 · 黑色节点）
            ↓
Stage 2: PARALLEL
   ┌─────────────┬─────────────┬─────────────┐
[信息研判]     [日程规划]     [策略支持]
 事件性质·       拆解·排期·    结合长期目标
 重要度·         冲突检测      做优先级与
 来源可信度                    取舍
   └─────────────┴─────────────┴─────────────┘
            ↓
Stage 3: 冲突检测 & 加权裁决（主控节点）
            ↓
Stage 4: 结构化输出（紫色节点）
         推荐方案 + 理由说明 + 可选替代路径
```

### 5.3 节点状态

- `done` — 绿勾
- `active` — indigo 脉冲小圆点（演示默认：规划、策略 active）
- `pending` — 灰色小点（默认：裁决、输出）

### 5.4 严格对齐

所有 4 层统一使用 `grid-cols-3`：

- 单节点 stage（1、3、4）：`col-start-2` 占中间列，左右两列为空 `<div />` 占位
- 并行 stage（2）：3 个节点各占 1 列

连接线也画在中间列（`w-px` 垂直小线），保证所有层的垂直中轴对齐。

### 5.5 Compact 模式

`WorkflowVisualizer` 支持 `compact` prop，将 4 层压缩成水平 2 行：

```
[主控 intake] → [研判|规划|策略 parallel 3-col]
                     ↓
        [主控 converge] → [输出]
```

适合 220–280 px 宽的容器。当前 Dashboard 使用的是完整模式，compact 为备用能力。

---

## 6. 跨页面状态与联动闭环

### 6.1 ScheduleContext

全局事件存储，位于 `src/context/ScheduleContext.tsx`，通过 React Context 暴露：

```ts
interface ScheduleCtx {
  events: EventItem[];                         // 当前事件列表
  selectedEventId: string;                     // 当前选中
  setSelectedEventId: (id: string) => void;
  appendWriteback: (eventId: string, steps: WritebackStep[]) => void;
  recentlyAppendedIds: string[];               // 6 秒内高亮 ID
}
```

`App.tsx` 顶层包 `<ScheduleProvider>`；`ScheduleView` 和 `AgentDrawer` 都消费此 Context。

### 6.2 编排回写闭环

```
用户拖拽 Dashboard 预警卡 → Agent 抽屉
    ↓
Agent 两轮对话（研判 → 规划）
    ↓
生成 ModCard（含 affectedEventId + writebackSteps）
    ↓
用户点击 "确认变更并写入日程"
    ↓
appendWriteback(eventId, steps) 触发
    ↓
目标事件 writebackTimeline 自动插入新 step（在第一个 pending 之前）
    ↓
recentlyAppendedIds 添加对应 ID，6 秒后自动清理
    ↓
ScheduleView 重新渲染，新 step 显示 "新" 徽章 + indigo 脉冲 ring
```

### 6.3 OpenClaw 多平台联动时间线

对应《作品报告》3.2.4。WritebackTimeline 支持 6 种平台类型：

| 平台 | 主色 | 代表 |
|---|---|---|
| `agent` | indigo | Agent 生成步骤（研判/规划/策略） |
| `user` | slate | 用户确认 |
| `dingtalk` | sky | 钉钉日历同步 |
| `calendar` | emerald | 系统日历（iCal） |
| `openclaw` | violet | OpenClaw 执行队列 |
| `system` | amber | 系统提醒触发 |

演示主锚点是"研招网报名确认"事项的 7 步完整 timeline：

1. `今天 10:15` agent · 研判识别为 P0 风险
2. `今天 10:16` agent · 规划生成重排方案
3. `今天 10:17` user · 用户确认变更并授权回写
4. `今天 10:17` dingtalk · 已同步至钉钉日历
5. `今天 10:17` calendar · 已写入系统日历 (iCal)
6. `今天 10:17` openclaw · 已创建 OpenClaw 执行任务
7. `10 月 25 日 16:30` system · 等待提前 30 分钟强提醒触发（pending）

---

## 7. 关键组件规格

### 7.1 WorkflowVisualizer

见 §5。

### 7.2 RadarChart

**Props**：

```ts
interface RadarChartProps {
  dimensions: { label: string; current: number; target: number }[];
  size?: number;       // 默认 280
  max?: number;        // 默认 100
}
```

**实现**：

- 纯 SVG 绘制，无第三方图表库
- 4 层同心环多边形作为网格背景
- 双层填充多边形：当前能力（indigo 填充）+ 目标要求（虚线浅色）
- 差距 > 15 的顶点用**红色大点**，否则用 indigo 小点
- 每个顶点外侧标注 `label` 和 `current / target (±N)`
- 底部 3 项图例：当前能力 / 目标要求（南大软工）/ 重点差距

### 7.3 SkillCard + .md Modal

**卡身**：

- 顶部 header：Agent 色图标 + Skill 中文名 + `.md` 文件名（monospace）+ 所属 Agent 徽章 + 适用场景说明
- 主体：
  - **输入 / 输出**：并排 2×2 mini 卡，各显示前 2 字段名（含 `*` 必填标记）+ `+N` 截断提示
  - **关键约束**：前 2 条，带 🚫（forbid）/ ✓（require）图标
  - **异常回执**：2 行描述
- 底部：`Anthropic Agent Skills` 小字标识 + `📄 查看 .md` 按钮

**Modal**：

- 深色背景，展示 Skill 规范的原始 markdown
- 包含 YAML frontmatter（name / owner / description）+ 完整输入、输出、约束、异常回执结构化文本
- 点 Modal 外或 X 按钮关闭

### 7.4 WritebackTimeline

见 §6.3。

- 纵向时间轴
- 左侧状态圆点（对应平台色 + 图标）
- 右侧：时间标签 pill + 平台标签 pill + 描述 + 可选 meta（mono 字体显示 mock task_id / UID）
- 顶部带 `已完成 N/M 步已完成` 徽章 + OpenClaw 紫色 pill

---

## 8. 数据层（Mock）

所有数据纯前端 mock，无真实后端交互。文件组织：

| 文件 | 导出 | 用途 |
|---|---|---|
| `src/data/events.ts` | `INITIAL_EVENTS` | 3 条事件（含 writebackTimeline） |
| `src/data/skills.ts` | `SKILLS` | 4 项 Skill 完整定义 |
| `src/data/academic.ts` | `GPA_BY_SEMESTER` / `CURRENT_GPA` / `GPA_RANK_PERCENT` / `CREDIT_CATEGORIES` / `ONGOING_COURSES` / `KNOWLEDGE_NODES` / `KNOWLEDGE_EDGES` / `CREDIT_WARNINGS` / `ABILITY_RADAR` | Academic + Profile 全部学业/能力数据 |

---

## 9. 设计系统

### 9.1 色彩语义

| 语义 | Tailwind 色板 | 用途 |
|---|---|---|
| Primary | `indigo` | 主色 / 当前选中 / 焦点 |
| Success | `emerald` | 正向 / 已完成 / 领先 |
| Warning | `amber` | 轻微风险 / 待关注 |
| Danger | `rose` | 严重风险 / 落后 |
| Accent | `violet` | 策略 Agent / OpenClaw / Skill 徽章 |
| Neutral Dark | `slate-900` | 暗色强调卡（执行流、Agent 记忆） |

**钉钉品牌色 `sky` 仅用于 WritebackTimeline 的钉钉节点**；全局不使用 `orange` / `purple`（已归并到 amber / violet）。

### 9.2 字号阶梯

| 级别 | 大小 | 用途 |
|---|---|---|
| 装饰小字 | 11 px | uppercase tracking 小标签 |
| 标签 | 12 px | 次级说明、platform pill |
| 小正文 | 13 px | 列表 meta / 柱图数值 |
| 正文 | 14 px | 表格、段落 |
| 强调正文 | 15–16 px | 卡内小标题 |
| 卡片标题 | 17 px | 模块 H3 |
| 主数据 | 19–20 px | 重要 KPI 数字 |
| 大数据 | 24–25 px | 距考研天数、学分环形中心 |
| 巨字 | 45 px | GPA 主数值 |

### 9.3 圆角

- 容器 / 大卡：`rounded-3xl`（24 px）
- 子块 / 中等：`rounded-2xl`（16 px）
- 按钮 / 大 pill：`rounded-xl`（12 px）
- 徽章 / 小标签：`rounded-md` 或 `rounded-full`

### 9.4 阴影

- `shadow-sm`：所有卡片默认
- `shadow-md`：hover 提升
- `shadow-2xl`：抽屉配置覆盖层
- 进度条发光、深色节点 ring 允许使用自定义光晕 `shadow-[0_0_Npx_rgba(...)]`

### 9.5 动效

- 基础库：`motion/react`
- 入场：`opacity: 0, y: 10` → `opacity: 1, y: 0`，duration 0.35 s
- active 状态：tailwind `animate-pulse`
- 已完成：`CheckCircle2` 绿勾（lucide-react）
- Modal 入场：spring damping 22 stiffness 260

---

## 10. 与《作品报告》第三章映射

| 报告位置 | 页面/组件落地 |
|---|---|
| 3.2.1 RAG 个体长期记忆 | Profile "Agent 长期记忆摘要"（3 类分组 tag 云） |
| 3.2.2 Skill 技能封装（Anthropic 规范） | Settings "Skill 能力手册"（4 张卡 + .md Modal） |
| 3.2.3 多智能体任务理解与协同（MAS-GPT） | Dashboard "协同决策网"（WorkflowVisualizer）+ Agent 抽屉 ModCard 编排 |
| 3.2.4 基于 OpenClaw 的平台联动 | Schedule 详情 "多平台联动时间线" + ScheduleContext 写入闭环 |
| 3.2.5 隐私安全 | 当前未落地（见 §13） |
| 1.3 学业规划模块 | Academic 整页（GPA / 学分 / 预警 / 课程表 / 拓扑） |
| 1.3 生涯规划模块 / 6.2 能力雷达 | Profile 多维能力雷达（双层 + 差距红点） |
| 1.3 聚合信息引擎 | Settings 信息源卡片 + Dashboard "系统上下文嗅探" |

---

## 11. 技术栈与目录结构

### 11.1 技术栈

- React 19
- TypeScript（strict 模式）
- Vite 6
- Tailwind CSS 4
- motion / motion/react（动画）
- lucide-react（图标）

### 11.2 目录结构

```
src/
├─ App.tsx                         页面路由 + ScheduleProvider + main 响应式 padding
├─ main.tsx                        Vite 入口
├─ index.css                       Tailwind + 自定义 scrollbar
├─ types.ts                        PageType / AgentType / EventItem / WritebackStep / SkillDef 等
├─ components/
│  ├─ Sidebar.tsx                  左侧悬浮导航（5 项）
│  ├─ AgentDrawer.tsx              抽屉 + CitationBlock + ModCardBlock + 可调宽
│  ├─ WorkflowVisualizer.tsx       MAS-GPT 4 层流程图（完整 / compact 两种模式）
│  ├─ RadarChart.tsx               能力雷达 SVG
│  └─ SkillCard.tsx                Skill 卡 + .md 预览 Modal
├─ views/
│  ├─ DashboardView.tsx            聚合工作台
│  ├─ AcademicView.tsx             学业规划
│  ├─ ScheduleView.tsx             日程编排
│  ├─ ProfileView.tsx              成长档案
│  └─ SettingsView.tsx             订阅规则
├─ context/
│  └─ ScheduleContext.tsx          全局事件 + writeback
├─ data/
│  ├─ events.ts                    初始事件列表
│  ├─ skills.ts                    4 项 Skill 定义
│  └─ academic.ts                  GPA / 学分 / 课程 / 拓扑 / 雷达 mock
└─ lib/
   └─ utils.ts                     cn() 工具
```

### 11.3 构建命令

```bash
npm run dev       # 本地开发，http://localhost:3000
npm run build     # 产出 dist/
npm run preview   # 预览构建结果（默认 4173）
npm run lint      # tsc --noEmit 类型检查
npm run clean     # 清理 dist
```

无真实后端。`.env.example` 中列出的 `GEMINI_API_KEY` / `APP_URL` 未被代码实际读取，本地启动无需任何密钥。

---

## 12. 验收清单

### 12.1 基础

- TypeScript 零报错（`npm run lint`）
- 生产构建成功（`npm run build`）
- dev 模式 5 主页面均能正常渲染

### 12.2 功能

- 左侧 5 主导航可切换，页面切换后 Agent 抽屉默认 Agent 跟随变化
- Dashboard 预警卡：单击跳 Schedule + 聚焦研招网事项；拖拽到抽屉触发 Multi-Agent 对话
- AgentDrawer：3 个 Agent checkbox 可多选；建议词胶囊可点击发送；ModCard 确认 → Schedule timeline 即时新增"新"脉冲步骤
- 抽屉左缘可拖拽调宽 288–640 px，双击把手重置，刷新后宽度保留
- Skill 卡 "查看 .md" 能弹 Modal 展示 markdown
- Settings 信息源卡可点击进入 drill-down 抓取池
- Schedule 详情 / 月历可切换

### 12.3 布局

- 5 个主页面左右留白按视口断点一致响应式
- Dashboard Bento 6 列栅格严格对齐（Row1 = 3+3，Row2 = 2+2+2）
- WorkflowVisualizer 4 层节点垂直中线严格对齐
- Profile 3 行栅格对齐清晰
- 任意抽屉宽度下所有卡片内容均不被裁切（overflow-hidden 仅用于装饰层，不用在卡片外壳）
- Schedule 详情面板超长 timeline 可通过面板内部滚动条查看，不阻塞左侧清单和页面头部

### 12.4 视觉

- 字号分布符合 §9.2
- 圆角仅用 `rounded-3xl` / `rounded-2xl` / `rounded-xl` / `rounded-md` / `rounded-full`
- 颜色仅限 §9.1 列出的语义色 + sky（仅 writeback 钉钉节点）
- 知识点拓扑图在大屏不被放大、在小屏等比缩小
- GPA 柱图 5 学期差异视觉清晰（非 0 基线）

---

## 13. 后续可扩展方向

以下内容已有技术路径，**当前 Demo 未落地**，是下一阶段可以继续推进的方向：

- **路由切换过渡动画**：`AnimatePresence` 包裹 view
- **术语 Tooltip**：MAS-GPT / OpenClaw / RAG / P0 等术语悬停显示解释
- **多套 Mock 剧情**：目前仅有 "考研报名 vs 计网实验" 一个冲突场景，可补 "期末 vs 大创" / "保研材料 vs 竞赛国赛" 等
- **"一键演示" 按钮**：自动串起 Dashboard → 拖拽 → 抽屉 → ModCard → Schedule → Profile 完整叙事
- **抽屉引用块（Quote Block）**：目前拖拽只预填文本，未做富引用块视觉
- **对话 → 主页面反向定位**：点击抽屉内引用的任务卡自动滚动主页面定位
- **隐私安全可视化**：对应报告 3.2.5，分层存储 / sandbox / 用户确认写入的前端呈现
- **目标模式切换**：考研 / 保研 / 竞赛 / 求职的主干切换，页面内容联动
- **主控 Agent 显式化**：把 MAS-GPT 的"主控"作为第 4 个 Agent 单独可见
- **真实模型 / 平台接入**：Gemini API、钉钉 Webhook、教务接口（超出纯前端 Demo 范围）
