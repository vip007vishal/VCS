import React, { useState } from 'react';
import { Card, Button, Badge, Modal } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';
import { UserPlus, Trash2, Zap, Shield } from 'lucide-react';
import { Employee, TaskStatus } from '../types';

const TeamsPage: React.FC = () => {
    const { addNotification, employees, hireEmployee, fireEmployee, tasks } = useSimulation();
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    
    const handleRemove = (id: string) => {
        fireEmployee(id);
        addNotification('Team Update', 'Member removed from team roster.', 'warning');
    };

    const handleHireAI = () => {
        const newAI: Employee = {
            id: `ai_${Date.now()}`,
            name: `AI Unit-${Math.floor(Math.random() * 900) + 100}`,
            role: 'AI Specialist',
            status: 'Processing',
            reliability: 90,
            capacity: 15,
            isAi: true,
            risk: 'Low'
        };
        hireEmployee(newAI);
        setIsHireModalOpen(false);
        addNotification('New Hire', 'AI Unit initialized and assigned to team.', 'success');
    };

    const getActiveTaskCount = (empId: string) => {
        return tasks.filter(t => t.assigneeId === empId && t.status === TaskStatus.IN_PROGRESS).length;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Team Management</h2>
                <Button onClick={() => setIsHireModalOpen(true)}><UserPlus size={18} /> Add AI Member</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(member => (
                    <Card key={member.id} className="relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${member.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                    {member.isAi ? 'AI' : member.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{member.name}</h4>
                                    <p className="text-xs text-slate-400">{member.role}</p>
                                </div>
                            </div>
                            <Badge color={member.status === 'Online' || member.status === 'Processing' ? 'green' : 'yellow'}>
                                {member.status}
                            </Badge>
                        </div>

                        <div className="space-y-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Shield size={14}/> Reliability</span>
                                <span className={member.reliability > 90 ? 'text-emerald-400' : 'text-amber-400'}>{member.reliability}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 flex items-center gap-2"><Zap size={14}/> Active Tasks</span>
                                <span className="text-white">{getActiveTaskCount(member.id)}</span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="outline" className="flex-1 text-xs h-8">View Details</Button>
                             {/* Prevent firing the main user/admin placeholder for stability */}
                             {member.id !== 'u_curr' && (
                                <Button variant="danger" className="text-xs h-8 w-8 p-0" onClick={() => handleRemove(member.id)}><Trash2 size={14} /></Button>
                             )}
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} title="Provision AI Resource">
                <div className="space-y-4">
                    <p className="text-slate-300">Select an AI model to join your team. Cost will be deducted from department budget.</p>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="p-3 border border-indigo-500 bg-indigo-500/10 rounded cursor-pointer">
                            <h5 className="font-bold text-white">DevBot v4 (Standard)</h5>
                            <p className="text-xs text-slate-400">Balanced performance. Good for CRUD tasks.</p>
                        </div>
                        <div className="p-3 border border-slate-700 hover:border-indigo-500 bg-slate-800 rounded cursor-pointer opacity-50">
                            <h5 className="font-bold text-white">ArchitectZero (Premium)</h5>
                            <p className="text-xs text-slate-400">High level system design. Requires CEO approval.</p>
                        </div>
                    </div>
                    <Button className="w-full mt-4" onClick={handleHireAI}>Confirm Provisioning</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TeamsPage;