import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge, Modal } from '../components/UI';
import { Shield, Upload, CheckCircle, Clock, AlertCircle, FileText, Lock } from 'lucide-react';

const VerificationPage: React.FC = () => {
    const { currentUser, addNotification } = useSimulation();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [verificationStatus, setVerificationStatus] = useState<'Pending' | 'Approved' | 'Rejected' | 'None'>('None');

    const handleUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setVerificationStatus('Pending');
                    addNotification('Documents Submitted', 'Your verification documents are under review.', 'info');
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const levels = [
        { level: 1, label: 'Email Verified', status: 'Approved', benefit: 'Basic Access' },
        { level: 2, label: 'Phone Verified', status: 'Approved', benefit: 'Create Tasks' },
        { level: 3, label: 'Identity Verified', status: verificationStatus === 'None' ? 'Pending Action' : verificationStatus, benefit: 'Senior Roles' },
        { level: 4, label: 'Professional Cert', status: 'Locked', benefit: 'Manager Access' },
        { level: 5, label: 'Founder Clearance', status: 'Locked', benefit: 'CEO Role Unlock' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-xl text-white">
                    <Shield size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Identity Verification</h2>
                    <p className="text-slate-400">Increase your trust score and unlock higher roles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Current Status" className="lg:col-span-2">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center relative">
                                    <span className="text-2xl font-bold text-white">{currentUser?.verificationLevel}</span>
                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-slate-900">
                                        <CheckCircle size={12} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Level {currentUser?.verificationLevel} Verified</h3>
                                    <p className="text-sm text-slate-400">Next Review: 30 Days</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-slate-400 mb-1">Trust Score Bonus</p>
                                <span className="text-xl font-bold text-emerald-400">+15%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-bold text-white">Verification Steps</h4>
                            {levels.map((lvl) => (
                                <div key={lvl.level} className={`flex items-center justify-between p-3 rounded-lg border ${lvl.level <= (currentUser?.verificationLevel || 0) ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${lvl.level <= (currentUser?.verificationLevel || 0) ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                            {lvl.level}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${lvl.level <= (currentUser?.verificationLevel || 0) ? 'text-white' : 'text-slate-400'}`}>{lvl.label}</p>
                                            <p className="text-xs text-slate-500">{lvl.benefit}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {lvl.level <= (currentUser?.verificationLevel || 0) ? (
                                            <Badge color="green">Verified</Badge>
                                        ) : lvl.level === (currentUser?.verificationLevel || 0) + 1 ? (
                                             verificationStatus === 'Pending' ? <Badge color="yellow">In Review</Badge> : <Button className="text-xs h-8" onClick={() => {}}>Start</Button>
                                        ) : (
                                            <Lock size={16} className="text-slate-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Upload Documents">
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-900/30">
                                <Upload size={32} className="mx-auto text-slate-500 mb-2" />
                                <p className="text-sm text-slate-300 font-medium">Drag & drop ID proof</p>
                                <p className="text-xs text-slate-500">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                            
                            {isUploading && (
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full transition-all duration-200" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            <Button className="w-full" onClick={handleUpload} disabled={isUploading || verificationStatus === 'Pending'}>
                                {verificationStatus === 'Pending' ? 'Under Review' : 'Submit Documents'}
                            </Button>
                        </div>
                    </Card>

                    <Card title="Fraud Prevention">
                        <div className="flex gap-3 items-start p-3 bg-amber-950/20 border border-amber-900/50 rounded-lg">
                            <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
                            <p className="text-xs text-slate-400">
                                Our AI Fraud Detection System analyzes document metadata. Falsified documents will result in an immediate permanent ban.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;