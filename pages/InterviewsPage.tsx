
import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Video, CheckCircle, Upload } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { ResumeStatus, Role } from '../types';
import { useNavigate } from 'react-router-dom';

const ResumeUploader: React.FC = () => {
    const { uploadResume, currentUser, resumes } = useSimulation();
    const [isUploading, setIsUploading] = useState(false);

    const myResume = resumes.find(r => r.userId === currentUser?.id);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const file = e.target.files[0];
            try {
                await uploadResume(file);
            } catch (e) {
                console.error(e);
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (myResume) {
        return (
            <div className={`p-6 border rounded-xl flex items-center justify-between ${myResume.status === ResumeStatus.APPROVED ? 'bg-slate-50 dark:bg-slate-900/50 border-emerald-500/30' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${myResume.status === ResumeStatus.APPROVED ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Resume Status</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{myResume.fileName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {myResume.status === ResumeStatus.PENDING_VALIDATION && (
                        <Badge color="yellow">Pending Validation</Badge>
                    )}
                    {myResume.status === ResumeStatus.APPROVED && (
                        <Badge color="green">Ready for Interview</Badge>
                    )}
                    {myResume.status === ResumeStatus.REJECTED && (
                        <Badge color="red">Rejected</Badge>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-900/20 text-center">
            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500 dark:text-indigo-400">
                <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Upload Your Resume</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">To start the interview process, our AI needs to analyze your skills and experience. PDF supported.</p>
            
            <div className="relative inline-block">
                <Button disabled={isUploading}>
                    {isUploading ? 'Analyzing...' : 'Select File'}
                </Button>
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
            </div>
        </div>
    );
};

const InterviewsPage: React.FC = () => {
    const { currentUser, interviews } = useSimulation();
    const [proctorMode, setProctorMode] = useState(true);
    const navigate = useNavigate();

    const myInterviews = interviews.filter(i => i.candidateId === currentUser?.id || i.interviewerId === currentUser?.id);

    const handleJoinInterview = (interviewId: string) => {
        // Navigate to the separate active interview page, passing proctor state
        navigate(`/interview/${interviewId}`, { state: { proctorMode } });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Center</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your application process and attend interviews.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <span className={`text-xs font-bold uppercase ${proctorMode ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'}`}>
                        Proctor Mode {proctorMode ? 'ON' : 'OFF'}
                    </span>
                    <button 
                        onClick={() => setProctorMode(!proctorMode)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${proctorMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${proctorMode ? 'translate-x-5' : ''}`}></div>
                    </button>
                </div>
            </div>

            {currentUser?.role === Role.USER && <ResumeUploader />}

            <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4">Scheduled Sessions</h3>
                {myInterviews.length === 0 ? (
                    <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-slate-500">
                        No interviews scheduled.
                    </div>
                ) : (
                    myInterviews.map(interview => (
                        <Card key={interview.id} className="hover:border-indigo-500 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${interview.status === 'COMPLETED' ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'}`}>
                                        <Video size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{interview.type === 'AI' ? 'AI Assessment' : 'Live Interview'}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {interview.candidateName} • Status: <span className={interview.status === 'IN_PROGRESS' ? 'text-emerald-600 dark:text-emerald-400' : ''}>{interview.status.replace('_', ' ')}</span>
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    {interview.status === 'SCHEDULED' || interview.status === 'IN_PROGRESS' || interview.status === 'DECISION_PENDING' ? (
                                        <Button onClick={() => handleJoinInterview(interview.id)}>
                                            {interview.status === 'IN_PROGRESS' ? 'Rejoin Room' : 'Join Room'}
                                        </Button>
                                    ) : (
                                        <Badge color="gray">Closed</Badge>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default InterviewsPage;
