
import React from 'react';
import { BrainCircuit, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  wide?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, wide = false }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-200">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <button 
        onClick={toggleTheme} 
        className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors z-50"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={`w-full relative z-10 ${wide ? 'max-w-5xl' : 'max-w-md'}`}>
        <div className="text-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50 transition-transform hover:scale-105">
            <BrainCircuit size={40} className="text-white" />
          </div>
          {title && <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>}
          {subtitle && <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>

        {children}

        <div className="mt-8 text-center text-slate-500 dark:text-slate-600 text-xs">
            &copy; 2024 SkillVerse Simulation Engine. All rights reserved.
        </div>
      </div>
    </div>
  );
};
