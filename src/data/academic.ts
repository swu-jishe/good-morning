export interface CourseGrade {
  id: string;
  name: string;
  credit: number;
  grade: number;
  category: 'major-core' | 'major-elective' | 'public' | 'general';
  semester: string;
}

export interface CreditCategory {
  label: string;
  earned: number;
  required: number;
  color: string;
}

export interface OngoingCourse {
  id: string;
  name: string;
  teacher: string;
  credit: number;
  schedule: string;
  predicted: number;
  risk: 'low' | 'medium' | 'high';
  note?: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  mastery: 'done' | 'ongoing' | 'locked';
  x: number;
  y: number;
}

export interface KnowledgeEdge {
  from: string;
  to: string;
}

export const GPA_BY_SEMESTER: { label: string; value: number }[] = [
  { label: '大一上', value: 3.62 },
  { label: '大一下', value: 3.71 },
  { label: '大二上', value: 3.78 },
  { label: '大二下', value: 3.84 },
  { label: '大三上', value: 3.82 },
];

export const CURRENT_GPA = 3.82;
export const TARGET_GPA = 3.9;

export const CREDIT_CATEGORIES: CreditCategory[] = [
  { label: '专业必修', earned: 52, required: 64, color: 'bg-indigo-500' },
  { label: '专业选修', earned: 18, required: 24, color: 'bg-violet-500' },
  { label: '公共必修', earned: 28, required: 32, color: 'bg-emerald-500' },
  { label: '通识教育', earned: 10, required: 16, color: 'bg-amber-500' },
];

export const ONGOING_COURSES: OngoingCourse[] = [
  {
    id: 'c1',
    name: '操作系统',
    teacher: '张教授',
    credit: 4,
    schedule: '周一 3-4 / 周四 1-2',
    predicted: 89,
    risk: 'low',
  },
  {
    id: 'c2',
    name: '计算机网络',
    teacher: '李教授',
    credit: 3,
    schedule: '周二 1-2 / 周五 3-4',
    predicted: 82,
    risk: 'medium',
    note: '实验四提交进度落后，建议本周补齐',
  },
  {
    id: 'c3',
    name: '机器学习',
    teacher: '王教授',
    credit: 3,
    schedule: '周三 5-6',
    predicted: 78,
    risk: 'high',
    note: '第二次随堂测验偏低，影响平时分',
  },
  {
    id: 'c4',
    name: '软件工程',
    teacher: '陈教授',
    credit: 2,
    schedule: '周四 5-6',
    predicted: 91,
    risk: 'low',
  },
  {
    id: 'c5',
    name: '马克思主义基本原理',
    teacher: '刘教授',
    credit: 3,
    schedule: '周一 5-6',
    predicted: 84,
    risk: 'medium',
    note: '主观题记忆偏弱',
  },
];

export const KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: 'ds', label: '数据结构', mastery: 'done', x: 1, y: 1 },
  { id: 'algo', label: '算法设计', mastery: 'done', x: 2, y: 0 },
  { id: 'discrete', label: '离散数学', mastery: 'done', x: 0, y: 0 },
  { id: 'os', label: '操作系统', mastery: 'ongoing', x: 3, y: 1 },
  { id: 'net', label: '计算机网络', mastery: 'ongoing', x: 3, y: 2 },
  { id: 'db', label: '数据库原理', mastery: 'ongoing', x: 2, y: 2 },
  { id: 'se', label: '软件工程', mastery: 'ongoing', x: 4, y: 2 },
  { id: 'ai', label: 'AI 基础', mastery: 'ongoing', x: 3, y: 3 },
  { id: 'ml', label: '机器学习', mastery: 'ongoing', x: 4, y: 3 },
  { id: 'compiler', label: '编译原理', mastery: 'locked', x: 4, y: 1 },
  { id: 'distributed', label: '分布式系统', mastery: 'locked', x: 5, y: 2 },
  { id: 'dl', label: '深度学习', mastery: 'locked', x: 5, y: 3 },
];

export const KNOWLEDGE_EDGES: KnowledgeEdge[] = [
  { from: 'discrete', to: 'ds' },
  { from: 'discrete', to: 'algo' },
  { from: 'ds', to: 'algo' },
  { from: 'ds', to: 'db' },
  { from: 'algo', to: 'os' },
  { from: 'algo', to: 'net' },
  { from: 'algo', to: 'compiler' },
  { from: 'os', to: 'distributed' },
  { from: 'net', to: 'distributed' },
  { from: 'db', to: 'se' },
  { from: 'os', to: 'compiler' },
  { from: 'algo', to: 'ai' },
  { from: 'ai', to: 'ml' },
  { from: 'ml', to: 'dl' },
];

export const CREDIT_WARNINGS = [
  {
    level: 'warn' as const,
    title: '通识教育学分不足',
    desc: '距毕业要求还差 6 学分，建议大三下选择《科技史》《艺术鉴赏》任一组合。',
  },
  {
    level: 'info' as const,
    title: '专业选修结构建议',
    desc: '已修 AI 方向 9 学分、系统方向 3 学分，继续冲考研复试方向建议加选《高级算法分析》。',
  },
];

export const ABILITY_RADAR = [
  { label: '专业课基础', current: 86, target: 92 },
  { label: '数学能力', current: 78, target: 90 },
  { label: '英语能力', current: 72, target: 85 },
  { label: '政治/公共课', current: 62, target: 82 },
  { label: '竞赛 / 项目', current: 84, target: 80 },
  { label: '信息素养', current: 92, target: 75 },
];
