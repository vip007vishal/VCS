import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const theme = {
  grid: "#334155",
  text: "#94a3b8",
  tooltipBg: "#1e293b",
  tooltipBorder: "#475569"
};

export const RevenueChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey="name" stroke={theme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
        <YAxis stroke={theme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
        <Tooltip 
            contentStyle={{ backgroundColor: theme.tooltipBg, borderColor: theme.tooltipBorder, color: '#f8fafc' }}
            itemStyle={{ color: '#818cf8' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const SkillRadar: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke={theme.grid} />
        <PolarAngleAxis dataKey="subject" tick={{ fill: theme.text, fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar name="Skills" dataKey="A" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
        <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, borderColor: theme.tooltipBorder, color: '#f8fafc' }}/>
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export const PerformanceLine: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
            <XAxis dataKey="day" stroke={theme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
            <YAxis stroke={theme.text} tick={{fontSize: 12}} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: theme.tooltipBg, borderColor: theme.tooltipBorder, color: '#f8fafc' }} />
            <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b'}} activeDot={{r: 6}} />
        </LineChart>
    </ResponsiveContainer>
  </div>
);
