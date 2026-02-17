import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  wide?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, wide = false }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className={`w-full relative z-10 ${wide ? 'max-w-5xl' : 'max-w-md'}`}>
        <div className="text-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50 transition-transform hover:scale-105">
            <BrainCircuit size={40} className="text-white" />
          </div>
          {title && <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>}
          {subtitle && <p className="text-slate-400">{subtitle}</p>}
        </div>

        {children}

        <div className="mt-8 text-center text-slate-600 text-xs">
            &copy; 2024 SkillVerse Simulation Engine. All rights reserved.
        </div>
      </div>
    </div>
  );
};
