import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';
import { Search, MoreVertical, Shield, Ban, CheckCircle } from 'lucide-react';
import { Role } from '../types';

const UsersManagementPage: React.FC = () => {
    const { currentUser } = useSimulation();
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        { id: 1, name: currentUser?.name || 'Admin', role: Role.ADMIN, status: 'Active', email: 'admin@skillverse.ai' },
        { id: 2, name: 'Sarah J.', role: Role.MANAGER, status: 'Active', email: 'sarah.j@nebulastream.com' },
        { id: 3, name: 'Mike T.', role: Role.USER, status: 'Active', email: 'mike.t@nebulastream.com' },
        { id: 4, name: 'Bot_992', role: Role.USER, status: 'Suspended', email: 'temp_99@fakemail.com' },
        { id: 5, name: 'Elon M.', role: Role.CEO, status: 'Active', email: 'elon@nebulastream.com' },
    ];

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Global User Directory</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Badge color={user.role === Role.ADMIN ? 'purple' : 'blue'}>{user.role}</Badge>
                                </td>
                                <td className="p-4">
                                    <Badge color={user.status === 'Active' ? 'green' : 'red'}>{user.status}</Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {user.status === 'Active' ? (
                                             <button className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg" title="Suspend">
                                                <Ban size={16} />
                                             </button>
                                        ) : (
                                            <button className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg" title="Activate">
                                                <CheckCircle size={16} />
                                             </button>
                                        )}
                                        <button className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default UsersManagementPage;