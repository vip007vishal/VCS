import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { Task, TaskStatus } from '../types';
import { User, ArrowRight, BrainCircuit, AlertTriangle } from 'lucide-react';

const TaskAllocationPage: React.FC = () => {
    const { tasks, moveTask, addNotification } = useSimulation();
    const [backlog] = useState<Task[]>(tasks.filter(t => t.status === TaskStatus.BACKLOG));

    // Mock Team Load
    const team = [
        { id: 'u1', name: 'Alex Dev', role: 'Senior Dev', currentLoad: 3, capacity: 5 },
        { id: 'u2', name: 'Mike T.', role: 'Junior Dev', currentLoad: 1, capacity: 3 },
        { id: 'AI', name: 'AI Copilot', role: 'Automated Agent', currentLoad: 12, capacity: 20, isAi: true },
    ];

    const handleAssign = (taskId: string, userId: string) => {
        // In a real app this would update state, for now we simulate visual feedback
        addNotification('Task Assigned', `Task ${taskId} assigned to ${userId}`, 'success');
        moveTask(taskId, TaskStatus.IN_PROGRESS); // Simulating moving to in-progress for the user
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Task Allocation</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                {/* Backlog Column */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-slate-300 mb-4 flex justify-between">
                        Unassigned Backlog 
                        <Badge>{backlog.length}</Badge>
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {backlog.map(task => (
                            <div key={task.id} className="p-3 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-indigo-500 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-slate-500">{task.id}</span>
                                    <Badge color={task.difficulty > 7 ? 'red' : 'blue'}>Diff: {task.difficulty}</Badge>
                                </div>
                                <p className="text-sm font-medium text-white mb-3">{task.title}</p>
                                
                                <div className="hidden group-hover:block space-y-2 pt-2 border-t border-slate-800 animate-in fade-in slide-in-from-top-1">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold">Quick Assign:</p>
                                    <div className="flex gap-2">
                                        {team.map(member => (
                                            <button 
                                                key={member.id}
                                                onClick={() => handleAssign(task.id, member.id)}
                                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${member.isAi ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-700 border-slate-500 text-slate-300'} hover:scale-110 transition-transform`}
                                                title={`Assign to ${member.name}`}
                                            >
                                                {member.isAi ? 'AI' : member.name.charAt(0)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Allocation Column */}
                <div className="lg:col-span-2 space-y-6 overflow-y-auto">
                    {team.map(member => (
                        <Card key={member.id} className="border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${member.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                        {member.isAi ? <BrainCircuit size={24}/> : member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">{member.name}</h4>
                                        <p className="text-sm text-slate-400">{member.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Capacity</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-slate-900 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${member.currentLoad > member.capacity ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                                style={{ width: `${Math.min(100, (member.currentLoad / member.capacity) * 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-bold ${member.currentLoad > member.capacity ? 'text-rose-400' : 'text-slate-300'}`}>
                                            {member.currentLoad}/{member.capacity}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {member.currentLoad > member.capacity && (
                                <div className="flex items-center gap-2 p-2 bg-rose-950/20 border border-rose-900/50 rounded text-rose-400 text-sm mb-4">
                                    <AlertTriangle size={16} />
                                    <span>Overloaded! High risk of burnout or errors.</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-xs text-slate-500 uppercase">Active Tasks</p>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {[...Array(member.currentLoad)].map((_, i) => (
                                        <div key={i} className="min-w-[150px] p-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-300 truncate">
                                            Task #{100 + i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskAllocationPage;