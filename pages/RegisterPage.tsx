import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card, Button, Input, Badge } from '../components/UI';
import { ArrowLeft, CheckCircle, BrainCircuit } from 'lucide-react';
import { Role } from '../types';
import { useSimulation } from '../context/SimulationContext';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, availableCompanies } = useSimulation();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState<Role>(Role.USER);
    const [companyId, setCompanyId] = useState<string>(availableCompanies[0].id);

    const handleRegister = () => {
        login(role, companyId);
        navigate('/dashboard');
    };

    return (
        <AuthLayout title="Join SkillVerse" subtitle="Initialize your corporate entity simulation.">
            <Card className="border-t-4 border-t-indigo-500">
                {/* Step 1: User Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Full Name</label>
                            <Input type="text" placeholder="e.g. Alex Dev" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Work Email</label>
                            <Input type="email" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Password</label>
                            <Input type="password" placeholder="••••••••" />
                        </div>
                        <Button className="w-full mt-4" onClick={() => setStep(2)}>Continue to Company</Button>
                    </div>
                )}

                {/* Step 2: Company Selection */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">Select Target Enterprise</h3>
                        <div className="space-y-3">
                            {availableCompanies.map(c => (
                                <div 
                                    key={c.id}
                                    onClick={() => setCompanyId(c.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${companyId === c.id ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-white">{c.name}</span>
                                        {companyId === c.id && <CheckCircle size={14} className="text-indigo-400" />}
                                    </div>
                                    <div className="flex gap-2 mb-1">
                                        <Badge color="blue">{c.methodology}</Badge>
                                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                                            <BrainCircuit size={10} /> {c.aiModel}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500">{c.description}</p>
                                </div>
                            ))}
                        </div>
                        
                        <Button className="w-full mt-4" onClick={() => setStep(3)}>Continue to Role</Button>
                        <button onClick={() => setStep(1)} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center justify-center gap-1">
                            <ArrowLeft size={12} /> Back
                        </button>
                    </div>
                )}

                {/* Step 3: Role Selection */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">Select Primary Interface</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[Role.USER, Role.MANAGER, Role.CEO, Role.ADMIN].map((r) => (
                                <div 
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${role === r ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm">{r}</span>
                                        {role === r && <CheckCircle size={14} />}
                                    </div>
                                    <p className="text-[10px] opacity-70">
                                        {r === 'USER' ? 'Execute tasks' : r === 'CEO' ? 'Manage strategy' : r === 'MANAGER' ? 'Lead teams' : 'System control'}
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <Button className="w-full mt-6" onClick={handleRegister}>Initialize Simulation</Button>
                        <button onClick={() => setStep(2)} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center justify-center gap-1">
                            <ArrowLeft size={12} /> Back
                        </button>
                    </div>
                )}
            </Card>
            
            <p className="text-center text-slate-500 text-sm mt-6">
                Already initialized? <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login here</span>
            </p>
        </AuthLayout>
    );
};

export default RegisterPage;