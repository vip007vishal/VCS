import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, StatBox, Badge } from '../components/UI';
import { Building, Users, Target, Globe, Award, TrendingUp } from 'lucide-react';

const CompanyPage: React.FC = () => {
    const { company } = useSimulation();

    const stats = [
        { label: 'Market Cap', value: '$45M', icon: TrendingUp, color: 'text-emerald-400' },
        { label: 'Employees', value: company.employees, icon: Users, color: 'text-blue-400' },
        { label: 'Global Rank', value: '#4,021', icon: Globe, color: 'text-purple-400' },
        { label: 'Trust Score', value: `${company.trustScore}/100`, icon: Award, color: 'text-amber-400' },
    ];

    const departments = [
        { name: 'Engineering', head: 'Sarah Connor', count: 18, status: 'Hiring' },
        { name: 'Product', head: 'John Doe', count: 6, status: 'Full' },
        { name: 'Design', head: 'Emily Chen', count: 4, status: 'Full' },
        { name: 'Marketing', head: 'Mike Ross', count: 8, status: 'Hiring' },
    ];

    return (
        <div className="space-y-6">
            <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden">
                 <img src="https://picsum.photos/1200/400?grayscale" alt="Office" className="w-full h-full object-cover opacity-30" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                 <div className="absolute bottom-6 left-6">
                     <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-indigo-600 rounded-lg">
                             <Building size={24} className="text-white" />
                         </div>
                         <h1 className="text-4xl font-bold text-white">{company.name}</h1>
                     </div>
                     <p className="text-slate-300 max-w-xl">
                         Building the future of digital simulation. We are a simulation-first company dedicated to creating realistic AI environments.
                     </p>
                 </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-400">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                        <stat.icon size={24} className={stat.color} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Company Announcements">
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white">Q3 Roadmap Updated</h4>
                                    <span className="text-xs text-slate-500">Today</span>
                                </div>
                                <p className="text-sm text-slate-300">
                                    We are shifting our methodology to {company.methodology} effective immediately. All teams please review the new compliance guidelines.
                                </p>
                            </div>
                            <div className="p-4 bg-slate-900/50 border-l-4 border-slate-600 rounded-r-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white">New AI Copilot Integration</h4>
                                    <span className="text-xs text-slate-500">2 days ago</span>
                                </div>
                                <p className="text-sm text-slate-300">
                                    The new AI engines have been deployed. Expect increased reliability in task estimation.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Departments" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {departments.map((dept) => (
                                <div key={dept.name} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h5 className="font-bold text-white">{dept.name}</h5>
                                        <p className="text-xs text-slate-500">Lead: {dept.head} • {dept.count} Members</p>
                                    </div>
                                    <Badge color={dept.status === 'Hiring' ? 'green' : 'blue'}>{dept.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Core Values" icon={Target}>
                         <ul className="space-y-3">
                             <li className="flex gap-3 text-sm text-slate-300">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                                 <span><strong>Innovation First:</strong> We prioritize cutting-edge AI integration in every workflow.</span>
                             </li>
                             <li className="flex gap-3 text-sm text-slate-300">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                                 <span><strong>Transparency:</strong> Open salary and operational metrics for all verification levels.</span>
                             </li>
                             <li className="flex gap-3 text-sm text-slate-300">
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></div>
                                 <span><strong>Agility:</strong> Rapid iteration cycles with automated testing.</span>
                             </li>
                         </ul>
                    </Card>

                    <Card title="Tech Stack">
                         <div className="flex flex-wrap gap-2">
                             {['React', 'TypeScript', 'Node.js', 'Python', 'TensorFlow', 'Kubernetes', 'AWS', 'PostgreSQL'].map(tech => (
                                 <span key={tech} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400 border border-slate-800">{tech}</span>
                             ))}
                         </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;