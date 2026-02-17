import { Task, User, Company, TaskStatus, AIState, Resume, InterviewPhase, Interview } from '../types';

// --- Scoring Engine ---
export const calculateUserScore = (completedTasks: number, verificationLevel: number, reliability: number) => {
  const baseScore = completedTasks * 10;
  const bonus = verificationLevel * 50;
  const reliabilityFactor = reliability / 100;
  return Math.floor((baseScore + bonus) * reliabilityFactor);
};

export const getSkillRadarData = (user: User) => {
  return user.skills.map(s => ({ subject: s.name, A: s.level, fullMark: 100 }));
};

// --- Revenue Engine ---
export const calculateRevenue = (currentRevenue: number, company: Company, activeTasks: number) => {
  // Simple fluctuation based on active tasks and trust
  const baseBurn = company.burnRate; // Daily cost
  const incomePerTask = 500;
  const trustFactor = company.trustScore / 100;
  
  const dailyIncome = (activeTasks * incomePerTask * trustFactor);
  const netChange = dailyIncome - baseBurn;
  
  // Add some random market volatility
  const volatility = (Math.random() - 0.5) * 200;
  
  return Math.floor(currentRevenue + netChange + volatility);
};

// --- AI Behavior Engine ---
export const simulateAIBehavior = (currentAiState: AIState): AIState => {
  // Randomly adjust confidence
  const confidenceChange = (Math.random() - 0.5) * 5; 
  let newConfidence = Math.max(0, Math.min(100, currentAiState.confidence + confidenceChange));
  
  // Determine Mood based on confidence
  let newMood: AIState['mood'] = 'Neutral';
  if (newConfidence > 80) newMood = 'Optimistic';
  if (newConfidence < 50) newMood = 'Stressed';

  // Reliability fluctuates slightly
  const reliabilityChange = (Math.random() - 0.5) * 2;
  const newReliability = Math.max(0, Math.min(100, currentAiState.reliability + reliabilityChange));

  const actions = [
    "Analyzing code structure...",
    "Optimizing database queries...",
    "Refactoring component tree...",
    "Running unit tests...",
    "Idle",
    "Reviewing PRs...",
    "Generating documentation...",
    "Screening resumes...",
    "Drafting interview questions..."
  ];
  
  const randomAction = actions[Math.floor(Math.random() * actions.length)];

  return {
    confidence: Math.floor(newConfidence),
    reliability: Math.floor(newReliability),
    mood: newMood,
    lastAction: randomAction,
    model: currentAiState.model
  };
};

export const shouldTaskFail = (difficulty: number, aiConfidence: number): boolean => {
  // Higher difficulty + Lower Confidence = Higher failure chance
  const riskFactor = (difficulty * 10) - aiConfidence;
  const randomRoll = Math.random() * 100;
  return randomRoll < riskFactor; // If roll is less than risk, it fails
};

// --- Fraud Detection Engine ---
export const calculateFraudRisk = (user: User, completedTasks: number): { score: number; level: 'Low' | 'Medium' | 'High' } => {
  let score = 0;
  
  // Risk Factor 1: Too many tasks completed (Task Farming)
  if (completedTasks > 50) score += 30;
  
  // Risk Factor 2: Low verification but high performance
  if (user.verificationLevel < 2 && user.performanceScore > 800) score += 40;
  
  // Risk Factor 3: Random audit
  score += Math.random() * 10;

  let level: 'Low' | 'Medium' | 'High' = 'Low';
  if (score > 50) level = 'Medium';
  if (score > 80) level = 'High';

  return { score: Math.floor(score), level };
};

// --- NEW: Resume & Interview Engines ---

export const parseResumeMock = (fileName: string): Resume['parsedData'] => {
    // Determine skills based on filename for simulation
    const isFrontend = fileName.toLowerCase().includes('frontend') || fileName.toLowerCase().includes('react');
    const isBackend = fileName.toLowerCase().includes('backend') || fileName.toLowerCase().includes('node') || fileName.toLowerCase().includes('java');
    
    const skills = [];
    if (isFrontend) skills.push('React', 'TypeScript', 'Tailwind', 'Figma');
    if (isBackend) skills.push('Node.js', 'PostgreSQL', 'Docker', 'AWS');
    if (!isFrontend && !isBackend) skills.push('Project Management', 'Agile', 'Jira');

    // Add some "fluff" skills
    if (Math.random() > 0.5) skills.push('Git', 'Communication');

    return {
        skills,
        experienceYears: Math.floor(Math.random() * 8) + 1,
        education: Math.random() > 0.5 ? 'B.S. Computer Science' : 'M.S. Software Engineering',
        summary: `Experienced professional with a focus on ${skills[0] || 'Tech'}. Proven track record in scaling high-load systems.`,
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
        projects: [
            { name: "E-Commerce Replatform", desc: "Migrated legacy monolith to microservices." },
            { name: "Real-time Dashboard", desc: "Implemented WebSocket updates for analytics." }
        ]
    };
};

export const formatResumeForAI = (data: Resume['parsedData']): string => {
    return `
    Skills: ${data.skills.join(', ')}
    Experience: ${data.experienceYears} Years
    Education: ${data.education}
    Summary: ${data.summary}
    Key Projects: ${data.projects?.map(p => `${p.name}: ${p.desc}`).join('; ')}
    `;
};

export const evaluateInterviewResponse = (question: string, answer: string): number => {
    // Advanced heuristic: Length of answer + technical keywords + sentiment
    let score = 50;
    if (answer.length > 50) score += 10;
    if (answer.length > 150) score += 10;
    
    // Check for "intelligent" keywords
    const keywords = ['optimized', 'scaled', 'refactored', 'users', 'latency', 'architecture', 'team', 'led', 'trade-off', 'consensus', 'impact'];
    let matches = 0;
    keywords.forEach(k => {
        if (answer.toLowerCase().includes(k)) matches++;
    });
    score += (matches * 3);

    return Math.min(100, score);
};