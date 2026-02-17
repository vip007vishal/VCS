import React from 'react';
import { Card, StatBox, Badge } from '../components/UI';
import { PerformanceLine, SkillRadar, RevenueChart } from '../components/Charts';
import { useSimulation } from '../context/SimulationContext';
import { TrendingUp, Activity, Target } from 'lucide-react';

const PerformancePage: React.FC = () => {
    const { currentUser } = useSimulation();

    const performanceHistory = [
        { day: 'Week 1', score: 45 },
        { day: 'Week 2', score: 55 },
        { day: 'Week 3', score: 62 },
        { day: 'Week 4', score: 75 },
    ];

    const teamComparison = [
        { subject: 'Code Quality', A: 85, fullMark: 100 },
        { subject: 'Velocity', A: 92, fullMark: 100 },
        { subject: 'Collaboration', A: 65, fullMark: 100 },
        { subject: 'Leadership', A: 40, fullMark: 100 },
        { subject: 'Innovation', A: 70, fullMark: 100 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBox label="Current Score" value={currentUser?.performanceScore || 0} trend="+12%" trendUp />
                <StatBox label="Rank in Team" value="#3" trend="Top 10%" trendUp />
                <StatBox label="Tasks Delivered" value="142" trend="+5 this week" trendUp />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Score Trajectory" icon={TrendingUp}>
                    <PerformanceLine data={performanceHistory} />
                    <p className="text-xs text-slate-500 mt-4 text-center">Your performance is trending upwards. Consistency is key for promotion.</p>
                </Card>

                <Card title="Skill Breakdown vs Team Avg" icon={Activity}>
                    <SkillRadar data={teamComparison} />
                </Card>
            </div>

            <Card title="Recent Achievements" icon={Target}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/20 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-xl">🏆</div>
                        <div>
                            <h4 className="font-bold text-white">Sprint Champion</h4>
                            <p className="text-xs text-slate-400">Completed most story points</p>
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-slate-900 border border-indigo-500/20 rounded-xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-xl">⚡</div>
                        <div>
                            <h4 className="font-bold text-white">Fast Fixer</h4>
                            <p className="text-xs text-slate-400">Resolved critical bug in 30m</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PerformancePage;
