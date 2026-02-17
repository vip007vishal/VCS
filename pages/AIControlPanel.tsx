import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { Sliders, Zap, Activity, BrainCircuit } from 'lucide-react';

const AIControlPanel: React.FC = () => {
    const { aiState, updateAiParams } = useSimulation();

    const availableModels = [
        'Gemini 1.5 Pro',
        'GPT-4o',
        'Claude 3.5 Sonnet',
        'Llama 3'
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">AI Global Control Panel</h2>
            <p className="text-slate-400">Adjust the simulation parameters for all AI agents in the system.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Behavioral Parameters" icon={Sliders}>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">Global Confidence Base</label>
                                <span className="text-sm font-bold text-indigo-400">{aiState.confidence}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={aiState.confidence}
                                onChange={(e) => updateAiParams({ confidence: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Controls the probability of AI initiating tasks and suggestions.</p>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-300">Reliability / Error Rate</label>
                                <span className="text-sm font-bold text-emerald-400">{aiState.reliability}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="50" max="100" 
                                value={aiState.reliability}
                                onChange={(e) => updateAiParams({ reliability: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <p className="text-xs text-slate-500 mt-1">Lower values increase the chance of AI generating buggy code.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                             <label className="text-sm font-medium text-slate-300 mb-2 block">Forced Mood State</label>
                             <div className="flex gap-2">
                                 {['Optimistic', 'Neutral', 'Stressed'].map((m) => (
                                     <button
                                        key={m}
                                        onClick={() => updateAiParams({ mood: m as any })}
                                        className={`px-4 py-2 rounded text-xs font-bold transition-all ${aiState.mood === m ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                     >
                                         {m}
                                     </button>
                                 ))}
                             </div>
                        </div>
                    </div>
                </Card>

                <Card title="System Logs" icon={Activity}>
                    <div className="bg-black rounded-lg p-4 font-mono text-xs text-emerald-400 h-64 overflow-y-auto">
                        <p className="opacity-50"># System initialized at {new Date().toLocaleTimeString()}</p>
                        <p>&gt; AI_AGENT_01: Connected</p>
                        <p>&gt; AI_AGENT_02: Connected</p>
                        <p>&gt; BEHAVIOR_ENGINE: Loaded profile 'Adaptive'</p>
                        <p>&gt; METRICS: Telemetry stream active</p>
                        <p className="text-yellow-400">&gt; WARNING: High load on semantic analysis node</p>
                        <p>&gt; OPTIMIZER: Re-routing tasks...</p>
                        <p>&gt; AI_AGENT_01: Task #424 completed (Confidence: 94%)</p>
                        <span className="animate-pulse">_</span>
                    </div>
                </Card>
            </div>

            <Card title="Advanced Settings" icon={BrainCircuit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <h4 className="font-bold text-white mb-2">Learning Rate</h4>
                        <div className="flex items-center gap-2">
                             <Badge color="blue">0.001</Badge>
                             <span className="text-xs text-slate-500">Adaptive</span>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <h4 className="font-bold text-white mb-2">Model Architecture</h4>
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 mb-2">
                                <Badge color="purple">{aiState.model}</Badge>
                                <span className="text-xs text-slate-500">Active</span>
                             </div>
                             <div className="flex flex-wrap gap-1">
                                {availableModels.map(m => (
                                    <button 
                                        key={m} 
                                        onClick={() => updateAiParams({ model: m })}
                                        className={`text-[10px] px-2 py-1 rounded border transition-colors ${aiState.model === m ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <h4 className="font-bold text-white mb-2">Context Window</h4>
                        <div className="flex items-center gap-2">
                             <Badge color="green">128k</Badge>
                             <span className="text-xs text-slate-500">Tokens</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AIControlPanel;