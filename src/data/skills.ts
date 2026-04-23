import { SkillDef } from '../types';

export const SKILLS: SkillDef[] = [
  {
    id: 'competition-scanner',
    name: '竞赛信息抓取与结构化',
    code: 'competition-scanner',
    ownerAgent: 'judgment',
    scenario: '定期扫描主流竞赛官网与校内通知，抽取报名时间、参赛要求、考核科目等关键字段，结构化入池供工作台调用。',
    inputs: [
      { name: 'source_urls', type: 'string[]', required: true, desc: '待扫描的竞赛信息源 URL 列表' },
      { name: 'keywords', type: 'string[]', required: false, desc: '过滤关键词（如「蓝桥杯」「大创」）' },
      { name: 'since', type: 'ISO8601', required: false, desc: '仅抓取该时间点之后的更新' },
    ],
    outputs: [
      { name: 'items', type: 'CompetitionItem[]', required: true, desc: '结构化竞赛卡片数组' },
      { name: 'title', type: 'string', required: true, desc: '竞赛标题' },
      { name: 'deadline', type: 'ISO8601', required: true, desc: '报名截止时间' },
      { name: 'subjects', type: 'string[]', required: false, desc: '考核科目' },
    ],
    constraints: [
      { kind: 'forbid', text: '禁止将原始 HTML 整段写入记忆库' },
      { kind: 'forbid', text: '禁止主动触发外部平台的登录动作' },
      { kind: 'require', text: '必须附带来源 URL 与抓取时间戳' },
      { kind: 'require', text: '字段缺失时需显式标记为 null 而非编造' },
    ],
    exceptionPolicy:
      '若目标站点返回非 2xx 或解析失败，标记 source 为 degraded 并进入异常回执队列，等待下一轮轮询重试，**不得** silent fallback。',
    mdPreview: `---
name: competition-scanner
owner: judgment-agent
description: 扫描竞赛信息源，输出结构化卡片
---

# Competition Scanner

## 适用场景
在用户关注"学科竞赛 / 大创 / ACM"等模式下，由信息研判 Agent 按配置周期拉取。

## 输入
- source_urls: string[]  （必填）
- keywords: string[]     （可选）
- since: ISO8601         （可选）

## 输出
- items: CompetitionItem[]
  - title: string
  - deadline: ISO8601
  - subjects: string[]
  - source_url: string
  - fetched_at: ISO8601

## 约束
- ❌ 禁止整段 HTML 入库
- ❌ 禁止触发平台登录
- ✅ 必须附带来源 URL 与抓取时间戳
- ✅ 字段缺失时显式 null

## 异常回执
失败 → 标记 degraded → 进入 exception queue，**不 silent fallback**。
`,
  },
  {
    id: 'schedule-conflict-resolver',
    name: '任务冲突检测与重排',
    code: 'schedule-conflict-resolver',
    ownerAgent: 'planning',
    scenario: '当有新任务写入或现有任务时间变更时，自动检测与既有日程的物理/逻辑冲突，给出重排建议卡。',
    inputs: [
      { name: 'incoming_task', type: 'EventItem', required: true, desc: '即将写入的任务（含时间、优先级、来源）' },
      { name: 'existing_schedule', type: 'EventItem[]', required: true, desc: '当前用户日程快照' },
      { name: 'user_profile', type: 'UserProfileRef', required: true, desc: '用户长期目标与能力画像引用' },
    ],
    outputs: [
      { name: 'has_conflict', type: 'boolean', required: true, desc: '是否存在冲突' },
      { name: 'modification_card', type: 'ModCard', required: false, desc: '冲突时输出的修改预览卡' },
      { name: 'rationale', type: 'string', required: true, desc: '决策理由（面向用户）' },
    ],
    constraints: [
      { kind: 'require', text: '生成的重排方案必须保留原任务信息作为 diff 对照' },
      { kind: 'require', text: '必须经用户二次确认后才能真正落库' },
      { kind: 'forbid', text: '禁止跨越用户已手动锁定（pinned）的时间块' },
    ],
    exceptionPolicy:
      '若检测到的冲突数 > 5，降级为「列出冲突清单、不再自动重排」，交由策略 Agent 介入。',
    mdPreview: `---
name: schedule-conflict-resolver
owner: planning-agent
description: 冲突检测 + 重排预览卡
---

# Schedule Conflict Resolver

## 适用场景
新任务写入 / 现有任务变更 / 用户主动请求"帮我理一理本周"。

## 输入
- incoming_task: EventItem  （必填）
- existing_schedule: EventItem[]
- user_profile: ref

## 输出
- has_conflict: boolean
- modification_card: ModCard?   # 仅在冲突时产出
- rationale: string

## 约束
- ✅ 必须保留原任务快照作为 diff
- ✅ 必须二次确认才落库
- ❌ 禁止跨越 pinned 时间块

## 异常回执
冲突数 > 5 → 降级为冲突清单 + 交由策略 Agent 介入。
`,
  },
  {
    id: 'target-gap-analyzer',
    name: '目标差距分析',
    code: 'target-gap-analyzer',
    ownerAgent: 'policy',
    scenario: '根据目标院校/企业的历年录取/录用标准，结合用户当前能力画像，输出差距雷达与阶段补齐建议。',
    inputs: [
      { name: 'target_type', type: '"school" | "company"', required: true, desc: '目标类型' },
      { name: 'target_ref', type: 'string', required: true, desc: '目标标识（如 "南京大学-软件工程"）' },
      { name: 'user_ability', type: 'AbilitySnapshot', required: true, desc: '用户当前多维能力快照' },
    ],
    outputs: [
      { name: 'gap_radar', type: 'RadarData', required: true, desc: '差距雷达数据（当前 vs 目标）' },
      { name: 'priority_gaps', type: 'Gap[]', required: true, desc: '需优先补齐的维度列表' },
      { name: 'action_plan', type: 'ActionStep[]', required: true, desc: '建议行动计划' },
    ],
    constraints: [
      { kind: 'require', text: '必须以目标历年数据中位数为基准，不得单点外推' },
      { kind: 'require', text: '输出仅作建议，不直接修改用户目标或日程' },
    ],
    exceptionPolicy:
      '目标样本数 < 3 年时，仅输出参考性建议并在 UI 明显标记「数据不足，仅供参考」。',
    mdPreview: `---
name: target-gap-analyzer
owner: policy-agent
description: 目标差距分析 + 雷达图数据
---

# Target Gap Analyzer

## 适用场景
用户切换目标（如"考研目标院校"）或主动请求差距诊断。

## 输入
- target_type: "school" | "company"
- target_ref: string
- user_ability: AbilitySnapshot

## 输出
- gap_radar: RadarData
- priority_gaps: Gap[]
- action_plan: ActionStep[]

## 约束
- ✅ 基于历年中位数，**禁止**单点外推
- ✅ 仅建议，不直接修改目标

## 异常回执
样本 < 3 年 → 输出加注「数据不足，仅供参考」。
`,
  },
  {
    id: 'gpa-early-warning',
    name: 'GPA 动态测算与学分预警',
    code: 'gpa-early-warning',
    ownerAgent: 'policy',
    scenario: '接入教务系统，实时测算 GPA、追踪学分进度，学分不足 / 预期掉档时主动预警。',
    inputs: [
      { name: 'transcript', type: 'CourseGrade[]', required: true, desc: '历次成绩单' },
      { name: 'curriculum', type: 'CurriculumSpec', required: true, desc: '培养方案（学分要求）' },
      { name: 'ongoing_courses', type: 'CourseRef[]', required: false, desc: '当前在修课程' },
    ],
    outputs: [
      { name: 'gpa', type: 'number', required: true, desc: '当前累计 GPA（4.0 制）' },
      { name: 'credit_progress', type: 'CreditProgress', required: true, desc: '学分完成结构' },
      { name: 'warnings', type: 'Warning[]', required: true, desc: '预警列表' },
    ],
    constraints: [
      { kind: 'forbid', text: '禁止将用户成绩原文向大模型作 prompt 注入' },
      { kind: 'require', text: '预警必须带有可执行建议（如推荐某类选修课）' },
    ],
    exceptionPolicy:
      '教务接口不可用时，显示最后一次成功同步的快照 + 「数据延迟 N 天」标识。',
    mdPreview: `---
name: gpa-early-warning
owner: policy-agent
description: GPA 测算 + 学分预警
---

# GPA Early Warning

## 适用场景
学业规划页刷新 / 选课季触发 / 期末成绩录入后。

## 输入
- transcript: CourseGrade[]
- curriculum: CurriculumSpec
- ongoing_courses: CourseRef[]

## 输出
- gpa: number
- credit_progress: CreditProgress
- warnings: Warning[]

## 约束
- ❌ 禁止将成绩原文 prompt 注入
- ✅ 预警必须带可执行建议

## 异常回执
教务接口不可用 → 展示最后快照 + 数据延迟标识。
`,
  },
];
