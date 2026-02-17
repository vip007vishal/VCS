import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Company, Task, AIState, Methodology, TaskStatus, Notification, Meeting, Employee, Resume, Interview, ResumeStatus, FieldOfInterest } from '../types';
import { simulateAIBehavior, calculateRevenue, calculateFraudRisk, parseResumeMock, formatResumeForAI, evaluateInterviewResponse } from '../utils/engines';
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
  hireEmployee: (employee: Employee) => void;
  fireEmployee: (employeeId: string) => void;
  generateTask: () => void;
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
  startInterview: (interviewId: string) => void;
  pauseInterview: (interviewId: string) => void;
  submitInterviewResponse: (interviewId: string, text: string) => void;
  finalizeInterview: (interviewId: string, decision: 'HIRED' | 'REJECTED', feedback: string, finalScores?: any) => void;
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
    { id: 'AI', name: 'AI Copilot', role: 'Automated Agent', status: 'Processing', reliability: 92, capacity: 20, isAi: true, risk: 'Low' },
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Refactor Auth Middleware', assigneeId: 'u1', status: TaskStatus.IN_PROGRESS, difficulty: 7, isAiGenerated: false },
  { id: 't2', title: 'Optimize DB Queries', assigneeId: 'AI', status: TaskStatus.DONE, difficulty: 5, aiConfidence: 95, isAiGenerated: true },
  { id: 't3', title: 'Design System Update', assigneeId: null, status: TaskStatus.BACKLOG, difficulty: 3, isAiGenerated: false },
  { id: 't4', title: 'Client API Integration', assigneeId: 'u1', status: TaskStatus.REVIEW, difficulty: 6, isAiGenerated: false },
  { id: 't5', title: 'Unit Test Coverage', assigneeId: null, status: TaskStatus.BACKLOG, difficulty: 4, aiConfidence: 88, isAiGenerated: true },
];

const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', type: 'Standup', participants: ['u1', 'AI', 'Manager'], isAiDriven: true, status: 'Completed' },
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
        assigneeId: i < 3 ? 'u1' : null,
        status: i === 0 ? TaskStatus.IN_PROGRESS : i === 1 ? TaskStatus.REVIEW : TaskStatus.BACKLOG,
        difficulty: Math.floor(Math.random() * 8) + 2,
        isAiGenerated: i >= 3,
        aiConfidence: i >= 3 ? Math.floor(Math.random() * 15) + 85 : undefined
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
  };

  const hireEmployee = (employee: Employee) => {
      setEmployees(prev => [...prev, employee]);
  };

  const fireEmployee = (employeeId: string) => {
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
      setTasks(prev => prev.map(t => t.assigneeId === employeeId ? { ...t, assigneeId: null, status: TaskStatus.BACKLOG } : t));
  };

  const generateTask = () => {
    const modelTasks = TASKS_BY_MODEL[company.aiModel] || TASKS_BY_MODEL['Gemini 1.5 Pro'];
    const randomTitle = modelTasks[Math.floor(Math.random() * modelTasks.length)];

    const newTask: Task = {
      id: `t${Date.now()}`,
      title: `${randomTitle} (Auto-${Math.floor(Math.random() * 100)})`,
      assigneeId: null,
      status: TaskStatus.BACKLOG,
      difficulty: Math.floor(Math.random() * 10) + 1,
      isAiGenerated: true,
      aiConfidence: Math.floor(Math.random() * 20) + 80
    };
    setTasks(prev => [...prev, newTask]);
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
        
        // Use Gemini to extract details
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: file.type, // 'application/pdf'
                            data: base64Data
                        }
                    },
                    {
                        text: `You are a Resume Parser. Extract the following details from this resume in strictly valid JSON format matching this schema:
                        {
                            "skills": ["string"],
                            "experienceYears": number,
                            "education": "string",
                            "summary": "string",
                            "projects": [{"name": "string", "desc": "string"}]
                        }
                        
                        Also calculate a "matchScore" (0-100) based on how well this resume fits a tech company described as: "${company.description}".
                        
                        IMPORTANT: Return ONLY the JSON.`
                    }
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
                                properties: {
                                    name: { type: Type.STRING },
                                    desc: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text || "{}";
        const parsedData = JSON.parse(jsonText);

        const newResume: Resume = {
            id: `r_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            fileName: file.name,
            uploadDate: Date.now(),
            status: ResumeStatus.PENDING_VALIDATION,
            parsedData: parsedData
        };

        setResumes(prev => [...prev, newResume]);
        addNotification('Resume Processed', 'Resume successfully analyzed by AI.', 'success');

      } catch (error) {
          console.error("Resume Parsing Error", error);
          // Fallback
          const parsed = parseResumeMock(file.name);
          const newResume: Resume = {
              id: `r_${Date.now()}`,
              userId: currentUser.id,
              userName: currentUser.name,
              fileName: file.name,
              uploadDate: Date.now(),
              status: ResumeStatus.PENDING_VALIDATION,
              parsedData: parsed
          };
          setResumes(prev => [...prev, newResume]);
          addNotification('AI Parsing Failed', 'Could not read file directly. Using simulated data.', 'warning');
      }
  };

  const validateResume = (resumeId: string, status: ResumeStatus, feedback?: string) => {
      setResumes(prev => prev.map(r => 
        r.id === resumeId ? { ...r, status, feedback } : r
      ));
      const resume = resumes.find(r => r.id === resumeId);
      if (resume) {
          addNotification(
              `Resume ${status === ResumeStatus.APPROVED ? 'Approved' : 'Updated'}`, 
              `Resume for ${resume.userName} has been marked as ${status}.`, 
              status === ResumeStatus.APPROVED ? 'success' : 'warning'
          );
      }
  };

  const scheduleInterview = (candidateId: string, type: 'AI' | 'HUMAN') => {
      const resume = resumes.find(r => r.userId === candidateId);
      if (!resume) return;

      if (resume.status !== ResumeStatus.APPROVED) {
          addNotification('Error', 'Cannot schedule interview. Resume is not Approved.', 'error');
          return;
      }

      const newInterview: Interview = {
          id: `int_${Date.now()}`,
          candidateId: candidateId,
          candidateName: resume.userName,
          resumeId: resume.id,
          interviewerId: type === 'AI' ? 'AI' : (currentUser?.id || 'm1'),
          type: type,
          status: 'SCHEDULED',
          scheduledTime: type === 'AI' ? 'On Demand' : 'Tomorrow, 10:00 AM',
          transcript: [],
          scores: { technical: 0, communication: 0, culture: 0, overall: 0 },
          currentPhase: 'INTRO',
          questionIndex: 0
      };
      setInterviews(prev => [...prev, newInterview]);
      addNotification('Interview Scheduled', `${type} Interview scheduled for ${resume.userName}.`, 'info');
  };

  const startInterview = async (interviewId: string) => {
      setInterviews(prev => prev.map(i => {
          if (i.id === interviewId) {
              return { ...i, status: 'IN_PROGRESS' };
          }
          return i;
      }));

      // If AI interview, generate the first greeting via Gemini
      const interview = interviews.find(i => i.id === interviewId);
      if (interview && interview.type === 'AI') {
          // Only start a new transcript if one doesn't exist to allow resuming
          if (interview.transcript.length === 0) {
            const resume = resumes.find(r => r.id === interview.resumeId);
            if (resume) {
               try {
                  const prompt = `
                    You are a strict, corporate AI Hiring Manager for ${company.name}.
                    Your name is "Sentinel AI". You do not engage in small talk.
                    You are conducting a structured interview with ${interview.candidateName}.
                    
                    Candidate Resume:
                    ${formatResumeForAI(resume.parsedData)}
                    
                    Instruction:
                    Start the interview formally. 
                    State your purpose. 
                    Ask the candidate to briefly summarize their experience.
                    Keep it concise (max 2 sentences). Professional tone only.
                  `;
                  const response = await ai.models.generateContent({
                      model: 'gemini-3-flash-preview',
                      contents: prompt
                  });
                  
                  const text = response.text || "Interview sequence initiated. State your professional summary immediately.";

                  setInterviews(prev => prev.map(i => {
                      if (i.id === interviewId) {
                          return { 
                              ...i, 
                              transcript: [{ sender: 'AI', text: text, timestamp: Date.now() }]
                          };
                      }
                      return i;
                  }));

               } catch (error) {
                   console.error("Gemini API Error", error);
                   addNotification('AI Error', 'Failed to connect to AI Interviewer. Please try again.', 'error');
               }
            }
          }
      }
  };

  const pauseInterview = (interviewId: string) => {
    setInterviews(prev => prev.map(i => {
        if (i.id === interviewId) {
            return { ...i, status: 'PAUSED' };
        }
        return i;
    }));
    addNotification('Interview Paused', 'Session progress has been saved.', 'info');
  };

  const submitInterviewResponse = async (interviewId: string, text: string) => {
      // 1. Optimistically update UI with user message
      setInterviews(prev => prev.map(i => {
          if (i.id === interviewId) {
              return { 
                  ...i, 
                  transcript: [...i.transcript, { sender: 'Candidate', text, timestamp: Date.now() }] 
              };
          }
          return i;
      }));

      // 2. Call Gemini API
      const interview = interviews.find(i => i.id === interviewId);
      if (!interview || interview.type !== 'AI') return;

      const resume = resumes.find(r => r.id === interview.resumeId);
      if (!resume) return;

      try {
        // Construct conversation history
        const history = interview.transcript.map(t => `${t.sender === 'AI' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n');
        
        const prompt = `
          You are a strict, corporate AI Hiring Manager named "Sentinel AI".
          You are interviewing ${interview.candidateName}.
          
          Candidate Resume Context:
          ${formatResumeForAI(resume.parsedData)}

          History:
          ${history}
          Candidate Response: ${text}

          Instructions:
          - Maintain a professional, slightly cold, corporate tone.
          - If the candidate's answer is short or vague, say "Elaborate."
          - Ask ONLY ONE next question.
          - The question must be MEDIUM level difficulty.
          - The question must be SHORT and CONCISE (maximum 2 sentences).
          - Do not ask multiple questions in one turn.
          - If you have enough info (5-6 exchanges), say "INTERVIEW_COMPLETE" followed by a closing statement.
          
          Do not use emojis. Be direct.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        const aiText = response.text?.trim() || "Proceed.";
        const isComplete = aiText.includes("INTERVIEW_COMPLETE");
        const finalText = aiText.replace("INTERVIEW_COMPLETE", "").trim() || "Interview concluded. Disconnect.";

        // Score the answer for simulation stats
        const score = evaluateInterviewResponse(interview.transcript[interview.transcript.length-1]?.text || "", text);

        setInterviews(prev => prev.map(i => {
            if (i.id === interviewId) {
                return { 
                    ...i, 
                    transcript: [...i.transcript, { sender: 'Candidate', text, timestamp: Date.now() }, { sender: 'AI', text: finalText, timestamp: Date.now() }],
                    status: isComplete ? 'DECISION_PENDING' : 'IN_PROGRESS',
                    scores: { ...i.scores, overall: Math.floor((i.scores.overall + score) / 2) }
                };
            }
            return i;
        }));

      } catch (error) {
          console.error("Gemini API Error", error);
      }
  };

  const finalizeInterview = (interviewId: string, decision: 'HIRED' | 'REJECTED', feedback: string, finalScores?: any) => {
      setInterviews(prev => prev.map(i => {
          if (i.id === interviewId) {
              if (decision === 'HIRED') {
                  // Auto-hire logic
                  const newEmp: Employee = {
                      id: i.candidateId,
                      name: i.candidateName,
                      role: 'Junior Developer', // Default
                      status: 'Online',
                      reliability: 80,
                      capacity: 5,
                      isAi: false,
                      risk: 'Low'
                  };
                  hireEmployee(newEmp);
                  addNotification('Hiring Complete', `${i.candidateName} has joined the team!`, 'success');
              } else {
                  addNotification('Application Update', `Candidate ${i.candidateName} was rejected.`, 'warning');
              }
              
              return { 
                  ...i, 
                  status: decision, 
                  feedback, 
                  scores: finalScores || i.scores 
              };
          }
          return i;
      }));
  };

  const updateSimulation = () => {
    // 1. Tick AI Behavior
    const nextAi = simulateAIBehavior(aiState);
    setAiState(prev => ({ ...nextAi, model: prev.model }));

    // Random Event: AI Failure
    if (nextAi.mood === 'Stressed' && Math.random() < 0.05) {
        addNotification('AI Failure Detected', 'AI Copilot failed a critical task due to low confidence.', 'error');
        setTasks(prev => {
            const aiTasks = prev.filter(t => t.assigneeId === 'AI' && t.status !== TaskStatus.FAILED);
            if (aiTasks.length > 0) {
                const target = aiTasks[0];
                return prev.map(t => t.id === target.id ? { ...t, status: TaskStatus.FAILED } : t);
            }
            return prev;
        });
    }

    // 2. Tick Revenue
    setCompany(prev => ({
      ...prev,
      revenue: calculateRevenue(prev.revenue, prev, tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length)
    }));

    // 3. Periodic Task Generation
    if (Math.random() < 0.2) {
        generateTask();
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(updateSimulation, 5000); 
    return () => clearInterval(interval);
  }, [currentUser, tasks, aiState]);

  return (
    <SimulationContext.Provider value={{ 
        currentUser, company, availableCompanies: MOCK_COMPANIES, tasks, employees, aiState, notifications, meetings, fraudRisk, resumes, interviews,
        login, registerUser, logout, moveTask, assignTask, hireEmployee, fireEmployee, generateTask, updateSimulation, 
        markNotificationRead, addNotification, setMethodology, updateAiParams, triggerFraudCheck,
        uploadResume, validateResume, scheduleInterview, startInterview, pauseInterview, submitInterviewResponse, finalizeInterview
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