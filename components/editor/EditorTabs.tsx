
import React from 'react';
import { useEditor } from '../../context/EditorContext';
import { X, Circle } from 'lucide-react';

export const EditorTabs: React.FC = () => {
  const { openFiles, activeFileId, openFile, closeFile, files } = useEditor();

  const getFileById = (id: string, list: any[]): any => {
    for (const f of list) {
      if (f.id === id) return f;
      if (f.children) {
        const found = getFileById(id, f.children);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div className="h-9 bg-slate-950 flex border-b border-slate-800 overflow-x-auto">
      {openFiles.map(fileId => {
        const file = getFileById(fileId, files);
        if (!file) return null;
        
        return (
          <div 
            key={fileId}
            onClick={() => openFile(fileId)}
            className={`flex items-center gap-2 px-3 min-w-[120px] max-w-[200px] text-xs border-r border-slate-800 cursor-pointer select-none group ${activeFileId === fileId ? 'bg-[#1e1e1e] text-white border-t-2 border-t-indigo-500' : 'bg-slate-900 text-slate-500 hover:bg-slate-800'}`}
          >
            <span className="truncate flex-1">{file.name}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); closeFile(fileId); }}
              className="text-slate-500 hover:text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {file.isModified ? <Circle size={8} fill="currentColor" className="text-white" /> : <X size={14} />}
            </button>
          </div>
        );
      })}
    </div>
  );
};
