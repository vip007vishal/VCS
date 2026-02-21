
import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const RevenueChart: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartTheme = {
    grid: isDark ? "#334155" : "#e2e8f0",
    text: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipBorder: isDark ? "#475569" : "#cbd5e1",
    tooltipText: isDark ? "#f8fafc" : "#1e293b"
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
          <XAxis dataKey="name" stroke={chartTheme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <YAxis stroke={chartTheme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
          <Tooltip 
              contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, color: chartTheme.tooltipText }}
              itemStyle={{ color: '#6366f1' }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SkillRadar: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartTheme = {
    grid: isDark ? "#334155" : "#e2e8f0",
    text: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipBorder: isDark ? "#475569" : "#cbd5e1",
    tooltipText: isDark ? "#f8fafc" : "#1e293b"
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke={chartTheme.grid} />
          <PolarAngleAxis dataKey="subject" tick={{ fill: chartTheme.text, fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Skills" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
          <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, color: chartTheme.tooltipText }}/>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PerformanceLine: React.FC<{ data: any[] }> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartTheme = {
    grid: isDark ? "#334155" : "#e2e8f0",
    text: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipBorder: isDark ? "#475569" : "#cbd5e1",
    tooltipText: isDark ? "#f8fafc" : "#1e293b"
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="day" stroke={chartTheme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTheme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, borderColor: chartTheme.tooltipBorder, color: chartTheme.tooltipText }} />
              <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} activeDot={{r: 6}} />
          </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
