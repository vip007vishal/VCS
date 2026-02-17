import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { TaskStatus } from '../types';
import { CheckCircle, Clock, AlertCircle, Filter, Search, ArrowRight } from 'lucide-react';

const TasksPage: React.FC = () => {
    const { tasks, moveTask } = useSimulation();
    const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTasks = tasks.filter(t => {
        const matchesStatus = filter === 'ALL' || t.status === filter;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">My Tasks</h2>
                    <p className="text-slate-400">Manage your assigned deliverables and track progress.</p>
                </div>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                     <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="pl-8 pr-4 py-1.5 bg-transparent text-sm text-white focus:outline-none w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {(['ALL', TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE] as const).map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === status ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {status === 'ALL' ? 'All Tasks' : status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">Task Title</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Difficulty</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No tasks found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{task.title}</div>
                                        <div className="text-xs text-slate-500 font-mono">{task.id}</div>
                                    </td>
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
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className={`w-1.5 h-4 rounded-sm ${i < (task.difficulty / 2) ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded ${task.isAiGenerated ? 'bg-purple-900/30 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
                                            {task.isAiGenerated ? 'AI Generated' : 'Manual'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {task.status !== TaskStatus.DONE && (
                                            <Button 
                                                className="text-xs py-1 h-8 ml-auto" 
                                                onClick={() => {
                                                    const nextStatus = 
                                                        task.status === TaskStatus.BACKLOG ? TaskStatus.IN_PROGRESS :
                                                        task.status === TaskStatus.IN_PROGRESS ? TaskStatus.REVIEW :
                                                        TaskStatus.DONE;
                                                    moveTask(task.id, nextStatus);
                                                }}
                                            >
                                                Advance <ArrowRight size={14} />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default TasksPage;