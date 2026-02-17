import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Calendar, Video, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const InterviewsPage: React.FC = () => {
    const { addNotification } = useSimulation();
    
    const [interviews, setInterviews] = useState([
        { id: 1, candidate: 'Elena R.', role: 'Senior Architect', time: '10:00 AM', status: 'Scheduled' },
        { id: 2, candidate: 'David K.', role: 'Frontend Dev', time: '2:00 PM', status: 'Scheduled' },
        { id: 3, candidate: 'AI-Model-X', role: 'Auto-Coder', time: 'Completed', status: 'Passed' },
    ]);

    const handleAction = (id: number, action: 'Pass' | 'Fail') => {
        setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: action === 'Pass' ? 'Passed' : 'Failed' } : i));
        addNotification('Interview Updated', `Candidate marked as ${action === 'Pass' ? 'Passed' : 'Failed'}`, action === 'Pass' ? 'success' : 'error');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Interview Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Today's Interviews">
                    <div className="space-y-4">
                        {interviews.map(interview => (
                            <div key={interview.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-800 rounded-lg text-indigo-400">
                                        {interview.status === 'Scheduled' ? <Video size={20} /> : <CheckCircle size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{interview.candidate}</h4>
                                        <p className="text-xs text-slate-400">{interview.role}</p>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                            <Clock size={12} /> {interview.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge color={interview.status === 'Scheduled' ? 'blue' : interview.status === 'Passed' ? 'green' : 'red'}>
                                        {interview.status}
                                    </Badge>
                                    {interview.status === 'Scheduled' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(interview.id, 'Pass')} className="p-1 hover:text-emerald-400 text-slate-500"><CheckCircle size={18} /></button>
                                            <button onClick={() => handleAction(interview.id, 'Fail')} className="p-1 hover:text-rose-400 text-slate-500"><XCircle size={18} /></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Interview Metrics">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900 rounded-lg text-center">
                            <p className="text-3xl font-bold text-white">12</p>
                            <p className="text-xs text-slate-500">Candidates this week</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-lg text-center">
                            <p className="text-3xl font-bold text-emerald-400">18%</p>
                            <p className="text-xs text-slate-500">Offer Rate</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-lg text-center">
                            <p className="text-3xl font-bold text-indigo-400">45m</p>
                            <p className="text-xs text-slate-500">Avg Interview Duration</p>
                        </div>
                        <div className="p-4 bg-slate-900 rounded-lg text-center">
                            <p className="text-3xl font-bold text-amber-400">92%</p>
                            <p className="text-xs text-slate-500">Candidate Satisfaction</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InterviewsPage;