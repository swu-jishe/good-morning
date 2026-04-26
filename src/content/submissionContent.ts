import type {EventItem, PageType, SkillDef} from '../types';

export const DEMO_BANNED_MARKERS = [
  '南京大学',
  '蓝桥杯',
  '研招网',
  '学习通',
  '学信网',
  'Anthropic',
  'OpenClaw',
  'Demo',
];

export const submissionContent = {
  navigation: {
    appName: '知途',
    badge: '智能协同',
    pageSummaries: {
      dashboard: '聚合工作台：汇总系统摘要、推荐动作与当前数据状态。',
      academic: '学业规划：查看成绩分析、学分进度与能力基线。',
      schedule: '日程编排：查看事项详情视图、月历视图与本地时间线结构。',
      profile: '成长档案：查看长期规划、阶段进展与能力对照。',
      settings: '信息源与策略：查看接入策略、来源状态与能力说明。',
    } satisfies Record<PageType, string>,
  },
  mascot: {
    greetings: [
      '你好，当前暂无新数据返回，我会继续陪你查看系统状态。',
      '最新业务数据仍在等待同步，现可先浏览各模块结构。',
      '如果你在查看布局或流程，我可以继续做页面导览。',
      '今天也按结构化方式推进下一步吧。',
    ],
    timeGreetings: {
      early: '早上好，先快速浏览今天的系统摘要吧。',
      late: '夜深了，整理材料后也记得留出休息时间。',
      normal: '欢迎回来，当前暂无新数据返回。',
    },
  },
  dashboard: {
    subtitle: '当前暂无数据，系统将继续等待后端返回并同步最新状态。',
    metrics: [
      {label: '已整理', value: 0, tone: 'neutral'},
      {label: '待确认', value: 0, tone: 'attention'},
      {label: '阻断项', value: 0, tone: 'stable'},
    ],
    primaryCard: {
      sourceLabel: '系统摘要',
      title: '当前暂无数据返回',
      summary: '系统已完成摘要、推荐动作与能力分析的承载准备，当前等待后端返回输入数据。',
      actionLabel: '查看数据状态',
      secondaryLabel: '查看智能协同',
    },
    recommendation: {
      label: '当前推荐动作',
      title: '等待后端返回后生成下一步推荐策略',
    },
    timeline: [
      {window: '00:00', title: '等待数据同步', detail: '当前暂无新的时间区块记录。'},
      {window: '00:00', title: '等待推荐刷新', detail: '推荐动作将在收到后端输入后更新。'},
      {window: '00:00', title: '等待系统回传', detail: '时间线将在后端返回后展示最新进度。'},
    ],
    profileSummary: {
      goal: '长期规划待同步',
      stage: '暂无记录',
      progressLabel: '完成度 0%',
      tags: ['智能协同', '能力基线', '待同步'],
    },
    monitors: [
      {title: '内容层统一维护', detail: '当前暂无业务记录，系统继续等待新的内容同步。'},
      {title: '界面模块稳定展示', detail: '布局与分析模块已就绪，待后端返回后补充数据。'},
    ],
  },
  academic: {
    headerSubtitle: '成绩测算 · 学分进度 · 知识拓扑',
    syncLabel: '数据状态：等待后端返回',
    gpaBySemester: [
      {label: '阶段一', value: 0},
      {label: '阶段二', value: 0},
      {label: '阶段三', value: 0},
      {label: '阶段四', value: 0},
    ],
    currentGpa: 0,
    targetGpa: 0,
    creditCategories: [
      {label: '核心课程', earned: 0, required: 0, color: 'bg-indigo-500'},
      {label: '拓展模块', earned: 0, required: 0, color: 'bg-violet-500'},
      {label: '公共基础', earned: 0, required: 0, color: 'bg-emerald-500'},
      {label: '综合实践', earned: 0, required: 0, color: 'bg-amber-500'},
    ],
    ongoingCourses: [] satisfies Array<{
      id: string;
      name: string;
      teacher: string;
      credit: number;
      schedule: string;
      predicted: number;
      risk: 'low' | 'medium' | 'high';
      note?: string;
    }>,
    knowledgeNodes: [
      {id: 'base', label: '基础能力', mastery: 'locked', x: 0, y: 1},
      {id: 'model', label: '模型理解', mastery: 'locked', x: 1, y: 0},
      {id: 'plan', label: '规划方法', mastery: 'locked', x: 2, y: 1},
      {id: 'integration', label: '接口接入', mastery: 'locked', x: 3, y: 1},
      {id: 'delivery', label: '交付整理', mastery: 'locked', x: 4, y: 2},
    ] satisfies Array<{
      id: string;
      label: string;
      mastery: 'done' | 'ongoing' | 'locked';
      x: number;
      y: number;
    }>,
    knowledgeEdges: [
      {from: 'base', to: 'model'},
      {from: 'model', to: 'plan'},
      {from: 'plan', to: 'integration'},
      {from: 'integration', to: 'delivery'},
    ],
    warnings: [
      {level: 'warn', title: '当前暂无成绩记录', desc: '成绩、学分与课程分析将在后端返回后更新。'},
      {level: 'info', title: '分析状态', desc: '当前仅显示空态结果，后续将按实际输入生成分析结论。'},
    ],
    abilityRadar: [
      {label: '基础能力', current: 0, target: 0},
      {label: '结构化表达', current: 0, target: 0},
      {label: '计划执行', current: 0, target: 0},
      {label: '资料整理', current: 0, target: 0},
      {label: '交付质量', current: 0, target: 0},
      {label: '协同效率', current: 0, target: 0},
    ],
  },
  profile: {
    overview: {
      title: '主干长期目标 · 能力基线档案',
      subtitle: '由统一内容层管理',
      daysLabel: '阶段剩余 0 天',
      cards: [
        {label: '目标方向', value: '待定'},
        {label: '规划主题', value: '暂无记录'},
        {label: '基线目标', value: '待定'},
        {label: '状态评估', value: '暂无记录'},
      ],
      progress: 0,
    },
    stageProgress: [
      {subject: '长期规划', category: '规划主线', status: 'on-track', delta: '0%', detail: '当前暂无规划进展记录，等待后端同步。', barPercent: 0},
      {subject: '能力基线', category: '分析维度', status: 'on-track', delta: '0%', detail: '能力分析模块已就绪，当前暂无基线数据。', barPercent: 0},
      {subject: '阶段里程碑', category: '关键节点', status: 'on-track', delta: '0%', detail: '当前暂无里程碑更新记录。', barPercent: 0},
      {subject: '验证覆盖', category: '同步记录', status: 'on-track', delta: '0%', detail: '当前暂无新的验证记录返回。', barPercent: 0},
    ],
    milestones: [
      {label: '长期规划确认', date: '待定', status: 'future'},
      {label: '能力基线同步', date: '待定', status: 'future'},
      {label: '阶段分析生成', date: '待定', status: 'future'},
      {label: '结果更新回传', date: '待定', status: 'future'},
    ],
    memorySections: [
      {title: '展示偏好', items: ['偏好结构化摘要', '保留清晰卡片层级']},
      {title: '交互规则', items: ['等待后端返回交互记录', '保持人工确认流程']},
      {title: '后续方向', items: ['预留接口接入位', '补充真实状态同步']},
    ],
    radarTargetLabel: '目标基线',
  },
  schedule: {
    events: [] satisfies EventItem[],
  },
  settings: {
    overviewTitle: '信息源接入与管理',
    overviewText: '系统已就绪，当前返回 0 条信息源数据。',
    statusText: '等待后端返回',
    fetchButtonLabel: '等待后端返回',
    sources: [
      {
        id: 1,
        name: '官方通知类来源',
        domain: '待定',
        url: '#',
        status: 'configured',
        lastSync: '00:00',
        total: 0,
        latestRaw: '系统已就绪，当前暂无来源明细。',
        items: [],
      },
      {
        id: 2,
        name: '日程与任务来源',
        domain: '待定',
        url: '#',
        status: 'manual',
        lastSync: '00:00',
        total: 0,
        latestRaw: '系统已就绪，当前暂无日程来源记录。',
        items: [],
      },
      {
        id: 3,
        name: '智能协同来源',
        domain: '待定',
        url: '#',
        status: 'pending',
        lastSync: '00:00',
        total: 0,
        latestRaw: '系统已就绪，当前暂无协同来源记录。',
        items: [],
      },
    ],
    reminderRules: [
      {title: '阻断提醒', detail: '当后端返回阻断型数据时，系统将在此展示提醒策略；当前暂无记录。'},
      {title: '人工确认', detail: '当后端返回变更请求时，系统将在此展示确认策略；当前暂无记录。'},
    ],
    exceptionStates: [
      {label: '信息源返回 0 条', status: 'readonly'},
      {label: '同步时间 00:00', status: 'pending'},
      {label: '来源状态待定', status: 'planned'},
    ],
  },
  assistant: {
    systemMessage: '系统已就绪，但当前暂无输入数据。',
    responseMessage: '当前暂无交互记录，等待后端返回。',
    dragPrefill: '已引用当前卡片，等待后端返回可处理的输入数据。',
    configNotice: '当前页面默认显示对应协同角色，可在本页切换查看：',
    configFootnote: '当前暂无长期配置记录，协同面板将继续等待后端返回。',
    suggestions: {
      judgment: ['查看信息源状态', '查看当前交互记录', '等待后端返回'],
      planning: ['查看日程状态', '查看流程状态', '等待后端返回'],
      policy: ['查看策略状态', '查看协同状态', '等待后端返回'],
    },
    prompts: {
      judgment: '系统已就绪，但当前暂无输入数据，请等待后端返回信息源记录。',
      planning: '系统已就绪，但当前暂无日程数据，请等待后端返回流程记录。',
      policy: '系统已就绪，但当前暂无策略输入，请等待后端返回协同结果。',
    },
  },
  workflow: {
    title: '智能协同流程',
    hint: '系统已就绪，但当前暂无输入数据，等待后端返回。',
    stages: [
      {
        stage: 'intake',
        nodes: [{id: 'content', role: 'master', label: '0 条输入数据', detail: '系统已就绪，当前暂无信息源输入。', status: 'active'}],
      },
      {
        stage: 'parallel',
        nodes: [
          {id: 'page-shell', role: 'judgment', label: '信息研判', detail: '暂无交互记录', status: 'pending'},
          {id: 'schedule-shell', role: 'planning', label: '日程规划', detail: '暂无日程记录', status: 'pending'},
          {id: 'policy-shell', role: 'policy', label: '策略支持', detail: '暂无策略记录', status: 'pending'},
        ],
      },
      {
        stage: 'converge',
        nodes: [{id: 'review', role: 'master', label: '协同汇聚', detail: '等待后端返回', status: 'pending'}],
      },
      {
        stage: 'output',
        nodes: [{id: 'future', role: 'output', label: '输出结果', detail: '暂无结果记录', status: 'pending'}],
      },
    ],
  },
  skills: {
    items: [
      {
        id: 'source-monitoring',
        name: '信息源整理与映射',
        code: 'source-monitoring',
        ownerAgent: 'judgment',
        scenario: '整理待接入信息源的字段结构、来源类型与映射说明。',
        inputs: [
          {name: 'source_list', type: 'string[]', required: true, desc: '待接入来源列表'},
          {name: 'field_schema', type: 'Record<string, string>', required: true, desc: '目标字段结构'},
        ],
        outputs: [
          {name: 'normalized_sources', type: 'SourceDescriptor[]', required: true, desc: '统一后的来源定义'},
          {name: 'integration_notes', type: 'string[]', required: true, desc: '后续接入说明'},
        ],
        constraints: [
          {kind: 'forbid', text: '禁止在前端中声称已实时联网抓取'},
          {kind: 'require', text: '必须明确标记当前仅为说明态输出'},
        ],
        exceptionPolicy: '若来源字段尚未确定，返回待补结构定义并保持空结果。',
        mdPreview: `---\nname: source-monitoring\ndescription: 整理来源字段与后续接入说明\n---\n\n# Source Monitoring\n\n## 输入\n- source_list\n- field_schema\n\n## 输出\n- normalized_sources\n- integration_notes\n\n## 约束\n- 不声称实时联网\n- 明确当前仅为说明态\n`,
      },
      {
        id: 'schedule-structure',
        name: '日程结构说明',
        code: 'schedule-structure',
        ownerAgent: 'planning',
        scenario: '说明事项卡、月历网格、清单和本地时间线在真实接入后的承载方式。',
        inputs: [
          {name: 'events', type: 'EventItem[]', required: true, desc: '当前日程事件'},
          {name: 'calendar_window', type: 'string', required: true, desc: '目标显示月份'},
        ],
        outputs: [
          {name: 'calendar_model', type: 'CalendarModel', required: true, desc: '渲染所需的月历结构'},
          {name: 'shell_notes', type: 'string[]', required: true, desc: '结构说明'},
        ],
        constraints: [
          {kind: 'forbid', text: '禁止编造外部平台已回写成功'},
          {kind: 'require', text: '必须保留用户确认作为真实回写前置条件'},
        ],
        exceptionPolicy: '若缺少日历日期字段，返回 calendarDate 缺失并阻止渲染推导。',
        mdPreview: `---\nname: schedule-structure\ndescription: 说明日程页面如何承载真实数据\n---\n\n# Schedule Structure\n\n## 输入\n- events\n- calendar_window\n\n## 输出\n- calendar_model\n- shell_notes\n\n## 约束\n- 不编造外部回写成功\n- 保留用户确认前置条件\n`,
      },
      {
        id: 'baseline-analysis',
        name: '基线对照说明',
        code: 'baseline-analysis',
        ownerAgent: 'policy',
        scenario: '说明能力雷达、阶段进展和里程碑数据的展示语义。',
        inputs: [
          {name: 'baseline_dimensions', type: 'RadarDimension[]', required: true, desc: '当前基线维度'},
          {name: 'progress_sections', type: 'ProgressSection[]', required: true, desc: '阶段进展信息'},
        ],
        outputs: [
          {name: 'radar_view_model', type: 'RadarViewModel', required: true, desc: '雷达图展示模型'},
          {name: 'summary_copy', type: 'string[]', required: true, desc: '说明文案'},
        ],
        constraints: [
          {kind: 'forbid', text: '禁止引用特定学校、考试或竞赛结果'},
          {kind: 'require', text: '必须使用中性目标基线表达'},
        ],
        exceptionPolicy: '若基线维度不完整，回退到最小展示集并显式标记为字段待补齐。',
        mdPreview: `---\nname: baseline-analysis\ndescription: 说明能力基线与阶段进展的展示规则\n---\n\n# Baseline Analysis\n\n## 输入\n- baseline_dimensions\n- progress_sections\n\n## 输出\n- radar_view_model\n- summary_copy\n\n## 约束\n- 不引用特定学校、考试或竞赛\n- 使用中性目标基线表达\n`,
      },
    ] satisfies SkillDef[],
  },
};
