export enum Role {
  USER = 'USER',
  MANAGER = 'MANAGER',
  CEO = 'CEO',
  ADMIN = 'ADMIN'
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
  FAILED = 'FAILED'
}

export enum Methodology {
  AGILE = 'AGILE',
  WATERFALL = 'WATERFALL',
  KANBAN = 'KANBAN'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar: string;
  verificationLevel: number; // 1-5
  performanceScore: number;
  skills: { name: string; level: number }[];
  founderEligibility: number; // 0-100%
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string | 'AI';
  status: TaskStatus;
  difficulty: number; // 1-10
  aiConfidence?: number;
  isAiGenerated: boolean;
}

export interface Company {
  id: string;
  name: string;
  revenue: number;
  trustScore: number;
  methodology: Methodology;
  employees: number;
  burnRate: number;
  aiModel: string;
  description?: string;
}

export interface AIState {
  mood: 'Optimistic' | 'Neutral' | 'Stressed';
  confidence: number;
  reliability: number;
  lastAction: string;
  model: string;
}

export interface Meeting {
  id: string;
  type: 'Standup' | 'Sprint Planning' | 'Retro' | '1:1' | 'Townhall';
  participants: string[];
  isAiDriven: boolean;
  status: 'Scheduled' | 'Live' | 'Completed';
}