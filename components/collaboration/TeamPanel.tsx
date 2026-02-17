import React from 'react';
import { Card } from '../UI';
import { Users, Shield } from 'lucide-react';

export const TeamPanel: React.FC = () => {
  const team = [
      { name: 'Sarah J.', role: 'Senior Dev', status: 'Online', risk: 'Low' },
      { name: 'Mike T.', role: 'Junior Dev', status: 'In Meeting', risk: 'Medium' },
      { name: 'Jessica L.', role: 'Designer', status: 'Offline', risk: 'Low' },
      { name: 'David K.', role: 'Manager', status: 'Online', risk: 'Low', isManager: true },
  ];

  return (
    <Card title="Team Squad" icon={Users} className="h-full">
      <div className="space-y-4">
        {team.map((member, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${member.isManager ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.isManager ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {member.name.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white flex items-center gap-1">
                            {member.name}
                            {member.isManager && <Shield size={10} className="text-indigo-400"/>}
                        </p>
                        <p className="text-[10px] text-slate-500">{member.role}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                     <div className={`w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-500' : member.status === 'Offline' ? 'bg-slate-500' : 'bg-amber-500'}`}></div>
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
};