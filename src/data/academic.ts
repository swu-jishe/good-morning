import {submissionContent} from '../content/submissionContent';

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

export const GPA_BY_SEMESTER: {label: string; value: number}[] = submissionContent.academic.gpaBySemester;
export const CURRENT_GPA = submissionContent.academic.currentGpa;
export const TARGET_GPA = submissionContent.academic.targetGpa;
export const CREDIT_CATEGORIES: CreditCategory[] = submissionContent.academic.creditCategories;
export const ONGOING_COURSES: OngoingCourse[] = submissionContent.academic.ongoingCourses;
export const KNOWLEDGE_NODES: KnowledgeNode[] = submissionContent.academic.knowledgeNodes;
export const KNOWLEDGE_EDGES: KnowledgeEdge[] = submissionContent.academic.knowledgeEdges;
export const CREDIT_WARNINGS = submissionContent.academic.warnings;
export const ABILITY_RADAR = submissionContent.academic.abilityRadar;
