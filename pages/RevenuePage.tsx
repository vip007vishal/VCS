import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Card, Button, StatBox, Badge } from '../components/UI';
import { RevenueChart } from '../components/Charts';
import { DollarSign, TrendingUp, TrendingDown, PieChart, AlertTriangle, Zap } from 'lucide-react';

const RevenuePage: React.FC = () => {
    const { company, tasks, aiState } = useSimulation();
    const [marketVolatility, setMarketVolatility] = useState(50);

    // Simulation Calcs
    const activeProjects = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const baseRevenue = company.revenue;
    const projectIncome = activeProjects * 15000;
    const employeeCost = company.employees * 8500; // Monthly avg
    const aiComputeCost = (aiState.confidence * 100) + (activeProjects * 200);
    const volatilityFactor = (marketVolatility - 50) * 1000;
    
    const projectedProfit = (baseRevenue / 12) + projectIncome - employeeCost - aiComputeCost + volatilityFactor;
    const profitMargin = (projectedProfit / ((baseRevenue / 12) + projectIncome)) * 100;

    const costBreakdown = [
        { name: 'Payroll', value: employeeCost, color: 'text-blue-400' },
        { name: 'AI Compute', value: aiComputeCost, color: 'text-purple-400' },
        { name: 'Infrastructure', value: 12000, color: 'text-slate-400' },
        { name: 'Marketing', value: 25000, color: 'text-emerald-400' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Financial Simulation Engine</h2>
                <div className="flex gap-2">
                     <Badge color={projectedProfit > 0 ? 'green' : 'red'}>
                        {projectedProfit > 0 ? 'Profitable' : 'Loss Projected'}
                     </Badge>
                     <Badge color="purple">FY 2024</Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatBox label="Monthly Burn" value={`$${(employeeCost + aiComputeCost + 37000).toLocaleString()}`} trend="+2.4%" />
                <StatBox label="Proj. Revenue" value={`$${((baseRevenue/12) + projectIncome).toLocaleString()}`} trend="+5.1%" trendUp />
                <StatBox label="Net Profit" value={`$${projectedProfit.toLocaleString()}`} trend={`${profitMargin.toFixed(1)}%`} trendUp={projectedProfit > 0} />
                <StatBox label="AI Cost Efficiency" value="High" trend="-$1.2k" trendUp />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Revenue vs Cost Trajectory" icon={TrendingUp} className="lg:col-span-2">
                    <RevenueChart data={[
                        { name: 'Q1', revenue: 200000 },
                        { name: 'Q2', revenue: 240000 },
                        { name: 'Q3', revenue: 180000 },
                        { name: 'Q4', revenue: projectedProfit * 3 } // Projection
                    ]} />
                    <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-800">
                        <h4 className="font-bold text-white mb-2">Simulation Controls</h4>
                        <label className="text-xs text-slate-400 block mb-2">Market Volatility Index (VIX)</label>
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={marketVolatility}
                            onChange={(e) => setMarketVolatility(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2"
                        />
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Stable Market</span>
                            <span>High Volatility</span>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Cost Breakdown" icon={PieChart}>
                        <div className="space-y-4">
                            {costBreakdown.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-2 border-b border-slate-800 last:border-0">
                                    <span className="text-sm text-slate-300">{item.name}</span>
                                    <span className={`font-bold ${item.color}`}>${item.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title="AI Resource Impact" icon={Zap}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-indigo-900/20 rounded-full text-indigo-400">
                                <Zap size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Current Compute Load</p>
                                <p className="text-xl font-bold text-white">45 TFLOPS</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400">
                            Automating <strong>{activeProjects} projects</strong> saves approximately <strong>${(activeProjects * 5000).toLocaleString()}</strong> in human capital costs monthly.
                        </p>
                    </Card>

                    {projectedProfit < 0 && (
                        <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl flex gap-3 animate-pulse">
                            <AlertTriangle className="text-rose-500 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-rose-500 text-sm">Critical Warning</h4>
                                <p className="text-xs text-slate-300">Runway depletion imminent. Reduce burn rate or increase project intake.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;