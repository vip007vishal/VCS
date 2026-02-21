
import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, StatBox, Button, Badge } from '../components/UI';
import { SkillRadar, PerformanceLine } from '../components/Charts';
import { Zap, CheckCircle, Award, Target, Bot } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { currentUser, tasks, aiState } = useSimulation();

  if (!currentUser) return null;

  const completedTasks = tasks.filter(t => t.status === 'DONE').length;
  
  // Mock Data for Charts
  const performanceData = [
    { day: 'Mon', score: 65 }, { day: 'Tue', score: 70 }, { day: 'Wed', score: 68 },
    { day: 'Thu', score: 85 }, { day: 'Fri', score: 82 }, { day: 'Sat', score: 90 },
  ];

  const skillData = [
    { subject: 'React', A: 85, fullMark: 100 },
    { subject: 'Node', A: 70, fullMark: 100 },
    { subject: 'Design', A: 60, fullMark: 100 },
    { subject: 'Testing', A: 90, fullMark: 100 },
    { subject: 'DevOps', A: 50, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Performance Score" value={currentUser.performanceScore} trend="+12%" trendUp />
        <StatBox label="Tasks Completed" value={completedTasks} trend="+3" trendUp />
        <StatBox label="Verification Level" value={`Lvl ${currentUser.verificationLevel}`} />
        <StatBox label="AI Trust Score" value={`${aiState.confidence}%`} trend={aiState.mood === 'Stressed' ? '-2%' : '+1%'} trendUp={aiState.mood !== 'Stressed'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Performance History" icon={Zap}>
            <PerformanceLine data={performanceData} />
          </Card>
          
          <Card title="Active Sprint" icon={Target}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-slate-700 dark:text-slate-300">Sprint 42 Progress</h4>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">65%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[65%]"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Pending Review</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">3 Tasks</p>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Blockers</p>
                    <p className="text-lg font-bold text-rose-500 dark:text-rose-400">1 Critical</p>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card title="Skill Matrix" icon={Award}>
             <SkillRadar data={skillData} />
             <div className="mt-4 text-center">
               <Button variant="outline" className="w-full text-xs">Request Training</Button>
             </div>
          </Card>

          <Card title="AI Manager Feedback">
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-900/50 dark:to-slate-900 p-4 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                   <p className="text-sm text-slate-600 dark:text-slate-300 italic">"Your code velocity is improving, but unit test coverage dropped by 5% this week. Focus on TDD."</p>
                   <div className="mt-2 flex gap-2">
                     <Badge color="yellow">Quality Risk</Badge>
                     <Badge color="green">High Velocity</Badge>
                   </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Founder Journey">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm text-slate-500 dark:text-slate-400">Eligibility</span>
               <span className="text-sm font-bold text-slate-600 dark:text-slate-500">Locked</span>
             </div>
             <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-500 h-full w-[40%]"></div>
             </div>
             <p className="text-xs text-slate-500">Reach Level 5 Verification and 900+ Score to unlock CEO mode.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
