export type PageType = 'dashboard' | 'academic' | 'schedule' | 'settings' | 'profile';
export type AgentType = 'judgment' | 'planning' | 'policy';
export type SourceType = 'competition' | 'exam' | 'course' | 'activity' | 'system';

export type WritebackPlatform =
  | 'agent'
  | 'user'
  | 'dingtalk'
  | 'calendar'
  | 'openclaw'
  | 'system';

export interface WritebackStep {
  time: string;
  platform: WritebackPlatform;
  label: string;
  status: 'done' | 'active' | 'pending';
  meta?: string;
}

export interface EventChecklistItem {
  id: string;
  title: string;
  estimate: string;
  done: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  calendarDate: string;
  date: string;
  time?: string;
  source: SourceType;
  priority: 'high' | 'medium' | 'low';
  summary: string;
  actionRequired?: string;
  url?: string;
  checklist?: EventChecklistItem[];
  writebackTimeline?: WritebackStep[];
}

export interface SkillField {
  name: string;
  type: string;
  required: boolean;
  desc: string;
}

export interface SkillDef {
  id: string;
  name: string;
  code: string;
  scenario: string;
  ownerAgent: AgentType;
  inputs: SkillField[];
  outputs: SkillField[];
  constraints: { kind: 'forbid' | 'require'; text: string }[];
  exceptionPolicy: string;
  mdPreview: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  role?: string;
  status: 'done' | 'active' | 'pending';
  detail?: string;
  branch?: 'parallel' | 'serial';
}
