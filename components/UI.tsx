
import React from 'react';
import { LucideIcon, X } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: LucideIcon }> = ({ children, className = '', title, icon: Icon }) => (
  <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm transition-colors duration-200 ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
        {Icon && <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />}
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50",
    secondary: "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors ${className}`}
    {...props} 
  />
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray'; className?: string }> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    green: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    yellow: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    red: "bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
    blue: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    purple: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    gray: "bg-slate-100 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const StatBox: React.FC<{ label: string; value: string | number; trend?: string; trendUp?: boolean }> = ({ label, value, trend, trendUp }) => (
  <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-200">
    <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
    <div className="flex items-end justify-between mt-1">
      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h4>
      {trend && (
        <span className={`text-xs ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'md' | 'lg' | 'xl' | 'full' }> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-6xl h-[90vh]',
    full: 'w-screen h-screen rounded-none border-0'
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm ${size === 'full' ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl w-full flex flex-col shadow-2xl relative transition-all duration-300 ${sizeClasses[size]}`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
        </div>
        <div className="flex-1 overflow-auto p-6 relative flex flex-col text-slate-700 dark:text-slate-300">
            {children}
        </div>
      </div>
    </div>
  );
};
