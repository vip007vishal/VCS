import React from 'react';
import { Card, StatBox, Badge, Button } from '../components/UI';
import { Users, AlertTriangle, Briefcase } from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox label="Team Velocity" value="42 pts" trend="+5%" trendUp />
        <StatBox label="Burnout Risk" value="Medium" trend="Stable" />
        <StatBox label="Active Projects" value="3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Team Overview" icon={Users}>
          <div className="space-y-4">
             {[
               { name: 'Alex Dev', role: 'Senior Dev', status: 'Online', risk: 'Low' },
               { name: 'Sarah J.', role: 'Designer', status: 'In Meeting', risk: 'Low' },
               { name: 'Mike T.', role: 'Junior Dev', status: 'Offline', risk: 'High' },
             ].map((member, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-300">
                     {member.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white">{member.name}</p>
                     <p className="text-xs text-slate-500">{member.role}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <Badge color={member.risk === 'High' ? 'red' : 'green'}>{member.risk} Risk</Badge>
                 </div>
               </div>
             ))}
          </div>
        </Card>

        <Card title="Pending Approvals" icon={AlertTriangle}>
           <div className="space-y-3">
             <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium text-slate-200">Production Deploy #442</span>
                 <span className="text-xs text-slate-500">2h ago</span>
               </div>
               <div className="flex gap-2">
                 <Button className="text-xs py-1 h-8">Approve</Button>
                 <Button variant="secondary" className="text-xs py-1 h-8">Reject</Button>
               </div>
             </div>
             <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
               <div className="flex justify-between mb-2">
                 <span className="text-sm font-medium text-slate-200">Expense Report: Q3 Offsite</span>
                 <span className="text-xs text-slate-500">1d ago</span>
               </div>
               <div className="flex gap-2">
                 <Button className="text-xs py-1 h-8">Approve</Button>
                 <Button variant="secondary" className="text-xs py-1 h-8">Reject</Button>
               </div>
             </div>
           </div>
        </Card>

        <Card title="Task Allocation" icon={Briefcase} className="lg:col-span-2">
          <div className="text-center py-8 text-slate-500">
            <p className="mb-4">Drag and drop tasks to assign to team members.</p>
            <Button variant="outline">Open Allocation Board</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
