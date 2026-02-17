import React from 'react';
import { LucideIcon, X } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: LucideIcon }> = ({ children, className = '', title, icon: Icon }) => (
  <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm ${className}`}>
    {title && (
      <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-2">
        {Icon && <Icon size={20} className="text-indigo-400" />}
        <h3 className="font-semibold text-slate-100">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'outline' }> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border border-slate-600 hover:bg-slate-800 text-slate-300"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-indigo-500 outline-none placeholder:text-slate-600 transition-colors ${className}`}
    {...props} 
  />
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'yellow' | 'red' | 'blue' | 'purple' }> = ({ children, color = 'blue' }) => {
  const colors = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    yellow: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

export const StatBox: React.FC<{ label: string; value: string | number; trend?: string; trendUp?: boolean }> = ({ label, value, trend, trendUp }) => (
  <div className="bg-slate-700/50 p-4 rounded-lg">
    <p className="text-slate-400 text-sm">{label}</p>
    <div className="flex items-end justify-between mt-1">
      <h4 className="text-2xl font-bold text-white">{value}</h4>
      {trend && (
        <span className={`text-xs ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      )}
    </div>
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div>{children}</div>
      </div>
    </div>
  );
};