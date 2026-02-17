import React from 'react';
import { Card, StatBox, Badge } from '../components/UI';
import { PerformanceLine, RevenueChart } from '../components/Charts';
import { Activity, AlertTriangle, TrendingDown } from 'lucide-react';

const ReportsPage: React.FC = () => {
    // Mock Data
    const velocityData = [
        { day: 'Sprint 1', score: 30 }, { day: 'Sprint 2', score: 35 }, 
        { day: 'Sprint 3', score: 32 }, { day: 'Sprint 4', score: 45 },
        { day: 'Sprint 5', score: 42 }, { day: 'Sprint 6', score: 50 },
    ];

    const bugRateData = [
        { name: 'W1', revenue: 20 }, { name: 'W2', revenue: 15 },
        { name: 'W3', revenue: 25 }, { name: 'W4', revenue: 10 }, // reusing chart component structure
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Department Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatBox label="Sprint Velocity" value="50 pts" trend="+15%" trendUp />
                <StatBox label="Code Churn" value="12%" trend="-2%" trendUp />
                <StatBox label="Bug Leakage" value="3.5%" trend="Stable" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Team Velocity Trend" icon={Activity}>
                    <PerformanceLine data={velocityData} />
                </Card>

                <Card title="Burnout Analysis" icon={TrendingDown}>
                    <div className="space-y-4">
                        <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-rose-400 flex items-center gap-2">
                                    <AlertTriangle size={16} /> High Risk Detected
                                </span>
                                <span className="text-xs text-slate-500">Updated 2h ago</span>
                            </div>
                            <p className="text-sm text-slate-300">
                                Developer <strong>Mike T.</strong> has logged 12h+ days for 3 consecutive days. 
                                Productivity is projected to drop by 40%.
                            </p>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">Team Energy Level</span>
                                <span className="text-amber-400">65%</span>
                            </div>
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full w-[65%]"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-900 p-2 rounded">
                                <div className="text-lg font-bold text-white">4.2</div>
                                <div className="text-xs text-slate-500">Avg Satisfaction</div>
                            </div>
                            <div className="bg-slate-900 p-2 rounded">
                                <div className="text-lg font-bold text-white">92%</div>
                                <div className="text-xs text-slate-500">Meeting Attendance</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Bug Discovery vs Resolution">
                 <RevenueChart data={bugRateData} />
                 <p className="text-center text-xs text-slate-500 mt-2">Data represents resolved bugs over last 4 weeks</p>
            </Card>
        </div>
    );
};

export default ReportsPage;
