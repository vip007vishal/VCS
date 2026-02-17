import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';
import { Award, TrendingUp, CheckCircle, XCircle, ChevronRight, Star } from 'lucide-react';

const PromotionsPage: React.FC = () => {
    const { addNotification } = useSimulation();
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    // Mock candidates
    const candidates = [
        { id: 1, name: 'Mike T.', role: 'Junior Developer', currentLevel: 2, score: 850, tenure: '1.2 Years', eligible: true, nextRole: 'Mid-Level Developer' },
        { id: 2, name: 'Jessica L.', role: 'Designer', currentLevel: 3, score: 720, tenure: '8 Months', eligible: false, nextRole: 'Senior Designer' },
        { id: 3, name: 'Alex Dev', role: 'Senior Developer', currentLevel: 4, score: 910, tenure: '3 Years', eligible: true, nextRole: 'Tech Lead' },
    ];

    const handlePromote = (employee: any) => {
        addNotification('Promotion Approved', `${employee.name} has been promoted to ${employee.nextRole}.`, 'success');
        setSelectedEmployee(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Promotion Review</h2>
                    <p className="text-slate-400">Evaluate team members for career advancement.</p>
                </div>
                <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase">Quarterly Budget</p>
                    <p className="text-xl font-bold text-emerald-400">$45,000</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {candidates.map(candidate => (
                    <Card key={candidate.id} className="relative overflow-hidden hover:border-indigo-500 transition-colors">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-300 border-2 border-slate-700">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <span>{candidate.role}</span>
                                        <ChevronRight size={14} />
                                        <span className="text-indigo-400 font-semibold">{candidate.nextRole}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-8 text-center">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Perf. Score</p>
                                    <p className={`text-xl font-bold ${candidate.score > 800 ? 'text-emerald-400' : 'text-amber-400'}`}>{candidate.score}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Tenure</p>
                                    <p className="text-xl font-bold text-white">{candidate.tenure}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">Level</p>
                                    <div className="flex items-center justify-center gap-1">
                                        <span className="text-xl font-bold text-white">{candidate.currentLevel}</span>
                                        <span className="text-slate-600">/ 5</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-auto">
                                {candidate.eligible ? (
                                    <Button onClick={() => setSelectedEmployee(candidate)} className="w-full md:w-auto">
                                        <Award size={18} /> Review Promotion
                                    </Button>
                                ) : (
                                    <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-500 text-sm flex items-center gap-2 justify-center">
                                        <Lock size={14} /> Criteria Not Met
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {selectedEmployee && (
                <Modal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} title={`Promote ${selectedEmployee.name}?`}>
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Star className="text-amber-400" size={20} fill="currentColor" />
                                Promotion Summary
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">New Title</span>
                                    <span className="text-white font-medium">{selectedEmployee.nextRole}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Salary Increase</span>
                                    <span className="text-emerald-400 font-medium">+15% ($12,000)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">New Responsibilities</span>
                                    <span className="text-white text-right max-w-[200px]">Code Reviews, Mentorship, Architecture Design</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" onClick={() => handlePromote(selectedEmployee)}>
                                <CheckCircle size={18} /> Approve Promotion
                            </Button>
                            <Button className="flex-1 bg-slate-700 hover:bg-slate-600" onClick={() => setSelectedEmployee(null)}>
                                <XCircle size={18} /> Cancel
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            
            <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg flex gap-3">
                <TrendingUp className="text-indigo-400 shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-white">AI Insight</h4>
                    <p className="text-xs text-slate-300 mt-1">
                        Based on velocity metrics, promoting <strong>Alex Dev</strong> to Tech Lead typically results in a 12% increase in overall team efficiency due to improved code reviews.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromotionsPage;

// Helper component for icon
const Lock = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);
