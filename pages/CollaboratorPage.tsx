import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Badge } from '../components/UI';
import { User, Zap, Activity, Bot } from 'lucide-react';
import { AIStatusIndicator } from '../components/collaboration/AIStatusIndicator';
import { TeamPanel } from '../components/collaboration/TeamPanel';
import { KanbanBoard } from '../components/collaboration/KanbanBoard';
import { ChatPanel } from '../components/collaboration/ChatPanel';

const CollaboratorPage: React.FC = () => {
  const { company } = useSimulation();
  const [mode, setMode] = useState<'HUMAN' | 'AI'>('HUMAN');
  const [aiLogs, setAiLogs] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'AI') {
      const interval = setInterval(() => {
        const actions = [
          `Optimizing Kernel process [PID: ${Math.floor(Math.random()*9000)}]`,
          `Refactoring component structure...`,
          `Reviewing Pull Request #1024`,
          `Deploying to staging environment...`,
          `Running integration tests (Coverage: ${Math.floor(Math.random()*10)+85}%)`
        ];
        setAiLogs(prev => [actions[Math.floor(Math.random()*actions.length)], ...prev].slice(0, 15));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Top Toggle */}
      <div className="flex justify-between items-center mb-6 shrink-0">
         <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Work Board</h2>
            <Badge color="purple">{company.methodology}</Badge>
         </div>
        <div className="bg-slate-900 p-1 rounded-lg flex border border-slate-700">
          <button 
            onClick={() => setMode('HUMAN')}
            className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${mode === 'HUMAN' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <User size={14} /> Human
          </button>
          <button 
             onClick={() => setMode('AI')}
             className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${mode === 'AI' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Zap size={14} /> AI-Only
          </button>
        </div>
      </div>

      {mode === 'HUMAN' ? (
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* LEFT: Team & AI Status */}
          <div className="w-64 flex flex-col gap-6 shrink-0 overflow-y-auto">
            <AIStatusIndicator />
            <div className="flex-1">
                <TeamPanel />
            </div>
          </div>

          {/* CENTER: Kanban - Dynamic */}
          <div className="flex-1 min-w-0">
             <KanbanBoard />
          </div>

          {/* RIGHT: Chat */}
          <div className="shrink-0 h-full">
            <ChatPanel />
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0 overflow-y-auto">
           <Card title="AI Operations Center" className="flex flex-col">
              <div className="flex-1 bg-black rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-hidden relative min-h-[400px]">
                 <div className="absolute top-2 right-2 flex gap-2">
                   <Badge color="green">ONLINE</Badge>
                   <Badge color="blue">AUTO-PILOT</Badge>
                 </div>
                 {aiLogs.map((log, i) => (
                   <div key={i} className="mb-1 opacity-80 animate-in fade-in slide-in-from-left-2">&gt; {log}</div>
                 ))}
                 <div className="animate-pulse">&gt; _</div>
              </div>
           </Card>
           
           <div className="space-y-6">
              <Card title="Real-Time Metrics" icon={Activity}>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-4 rounded text-center">
                       <p className="text-slate-400 text-xs uppercase">Tasks / Min</p>
                       <p className="text-3xl font-bold text-white">420</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center">
                       <p className="text-slate-400 text-xs uppercase">Error Rate</p>
                       <p className="text-3xl font-bold text-emerald-400">0.02%</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center">
                       <p className="text-slate-400 text-xs uppercase">Compute Load</p>
                       <p className="text-3xl font-bold text-amber-400">89%</p>
                    </div>
                    <div className="bg-slate-900 p-4 rounded text-center">
                       <p className="text-slate-400 text-xs uppercase">Optimization</p>
                       <p className="text-3xl font-bold text-indigo-400">Level 5</p>
                    </div>
                 </div>
              </Card>
              
              <div className="bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-center gap-4">
                 <Bot size={32} className="text-indigo-400" />
                 <div>
                    <h4 className="font-bold text-white">AI Supervisor Active</h4>
                    <p className="text-sm text-slate-400">The system is currently handling all backlog tickets automatically based on heuristic patterns.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorPage;