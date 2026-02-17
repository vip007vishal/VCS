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

export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'Online' | 'Offline' | 'In Meeting' | 'Processing';
  reliability: number;
  capacity: number; // Max concurrent tasks
  isAi: boolean;
  avatar?: string;
  risk?: 'Low' | 'Medium' | 'High';
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string | 'AI' | null;
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

// --- NEW HIRING SYSTEM TYPES ---

export enum ResumeStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CHANGES_REQUESTED = 'CHANGES_REQUESTED'
}

export interface Resume {
  id: string;
  userId: string;
  userName: string;
  fileName: string;
  uploadDate: number;
  status: ResumeStatus;
  feedback?: string;
  parsedData: {
    skills: string[];
    experienceYears: number;
    education: string;
    summary: string;
    matchScore: number; // 0-100 match against company needs
    projects?: { name: string; desc: string }[];
  };
}

export type InterviewPhase = 'INTRO' | 'TECHNICAL_RESUME' | 'DEEP_DIVE' | 'SCENARIO' | 'BEHAVIORAL' | 'CLOSING' | 'COMPLETED';

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  resumeId: string;
  interviewerId: string | 'AI'; // 'AI' or User ID of manager
  type: 'AI' | 'HUMAN';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'DECISION_PENDING' | 'HIRED' | 'REJECTED';
  scheduledTime: string;
  transcript: { sender: 'AI' | 'Candidate' | 'Interviewer'; text: string; timestamp: number }[];
  scores: {
    technical: number;
    communication: number;
    culture: number;
    overall: number;
  };
  feedback?: string;
  currentPhase: InterviewPhase;
  questionIndex: number;
}