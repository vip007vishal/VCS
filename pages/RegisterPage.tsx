import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card, Button, Input, Badge } from '../components/UI';
import { ArrowLeft, CheckCircle, BrainCircuit, Code, Database, Cloud, Layout, Monitor } from 'lucide-react';
import { Role, FieldOfInterest } from '../types';
import { useSimulation } from '../context/SimulationContext';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { registerUser, availableCompanies } = useSimulation();
    const [step, setStep] = useState(1);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyId: availableCompanies[0].id,
        fieldOfInterest: 'Frontend' as FieldOfInterest
    });

    const handleRegister = () => {
        registerUser(formData.name, formData.email, formData.fieldOfInterest, formData.companyId);
        navigate('/dashboard');
    };

    const fields: { id: FieldOfInterest; icon: any; label: string }[] = [
        { id: 'Frontend', icon: Monitor, label: 'Frontend' },
        { id: 'Backend', icon: Code, label: 'Backend' },
        { id: 'Figma Design', icon: Layout, label: 'Design' },
        { id: 'Tester', icon: CheckCircle, label: 'Tester' },
        { id: 'Cloud', icon: Cloud, label: 'Cloud' },
        { id: 'Database', icon: Database, label: 'Database' }
    ];

    return (
        <AuthLayout title="Join SkillVerse" subtitle="Initialize your corporate entity simulation.">
            <Card className="border-t-4 border-t-indigo-500">
                {/* Step 1: User Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Full Name</label>
                            <Input 
                                type="text" 
                                placeholder="e.g. Alex Dev" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Work Email</label>
                            <Input 
                                type="email" 
                                placeholder="name@company.com" 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Password</label>
                            <Input 
                                type="password" 
                                placeholder="••••••••" 
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <Button className="w-full mt-4" onClick={() => setStep(2)} disabled={!formData.name || !formData.email || !formData.password}>
                            Continue to Specialization
                        </Button>
                        <div className="text-center mt-4">
                             <span className="text-xs text-slate-500">Already initialized? </span>
                             <span className="text-xs text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login here</span>
                        </div>
                    </div>
                )}

                {/* Step 2: Field of Interest */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">Select Primary Specialization</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {fields.map((f) => (
                                <div 
                                    key={f.id}
                                    onClick={() => setFormData({...formData, fieldOfInterest: f.id})}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.fieldOfInterest === f.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                                >
                                    <div className="flex flex-col items-center gap-2 py-2">
                                        <f.icon size={24} />
                                        <span className="font-bold text-xs">{f.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Button className="w-full mt-6" onClick={() => setStep(3)}>Continue to Company</Button>
                        <button onClick={() => setStep(1)} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center justify-center gap-1">
                            <ArrowLeft size={12} /> Back
                        </button>
                    </div>
                )}

                {/* Step 3: Company Selection */}
                {step === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-2">Select Target Enterprise</h3>
                        <div className="space-y-3">
                            {availableCompanies.map(c => (
                                <div 
                                    key={c.id}
                                    onClick={() => setFormData({...formData, companyId: c.id})}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${formData.companyId === c.id ? 'bg-indigo-900/30 border-indigo-500' : 'bg-slate-900 border-slate-700 hover:border-slate-500'}`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-white">{c.name}</span>
                                        {formData.companyId === c.id && <CheckCircle size={14} className="text-indigo-400" />}
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
                        
                        <Button className="w-full mt-4" onClick={handleRegister}>Start Simulation</Button>
                        <button onClick={() => setStep(2)} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-2 flex items-center justify-center gap-1">
                            <ArrowLeft size={12} /> Back
                        </button>
                    </div>
                )}
            </Card>
        </AuthLayout>
    );
};

export default RegisterPage;