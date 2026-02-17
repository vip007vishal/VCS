import React from 'react';
import { Card } from '../UI';
import { Users, Shield, BrainCircuit } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const TeamPanel: React.FC = () => {
  const { employees } = useSimulation();

  return (
    <Card title="Team Squad" icon={Users} className="h-full">
      <div className="space-y-4">
        {employees.map((member) => (
            <div key={member.id} className={`flex items-center justify-between p-3 rounded-lg border ${member.role.includes('Manager') ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {member.isAi ? <BrainCircuit size={14} /> : member.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white flex items-center gap-1">
                            {member.name}
                            {member.role.includes('Manager') && <Shield size={10} className="text-indigo-400"/>}
                        </p>
                        <p className="text-[10px] text-slate-500">{member.role}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                     <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Offline' ? 'bg-slate-500' : 'bg-amber-500'}`} title={member.status}></div>
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
};