import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { ShieldAlert, UserX, AlertOctagon, Search } from 'lucide-react';

const FraudPanel: React.FC = () => {
    const { fraudRisk, currentUser } = useSimulation();

    const flaggedUsers = [
        { id: 'u442', name: 'Bot_FARM_01', risk: 98, reason: 'Task Farming (120/hr)', status: 'Banned' },
        { id: 'u102', name: 'John Doe', risk: 45, reason: 'Rapid IP Change', status: 'Monitoring' },
        { id: currentUser?.id, name: currentUser?.name, risk: fraudRisk.score, reason: 'Manual Check', status: fraudRisk.level },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Fraud Detection Center</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-rose-900/50 rounded-full text-rose-400">
                         <ShieldAlert size={32} />
                     </div>
                     <div>
                         <p className="text-sm text-slate-400 uppercase font-bold">High Risk Events</p>
                         <p className="text-3xl font-bold text-white">12</p>
                     </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-slate-900 rounded-full text-slate-400">
                         <UserX size={32} />
                     </div>
                     <div>
                         <p className="text-sm text-slate-400 uppercase font-bold">Auto-Banned</p>
                         <p className="text-3xl font-bold text-white">5</p>
                     </div>
                </div>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
                     <div className="p-3 bg-slate-900 rounded-full text-slate-400">
                         <AlertOctagon size={32} />
                     </div>
                     <div>
                         <p className="text-sm text-slate-400 uppercase font-bold">Pending Review</p>
                         <p className="text-3xl font-bold text-white">3</p>
                     </div>
                </div>
            </div>

            <Card title="Live Threat Monitor">
                 <div className="mb-4 flex gap-2">
                     <input type="text" placeholder="Search User ID..." className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-sm text-white w-64" />
                     <Button variant="secondary">Search</Button>
                 </div>
                 <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Risk Score</th>
                            <th className="p-4">Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {flaggedUsers.map((u, i) => (
                            <tr key={i} className="hover:bg-slate-700/30">
                                <td className="p-4 font-mono text-xs text-slate-500">{u.id}</td>
                                <td className="p-4 font-bold text-white">{u.name}</td>
                                <td className="p-4">
                                    <span className={`font-bold ${u.risk > 80 ? 'text-rose-500' : u.risk > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {Math.floor(u.risk)}/100
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-300">{u.reason}</td>
                                <td className="p-4">
                                    <Badge color={u.status === 'Banned' ? 'red' : u.status === 'Monitoring' ? 'yellow' : 'green'}>
                                        {u.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <Button variant="outline" className="text-xs h-8">Review</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </Card>
        </div>
    );
};

export default FraudPanel;