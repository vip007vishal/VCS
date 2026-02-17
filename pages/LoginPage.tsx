import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Role } from '../types';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { Shield, Briefcase, User, Server, Building, BrainCircuit, Check } from 'lucide-react';
import { Badge } from '../components/UI';

const RoleCard: React.FC<{ role: Role; icon: any; desc: string; onClick: () => void }> = ({ role, icon: Icon, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center p-6 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:border-indigo-500 hover:scale-105 transition-all group w-full"
  >
    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-500/20">
      <Icon size={32} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{role}</h3>
    <p className="text-sm text-slate-400 text-center">{desc}</p>
  </button>
);

const LoginPage: React.FC = () => {
  const { login, availableCompanies } = useSimulation();
  const navigate = useNavigate();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(availableCompanies[0].id);

  const handleLogin = (role: Role) => {
    login(role, selectedCompanyId);
    navigate('/dashboard');
  };

  return (
    <AuthLayout 
        title="SkillVerse AI" 
        subtitle="The ultimate corporate simulation. Choose your enterprise and role."
        wide
    >
      <div className="space-y-8 w-full">
        {/* Company Selection Section */}
        <div>
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <Building className="text-indigo-400" size={24}/> Select Target Enterprise
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableCompanies.map(company => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${selectedCompanyId === company.id ? 'bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                >
                  {selectedCompanyId === company.id && (
                    <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <h3 className="font-bold text-white mb-1">{company.name}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge color="blue">{company.methodology}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                     <BrainCircuit size={12} />
                     <span>{company.aiModel}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{company.description}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Role Selection Section */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
             <User className="text-emerald-400" size={24}/> Select Role Simulation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoleCard 
              role={Role.USER} 
              icon={User} 
              desc="Complete tasks, collaborate, and earn promotions." 
              onClick={() => handleLogin(Role.USER)} 
            />
            <RoleCard 
              role={Role.MANAGER} 
              icon={Briefcase} 
              desc="Manage teams, assign work, and monitor burnout." 
              onClick={() => handleLogin(Role.MANAGER)} 
            />
            <RoleCard 
              role={Role.CEO} 
              icon={Server} 
              desc="Control methodology, hiring, and company revenue." 
              onClick={() => handleLogin(Role.CEO)} 
            />
            <RoleCard 
              role={Role.ADMIN} 
              icon={Shield} 
              desc="Oversee system integrity and AI behavior params." 
              onClick={() => handleLogin(Role.ADMIN)} 
            />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2 mt-8">
        <p className="text-slate-500 text-sm">
            New to the simulation? <span className="text-indigo-400 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Create an account</span>
        </p>
        <p className="text-slate-500 text-sm">
            Lost access? <span className="text-slate-400 cursor-pointer hover:underline" onClick={() => navigate('/forgot-password')}>Recover Account</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;