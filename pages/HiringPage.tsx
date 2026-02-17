import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge, Modal } from '../components/UI';
import { UserPlus, Star, X, Check, FileText, MessageSquare, Bot } from 'lucide-react';

const HiringPage: React.FC = () => {
    const { addNotification } = useSimulation();
    const [interviewModal, setInterviewModal] = useState<any>(null);

    const candidates = [
        { id: 1, name: 'Elena R.', role: 'Senior Architect', exp: '8 Yrs', salary: '$180k', match: 92, skills: ['System Design', 'Cloud', 'Leadership'] },
        { id: 2, name: 'David K.', role: 'Frontend Dev', exp: '3 Yrs', salary: '$120k', match: 78, skills: ['React', 'CSS', 'A11y'] },
        { id: 3, name: 'AI-Model-X', role: 'Auto-Coder', exp: 'v2.4', salary: '$500/mo', match: 99, skills: ['Python', 'Go', 'SQL'], isAi: true },
        { id: 4, name: 'Priya M.', role: 'Product Manager', exp: '5 Yrs', salary: '$150k', match: 85, skills: ['Agile', 'Roadmapping', 'Analytics'] },
    ];

    const startInterview = (candidate: any) => {
        setInterviewModal(candidate);
    };

    const handleHire = (candidate: any) => {
        addNotification('Offer Sent', `Job offer sent to ${candidate.name}.`, 'success');
        setInterviewModal(null);
    };

    const handleReject = () => {
        setInterviewModal(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Talent Acquisition</h2>
                    <p className="text-slate-400">Review candidates and expand your workforce.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">Hiring Budget</p>
                        <p className="text-xl font-bold text-white">$2.5M</p>
                    </div>
                    <Button><UserPlus size={18} /> Post Job</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map(candidate => (
                    <Card key={candidate.id} className="flex flex-col h-full hover:border-indigo-500 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${candidate.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                    {candidate.isAi ? <Bot size={24}/> : candidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{candidate.name}</h4>
                                    <p className="text-xs text-slate-400">{candidate.role}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-bold ${candidate.match > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{candidate.match}% Match</span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Experience</span>
                                <span className="text-white">{candidate.exp}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                                <span className="text-slate-500">Asking Salary</span>
                                <span className="text-white">{candidate.salary}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {candidate.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <Button variant="secondary" className="flex-1" onClick={() => startInterview(candidate)}>Interview</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {interviewModal && (
                <Modal isOpen={!!interviewModal} onClose={() => setInterviewModal(null)} title={`Interviewing: ${interviewModal.name}`}>
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">HR</div>
                                <div className="bg-slate-800 p-3 rounded-r-lg rounded-bl-lg text-sm text-slate-300 max-w-[80%]">
                                    Can you describe a challenging architectural problem you solved recently?
                                </div>
                            </div>
                             <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                                    {interviewModal.isAi ? <Bot size={16}/> : interviewModal.name.charAt(0)}
                                </div>
                                <div className="bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-l-lg rounded-br-lg text-sm text-white max-w-[80%]">
                                    {interviewModal.isAi 
                                        ? "I optimized a distributed graph database query reducing latency by 400ms using a custom caching layer." 
                                        : "At my last role, I migrated a legacy monolith to microservices while maintaining 99.99% uptime."}
                                </div>
                            </div>
                            <div className="text-center text-xs text-slate-500 italic">Analysis: Candidate demonstrates strong technical depth.</div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" onClick={() => handleHire(interviewModal)}>
                                <Check size={18} /> Hire Candidate
                            </Button>
                            <Button className="flex-1 bg-rose-600 hover:bg-rose-500" onClick={handleReject}>
                                <X size={18} /> Reject
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default HiringPage;