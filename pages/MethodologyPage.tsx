import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, Badge } from '../components/UI';
import { Methodology } from '../types';
import { BrainCircuit, RefreshCw, Layers, Box, Check } from 'lucide-react';

const MethodologyPage: React.FC = () => {
    const { company, setMethodology } = useSimulation();

    const methods = [
        { 
            id: Methodology.AGILE, 
            name: 'Agile', 
            icon: RefreshCw, 
            desc: 'Iterative approach. Good for flexibility and speed.',
            pros: ['High Adaptability', 'Frequent Delivery'],
            cons: ['Scope Creep Risk', 'Requires High Collaboration']
        },
        { 
            id: Methodology.KANBAN, 
            name: 'Kanban', 
            icon: Layers, 
            desc: 'Visual workflow management. Focus on continuous delivery.',
            pros: ['Visual Process', 'Reduced Waste'],
            cons: ['Less Structure', 'Can Stall without Discipline']
        },
        { 
            id: Methodology.WATERFALL, 
            name: 'Waterfall', 
            icon: Box, 
            desc: 'Linear sequential approach. Good for fixed requirements.',
            pros: ['Clear Milestones', 'Easy to Manage'],
            cons: ['Inflexible', 'Late Testing Phase']
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-600 p-3 rounded-xl text-white">
                    <BrainCircuit size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Operational Methodology</h2>
                    <p className="text-slate-400">Define how your simulated company executes tasks.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {methods.map(m => (
                    <Card key={m.id} className={`border-2 transition-all ${company.methodology === m.id ? 'border-indigo-500 bg-slate-800/80 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-slate-700 hover:border-slate-500'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-900 rounded-lg text-indigo-400">
                                <m.icon size={24} />
                            </div>
                            {company.methodology === m.id && <Badge color="green">Active</Badge>}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{m.name}</h3>
                        <p className="text-sm text-slate-400 mb-6 min-h-[40px]">{m.desc}</p>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Pros</p>
                                {m.pros.map(p => <div key={p} className="text-xs text-slate-300 flex items-center gap-1"><Check size={10}/> {p}</div>)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-rose-400 uppercase mb-1">Cons</p>
                                {m.cons.map(c => <div key={c} className="text-xs text-slate-300">• {c}</div>)}
                            </div>
                        </div>

                        <Button 
                            variant={company.methodology === m.id ? 'secondary' : 'primary'} 
                            className="w-full"
                            disabled={company.methodology === m.id}
                            onClick={() => setMethodology(m.id)}
                        >
                            {company.methodology === m.id ? 'Current Model' : 'Switch Model'}
                        </Button>
                    </Card>
                ))}
            </div>

            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl mt-8">
                <h4 className="font-bold text-white mb-2">Impact Analysis</h4>
                <p className="text-sm text-slate-400">
                    Switching methodologies impacts the AI's behavior pattern. 
                    <strong> Agile</strong> increases meeting frequency but boosts reliability. 
                    <strong> Waterfall</strong> reduces meeting overhead but increases failure risk on dynamic tasks.
                </p>
            </div>
        </div>
    );
};

export default MethodologyPage;
