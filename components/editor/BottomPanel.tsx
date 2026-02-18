
import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { Terminal, Activity, AlertCircle, XCircle } from 'lucide-react';

export const BottomPanel: React.FC = () => {
  const { activePanelTab, setActivePanelTab, terminalLogs, clearTerminal } = useEditor();

  const tabs = [
    { id: 'TERMINAL', label: 'Terminal', icon: Terminal },
    { id: 'OUTPUT', label: 'Output', icon: Activity },
    { id: 'TESTS', label: 'Test Results', icon: AlertCircle },
  ];

  return (
    <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0">
      <div className="flex items-center border-b border-slate-800 px-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanelTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase transition-colors ${activePanelTab === tab.id ? 'text-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
        <div className="ml-auto flex items-center">
           <button onClick={clearTerminal} className="p-1 hover:text-white text-slate-500" title="Clear Console"><XCircle size={14} /></button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 font-mono text-xs custom-scrollbar">
        {activePanelTab === 'TERMINAL' && (
          <div className="space-y-1">
            {terminalLogs.map((log, i) => (
              <div key={i} className={`${log.type === 'error' ? 'text-rose-400' : log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'}`}>
                <span className="opacity-50 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                {log.type === 'command' && <span className="text-indigo-400 mr-2">$</span>}
                {log.message}
              </div>
            ))}
            <div className="flex items-center gap-1 text-slate-500 mt-2">
                <span>$</span>
                <span className="w-2 h-4 bg-slate-500 animate-pulse"></span>
            </div>
          </div>
        )}
        
        {activePanelTab === 'OUTPUT' && (
            <div className="text-slate-400 italic">No output generated yet. Run code to see results.</div>
        )}

        {activePanelTab === 'TESTS' && (
            <div className="text-slate-400">
               Run tests to see assertion results.
            </div>
        )}
      </div>
    </div>
  );
};
