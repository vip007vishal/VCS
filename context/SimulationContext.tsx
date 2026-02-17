import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, Company, Task, AIState, Methodology, TaskStatus, Notification, Meeting } from '../types';
import { simulateAIBehavior, calculateRevenue, calculateFraudRisk } from '../utils/engines';

interface SimulationContextType {
  currentUser: User | null;
  company: Company;
  availableCompanies: Company[];
  tasks: Task[];
  aiState: AIState;
  notifications: Notification[];
  meetings: Meeting[];
  fraudRisk: { score: number; level: 'Low' | 'Medium' | 'High' };
  login: (role: Role, companyId: string) => void;
  logout: () => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  generateTask: () => void;
  updateSimulation: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  setMethodology: (m: Methodology) => void;
  updateAiParams: (params: Partial<AIState>) => void;
  triggerFraudCheck: () => void;
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

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Refactor Auth Middleware', assigneeId: 'u1', status: TaskStatus.IN_PROGRESS, difficulty: 7, isAiGenerated: false },
  { id: 't2', title: 'Optimize DB Queries', assigneeId: 'AI', status: TaskStatus.DONE, difficulty: 5, aiConfidence: 95, isAiGenerated: true },
  { id: 't3', title: 'Design System Update', assigneeId: 'u1', status: TaskStatus.BACKLOG, difficulty: 3, isAiGenerated: false },
  { id: 't4', title: 'Client API Integration', assigneeId: 'u1', status: TaskStatus.REVIEW, difficulty: 6, isAiGenerated: false },
  { id: 't5', title: 'Unit Test Coverage', assigneeId: 'AI', status: TaskStatus.BACKLOG, difficulty: 4, aiConfidence: 88, isAiGenerated: true },
];

const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', type: 'Standup', participants: ['u1', 'AI', 'Manager'], isAiDriven: true, status: 'Completed' },
  { id: 'm2', type: 'Sprint Planning', participants: ['u1', 'Team'], isAiDriven: false, status: 'Scheduled' },
];

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [aiState, setAiState] = useState<AIState>(INITIAL_AI);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [fraudRisk, setFraudRisk] = useState<{ score: number; level: 'Low' | 'Medium' | 'High' }>({ score: 12, level: 'Low' });

  const login = (role: Role, companyId: string) => {
    const selectedCompany = MOCK_COMPANIES.find(c => c.id === companyId) || MOCK_COMPANIES[0];
    setCompany(selectedCompany);
    setAiState(prev => ({ ...prev, model: selectedCompany.aiModel }));

    // Generate initial tasks specific to the company's model
    const modelTasks = TASKS_BY_MODEL[selectedCompany.aiModel] || TASKS_BY_MODEL['Gemini 1.5 Pro'];
    const newTasks: Task[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `init_${Date.now()}_${i}`,
        title: modelTasks[i % modelTasks.length],
        assigneeId: i < 3 ? 'u1' : 'AI', // Mix of assignments
        status: i === 0 ? TaskStatus.IN_PROGRESS : i === 1 ? TaskStatus.REVIEW : TaskStatus.BACKLOG,
        difficulty: Math.floor(Math.random() * 8) + 2,
        isAiGenerated: i >= 3,
        aiConfidence: i >= 3 ? Math.floor(Math.random() * 15) + 85 : undefined
    }));
    setTasks(newTasks);

    setCurrentUser({
      id: 'u1',
      name: role === Role.CEO ? 'Elon M.' : 'Alex Dev',
      role: role,
      avatar: 'https://picsum.photos/200',
      verificationLevel: role === Role.USER ? 2 : 5,
      performanceScore: 750,
      skills: [
        { name: 'React', level: 85 },
        { name: 'Node', level: 70 },
        { name: 'System Design', level: 60 },
        { name: 'AI Ops', level: 40 }
      ],
      founderEligibility: 45
    });
    addNotification('Welcome to SkillVerse', `You have logged in as ${role} at ${selectedCompany.name}.`, 'info');
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
    
    if (newStatus === TaskStatus.DONE) {
        if (currentUser) {
            setCurrentUser(prev => prev ? ({
                ...prev,
                performanceScore: prev.performanceScore + 10,
                founderEligibility: Math.min(100, prev.founderEligibility + 2)
            }) : null);
        }
    }
  };

  const generateTask = () => {
    // Generate task based on current model
    const modelTasks = TASKS_BY_MODEL[company.aiModel] || TASKS_BY_MODEL['Gemini 1.5 Pro'];
    const randomTitle = modelTasks[Math.floor(Math.random() * modelTasks.length)];

    const newTask: Task = {
      id: `t${Date.now()}`,
      title: `${randomTitle} (Auto-${Math.floor(Math.random() * 100)})`,
      assigneeId: 'AI',
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
      if (params.model) {
        addNotification('Model Switched', `AI Architecture updated to ${params.model}.`, 'info');
      }
  };

  const triggerFraudCheck = () => {
      if (currentUser) {
          const risk = calculateFraudRisk(currentUser, tasks.filter(t => t.status === TaskStatus.DONE).length);
          setFraudRisk(risk);
          if (risk.level === 'High') {
              addNotification('Security Alert', 'Suspicious activity detected on your account.', 'error');
          }
      }
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

  // Global heartbeat for simulation
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(updateSimulation, 5000); 
    return () => clearInterval(interval);
  }, [currentUser, tasks, aiState]);

  return (
    <SimulationContext.Provider value={{ 
        currentUser, company, availableCompanies: MOCK_COMPANIES, tasks, aiState, notifications, meetings, fraudRisk,
        login, logout, moveTask, generateTask, updateSimulation, 
        markNotificationRead, addNotification, setMethodology, updateAiParams, triggerFraudCheck
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