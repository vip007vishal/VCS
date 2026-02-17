import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge, Modal } from '../components/UI';
import { FileCheck, Check, X, Eye, FileText, AlertTriangle } from 'lucide-react';
import { ResumeStatus, Resume } from '../types';

const ResumeValidationPage: React.FC = () => {
    const { resumes, validateResume } = useSimulation();
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Filter for Pending Resumes
    const pendingResumes = resumes.filter(r => r.status === ResumeStatus.PENDING_VALIDATION || r.status === ResumeStatus.CHANGES_REQUESTED);
    const processedResumes = resumes.filter(r => r.status === ResumeStatus.APPROVED || r.status === ResumeStatus.REJECTED);

    const handleApprove = (id: string) => {
        validateResume(id, ResumeStatus.APPROVED);
        setSelectedResume(null);
    };

    const handleReject = () => {
        if (selectedResume && rejectReason) {
            validateResume(selectedResume.id, ResumeStatus.REJECTED, rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            setSelectedResume(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileCheck className="text-indigo-400" /> Resume Validation Center
                    </h2>
                    <p className="text-slate-400">Review and validate candidate resumes before interview scheduling.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-180px)]">
                {/* List Column */}
                <div className="flex flex-col gap-6 overflow-hidden">
                    <Card title={`Pending Review (${pendingResumes.length})`} className="flex-1 overflow-y-auto">
                        <div className="space-y-3">
                            {pendingResumes.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No resumes pending validation.</p>
                            ) : (
                                pendingResumes.map(r => (
                                    <div 
                                        key={r.id} 
                                        onClick={() => setSelectedResume(r)}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedResume?.id === r.id ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-900/50 border-slate-800 hover:border-slate-600'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-white">{r.userName}</h4>
                                            <Badge color="yellow">Pending</Badge>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>{r.fileName}</span>
                                            <span>AI Match: {r.parsedData.matchScore}%</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card title="Recently Processed" className="h-64 overflow-y-auto">
                        <div className="space-y-2">
                            {processedResumes.map(r => (
                                <div key={r.id} className="flex justify-between items-center p-2 border-b border-slate-800 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-slate-300">{r.userName}</p>
                                        <p className="text-xs text-slate-500">{new Date(r.uploadDate).toLocaleDateString()}</p>
                                    </div>
                                    <Badge color={r.status === ResumeStatus.APPROVED ? 'green' : 'red'}>
                                        {r.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Detail Column */}
                <Card className="flex flex-col h-full">
                    {selectedResume ? (
                        <>
                            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{selectedResume.userName}</h3>
                                    <p className="text-xs text-slate-400">ID: {selectedResume.userId}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-xs" onClick={() => handleApprove(selectedResume.id)}>
                                        <Check size={14} /> Approve
                                    </Button>
                                    <Button className="bg-rose-600 hover:bg-rose-500 text-xs" onClick={() => setShowRejectModal(true)}>
                                        <X size={14} /> Reject
                                    </Button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                <div className="p-4 bg-slate-900 rounded border border-slate-800">
                                    <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">AI Summary Analysis</h4>
                                    <p className="text-sm text-slate-300">{selectedResume.parsedData.summary}</p>
                                    <div className="mt-3 flex gap-4">
                                        <div>
                                            <p className="text-xs text-slate-500">Exp. Years</p>
                                            <p className="text-white font-bold">{selectedResume.parsedData.experienceYears}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">Education</p>
                                            <p className="text-white font-bold">{selectedResume.parsedData.education}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Skills Detected</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedResume.parsedData.skills.map(s => (
                                            <Badge key={s} color="purple">{s}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs uppercase font-bold text-slate-500 mb-2">Projects</h4>
                                    <div className="space-y-2">
                                        {selectedResume.parsedData.projects?.map((p, i) => (
                                            <div key={i} className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                                <p className="font-bold text-sm text-indigo-300">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedResume.parsedData.matchScore < 50 && (
                                    <div className="p-3 bg-rose-950/20 border border-rose-900/50 rounded flex gap-2 items-center text-rose-400">
                                        <AlertTriangle size={16} />
                                        <span className="text-sm">Low AI Match Score. Review carefully.</span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p>Select a resume to review details.</p>
                        </div>
                    )}
                </Card>
            </div>

            <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Candidate">
                <div className="space-y-4">
                    <p className="text-slate-300 text-sm">Please provide a reason for rejection. This will be sent to the candidate.</p>
                    <textarea 
                        className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm"
                        placeholder="e.g. Insufficient experience in React..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                    <Button className="w-full bg-rose-600 hover:bg-rose-500" onClick={handleReject}>Confirm Rejection</Button>
                </div>
            </Modal>
        </div>
    );
};

export default ResumeValidationPage;