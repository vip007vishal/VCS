import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Bot } from 'lucide-react';
import { Badge } from '../UI';

export const AIStatusIndicator: React.FC = () => {
  const { aiState } = useSimulation();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse-slow">
            <Bot size={24} className="text-white" />
          </div>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-slate-800 rounded-full ${aiState.mood === 'Stressed' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
        </div>
        <div>
          <h3 className="font-bold text-white">AI Copilot</h3>
          <p className="text-xs text-slate-400 font-mono truncate max-w-[150px]">{aiState.lastAction}</p>
        </div>
      </div>

      <div className="space-y-3">
         <div>
             <div className="flex justify-between text-xs mb-1">
                 <span className="text-slate-400">Confidence</span>
                 <span className={aiState.confidence > 80 ? 'text-emerald-400' : 'text-amber-400'}>{aiState.confidence}%</span>
             </div>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${aiState.confidence}%` }}></div>
             </div>
         </div>
         
         <div>
             <div className="flex justify-between text-xs mb-1">
                 <span className="text-slate-400">Reliability</span>
                 <span className="text-blue-400">{aiState.reliability}%</span>
             </div>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                 <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${aiState.reliability}%` }}></div>
             </div>
         </div>

         <div className="flex gap-2 pt-2">
             <Badge color={aiState.mood === 'Stressed' ? 'red' : aiState.mood === 'Optimistic' ? 'green' : 'blue'}>{aiState.mood}</Badge>
             <Badge color="purple">{aiState.model}</Badge>
         </div>
      </div>
    </div>
  );
};