import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Shield, Briefcase, User, Server, Lock, HelpCircle } from 'lucide-react';
import { Badge, Button, Input } from '../components/UI';

const LoginPage: React.FC = () => {
  const { login } = useSimulation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Role>(Role.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoHelp, setShowDemoHelp] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, activeTab);
    navigate('/dashboard');
  };

  const tabs = [
      { id: Role.USER, label: 'Employee', icon: User },
      { id: Role.MANAGER, label: 'Manager', icon: Briefcase },
      { id: Role.CEO, label: 'CEO', icon: Server },
      { id: Role.ADMIN, label: 'Admin', icon: Shield },
  ];

  const fillDemo = (demoEmail: string, demoRole: Role) => {
      setEmail(demoEmail);
      setActiveTab(demoRole);
      setPassword('demo123');
  };

  return (
    <AuthLayout 
        title="SkillVerse AI" 
        subtitle="Secure Corporate Access Terminal"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
          
          {/* Demo Helper Toggle */}
          <button 
             onClick={() => setShowDemoHelp(!showDemoHelp)}
             className="absolute top-2 right-2 text-indigo-400 hover:text-white p-2"
             title="Show Demo Credentials"
          >
              <HelpCircle size={20} />
          </button>

          {/* Role Tabs */}
          <div className="flex border-b border-slate-800">
              {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors flex flex-col items-center gap-1 ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                  >
                      <tab.icon size={16} />
                      {tab.label}
                  </button>
              ))}
          </div>

          <div className="p-8">
              {showDemoHelp ? (
                  <div className="animate-in fade-in slide-in-from-top-4 space-y-4">
                      <h3 className="font-bold text-white text-center mb-4">Select a Demo Profile</h3>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Company: Nebula Stream (Agile)</div>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => fillDemo('alex@nebulastream.com', Role.USER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Employee</button>
                            <button onClick={() => fillDemo('sarah@nebulastream.com', Role.MANAGER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Manager</button>
                            <button onClick={() => fillDemo('elon@nebulastream.com', Role.CEO)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">CEO</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Company: CyberDyne (Waterfall)</div>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => fillDemo('t800@cyberdyne.com', Role.USER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Employee</button>
                            <button onClick={() => fillDemo('john@cyberdyne.com', Role.MANAGER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Manager</button>
                            <button onClick={() => fillDemo('miles@cyberdyne.com', Role.CEO)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">CEO</button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Company: Quantum Soft (Kanban)</div>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => fillDemo('shuri@quantum.com', Role.USER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Employee</button>
                            <button onClick={() => fillDemo('david@quantum.com', Role.MANAGER)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">Manager</button>
                            <button onClick={() => fillDemo('silvia@quantum.com', Role.CEO)} className="p-2 bg-slate-800 hover:bg-indigo-600 rounded text-xs text-white border border-slate-700">CEO</button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700">
                          <button onClick={() => setShowDemoHelp(false)} className="w-full text-xs text-slate-400 hover:text-white">Cancel</button>
                      </div>
                  </div>
              ) : (
                  <>
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 rounded-full bg-slate-800 mb-3 text-indigo-400">
                            {activeTab === Role.USER && <User size={32} />}
                            {activeTab === Role.MANAGER && <Briefcase size={32} />}
                            {activeTab === Role.CEO && <Server size={32} />}
                            {activeTab === Role.ADMIN && <Shield size={32} />}
                        </div>
                        <h2 className="text-xl font-bold text-white">Login as {tabs.find(t => t.id === activeTab)?.label}</h2>
                        <p className="text-sm text-slate-400">Enter your credentials to access the dashboard.</p>
                        <p className="text-xs text-indigo-400 mt-2 cursor-pointer hover:underline" onClick={() => setShowDemoHelp(true)}>
                            Want to try a demo? Click here.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Corporate Email</label>
                            <Input 
                                type="email" 
                                placeholder="name@company.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 font-bold uppercase mb-1 block">Password</label>
                            <Input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {activeTab !== Role.USER && (
                            <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded flex items-start gap-2 text-xs text-amber-400">
                                <Lock size={14} className="mt-0.5 shrink-0" />
                                <span>Restricted Area. Authorized personnel only. Access is monitored.</span>
                            </div>
                        )}

                        <Button className="w-full mt-4" type="submit">Authenticate</Button>
                    </form>
                  </>
              )}
          </div>
          
          <div className="bg-slate-950 p-4 text-center border-t border-slate-800">
              <p className="text-slate-500 text-xs">
                  New Employee? <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Initialize Profile</span>
              </p>
          </div>
      </div>

      <div className="text-center space-y-2 mt-6">
        <p className="text-slate-500 text-xs">
            Lost access? <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/forgot-password')}>Recover Account</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;