
import React from 'react';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { MonacoEditorPane } from './MonacoEditorPane';
import { BottomPanel } from './BottomPanel';
import { AISidePanel } from './AISidePanel';
import { useEditor } from '../../context/EditorContext';
import { Play, Save, Send, RotateCcw } from 'lucide-react';
import { Button } from '../UI';
import { Task } from '../../types';

interface EditorShellProps {
    task: Task;
    onSave: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const EditorShell: React.FC<EditorShellProps> = ({ task, onSave, onSubmit, isSubmitting }) => {
  const { addTerminalLog, isReadOnly } = useEditor();

  const handleRun = () => {
      addTerminalLog('Build started...', 'info');
      setTimeout(() => {
          addTerminalLog('Compiling src/index.ts...', 'command');
          addTerminalLog('Build successful. (420ms)', 'success');
          addTerminalLog('App running at http://localhost:3000', 'info');
      }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-4 shrink-0">
         <div className="flex items-center gap-4">
             <div className="font-bold text-white tracking-wide">WorkSphere <span className="text-indigo-500">Code Editor</span></div>
             <div className="h-6 w-px bg-slate-700"></div>
             <div className="text-sm text-slate-300">{task.title}</div>
             {isReadOnly && <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded border border-amber-500/50">Read Only</span>}
         </div>
         <div className="flex items-center gap-3">
             <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white" title="Reset Workspace">
                 <RotateCcw size={18} />
             </button>
             <button className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onClick={onSave} title="Save (Ctrl+S)">
                 <Save size={18} />
             </button>
             <div className="h-6 w-px bg-slate-700 mx-2"></div>
             <Button variant="secondary" className="h-8 text-xs gap-2" onClick={handleRun}>
                 <Play size={14} /> Run
             </Button>
             {!isReadOnly && (
                <Button className="h-8 text-xs gap-2 bg-emerald-600 hover:bg-emerald-500" onClick={onSubmit} disabled={isSubmitting}>
                    <Send size={14} /> {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
             )}
         </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
          <FileExplorer />
          <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
              <EditorTabs />
              <MonacoEditorPane />
              <BottomPanel />
          </div>
          <AISidePanel task={task} />
      </div>
    </div>
  );
};
