import React, { useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, StatBox, Button } from '../components/UI';
import { Shield, Server, Users, Sliders } from 'lucide-react';

const AdminDashboard: React.FC = () => {
    const { aiState, updateAiParams, tasks, fraudRisk, triggerFraudCheck } = useSimulation();

    // Trigger fraud check on mount to get latest value
    useEffect(() => {
        triggerFraudCheck();
    }, []);

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBox label="Total Users" value="1,240" />
                <StatBox label="Active Companies" value="85" />
                <StatBox label="Global AI Confidence" value={`${aiState.confidence}%`} />
                <StatBox 
                    label="Fraud Risk Score" 
                    value={fraudRisk.score} 
                    trend={fraudRisk.level} 
                    trendUp={fraudRisk.level === 'Low'} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="AI Simulation Control" icon={Sliders}>
                    <div className="space-y-6">
                        <div>
                            <label className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Base Confidence</span>
                                <span>{aiState.confidence}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={aiState.confidence}
                                onChange={(e) => updateAiParams({ confidence: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Reliability Factor</span>
                                <span>{aiState.reliability}%</span>
                            </label>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={aiState.reliability}
                                onChange={(e) => updateAiParams({ reliability: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button className="flex-1" variant="danger" onClick={() => updateAiParams({ mood: 'Stressed', confidence: 40 })}>Trigger Market Crash</Button>
                            <Button className="flex-1" variant="secondary" onClick={() => updateAiParams({ mood: 'Optimistic', confidence: 95 })}>Reset Market</Button>
                        </div>
                    </div>
                </Card>

                <Card title="Fraud Detection Panel" icon={Shield}>
                     <div className="space-y-3">
                        <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex justify-between items-center">
                             <div>
                                 <h5 className="text-sm font-bold text-slate-200">System Scan</h5>
                                 <p className="text-xs text-slate-500">Last check: Just now</p>
                             </div>
                             <Button onClick={triggerFraudCheck} variant="outline" className="text-xs h-8">Run Scan</Button>
                        </div>

                        {fraudRisk.level !== 'Low' && (
                            <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded-lg flex justify-between items-center animate-pulse">
                                <div>
                                    <h5 className="text-sm font-bold text-rose-400">Current User Risk: {fraudRisk.level}</h5>
                                    <p className="text-xs text-slate-500">Anomaly score: {fraudRisk.score}</p>
                                </div>
                                <Button variant="danger" className="text-xs h-8">Restrict</Button>
                            </div>
                        )}
                        
                        <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg flex justify-between items-center">
                            <div>
                                <h5 className="text-sm font-bold text-amber-400">Company #C-22</h5>
                                <p className="text-xs text-slate-500">Suspicious revenue spike (+400%).</p>
                            </div>
                            <Button variant="outline" className="text-xs h-8">Investigate</Button>
                        </div>
                     </div>
                </Card>
            </div>

            <Card title="System Health" icon={Server}>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-slate-900 rounded-lg">
                        <div className="text-emerald-400 font-bold text-xl mb-1">99.9%</div>
                        <div className="text-xs text-slate-500">Uptime</div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg">
                        <div className="text-blue-400 font-bold text-xl mb-1">45ms</div>
                        <div className="text-xs text-slate-500">Latency</div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-lg">
                        <div className="text-purple-400 font-bold text-xl mb-1">{tasks.length}</div>
                        <div className="text-xs text-slate-500">Active Objects</div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;