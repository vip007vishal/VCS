import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';
import { Building, TrendingUp, ShieldAlert, MoreVertical, Eye, Ban } from 'lucide-react';
import { Methodology } from '../types';

const CompaniesManagementPage: React.FC = () => {
    const { addNotification } = useSimulation();

    // Mock companies
    const [companies, setCompanies] = useState([
        { id: 'c1', name: 'Nebula Stream Inc.', revenue: '$1.2M', employees: 42, methodology: Methodology.AGILE, trust: 85, status: 'Active' },
        { id: 'c2', name: 'CyberDyne Sys', revenue: '$5.8M', employees: 120, methodology: Methodology.WATERFALL, trust: 92, status: 'Active' },
        { id: 'c3', name: 'Phantom Shell', revenue: '$0', employees: 1, methodology: Methodology.KANBAN, trust: 12, status: 'Flagged' },
    ]);

    const toggleStatus = (id: string) => {
        setCompanies(prev => prev.map(c => {
            if (c.id === id) {
                const newStatus = c.status === 'Active' ? 'Suspended' : 'Active';
                addNotification('Company Status Updated', `${c.name} is now ${newStatus}`, newStatus === 'Suspended' ? 'warning' : 'success');
                return { ...c, status: newStatus };
            }
            return c;
        }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Company Registry</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
                    <p className="text-slate-400 text-sm">Total Market Cap</p>
                    <h3 className="text-2xl font-bold text-white mt-1">$42.5M</h3>
                </div>
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
                    <p className="text-slate-400 text-sm">Avg Trust Score</p>
                    <h3 className="text-2xl font-bold text-emerald-400 mt-1">78/100</h3>
                </div>
                <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl">
                    <p className="text-slate-400 text-sm">Flagged Entities</p>
                    <h3 className="text-2xl font-bold text-rose-400 mt-1">3</h3>
                </div>
            </div>

            <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-400 text-xs uppercase font-medium">
                        <tr>
                            <th className="p-4">Company Name</th>
                            <th className="p-4">Revenue (ARR)</th>
                            <th className="p-4">Size</th>
                            <th className="p-4">Methodology</th>
                            <th className="p-4">Trust</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {companies.map(company => (
                            <tr key={company.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-800 rounded text-indigo-400">
                                            <Building size={16} />
                                        </div>
                                        <span className="font-medium text-white">{company.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300">{company.revenue}</td>
                                <td className="p-4 text-slate-300">{company.employees}</td>
                                <td className="p-4">
                                    <Badge color="purple">{company.methodology}</Badge>
                                </td>
                                <td className="p-4">
                                    <span className={`font-bold ${company.trust > 80 ? 'text-emerald-400' : company.trust < 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                                        {company.trust}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Badge color={company.status === 'Active' ? 'green' : company.status === 'Flagged' ? 'yellow' : 'red'}>
                                        {company.status}
                                    </Badge>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="View Details">
                                            <Eye size={16} />
                                        </button>
                                        <button 
                                            className={`p-2 rounded transition-colors ${company.status === 'Active' ? 'text-rose-400 hover:bg-rose-900/20' : 'text-emerald-400 hover:bg-emerald-900/20'}`}
                                            title={company.status === 'Active' ? 'Suspend' : 'Activate'}
                                            onClick={() => toggleStatus(company.id)}
                                        >
                                            {company.status === 'Active' ? <Ban size={16} /> : <ShieldAlert size={16} />}
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

export default CompaniesManagementPage;