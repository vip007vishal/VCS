
import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge, Modal } from '../components/UI';
import { UserPlus, Star, X, Check, FileText, MessageSquare, Bot, Clock, Video, Eye, Mic, List, User, AlertCircle, ShieldAlert, Shield } from 'lucide-react';
import { Interview, Resume, ResumeStatus } from '../types';

const HiringPage: React.FC = () => {
    const { addNotification, resumes, interviews, scheduleInterview, finalizeInterview } = useSimulation();
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
    const [viewMode, setViewMode] = useState<'PIPELINE' | 'INTERVIEW'>('PIPELINE');

    // Human Interview State
    const [scores, setScores] = useState({ technical: 50, communication: 50, culture: 50, leadership: 50 });
    const [notes, setNotes] = useState('');

    const pendingCandidates = resumes.filter(r => !interviews.some(i => i.resumeId === r.id));
    const activeInterviews = interviews.filter(i => ['SCHEDULED', 'IN_PROGRESS', 'DECISION_PENDING'].includes(i.status));

    const handleSchedule = (candidateId: string, type: 'AI' | 'HUMAN') => {
        const resume = resumes.find(r => r.userId === candidateId);
        if (resume && resume.status !== ResumeStatus.APPROVED) {
            addNotification("Cannot Schedule", "Resume must be APPROVED by validation center first.", "error");
            return;
        }
        scheduleInterview(candidateId, type);
        setSelectedResume(null);
    };

    const handleDecision = (interview: Interview, decision: 'HIRED' | 'REJECTED') => {
        finalizeInterview(interview.id, decision, notes, { ...scores, overall: (scores.technical + scores.communication + scores.culture + scores.leadership)/4 });
        setSelectedInterview(null);
        setViewMode('PIPELINE');
        setNotes('');
    };

    const startHumanInterview = (interview: Interview) => {
        setSelectedInterview(interview);
        setViewMode('INTERVIEW');
        const resume = resumes.find(r => r.id === interview.resumeId);
        if(resume) setSelectedResume(resume);
    };

    if (viewMode === 'INTERVIEW' && selectedInterview && selectedResume) {
        return (
            <div className="h-[calc(100vh-120px)] flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Video className="text-indigo-400" /> Human Interview Mode
                        </h2>
                        <p className="text-slate-400">Conducting interview with {selectedInterview.candidateName}</p>
                    </div>
                    <Button variant="outline" onClick={() => setViewMode('PIPELINE')}>Exit Interview</Button>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                    {/* LEFT: Resume Viewer */}
                    <Card className="flex flex-col overflow-hidden h-full">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><FileText size={18}/> Candidate Resume</h3>
                            <Badge color="blue">{selectedResume.parsedData.matchScore}% Match</Badge>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            <div className="bg-slate-900 p-4 rounded-lg">
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-1">Summary</h4>
                                <p className="text-sm text-slate-200">{selectedResume.parsedData.summary}</p>
                            </div>
                            
                            <div>
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedResume.parsedData.skills.map(s => (
                                        <Badge key={s} color="purple">{s}</Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 p-3 rounded">
                                    <h4 className="text-slate-400 text-xs uppercase font-bold mb-1">Experience</h4>
                                    <p className="text-white">{selectedResume.parsedData.experienceYears} Years</p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded">
                                    <h4 className="text-slate-400 text-xs uppercase font-bold mb-1">Education</h4>
                                    <p className="text-white">{selectedResume.parsedData.education}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-slate-400 text-xs uppercase font-bold mb-2">Projects</h4>
                                <div className="space-y-2">
                                    {selectedResume.parsedData.projects?.map((p, i) => (
                                        <div key={i} className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                            <p className="font-bold text-sm text-indigo-300">{p.name}</p>
                                            <p className="text-xs text-slate-400">{p.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* RIGHT: Scoring & Controls */}
                    <Card className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                            <h3 className="font-bold text-white flex items-center gap-2"><Star size={18}/> Evaluation Panel</h3>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-slate-400">Live</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto space-y-6">
                            {/* Sliders */}
                            {[
                                { label: 'Technical Proficiency', key: 'technical' },
                                { label: 'Communication Skills', key: 'communication' },
                                { label: 'Culture Fit', key: 'culture' },
                                { label: 'Leadership Potential', key: 'leadership' },
                            ].map((criterion) => (
                                <div key={criterion.key}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">{criterion.label}</span>
                                        <span className="font-bold text-indigo-400">{(scores as any)[criterion.key]}/100</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="100" 
                                        value={(scores as any)[criterion.key]} 
                                        onChange={(e) => setScores(prev => ({...prev, [criterion.key]: parseInt(e.target.value)}))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                </div>
                            ))}

                            {/* Notes */}
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase mb-2 block">Interviewer Notes</label>
                                <textarea 
                                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none"
                                    placeholder="Key strengths, weaknesses, red flags..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-700 flex gap-4">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" onClick={() => handleDecision(selectedInterview, 'HIRED')}>
                                <Check size={18} /> Hire Candidate
                            </Button>
                            <Button className="flex-1 bg-slate-700 hover:bg-slate-600" onClick={() => setViewMode('PIPELINE')}>
                                Hold Decision
                            </Button>
                            <Button className="flex-1 bg-rose-600 hover:bg-rose-500" onClick={() => handleDecision(selectedInterview, 'REJECTED')}>
                                <X size={18} /> Reject
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Hiring Center</h2>
                    <p className="text-slate-400">Manage pipeline, conduct interviews, and hire talent.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase">Open Roles</p>
                        <p className="text-xl font-bold text-white">4</p>
                    </div>
                    <Button><UserPlus size={18} /> Create Requisition</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMN 1: CANDIDATE PIPELINE */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <List className="text-indigo-400"/> Candidate Pipeline
                    </h3>
                    {pendingCandidates.length === 0 ? (
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500">
                            No new applications.
                        </div>
                    ) : (
                        pendingCandidates.map(resume => (
                            <Card key={resume.id} className="hover:border-indigo-500 transition-colors group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{resume.userName}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-400">{resume.fileName}</p>
                                            {resume.status === ResumeStatus.APPROVED ? (
                                                <Badge color="green">Validated</Badge>
                                            ) : resume.status === ResumeStatus.REJECTED ? (
                                                <Badge color="red">Rejected</Badge>
                                            ) : (
                                                <Badge color="yellow">Validation Pending</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Badge color={resume.parsedData.matchScore > 80 ? 'green' : 'yellow'}>
                                        {resume.parsedData.matchScore}% AI Match
                                    </Badge>
                                </div>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {resume.parsedData.skills.slice(0, 3).map(s => (
                                        <span key={s} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">{s}</span>
                                    ))}
                                    {resume.parsedData.skills.length > 3 && <span className="text-xs text-slate-500 px-2 py-1">+ {resume.parsedData.skills.length - 3} more</span>}
                                </div>
                                
                                {resume.status === ResumeStatus.APPROVED && (
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" className="flex-1 text-xs h-8" onClick={() => setSelectedResume(resume)}>
                                            <Eye size={14}/> Preview
                                        </Button>
                                        <Button className="flex-1 text-xs h-8" onClick={() => handleSchedule(resume.userId, 'AI')}>
                                            <Bot size={14}/> AI Screen
                                        </Button>
                                        <Button className="flex-1 text-xs h-8 bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 hover:bg-indigo-600 hover:text-white" onClick={() => handleSchedule(resume.userId, 'HUMAN')}>
                                            <Mic size={14}/> Human Int.
                                        </Button>
                                    </div>
                                )}
                                {resume.status === ResumeStatus.PENDING_VALIDATION && (
                                    <div className="bg-amber-950/20 p-2 rounded flex gap-2 items-center text-xs text-amber-500">
                                        <AlertCircle size={14} />
                                        <span>Resume pending Manager Validation.</span>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>

                {/* COLUMN 2: ACTIVE INTERVIEWS */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageSquare className="text-emerald-400"/> Interviews In Progress
                    </h3>
                    {activeInterviews.length === 0 ? (
                        <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500">
                            No scheduled interviews.
                        </div>
                    ) : (
                        activeInterviews.map(interview => (
                            <Card key={interview.id} className={`border-l-4 ${interview.type === 'AI' ? 'border-l-purple-500' : 'border-l-indigo-500'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-white">{interview.candidateName}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            {interview.type === 'AI' ? <Bot size={12}/> : <User size={12}/>}
                                            <span>{interview.type === 'AI' ? 'AI Assessment' : 'Live Interview'}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            <span className={interview.status === 'IN_PROGRESS' ? 'text-emerald-400' : 'text-slate-400'}>{interview.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">Phase</p>
                                        <p className="text-sm text-white font-medium">{interview.currentPhase || 'Scheduled'}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end gap-2">
                                    {interview.status === 'DECISION_PENDING' && (
                                        <Button className="text-xs h-8" onClick={() => setSelectedInterview(interview)}>Review Result</Button>
                                    )}
                                    {interview.type === 'HUMAN' && interview.status === 'SCHEDULED' && (
                                        <Button className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500" onClick={() => startHumanInterview(interview)}>
                                            <Video size={14}/> Start Meeting
                                        </Button>
                                    )}
                                    {interview.status === 'IN_PROGRESS' && interview.type === 'AI' && (
                                         <Button variant="outline" className="text-xs h-8" onClick={() => setSelectedInterview(interview)}>Monitor</Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* RESUME PREVIEW MODAL (Quick View) */}
            {selectedResume && (
                <Modal isOpen={!!selectedResume} onClose={() => setSelectedResume(null)} title={`Resume: ${selectedResume.userName}`}>
                    <div className="space-y-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-sm text-slate-300 max-h-[400px] overflow-y-auto">
                            <p><strong>Experience:</strong> {selectedResume.parsedData.experienceYears} Years</p>
                            <p><strong>Education:</strong> {selectedResume.parsedData.education}</p>
                            <p className="mt-2"><strong>Summary:</strong></p>
                            <p className="mb-4">{selectedResume.parsedData.summary}</p>
                            <p><strong>Projects:</strong></p>
                            <ul className="list-disc pl-4 space-y-1">
                                {selectedResume.parsedData.projects?.map((p, i) => (
                                    <li key={i}>{p.name}: {p.desc}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1" onClick={() => handleSchedule(selectedResume.userId, 'HUMAN')}>Schedule Live Interview</Button>
                            <Button variant="secondary" className="flex-1" onClick={() => handleSchedule(selectedResume.userId, 'AI')}>Start AI Assessment</Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* INTERVIEW RESULT / MONITOR MODAL */}
            {selectedInterview && viewMode === 'PIPELINE' && (
                <Modal isOpen={!!selectedInterview} onClose={() => setSelectedInterview(null)} title={`Interview Log: ${selectedInterview.candidateName}`}>
                    <div className="space-y-4">
                        
                        {/* Security Report Section - Displays Violations if Proctor Mode was used */}
                        {selectedInterview.violations && selectedInterview.violations.length > 0 && (
                            <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg animate-in slide-in-from-top-2">
                                <h5 className="text-xs font-bold text-rose-400 uppercase mb-2 flex items-center gap-2">
                                    <ShieldAlert size={14} /> Proctoring Violations Detected ({selectedInterview.violations.length})
                                </h5>
                                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                                    {selectedInterview.violations.map((v, i) => (
                                        <div key={i} className="text-xs text-rose-300 flex justify-between p-1 hover:bg-rose-900/20 rounded">
                                            <span>{v.type}</span>
                                            <span className="opacity-70 font-mono">{new Date(v.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 h-64 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-2">
                                <h5 className="text-xs font-bold text-slate-500 uppercase">Transcript</h5>
                                {(!selectedInterview.violations || selectedInterview.violations.length === 0) && (
                                    <span className="text-[10px] text-emerald-500 flex items-center gap-1"><Shield size={10}/> Integrity Verified</span>
                                )}
                            </div>
                            <div className="space-y-3 text-sm">
                                {selectedInterview.transcript.map((t, idx) => (
                                    <div key={idx} className={`flex gap-2 ${t.sender === 'AI' ? '' : 'flex-row-reverse'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${t.sender === 'AI' ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                                            {t.sender === 'AI' ? 'AI' : 'C'}
                                        </div>
                                        <div className={`p-2 rounded-lg max-w-[80%] ${t.sender === 'AI' ? 'bg-slate-800 text-slate-300' : 'bg-indigo-900/30 text-white'}`}>
                                            {t.text}
                                        </div>
                                    </div>
                                ))}
                                {selectedInterview.transcript.length === 0 && <p className="text-slate-500 text-center italic">Waiting for interview start...</p>}
                            </div>
                        </div>
                        
                        {selectedInterview.status === 'DECISION_PENDING' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-4 py-2 bg-slate-800 rounded border border-slate-700">
                                    <span className="text-sm font-bold text-slate-300">AI Recommended Score</span>
                                    <span className={`text-xl font-bold ${selectedInterview.scores.overall > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {selectedInterview.scores.overall}/100
                                    </span>
                                </div>
                                <div className="flex gap-3">
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500" onClick={() => handleDecision(selectedInterview, 'HIRED')}>
                                        <Check size={18} /> Hire
                                    </Button>
                                    <Button className="flex-1 bg-rose-600 hover:bg-rose-500" onClick={() => handleDecision(selectedInterview, 'REJECTED')}>
                                        <X size={18} /> Reject
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default HiringPage;
