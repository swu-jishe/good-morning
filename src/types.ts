export type PageType = 'dashboard' | 'schedule' | 'settings';
export type AgentType = 'judgment' | 'planning' | 'policy';
export type SourceType = 'competition' | 'exam' | 'course' | 'activity' | 'system';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  source: SourceType;
  priority: 'high' | 'medium' | 'low';
  summary: string;
  actionRequired?: string;
  url?: string;
}
