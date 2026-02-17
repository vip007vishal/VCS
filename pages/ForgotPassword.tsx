import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card, Button, Input } from '../components/UI';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const { addNotification } = useSimulation();
    const [submitted, setSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            addNotification('Reset Link Sent', `Recovery instructions sent to ${email}`, 'success');
        }
    };

    return (
        <AuthLayout title="Account Recovery" subtitle="Enter your corporate email to reset credentials.">
            <Card className="border-t-4 border-t-indigo-500">
                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Work Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <Input 
                                    type="email" 
                                    placeholder="name@company.com" 
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full" type="submit">Send Reset Link</Button>
                    </form>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                            <CheckCircle size={24} />
                        </div>
                        <h3 className="text-white font-bold mb-2">Check your email</h3>
                        <p className="text-slate-400 text-sm mb-4">We've sent a temporary login link to <span className="text-indigo-400">{email}</span></p>
                        <Button variant="secondary" className="w-full" onClick={() => navigate('/login')}>Return to Login</Button>
                    </div>
                )}
                
                {!submitted && (
                    <button onClick={() => navigate('/login')} className="w-full text-center text-xs text-slate-500 hover:text-slate-300 mt-4 flex items-center justify-center gap-1">
                        <ArrowLeft size={12} /> Back to Login
                    </button>
                )}
            </Card>
        </AuthLayout>
    );
};

export default ForgotPassword;
