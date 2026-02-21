
import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useTheme } from '../context/ThemeContext';
import { Role } from '../types';
import { 
  LayoutDashboard, Users, Briefcase, Settings, LogOut, 
  TrendingUp, ShieldCheck, Activity, BrainCircuit, Bell, Calendar, Award, Shield, User, Building, ListTodo, UserPlus, Sliders, ShieldAlert, Video, FileCheck, Sun, Moon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem: React.FC<{ icon: any; label: string; to: string; active: boolean; onClick: () => void }> = ({ icon: Icon, label, to, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${active ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white'}`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const NotificationDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { notifications, markNotificationRead } = useSimulation();
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <h4 className="font-semibold text-slate-800 dark:text-white">Notifications</h4>
                <span className="text-xs text-slate-500">{notifications.filter(n => !n.read).length} new</span>
            </div>
            <div className="p-2">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No new notifications</div>
                ) : (
                    notifications.map(n => (
                        <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors ${n.read ? 'opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700' : 'bg-indigo-50 dark:bg-slate-700/50 hover:bg-indigo-100 dark:hover:bg-slate-700 border-l-2 border-indigo-500'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold uppercase ${n.type === 'error' ? 'text-rose-500 dark:text-rose-400' : n.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' : 'text-blue-500 dark:text-blue-400'}`}>
                                    {n.type}
                                </span>
                                <span className="text-[10px] text-slate-500">{new Date(n.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <h5 className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useSimulation();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const getLinks = () => {
    const common = [
       { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }
    ];

    switch (currentUser.role) {
      case Role.USER:
        return [
          ...common,
          { label: 'Tasks', to: '/tasks', icon: ListTodo },
          { label: 'Collaborator', to: '/collaborator', icon: Briefcase },
          { label: 'Interviews', to: '/interviews', icon: Video },
          { label: 'Meetings', to: '/meetings', icon: Calendar },
          { label: 'Performance', to: '/performance', icon: TrendingUp },
          { label: 'Career', to: '/career', icon: Award },
          { label: 'Company', to: '/company', icon: Building },
          { label: 'Verification', to: '/verification', icon: ShieldCheck },
        ];
      case Role.MANAGER:
        return [
          ...common,
          { label: 'Team', to: '/team', icon: Users },
          { label: 'Allocation', to: '/allocation', icon: ListTodo },
          { label: 'Resume Validation', to: '/resume-validation', icon: FileCheck },
          { label: 'Hiring Center', to: '/hiring', icon: UserPlus },
          { label: 'Interviews', to: '/interviews', icon: Video },
          { label: 'Reports', to: '/reports', icon: Activity },
          { label: 'Promotions', to: '/promotions', icon: Award },
          { label: 'Collaborator', to: '/collaborator', icon: Users },
          { label: 'Company', to: '/company', icon: Building },
        ];
      case Role.CEO:
        return [
          ...common,
          { label: 'Revenue', to: '/revenue', icon: TrendingUp },
          { label: 'Resume Validation', to: '/resume-validation', icon: FileCheck },
          { label: 'Hiring Center', to: '/hiring', icon: UserPlus },
          { label: 'Interviews', to: '/interviews', icon: Video },
          { label: 'Methodology', to: '/methodology', icon: BrainCircuit },
          { label: 'Company', to: '/company', icon: Building },
        ];
      case Role.ADMIN:
        return [
          ...common,
          { label: 'Users', to: '/users', icon: Users },
          { label: 'Companies', to: '/companies', icon: Building },
          { label: 'AI Control', to: '/ai-control', icon: Sliders },
          { label: 'Fraud Detection', to: '/fraud', icon: ShieldAlert },
          { label: 'System', to: '/admin', icon: Shield },
        ];
      default:
        return common;
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-20 transition-colors duration-200">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-500 dark:from-indigo-400 dark:to-cyan-400">
            SkillVerse
          </h1>
        </div>
        <div className="mt-4 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Ver. 1.0.5</span>
            <span className="text-emerald-600 dark:text-emerald-400">Online</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
        {getLinks().map((link) => (
          <SidebarItem 
            key={link.to} 
            {...link} 
            active={location.pathname === link.to} 
            onClick={() => navigate(link.to)}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => navigate('/profile')}>
          <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full ring-2 ring-indigo-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
          </div>
          <Settings size={16} className="text-slate-400" />
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { company, notifications } = useSimulation();
  const { theme, toggleTheme } = useTheme();
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans transition-colors duration-200">
      <Sidebar />
      <main className="ml-64 p-8">
        <header className="flex justify-between items-center mb-8 relative">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back to {company.name}</p>
            </div>
            <div className="flex gap-4 items-center">
                <button 
                    onClick={toggleTheme} 
                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors shadow-sm"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                    <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400"/>
                    <span className="text-xs font-medium">Trust: {company.trustScore}%</span>
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifs(!showNotifs)}
                        className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white relative transition-colors shadow-sm"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
                        )}
                    </button>
                    <NotificationDropdown isOpen={showNotifs} onClose={() => setShowNotifs(false)} />
                </div>
            </div>
        </header>
        {children}
      </main>
    </div>
  );
};
