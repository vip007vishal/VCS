import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { TaskStatus, Methodology } from '../../types';
import { Clock, AlertTriangle } from 'lucide-react';

const KanbanColumn: React.FC<{ title: string; tasks: any[]; onDrop: (e: React.DragEvent) => void; color?: string }> = ({ title, tasks, onDrop, color }) => {
  return (
    <div 
      className={`flex-1 min-w-[250px] bg-slate-900/50 rounded-xl p-4 border ${color ? `border-${color}-500/30` : 'border-slate-800/50'} flex flex-col h-full`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${color ? `text-${color}-400` : 'text-slate-300'}`}>{title}</h3>
        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{tasks.length}</span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map(task => (
          <div 
            key={task.id} 
            draggable 
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
            className={`p-4 rounded-lg border cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${task.status === TaskStatus.FAILED ? 'bg-rose-950/20 border-rose-900/50' : 'bg-slate-800 border-slate-700'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-1.5 py-0.5 rounded ${task.isAiGenerated ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                {task.isAiGenerated ? 'AI Task' : 'Manual'}
              </span>
              {task.status === TaskStatus.FAILED && <AlertTriangle size={14} className="text-rose-500" />}
            </div>
            <h4 className="text-sm font-medium text-slate-200 mb-2">{task.title}</h4>
            <div className="flex items-center justify-between text-xs text-slate-500">
               <div className="flex items-center gap-1">
                 <Clock size={12} />
                 <span>2d</span>
               </div>
               {task.aiConfidence && (
                 <span className={task.aiConfidence > 80 ? 'text-emerald-400' : 'text-amber-400'}>
                   {task.aiConfidence}% Conf.
                 </span>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC = () => {
    const { tasks, moveTask, company } = useSimulation();

    const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) moveTask(taskId, status);
    };

    const getBoardConfig = () => {
        switch (company.methodology) {
          case Methodology.WATERFALL:
            return [
              { title: 'Requirements', status: TaskStatus.BACKLOG },
              { title: 'Implementation', status: TaskStatus.IN_PROGRESS, color: 'blue' },
              { title: 'Verification', status: TaskStatus.REVIEW, color: 'purple' },
              { title: 'Maintenance', status: TaskStatus.DONE, color: 'emerald' }
            ];
          case Methodology.KANBAN:
            return [
              { title: 'To Do', status: TaskStatus.BACKLOG },
              { title: 'Doing', status: TaskStatus.IN_PROGRESS, color: 'indigo' },
              { title: 'Done', status: TaskStatus.DONE, color: 'green' }
            ];
          case Methodology.AGILE:
          default:
            return [
              { title: 'Backlog', status: TaskStatus.BACKLOG },
              { title: 'In Progress', status: TaskStatus.IN_PROGRESS, color: 'blue' },
              { title: 'Review', status: TaskStatus.REVIEW, color: 'amber' },
              { title: 'Done', status: TaskStatus.DONE, color: 'emerald' }
            ];
        }
    };

    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-2 h-full">
            {getBoardConfig().map((col) => (
               <KanbanColumn 
                  key={col.title}
                  title={col.title}
                  color={col.color}
                  tasks={tasks.filter(t => {
                      if (company.methodology === Methodology.KANBAN) {
                          if (col.status === TaskStatus.IN_PROGRESS) return t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.REVIEW;
                          return t.status === col.status;
                      }
                      return t.status === col.status;
                  })}
                  onDrop={(e) => handleDrop(e, col.status)}
               />
            ))}
        </div>
    );
};