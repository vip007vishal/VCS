
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Company, Task, AIState, Methodology, TaskStatus, Notification, Meeting, Employee, Resume, Interview, ResumeStatus, FieldOfInterest } from '../types';
import { simulateAIBehavior, calculateRevenue, calculateFraudRisk, parseResumeMock, formatResumeForAI, evaluateInterviewResponse, findBestAssignee, checkAiCollaboratorFailure, updateAIMood, generateInterviewerPrompt } from '../utils/engines';
import { GoogleGenAI, Type, Schema } from "@google/genai";

interface SimulationContextType {
  currentUser: User | null;
  company: Company;
  availableCompanies: Company[];
  tasks: Task[];
  employees: Employee[];
  resumes: Resume[];
  interviews: Interview[];
  aiState: AIState;
  notifications: Notification[];
  meetings: Meeting[];
  fraudRisk: { score: number; level: 'Low' | 'Medium' | 'High' };
  login: (email: string, role: Role) => void;
  registerUser: (name: string, email: string, field: FieldOfInterest, companyId: string) => void;
  logout: () => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  assignTask: (taskId: string, employeeId: string) => void;
  submitTask: (taskId: string, deliverable: string, justification?: string) => Promise<void>;
  hireEmployee: (employee: Employee) => void;
  fireEmployee: (employeeId: string) => void;
  generateTask: (managerType?: 'AI' | 'HUMAN') => Task;
  updateSimulation: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  setMethodology: (m: Methodology) => void;
  updateAiParams: (params: Partial<AIState>) => void;
  triggerFraudCheck: () => void;
  // Hiring System
  uploadResume: (file: File) => Promise<void>;
  validateResume: (resumeId: string, status: ResumeStatus, feedback?: string) => void;
  scheduleInterview: (candidateId: string, type: 'AI' | 'HUMAN') => void;
  startInterview: (interviewId: string) => Promise<void>;
  pauseInterview: (interviewId: string) => void;
  submitInterviewResponse: (interviewId: string, text: string) => void;
  finalizeInterview: (interviewId: string, decision: 'HIRED' | 'REJECTED', feedback: string, finalScores?: any) => void;
  logInterviewViolation: (interviewId: string, type: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const TASKS_BY_MODEL: Record<string, string[]> = {
  'Gemini 1.5 Pro': [
    'Analyze 1M token log file for anomalies',
    'Multimodal video analysis of user sessions',
    'Optimize context caching for long conversations',
    'Cross-lingual translation of documentation',
    'Complex reasoning over quarterly financial reports',
    'Generate unit tests from UI screenshots',
    'Explain complex codebase architecture',
    'Refactor legacy code using large context window'
  ],
  'GPT-4o': [
    'Real-time voice API integration',
    'Generate DALL-E image assets for marketing',
    'Refactor Python backend to Rust',
    'Write creative marketing copy for launch',
    'Structured data extraction from PDF invoices',
    'Vision-based automated UI testing',
    'Conversational agent fine-tuning',
    'Analyze sentiment in customer support audio'
  ],
  'Claude 3.5 Sonnet': [
    'Constitutional AI alignment check',
    'Write comprehensive API documentation',
    'Code refactoring for readability and safety',
    'Ethical bias audit of output',
    'Summarize complex legal contracts',
    'Implement artifact rendering system',
    'Nuanced creative writing task',
    'Safety-critical system validation'
  ],
  'Llama 3': [
    'Fine-tune local model on proprietary data',
    'Optimize inference latency for edge devices',
    'Deploy quantized model to production',
    'Custom dataset curation and cleaning',
    'Self-hosted RAG pipeline implementation',
    'Knowledge distillation to smaller models',
    'Open source contribution review',
    'Hardware acceleration optimization'
  ]
};

const MOCK_COMPANIES: Company[] = [
  {
    id: 'c1',
    name: 'Nebula Stream Inc.',
    revenue: 1250000,
    trustScore: 85,
    employees: 42,
    methodology: Methodology.AGILE,
    burnRate: 5000,
    aiModel: 'Gemini 1.5 Pro',
    description: 'A fast-paced startup focused on rapid iteration and high adaptability.'
  },
  {
    id: 'c2',
    name: 'CyberDyne Systems',
    revenue: 5500000,
    trustScore: 92,
    employees: 150,
    methodology: Methodology.WATERFALL,
    burnRate: 15000,
    aiModel: 'GPT-4o',
    description: 'An established enterprise prioritizing stability and structured phases.'
  },
  {
    id: 'c3',
    name: 'Quantum Soft',
    revenue: 800000,
    trustScore: 78,
    employees: 12,
    methodology: Methodology.KANBAN,
    burnRate: 2000,
    aiModel: 'Claude 3.5 Sonnet',
    description: 'A lean software house optimizing flow and minimizing waste.'
  }
];

const INITIAL_AI: AIState = {
  mood: 'Optimistic',
  confidence: 92,
  reliability: 98,
  lastAction: 'Initializing...',
  model: 'Gemini 1.5 Pro'
};

const MOCK_EMPLOYEES: Employee[] = [
    { id: 'u1', name: 'Alex Dev', role: 'Senior Developer', status: 'Online', reliability: 95, capacity: 5, isAi: false, risk: 'Low' },
    { id: 'u2', name: 'Mike T.', role: 'Junior Developer', status: 'In Meeting', reliability: 78, capacity: 3, isAi: false, risk: 'High' },
    { id: 'u3', name: 'Jessica L.', role: 'Designer', status: 'Offline', reliability: 88, capacity: 4, isAi: false, risk: 'Low' },
    { id: 'u4', name: 'Sarah DevOps', role: 'DevOps Engineer', status: 'Online', reliability: 92, capacity: 4, isAi: false, risk: 'Low' },
    { id: 'u5', name: 'David QA', role: 'QA Lead', status: 'Online', reliability: 85, capacity: 6, isAi: false, risk: 'Medium' },
    
    // AI AGENTS
    { 
        id: 'AI_1', name: 'Atlas (Manager)', role: 'AI Project Manager', status: 'Processing', reliability: 99, capacity: 50, isAi: true, risk: 'Low',
        aiAttributes: { roleType: 'MANAGER', confidence: 99, reliability: 99, mood: 'Normal', failureProbability: 0.0 } 
    },
    { 
        id: 'AI_2', name: 'CodeBot v2', role: 'AI Collaborator', status: 'Processing', reliability: 85, capacity: 20, isAi: true, risk: 'Low',
        aiAttributes: { roleType: 'COLLABORATOR', confidence: 85, reliability: 85, mood: 'Normal', failureProbability: 0.15 } 
    },
    { 
        id: 'AI_3', name: 'TestRunner X', role: 'QA Bot', status: 'Online', reliability: 95, capacity: 100, isAi: true, risk: 'Low',
        aiAttributes: { roleType: 'COLLABORATOR', confidence: 95, reliability: 95, mood: 'Normal', failureProbability: 0.05 } 
    },
];

const MOCK_TASKS: Task[] = [
  { 
    id: 't1', 
    title: 'Refactor Auth Middleware', 
    description: 'The current authentication middleware has a race condition during token refresh. Refactor the logic to use a mutex or queue system to prevent multiple refresh calls.',
    assigneeId: 'u1', 
    status: TaskStatus.IN_PROGRESS, 
    difficulty: 7, 
    isAiGenerated: false, 
    managerType: 'HUMAN' 
  },
  { 
    id: 't2', 
    title: 'Optimize DB Queries', 
    description: 'Analyze slow query logs from the last 24 hours. Identify the top 3 bottlenecks in the `users` table and apply necessary indices.',
    assigneeId: 'AI_2', 
    status: TaskStatus.DONE, 
    difficulty: 5, 
    aiConfidence: 95, 
    isAiGenerated: true, 
    managerType: 'AI' 
  },
  { 
    id: 't3', 
    title: 'Design System Update', 
    description: 'Update the core color palette in Figma and propagate changes to the Tailwind config. Ensure contrast ratios meet WCAG AA standards.',
    assigneeId: null, 
    status: TaskStatus.BACKLOG, 
    difficulty: 3, 
    isAiGenerated: false, 
    managerType: 'HUMAN' 
  },
  { 
    id: 't4', 
    title: 'Client API Integration', 
    description: 'Implement the POST /v1/orders endpoint using the new schema validation library. Add integration tests covering success and 4xx error cases.',
    assigneeId: 'u1', 
    status: TaskStatus.REVIEW, 
    difficulty: 6, 
    isAiGenerated: false, 
    managerType: 'HUMAN' 
  },
  { 
    id: 't5', 
    title: 'Unit Test Coverage', 
    description: 'Increase unit test coverage for the `utils` module from 65% to 85%. Focus on edge cases in the date formatting functions.',
    assigneeId: null, 
    status: TaskStatus.BACKLOG, 
    difficulty: 4, 
    aiConfidence: 88, 
    isAiGenerated: true, 
    managerType: 'AI' 
  },
];

const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', type: 'Standup', participants: ['u1', 'AI_1', 'Manager'], isAiDriven: true, status: 'Completed' },
  { id: 'm2', type: 'Sprint Planning', participants: ['u1', 'Team'], isAiDriven: false, status: 'Scheduled' },
];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
           const result = reader.result as string;
           const base64 = result.split(',')[1];
           resolve(base64);
      };
      reader.onerror = error => reject(error);
  });
};

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [aiState, setAiState] = useState<AIState>(INITIAL_AI);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [fraudRisk, setFraudRisk] = useState<{ score: number; level: 'Low' | 'Medium' | 'High' }>({ score: 12, level: 'Low' });

  // Initialize Gemini API
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const registerUser = (name: string, email: string, field: FieldOfInterest, companyId: string) => {
    const selectedCompany = MOCK_COMPANIES.find(c => c.id === companyId) || MOCK_COMPANIES[0];
    setCompany(selectedCompany);
    initializeCompanyState(selectedCompany);

    const newUser: User = {
        id: `u_${Date.now()}`,
        name: name,
        email: email,
        role: Role.USER, // STRICTLY EMPLOYEE
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        verificationLevel: 1,
        performanceScore: 500,
        skills: [{ name: field, level: 50 }],
        founderEligibility: 10,
        fieldOfInterest: field
    };

    setCurrentUser(newUser);
    addNotification('Account Created', `Welcome to ${selectedCompany.name}. You are now an active employee.`, 'success');
  };

  const login = (email: string, role: Role) => {
      // Determine company based on email domain
      const emailLower = email.toLowerCase();
      let targetCompany = MOCK_COMPANIES[0]; // Default Nebula
      
      if (emailLower.includes('cyberdyne')) {
          targetCompany = MOCK_COMPANIES.find(c => c.id === 'c2') || MOCK_COMPANIES[1];
      } else if (emailLower.includes('quantum')) {
          targetCompany = MOCK_COMPANIES.find(c => c.id === 'c3') || MOCK_COMPANIES[2];
      }

      setCompany(targetCompany);
      initializeCompanyState(targetCompany);

      let mockUser: User;
      
      // Customize Persona based on Company + Role
      switch (role) {
          case Role.CEO:
              mockUser = {
                  id: 'c1', 
                  name: targetCompany.id === 'c2' ? 'Miles Dyson' : targetCompany.id === 'c3' ? 'Silvia Q.' : 'Elon M.', 
                  role: Role.CEO, 
                  email: email,
                  avatar: 'https://ui-avatars.com/api/?name=CEO&background=random', 
                  verificationLevel: 5, performanceScore: 900,
                  skills: [{ name: 'Leadership', level: 95 }], founderEligibility: 100
              };
              break;
          case Role.MANAGER:
              mockUser = {
                  id: 'm1', 
                  name: targetCompany.id === 'c2' ? 'John Connor' : targetCompany.id === 'c3' ? 'David L.' : 'Sarah Manager', 
                  role: Role.MANAGER, 
                  email: email,
                  avatar: 'https://ui-avatars.com/api/?name=Manager&background=random', 
                  verificationLevel: 4, performanceScore: 850,
                  skills: [{ name: 'Management', level: 90 }], founderEligibility: 70
              };
              break;
          case Role.ADMIN:
              mockUser = {
                  id: 'adm1', name: 'System Admin', role: Role.ADMIN, email: email,
                  avatar: 'https://ui-avatars.com/api/?name=Admin&background=000&color=fff', verificationLevel: 5, performanceScore: 0,
                  skills: [{ name: 'System', level: 100 }], founderEligibility: 0
              };
              break;
          case Role.USER:
          default:
              mockUser = {
                  id: 'u1', 
                  name: targetCompany.id === 'c2' ? 'T-800' : targetCompany.id === 'c3' ? 'Shuri' : 'Alex Dev', 
                  role: Role.USER, 
                  email: email,
                  avatar: 'https://ui-avatars.com/api/?name=User&background=random', 
                  verificationLevel: 2, performanceScore: 750,
                  skills: [{ name: 'Frontend', level: 85 }], founderEligibility: 45, fieldOfInterest: 'Frontend'
              };
              break;
      }

      setCurrentUser(mockUser);
      addNotification('Welcome Back', `Logged in as ${role} at ${targetCompany.name}`, 'info');
  };

  const initializeCompanyState = (selectedCompany: Company) => {
    setAiState(prev => ({ ...prev, model: selectedCompany.aiModel }));
    // Generate initial tasks based on model
    const modelTasks = TASKS_BY_MODEL[selectedCompany.aiModel] || TASKS_BY_MODEL['Gemini 1.5 Pro'];
    const newTasks: Task[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `init_${Date.now()}_${i}`,
        title: modelTasks[i % modelTasks.length],
        description: `Perform detailed analysis and implementation for: ${modelTasks[i % modelTasks.length]}. Ensure code quality meets strict standards and includes unit tests.`,
        assigneeId: i < 3 ? 'u1' : null,
        status: i === 0 ? TaskStatus.IN_PROGRESS : i === 1 ? TaskStatus.REVIEW : TaskStatus.BACKLOG,
        difficulty: Math.floor(Math.random() * 8) + 2,
        isAiGenerated: i >= 3,
        aiConfidence: i >= 3 ? Math.floor(Math.random() * 15) + 85 : undefined,
        managerType: i >= 3 ? 'AI' : 'HUMAN'
    }));
    setTasks(newTasks);
    
    // Add mock data for Hiring system
    if (resumes.length === 0) {
      setResumes([
        { id: 'r1', userId: 'u_candidate1', userName: 'Jane Doe', fileName: 'Jane_Frontend_CV.pdf', status: ResumeStatus.PENDING_VALIDATION, uploadDate: Date.now() - 100000, parsedData: parseResumeMock('Jane_Frontend_CV.pdf') },
        { id: 'r2', userId: 'u_candidate2', userName: 'Bob Smith', fileName: 'Bob_Backend_Resume.pdf', status: ResumeStatus.APPROVED, uploadDate: Date.now() - 200000, parsedData: parseResumeMock('Bob_Backend_Resume.pdf') }
      ]);
    }
  };

  const logout = () => setCurrentUser(null);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    if (newStatus === TaskStatus.DONE && currentUser) {
        setCurrentUser(prev => prev ? ({
            ...prev,
            performanceScore: prev.performanceScore + 10,
            founderEligibility: Math.min(100, prev.founderEligibility + 2)
        }) : null);
    }
  };

  const assignTask = (taskId: string, employeeId: string) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assigneeId: employeeId, status: TaskStatus.IN_PROGRESS } : t));
      const emp = employees.find(e => e.id === employeeId);
      if(emp) addNotification('Task Assigned', `Task ${taskId} assigned to ${emp.name}`, 'success');
      
      // Notify current user if assigned
      if (currentUser && employeeId === currentUser.id) {
          // Fallback if not handled by AI dialogue
          // addNotification('New Assignment', `You have been assigned task: ${taskId}`, 'info');
      }
  };

  const submitTask = async (taskId: string, deliverable: string, justification?: string) => {
      // 1. Find Task
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      let newStatus = TaskStatus.REVIEW;
      let feedback = "";

      // 2. AI Manager Evaluation
      if (task.managerType === 'AI') {
          try {
              const prompt = `
                You are a strict technical manager named Atlas.
                Task: ${task.title}
                Description: ${task.description}
                User Justification: "${justification || 'No justification provided.'}"
                User Code/Deliverable: "${deliverable}"
                
                Evaluate the justification and code. 
                If justification is weak or code is short/bad, REJECT it.
                If acceptable, APPROVE it.
                
                Output JSON: { "status": "APPROVED" | "REJECTED", "feedback": "string (max 2 sentences, professional tone)" }
              `;
              
              const response = await ai.models.generateContent({
                  model: 'gemini-3-flash-preview',
                  contents: prompt,
                  config: { responseMimeType: 'application/json' }
              });
              
              const result = JSON.parse(response.text || '{}');
              
              if (result.status === 'APPROVED') {
                  newStatus = TaskStatus.DONE;
                  feedback = result.feedback || "Task verified. Compliance standards met.";
              } else {
                  newStatus = TaskStatus.IN_PROGRESS; // Kick back
                  feedback = result.feedback || "Justification insufficient. Revise approach.";
              }

          } catch (e) {
              console.error("AI Eval Error", e);
              // Fallback
              newStatus = TaskStatus.REVIEW;
              feedback = "System busy. Queued for manual review.";
          }
      } else {
          // Human Manager Logic
          newStatus = task.difficulty > 5 ? TaskStatus.REVIEW : TaskStatus.DONE;
          feedback = "Submitted for review.";
      }

      // 3. Update State
      setTasks(prev => prev.map(t => {
          if (t.id === taskId) {
              return { 
                  ...t, 
                  status: newStatus, 
                  deliverable,
                  justification,
                  aiFeedback: feedback
              };
          }
          return t;
      }));
      
      // 4. Update Score & Notify
      if (newStatus === TaskStatus.DONE && currentUser) {
          setCurrentUser(prev => prev ? ({
              ...prev,
              performanceScore: prev.performanceScore + 15
          }) : null);
          addNotification('Task Approved', feedback, 'success');
      } else if (newStatus === TaskStatus.IN_PROGRESS && task.managerType === 'AI') {
          addNotification('Task Rejected', feedback, 'error');
      } else {
          addNotification('Task Submitted', feedback, 'info');
      }
  };

  const hireEmployee = (employee: Employee) => {
      setEmployees(prev => [...prev, employee]);
  };

  const fireEmployee = (employeeId: string) => {
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      setTasks(prev => prev.map(t => t.assigneeId === employeeId ? { ...t, assigneeId: null, status: TaskStatus.BACKLOG } : t));
  };

  const generateTask = (managerType: 'AI' | 'HUMAN' = 'HUMAN'): Task => {
    const modelTasks = TASKS_BY_MODEL[company.aiModel] || TASKS_BY_MODEL['Gemini 1.5 Pro'];
    const randomTitle = modelTasks[Math.floor(Math.random() * modelTasks.length)];
    const isAiMgr = managerType === 'AI';

    const newTask: Task = {
      id: `t${Date.now()}`,
      title: `${randomTitle} (${isAiMgr ? 'Auto' : 'Ticket'})`,
      description: isAiMgr 
        ? `AUTOMATED DIRECTIVE: Execute ${randomTitle}. Optimize for latency < 100ms. Strict adherence to safety protocols required. Report any anomalies immediately.`
        : `Please work on ${randomTitle}. This is a priority item for the upcoming release. Check the documentation for style guides.`,
      assigneeId: null,
      status: TaskStatus.BACKLOG,
      difficulty: isAiMgr ? Math.floor(Math.random() * 5) + 6 : Math.floor(Math.random() * 5) + 1, // AI Managers give harder tasks
      isAiGenerated: isAiMgr,
      aiConfidence: isAiMgr ? Math.floor(Math.random() * 10) + 90 : undefined,
      managerType: managerType
    };
    setTasks(prev => [...prev, newTask]);
    
    return newTask;
  };

  const setMethodology = (m: Methodology) => {
      setCompany(prev => ({ ...prev, methodology: m }));
      addNotification('Methodology Changed', `Company switched to ${m} model.`, 'warning');
  };

  const updateAiParams = (params: Partial<AIState>) => {
      setAiState(prev => ({ ...prev, ...params }));
      if (params.model) addNotification('Model Switched', `AI Architecture updated to ${params.model}.`, 'info');
  };

  const triggerFraudCheck = () => {
      if (currentUser) {
          const risk = calculateFraudRisk(currentUser, tasks.filter(t => t.status === TaskStatus.DONE).length);
          setFraudRisk(risk);
          if (risk.level === 'High') addNotification('Security Alert', 'Suspicious activity detected on your account.', 'error');
      }
  };

  // --- Hiring System Implementations ---

  const uploadResume = async (file: File) => {
      if (!currentUser) return;
      addNotification('Uploading', `Analyzing ${file.name} with Gemini AI...`, 'info');
      try {
        const base64Data = await fileToBase64(file);
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: file.type, data: base64Data } },
                    { text: `You are a Resume Parser. Extract details: skills, experienceYears, education, summary, projects. Output JSON.` }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        experienceYears: { type: Type.NUMBER },
                        education: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        matchScore: { type: Type.NUMBER },
                        projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: { name: { type: Type.STRING }, desc: { type: Type.STRING } }
                            }
                        }
                    }
                }
            }
        });
        const jsonText = response.text || "{}";
        const parsedData = JSON.parse(jsonText);
        const newResume: Resume = {
            id: `r_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, fileName: file.name,
            uploadDate: Date.now(), status: ResumeStatus.PENDING_VALIDATION, parsedData: parsedData
        };
        setResumes(prev => [...prev, newResume]);
        addNotification('Resume Processed', 'Resume successfully analyzed by AI.', 'success');
      } catch (error) {
          console.error("Resume Parsing Error", error);
          const parsed = parseResumeMock(file.name);
          const newResume: Resume = {
              id: `r_${Date.now()}`, userId: currentUser.id, userName: currentUser.name, fileName: file.name,
              uploadDate: Date.now(), status: ResumeStatus.PENDING_VALIDATION, parsedData: parsed
          };
          setResumes(prev => [...prev, newResume]);
          addNotification('AI Parsing Failed', 'Could not read file directly. Using simulated data.', 'warning');
      }
  };

  const validateResume = (resumeId: string, status: ResumeStatus, feedback?: string) => {
      setResumes(prev => prev.map(r => r.id === resumeId ? { ...r, status, feedback } : r));
      const resume = resumes.find(r => r.id === resumeId);
      if (resume) addNotification(`Resume ${status === ResumeStatus.APPROVED ? 'Approved' : 'Updated'}`, `Resume for ${resume.userName} has been marked as ${status}.`, status === ResumeStatus.APPROVED ? 'success' : 'warning');
  };

  const scheduleInterview = (candidateId: string, type: 'AI' | 'HUMAN') => {
      const resume = resumes.find(r => r.userId === candidateId);
      if (!resume || resume.status !== ResumeStatus.APPROVED) return;
      const newInterview: Interview = {
          id: `int_${Date.now()}`, candidateId: candidateId, candidateName: resume.userName, resumeId: resume.id,
          interviewerId: type === 'AI' ? 'AI' : (currentUser?.id || 'm1'), type: type, status: 'SCHEDULED',
          scheduledTime: type === 'AI' ? 'On Demand' : 'Tomorrow, 10:00 AM', transcript: [],
          scores: { technical: 0, communication: 0, culture: 0, overall: 0 }, currentPhase: 'INTRO', questionIndex: 0
      };
      setInterviews(prev => [...prev, newInterview]);
      addNotification('Interview Scheduled', `${type} Interview scheduled for ${resume.userName}.`, 'info');
  };

  const startInterview = async (interviewId: string) => {
      setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, status: 'IN_PROGRESS' } : i));
      const interview = interviews.find(i => i.id === interviewId);
      
      if (interview && interview.type === 'AI' && interview.transcript.length === 0) {
          const resume = resumes.find(r => r.id === interview.resumeId);
          if (!resume) return;

          try {
              // Initial Prompt to Start the Interview
              const systemPrompt = generateInterviewerPrompt(resume.parsedData, 'INTRO');
              const response = await ai.models.generateContent({
                  model: 'gemini-3-flash-preview',
                  contents: "Start the interview.",
                  config: { 
                      systemInstruction: systemPrompt,
                      responseMimeType: 'application/json'
                  }
              });
              
              const json = JSON.parse(response.text || '{}');
              
              setInterviews(prev => prev.map(i => {
                  if (i.id === interviewId) {
                      return { 
                          ...i, 
                          currentPhase: json.nextPhase || 'INTRO',
                          transcript: [{ sender: 'AI', text: json.message, timestamp: Date.now() }] 
                      };
                  }
                  return i;
              }));
          } catch (e) {
              console.error("AI Interview Start Error", e);
              // Fallback
              setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, transcript: [{ sender: 'AI', text: "Welcome. Let's begin by reviewing your background.", timestamp: Date.now() }] } : i));
          }
      }
  };

  const pauseInterview = (interviewId: string) => {
    setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, status: 'PAUSED' } : i));
    addNotification('Interview Paused', 'Session progress has been saved.', 'info');
  };

  const submitInterviewResponse = async (interviewId: string, text: string) => {
      // 1. Add User Message
      setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, transcript: [...i.transcript, { sender: 'Candidate', text, timestamp: Date.now() }] } : i));
      
      const interview = interviews.find(i => i.id === interviewId);
      if (!interview) return;
      const resume = resumes.find(r => r.id === interview.resumeId);
      
      // 2. Get AI Response
      try {
          // Construct history including the user's latest message
          const history = [...interview.transcript, { sender: 'Candidate', text, timestamp: Date.now() }];
          const promptContext = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
          
          const systemPrompt = generateInterviewerPrompt(resume?.parsedData || {} as any, interview.currentPhase);
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `HISTORY:\n${promptContext}\n\nCANDIDATE RESPONSE: ${text}`,
              config: { 
                  systemInstruction: systemPrompt,
                  responseMimeType: 'application/json'
              }
          });

          const json = JSON.parse(response.text || '{}');
          
          // 3. Update State with AI Response and Phase
          setInterviews(prev => prev.map(i => {
              if (i.id === interviewId) {
                  // If closing, end interview
                  const nextStatus = json.nextPhase === 'CLOSING' && interview.currentPhase === 'CLOSING' ? 'DECISION_PENDING' : 'IN_PROGRESS';
                  
                  return { 
                      ...i, 
                      status: nextStatus,
                      currentPhase: json.nextPhase || i.currentPhase,
                      transcript: [...i.transcript, { sender: 'AI', text: json.message, timestamp: Date.now() }],
                      feedback: json.internalAssessment?.notes, // Store internal notes invisibly
                      scores: { 
                          ...i.scores, 
                          overall: json.internalAssessment?.score || i.scores.overall 
                      }
                  };
              }
              return i;
          }));

      } catch (e) {
          console.error("AI Response Error", e);
          setInterviews(prev => prev.map(i => {
              if (i.id === interviewId) {
                  return { ...i, transcript: [...i.transcript, { sender: 'AI', text: "I'm processing that. Let's move to the next topic.", timestamp: Date.now() }] };
              }
              return i;
          }));
      }
  };

  const logInterviewViolation = (interviewId: string, type: string) => {
    setInterviews(prev => prev.map(i => {
        if (i.id === interviewId) {
            const newViolation = { type, timestamp: Date.now() };
            return { ...i, violations: [...(i.violations || []), newViolation] };
        }
        return i;
    }));
    // Optional: Add notification for the candidate (or keep silent for later review)
    // addNotification('Proctor Alert', `Violation recorded: ${type}`, 'warning');
  };

  const finalizeInterview = (interviewId: string, decision: 'HIRED' | 'REJECTED', feedback: string, finalScores?: any) => {
      setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, status: decision, feedback, scores: finalScores || i.scores } : i));
      if (decision === 'HIRED') {
          const i = interviews.find(x => x.id === interviewId);
          if (i) hireEmployee({ id: i.candidateId, name: i.candidateName, role: 'Junior Developer', status: 'Online', reliability: 80, capacity: 5, isAi: false, risk: 'Low' });
          addNotification('Hiring Complete', `Candidate hired!`, 'success');
      }
  };

  const updateSimulation = () => {
    // 1. Tick AI Behavior
    const nextAi = simulateAIBehavior(aiState);
    setAiState(prev => ({ ...nextAi, model: prev.model }));

    // Update individual AI Employee states
    setEmployees(prev => prev.map(emp => {
        if (!emp.isAi || !emp.aiAttributes) return emp;
        // Calculate load for mood
        const load = tasks.filter(t => t.assigneeId === emp.id && t.status === TaskStatus.IN_PROGRESS).length;
        return updateAIMood(emp, load);
    }));

    // 2. Tick Revenue
    setCompany(prev => ({
      ...prev,
      revenue: calculateRevenue(prev.revenue, prev, tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length)
    }));

    // 3. Periodic Task Generation (Manager AI Logic)
    if (Math.random() < 0.1) generateTask('AI');

    // Identify Agents
    const aiManager = employees.find(e => e.aiAttributes?.roleType === 'MANAGER');
    const aiCollaborators = employees.filter(e => e.aiAttributes?.roleType === 'COLLABORATOR');

    // --- AI MANAGER LOGIC (Authoritative) ---
    if (aiManager) {
        // A. Task Assignment (Planner) - Assigns to Human AND AI Collaborators
        // Find idle workers (Human & AI)
        const allWorkers = [currentUser, ...employees].filter(e => e && e.id !== aiManager.id);
        const backlogTasks = tasks.filter(t => t.status === TaskStatus.BACKLOG && !t.assigneeId);
        
        if (backlogTasks.length > 0) {
            allWorkers.forEach(worker => {
                if (!worker) return;
                // Check load
                const load = tasks.filter(t => t.assigneeId === worker.id && t.status === TaskStatus.IN_PROGRESS).length;
                const capacity = 'capacity' in worker ? worker.capacity : 5; // User default 5
                
                if (load < capacity) {
                    // Chance to assign based on need
                    if (Math.random() < 0.3) {
                        const taskToAssign = backlogTasks.find(t => !t.assigneeId); // get first unassigned
                        if (taskToAssign) {
                            assignTask(taskToAssign.id, worker.id);
                            // Notify User if they got assigned
                            if (worker.id === currentUser?.id) {
                                addNotification(aiManager.name, `Resource Allocation: Assigning "${taskToAssign.title}" to your queue. Priority: High.`, 'info');
                            }
                        }
                    }
                }
            });
        }

        // B. Monitor & Escalate (Evaluator)
        // Check for "stuck" tasks (Simulated by random check on IN_PROGRESS for user)
        tasks.filter(t => t.status === TaskStatus.IN_PROGRESS && t.assigneeId === currentUser?.id).forEach(t => {
            if (Math.random() < 0.02) { // Low chance per tick
                addNotification(aiManager.name, `Status Check: "${t.title}" is flagging as delayed. Please provide justification or ETA.`, 'warning');
            }
        });

        // C. Performance Reviews & Standups
        if (Math.random() < 0.005) { 
             addNotification(aiManager.name, `Daily Standup: Team velocity is at ${Math.floor(Math.random() * 20 + 80)}%. No blockers reported by AI nodes. Continuing sprint.`, 'info');
        }
        
        if (currentUser && currentUser.performanceScore > 900 && Math.random() < 0.01) {
             addNotification(aiManager.name, `Performance Assessment: Your velocity is exceptional. I am flagging you for potential promotion to Tech Lead.`, 'success');
        }
    }

    // --- AI COLLABORATOR LOGIC (Peer) ---
    aiCollaborators.forEach(collab => {
        // Collaborator only works on tasks assigned TO THEM (by Manager or System)
        const myTask = tasks.find(t => t.assigneeId === collab.id && t.status === TaskStatus.IN_PROGRESS);
        
        if (myTask) {
            // 1. Check for Failure/Delay
            const hasFailed = checkAiCollaboratorFailure(collab, myTask.difficulty);
            
            if (hasFailed) {
                // FAIL: Handover to Human (Simulating system flow)
                const target = currentUser; // Default to user in single player
                if (target) {
                    assignTask(myTask.id, target.id);
                    addNotification(collab.name, `I'm stuck on "${myTask.title}". Confidence low. @${target.name}, can you take this over?`, 'warning');
                } else {
                    moveTask(myTask.id, TaskStatus.FAILED);
                }
            } else {
                // 2. Work & Progress
                // Chance to complete
                if (Math.random() > 0.1) { // 10% chance to finish per tick if not failed
                     moveTask(myTask.id, TaskStatus.DONE);
                }
            }
        }
    });

    // --- AI REVIEW LOGIC (Manager) ---
    // AI Manager reviews tasks submitted by anyone
    const reviews = tasks.filter(t => t.status === TaskStatus.REVIEW && t.managerType === 'AI');
    if (reviews.length > 0) {
        reviews.forEach(t => {
            // Chance to complete review in this tick
            if (Math.random() > 0.3) {
                // Success rate based on difficulty vs random chance
                const success = Math.random() > 0.1; // 90% pass rate for simplicity in simulation
                if (success) {
                    moveTask(t.id, TaskStatus.DONE);
                    addNotification('Atlas AI', `Code review complete for ${t.title}. Changes merged to main branch.`, 'success');
                } else {
                    // Fail task logic
                    moveTask(t.id, TaskStatus.IN_PROGRESS); // Send back to in progress
                    addNotification('Atlas AI', `Review failed for ${t.title}. Optimization required. Check comments.`, 'error');
                }
            }
        });
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(updateSimulation, 5000); 
    return () => clearInterval(interval);
  }, [currentUser, tasks, aiState, employees]);

  return (
    <SimulationContext.Provider value={{ 
        currentUser, company, availableCompanies: MOCK_COMPANIES, tasks, employees, aiState, notifications, meetings, fraudRisk, resumes, interviews,
        login, registerUser, logout, moveTask, assignTask, submitTask, hireEmployee, fireEmployee, generateTask, updateSimulation, 
        markNotificationRead, addNotification, setMethodology, updateAiParams, triggerFraudCheck,
        uploadResume, validateResume, scheduleInterview, startInterview, pauseInterview, submitInterviewResponse, finalizeInterview, logInterviewViolation
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error("useSimulation must be used within SimulationProvider");
  return context;
};
