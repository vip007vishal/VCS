
import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge, Modal } from '../components/UI';
import { TaskStatus, Role, Task } from '../types';
import { Filter, Search, ArrowRight, User, Bot, PlusCircle, Briefcase, Lock, Send, Cpu, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TasksPage: React.FC = () => {
    const navigate = useNavigate();
    const { tasks, moveTask, assignTask, submitTask, currentUser, generateTask, addNotification } = useSimulation();
    const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewScope, setViewScope] = useState<'MINE' | 'ALL'>('MINE');
    const [managerMode, setManagerMode] = useState<'HUMAN' | 'AI'>('HUMAN');
    const [isRequesting, setIsRequesting] = useState(false);
    
    // Justification Modal State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showJustification, setShowJustification] = useState(false);
    const [justificationText, setJustificationText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canViewAll = [Role.MANAGER, Role.CEO, Role.ADMIN].includes(currentUser?.role || Role.USER);

    const filteredTasks = tasks.filter(t => {
        const matchesStatus = filter === 'ALL' || t.status === filter;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesScope = viewScope === 'ALL' || t.assigneeId === currentUser?.id;
        return matchesStatus && matchesSearch && matchesScope;
    });

    const handleRequestTask = () => {
        setIsRequesting(true);
        if (managerMode === 'AI') {
            setTimeout(() => {
                generateTask('AI');
                setIsRequesting(false);
                addNotification('Atlas AI', 'Task generated and optimized for your skillset.', 'success');
            }, 800);
        } else {
            setTimeout(() => {
                generateTask('HUMAN');
                setIsRequesting(false);
                addNotification('Manager', 'I have added a ticket to the backlog. Please review.', 'info');
            }, 2000);
        }
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleClaimTask = () => {
        if (!selectedTask || !currentUser) return;
        assignTask(selectedTask.id, currentUser.id);
        setSelectedTask(prev => prev ? ({ ...prev, assigneeId: currentUser.id }) : null);
    };

    const handleOpenEditor = () => {
        if (!selectedTask) return;
        moveTask(selectedTask.id, TaskStatus.IN_PROGRESS);
        navigate(`/dashboard/editor/${selectedTask.id}`);
    };

    // For Quick Submit (Manual tasks without code)
    const handleQuickSubmit = async () => {
        if (!selectedTask) return;
        if (selectedTask.managerType === 'AI') {
            setShowJustification(true);
        } else {
            await submitTask(selectedTask.id, "Quick update from dashboard", "");
            setSelectedTask(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Manager Toggle */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${managerMode === 'AI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                        {managerMode === 'AI' ? <Bot size={24} /> : <Briefcase size={24} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Current Manager</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {managerMode === 'AI' ? 'Atlas (AI Supervisor)' : 'Sarah (Human Lead)'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 uppercase font-bold hidden md:inline">Switch Manager:</span>
                    <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-lg flex border border-slate-200 dark:border-slate-700">
                        <button 
                            onClick={() => setManagerMode('HUMAN')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${managerMode === 'HUMAN' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <User size={14} /> Human
                        </button>
                        <button 
                            onClick={() => setManagerMode('AI')}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 ${managerMode === 'AI' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <Bot size={14} /> AI Agent
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {viewScope === 'MINE' ? 'My Assignments' : 'Team Workload'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400">Track progress and deliverables.</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap justify-end">
                    <Button 
                        onClick={handleRequestTask} 
                        disabled={isRequesting}
                        className={`gap-2 ${managerMode === 'AI' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
                    >
                        {isRequesting ? (
                            <span className="animate-pulse">Requesting...</span>
                        ) : (
                            <>
                                <PlusCircle size={16} /> 
                                Request Task from {managerMode === 'AI' ? 'AI' : 'Manager'}
                            </>
                        )}
                    </Button>
                    
                    {canViewAll && (
                         <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
                             <button 
                                onClick={() => setViewScope('MINE')}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${viewScope === 'MINE' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                             >
                                 My Tasks
                             </button>
                             <button 
                                onClick={() => setViewScope('ALL')}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${viewScope === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-500 dark:text-slate-400'}`}
                             >
                                 All Tasks
                             </button>
                         </div>
                    )}
                    <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                         <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-8 pr-4 py-1.5 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none w-32 md:w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['ALL', TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === status ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {status === 'ALL' ? 'All Status' : status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">Task Title</th>
                            {viewScope === 'ALL' && <th className="p-4">Assignee</th>}
                            <th className="p-4">Status</th>
                            <th className="p-4">Source</th>
                            <th className="p-4">Difficulty</th>
                            <th className="p-4 text-right">View</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={viewScope === 'ALL' ? 6 : 5} className="p-8 text-center text-slate-500">
                                    No tasks found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map(task => (
                                <tr key={task.id} onClick={() => handleTaskClick(task)} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.title}</div>
                                        <div className="text-xs text-slate-500 font-mono">{task.id}</div>
                                    </td>
                                    {viewScope === 'ALL' && (
                                        <td className="p-4">
                                            {task.assigneeId ? (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${task.assigneeId.includes('AI') ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-white'}`}>
                                                        {task.assigneeId.includes('AI') ? 'AI' : 'U'}
                                                    </div>
                                                    <span className="text-xs text-slate-600 dark:text-slate-300">
                                                        {task.assigneeId === currentUser?.id ? 'You' : task.assigneeId}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                    )}
                                    <td className="p-4">
                                        <Badge color={
                                            task.status === TaskStatus.DONE ? 'green' :
                                            task.status === TaskStatus.IN_PROGRESS ? 'blue' :
                                            task.status === TaskStatus.FAILED ? 'red' : 'yellow'
                                        }>
                                            {task.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {task.managerType === 'AI' ? (
                                                <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                                            ) : (
                                                <User size={14} className="text-slate-400" />
                                            )}
                                            <span className="text-xs text-slate-600 dark:text-slate-300">
                                                {task.managerType === 'AI' ? 'Atlas AI' : 'Human Mgr'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-1.5 h-4 rounded-sm ${i < (task.difficulty / 2) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <ArrowRight size={16} className="ml-auto text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>

            {/* TASK PREVIEW MODAL */}
            {selectedTask && (
                <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Overview">
                    <div className="flex flex-col gap-6">
                        {/* Task Brief */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <Badge color={selectedTask.difficulty > 7 ? 'red' : 'blue'}>Diff: {selectedTask.difficulty}</Badge>
                                    <span className="text-xs font-mono text-slate-500">{selectedTask.id}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">{selectedTask.title}</h4>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                                    {selectedTask.description || "System: Execute standardized protocol for this ticket. Ensure all unit tests pass before submission."}
                                </div>
                                {selectedTask.aiFeedback && (
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-200 dark:border-indigo-500/50 mb-4 animate-in fade-in">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Bot size={14} className="text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">AI Manager Feedback</span>
                                        </div>
                                        <p className="text-xs text-indigo-800 dark:text-slate-300 italic">"{selectedTask.aiFeedback}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                                    <span>Assignee</span>
                                    <span className="text-slate-900 dark:text-white">{selectedTask.assigneeId === currentUser?.id ? 'You' : selectedTask.assigneeId || 'Unassigned'}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-1">
                                    <span>Manager</span>
                                    <span className="text-slate-900 dark:text-white">{selectedTask.managerType === 'AI' ? 'Atlas (AI)' : 'Sarah (Human)'}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>Deadline</span>
                                    <span className="text-slate-900 dark:text-white">Sprint End (2d)</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 space-y-3 border-t border-slate-200 dark:border-slate-700">
                                {!selectedTask.assigneeId ? (
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/20" onClick={handleClaimTask}>
                                        <Briefcase size={16} /> Claim Ticket
                                    </Button>
                                ) : selectedTask.assigneeId === currentUser?.id ? (
                                    selectedTask.status === TaskStatus.BACKLOG ? (
                                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 animate-pulse" onClick={handleOpenEditor}>
                                            <Cpu size={16} /> Initialize Environment
                                        </Button>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button className="w-full bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600" onClick={handleOpenEditor}>
                                                <ExternalLink size={16} /> Open Editor
                                            </Button>
                                            {selectedTask.status !== TaskStatus.DONE && (
                                                <Button className="w-full bg-indigo-600" onClick={handleQuickSubmit}>
                                                    <Send size={16} /> Quick Submit
                                                </Button>
                                            )}
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                                        <Lock size={14} /> Locked by {selectedTask.assigneeId}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default TasksPage;
