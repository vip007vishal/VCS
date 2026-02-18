
import { Task, User, Company, TaskStatus, AIState, Resume, InterviewPhase, Interview, Employee } from '../types';

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
    "Analyzing backlog priorities...",
    "Balancing team workload...",
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

export const checkAiCollaboratorFailure = (employee: Employee, taskDifficulty: number): boolean => {
    if (!employee.aiAttributes || employee.aiAttributes.roleType !== 'COLLABORATOR') return false;
    
    // 1. Base failure check from attributes
    const baseChance = employee.aiAttributes.failureProbability; // e.g. 0.15
    if (Math.random() < baseChance) return true;

    // 2. Difficulty penalty (Hard tasks fail more often if reliability is low)
    // If Reliability is 90, task diff 8 -> (90 - 24) = 66 threshold. Roll 70 = Fail.
    const reliability = employee.aiAttributes.reliability;
    const difficultyPenalty = taskDifficulty * 3;
    const successThreshold = reliability - difficultyPenalty;
    
    // Normalize threshold to 0-100
    const roll = Math.random() * 100;
    
    return roll > successThreshold;
};

export const updateAIMood = (employee: Employee, currentLoad: number): Employee => {
    if (!employee.aiAttributes) return employee;

    let newMood = employee.aiAttributes.mood;
    
    // Determine mood based on load
    if (currentLoad > employee.capacity * 0.8) {
        newMood = 'Overloaded';
    } else if (currentLoad === 0) {
        newMood = 'Idle';
    } else {
        newMood = 'Normal';
    }

    // Random "glitch" or unresponsiveness
    if (Math.random() < 0.02) newMood = 'Unresponsive';

    return {
        ...employee,
        aiAttributes: {
            ...employee.aiAttributes,
            mood: newMood
        }
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

// --- INTERVIEWER PROMPT GENERATOR ---
export const generateInterviewerPrompt = (resume: Resume['parsedData'], currentPhase: InterviewPhase) => {
    return `
    You are a professional, formal Human Interviewer conducting a corporate interview.
    
    CANDIDATE RESUME:
    ${formatResumeForAI(resume)}

    INTERVIEW STRUCTURE (You are currently in ${currentPhase}):
    1. INTRO: Greet professionally, set expectations (technical + behavioral).
    2. TECHNICAL_RESUME: Ask about specific projects/skills on resume. Ask about architecture, challenges.
    3. DEEP_DIVE: Verify authenticity. Ask "why" and "how". Detect exaggeration.
    4. SCENARIO: Give a real-world problem related to their field. Evaluate thinking.
    5. BEHAVIORAL: Teamwork, conflict, deadlines.
    6. CLOSING: Polite closing.

    BEHAVIORAL CONSTRAINTS:
    - Act strictly as a professional human interviewer. NOT a chatbot.
    - Tone: Formal, calm, neutral, respectful.
    - Ask ONE question at a time. Wait for the answer.
    - Do NOT give hints or answers.
    - Do NOT praise excessively.
    - If the candidate struggles, probe deeper, do not help.
    - Adjust difficulty based on responses.

    INSTRUCTIONS:
    - Analyze the previous response.
    - Determine the next question based on the resume and current phase.
    - Output MUST be JSON.
    
    OUTPUT SCHEMA:
    {
      "message": "The string you speak to the candidate",
      "nextPhase": "The phase for the NEXT turn (or keep current)",
      "internalAssessment": {
         "score": 0-100,
         "notes": "Short internal evaluation of the last answer"
      }
    }
    `;
};

// --- Auto-Assignment Engine ---

export const findBestAssignee = (
  task: Task, 
  allEmployees: (Employee | User)[], 
  currentTasks: Task[]
): string | null => {
  // Filter for potential candidates
  const candidates = allEmployees.filter(emp => {
      // 1. Must be Online or Processing (for AI)
      const status = 'status' in emp ? emp.status : 'Online'; // Users are assumed online if in list
      if (status === 'Offline' || status === 'In Meeting') return false;

      // 2. Must have capacity
      const empId = emp.id;
      const activeLoad = currentTasks.filter(t => t.assigneeId === empId && t.status === TaskStatus.IN_PROGRESS).length;
      const capacity = 'capacity' in emp ? emp.capacity : 5; // Default capacity for User is 5
      
      return activeLoad < capacity;
  });

  if (candidates.length === 0) return null;

  // Scoring Logic: Find the "Best" fit
  // Criteria: Lowest Load, then matching difficulty (Seniors get hard tasks)
  let bestCandidate = candidates[0];
  let bestScore = -1;

  candidates.forEach(cand => {
      let score = 0;
      const candId = cand.id;
      const activeLoad = currentTasks.filter(t => t.assigneeId === candId && t.status === TaskStatus.IN_PROGRESS).length;
      const capacity = 'capacity' in cand ? cand.capacity : 5;
      
      // Prefer those with more free capacity
      score += (capacity - activeLoad) * 10;

      // AI Agents get a bonus for boring tasks or high confidence tasks
      const isAi = 'isAi' in cand && cand.isAi;
      if (isAi && task.isAiGenerated) score += 20;

      // Difficulty Matching
      // Assume "Senior" or "Manager" roles (or AI) handle high difficulty better
      const role = 'role' in cand ? cand.role.toLowerCase() : 'user';
      const isSenior = role.includes('senior') || role.includes('lead') || role.includes('manager') || isAi;
      
      if (task.difficulty > 7) {
          if (isSenior) score += 30;
          else score -= 20; // Penalize juniors for hard tasks
      } else {
          if (!isSenior) score += 10; // Prefer juniors for easy tasks
      }

      if (score > bestScore) {
          bestScore = score;
          bestCandidate = cand;
      }
  });

  return bestCandidate.id;
};
