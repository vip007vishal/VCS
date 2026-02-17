import React from 'react';
import { Card, StatBox, Badge, Button } from '../components/UI';
import { Users, AlertTriangle, Briefcase } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard: React.FC = () => {
  const { employees, tasks } = useSimulation();
  const navigate = useNavigate();

  // Calculate stats from context
  const activeProjects = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const teamVelocity = Math.floor(activeProjects * 12.5) + 20; // Mock calculation based on active work

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox label="Team Velocity" value={`${teamVelocity} pts`} trend="+5%" trendUp />
        <StatBox label="Burnout Risk" value="Medium" trend="Stable" />
        <StatBox label="Active Projects" value={activeProjects} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Team Overview" icon={Users}>
          <div className="space-y-4">
             {employees.slice(0, 5).map((member, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                     {member.isAi ? 'AI' : member.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white">{member.name}</p>
                     <p className="text-xs text-slate-500">{member.role}</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <Badge color={member.risk === 'High' ? 'red' : 'green'}>{member.risk || 'Low'} Risk</Badge>
                 </div>
               </div>
             ))}
             {employees.length > 5 && <div className="text-center text-xs text-slate-500">+{employees.length - 5} more members</div>}
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
            <Button variant="outline" onClick={() => navigate('/allocation')}>Open Allocation Board</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;