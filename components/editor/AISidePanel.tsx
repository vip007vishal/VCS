
import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { Bot, Zap, Bug, CheckCircle, Info, FileText } from 'lucide-react';
import { Button } from '../UI';
import { Task } from '../../types';

interface AISidePanelProps {
    task: Task;
}

export const AISidePanel: React.FC<AISidePanelProps> = ({ task }) => {
  const { terminalLogs } = useEditor();
  const [activeTab, setActiveTab] = useState<'INFO' | 'AI'>('INFO');
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);

  const runAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
        setFeedback([
            { type: 'hint', message: 'Consider extracting the validation logic into a separate utility function.' },
            { type: 'warn', message: 'Line 24: Potential memory leak in event listener.' },
            { type: 'good', message: 'Good use of TypeScript interfaces.' }
        ]);
        setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('INFO')}
            className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'INFO' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
              <Info size={14} /> Task Info
          </button>
          <button 
            onClick={() => setActiveTab('AI')}
            className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-colors ${activeTab === 'AI' ? 'bg-slate-800 text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
              <Bot size={14} /> AI Copilot
          </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'INFO' ? (
            <div className="p-5 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${task.difficulty > 7 ? 'bg-rose-900/30 border-rose-500/50 text-rose-400' : 'bg-blue-900/30 border-blue-500/50 text-blue-400'}`}>
                            Difficulty: {task.difficulty}/10
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-400">
                            {task.managerType === 'AI' ? 'AI Manager' : 'Human Manager'}
                        </span>
                    </div>
                    <div className="text-sm text-slate-300 leading-relaxed space-y-4">
                        <div className="p-3 bg-slate-800/50 rounded border border-slate-700">
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><FileText size={12}/> Brief</h4>
                            <p>{task.description}</p>
                        </div>
                        
                        <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Objectives & deliverables</h4>
                            <ul className="list-disc list-inside space-y-1 text-slate-300">
                                <li>Analyze requirements in README.md</li>
                                <li>Implement solution in <code>src/</code></li>
                                <li>Ensure code compiles without errors</li>
                                <li>Pass all unit tests</li>
                                <li>Refactor for readability</li>
                            </ul>
                        </div>

                        {task.aiFeedback && (
                            <div className="p-3 bg-indigo-900/20 border border-indigo-500/30 rounded">
                                <h4 className="text-xs font-bold text-indigo-400 uppercase mb-1">Previous Feedback</h4>
                                <p className="italic text-indigo-200">"{task.aiFeedback}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col h-full">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Bot size={16} className="text-indigo-400" /> AI Copilot
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1">Real-time code analysis & suggestions</p>
                </div>

                <div className="flex-1 p-4 space-y-6">
                    {/* Score Estimate */}
                    <div className="bg-slate-800 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400 uppercase font-bold">Projected Score</span>
                            <span className="text-emerald-400 font-bold text-lg">88/100</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full w-[88%]"></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <Button variant="secondary" className="w-full text-xs gap-2" onClick={runAnalysis} disabled={analyzing}>
                            {analyzing ? 'Scanning...' : <><Zap size={14}/> Analyze Code Quality</>}
                        </Button>
                    </div>

                    {/* Feedback List */}
                    <div className="space-y-3">
                        {feedback.length > 0 ? feedback.map((item, i) => (
                            <div key={i} className={`p-3 rounded border text-xs ${item.type === 'warn' ? 'bg-amber-950/20 border-amber-900/50 text-amber-200' : item.type === 'good' ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                                <div className="flex gap-2">
                                    {item.type === 'warn' ? <Bug size={14}/> : item.type === 'good' ? <CheckCircle size={14}/> : <Bot size={14}/>}
                                    <span>{item.message}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-slate-500 text-xs py-8">
                                Run analysis to get AI feedback on your code structure and logic.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
