
import React, { useState } from 'react';
import { useEditor } from '../../context/EditorContext';
import { EditorFile } from '../../types';
import { Folder, FileCode, ChevronRight, ChevronDown, FileJson, FileType, Plus, Trash2 } from 'lucide-react';

const FileIcon: React.FC<{ name: string; isFolder?: boolean; isOpen?: boolean }> = ({ name, isFolder, isOpen }) => {
  if (isFolder) return isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />;
  if (name.endsWith('.json')) return <FileJson size={16} className="text-yellow-400" />;
  if (name.endsWith('.ts') || name.endsWith('.js')) return <FileCode size={16} className="text-blue-400" />;
  if (name.endsWith('.md')) return <FileType size={16} className="text-purple-400" />;
  return <FileCode size={16} className="text-slate-400" />;
};

const FileItem: React.FC<{ file: EditorFile; level: number }> = ({ file, level }) => {
  const { openFile, activeFileId, isReadOnly, deleteFile } = useEditor();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (file.isFolder) {
      setIsOpen(!isOpen);
    } else {
      openFile(file.id);
    }
  };

  return (
    <div>
      <div 
        className={`flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-slate-800 transition-colors group ${activeFileId === file.id ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <FileIcon name={file.name} isFolder={file.isFolder} isOpen={isOpen} />
          <span className="text-sm truncate select-none">{file.name}</span>
        </div>
        {!isReadOnly && !file.isFolder && (
           <button 
             onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
             className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity"
           >
             <Trash2 size={12} />
           </button>
        )}
      </div>
      {file.isFolder && isOpen && file.children && (
        <div>
          {file.children.map(child => <FileItem key={child.id} file={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const { files, createFile, isReadOnly } = useEditor();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Explorer</span>
        {!isReadOnly && (
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onClick={() => createFile('new_file.ts', false)}>
              <Plus size={14} />
            </button>
            <button className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white" onClick={() => createFile('new_folder', true)}>
              <Folder size={14} />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map(file => <FileItem key={file.id} file={file} level={0} />)}
      </div>
    </div>
  );
};
