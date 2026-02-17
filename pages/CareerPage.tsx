import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { Lock, Unlock, Star, Briefcase, ChevronRight } from 'lucide-react';

const CareerPage: React.FC = () => {
    const { currentUser } = useSimulation();
    
    if (!currentUser) return null;

    const levels = [
        { level: 1, title: 'Junior Developer', unlocked: true },
        { level: 2, title: 'Mid-Level Developer', unlocked: true },
        { level: 3, title: 'Senior Developer', unlocked: currentUser.verificationLevel >= 3 },
        { level: 4, title: 'Tech Lead / Manager', unlocked: false },
        { level: 5, title: 'Founder / CEO', unlocked: false },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Career Path</h2>
                <p className="text-slate-400">Unlock certifications and verification levels to become a Founder.</p>
            </div>

            <div className="relative">
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-slate-800 -z-10"></div>
                <div className="space-y-12">
                    {levels.map((lvl, index) => (
                        <div key={lvl.level} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className="flex-1 text-right">
                                {index % 2 === 0 && (
                                    <div className="pr-8">
                                        <h3 className={`text-xl font-bold ${lvl.unlocked ? 'text-indigo-400' : 'text-slate-600'}`}>{lvl.title}</h3>
                                        <p className="text-sm text-slate-500">Level {lvl.level}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center z-10 ${lvl.unlocked ? 'bg-slate-900 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-700'}`}>
                                {lvl.unlocked ? <Unlock size={24} /> : <Lock size={24} />}
                            </div>

                            <div className="flex-1">
                                {index % 2 !== 0 && (
                                    <div className="pl-8">
                                        <h3 className={`text-xl font-bold ${lvl.unlocked ? 'text-indigo-400' : 'text-slate-600'}`}>{lvl.title}</h3>
                                        <p className="text-sm text-slate-500">Level {lvl.level}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Founder Eligibility Tracker">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-amber-500 flex items-center gap-2">
                                <Star size={16} fill="currentColor" /> Status
                            </span>
                            <span className="text-2xl font-bold text-white">{currentUser.founderEligibility}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
                            <div 
                                className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full transition-all duration-1000 relative" 
                                style={{ width: `${currentUser.founderEligibility}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 text-center">Reach 100% to unlock the "Create Company" feature.</p>
                    </div>
                </Card>

                <Card title="Verification Tasks">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-emerald-500/30">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                            <span className="text-sm text-slate-300 line-through decoration-slate-500">Complete 50 Tasks</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">2</div>
                            <span className="text-sm text-slate-300">Maintain &gt;90% Reliability for 7 days</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">3</div>
                            <span className="text-sm text-slate-300">Lead 5 Successful Sprints</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CareerPage;