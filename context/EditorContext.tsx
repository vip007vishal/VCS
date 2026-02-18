
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EditorFile, TerminalLog } from '../types';

interface EditorContextType {
  files: EditorFile[];
  activeFileId: string | null;
  openFiles: string[]; // Array of File IDs
  terminalLogs: TerminalLog[];
  activePanelTab: 'TERMINAL' | 'OUTPUT' | 'TESTS' | 'AI_REVIEW';
  isReadOnly: boolean;
  
  // Actions
  initializeWorkspace: (template: EditorFile[]) => void;
  openFile: (fileId: string) => void;
  closeFile: (fileId: string) => void;
  updateFileContent: (fileId: string, content: string) => void;
  createFile: (name: string, isFolder: boolean, parentId?: string) => void;
  deleteFile: (fileId: string) => void;
  setActivePanelTab: (tab: 'TERMINAL' | 'OUTPUT' | 'TESTS' | 'AI_REVIEW') => void;
  addTerminalLog: (message: string, type?: TerminalLog['type']) => void;
  clearTerminal: () => void;
  setReadOnly: (readonly: boolean) => void;
  getActiveFile: () => EditorFile | undefined;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<EditorFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [openFiles, setOpenFiles] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [activePanelTab, setActivePanelTab] = useState<'TERMINAL' | 'OUTPUT' | 'TESTS' | 'AI_REVIEW'>('TERMINAL');
  const [isReadOnly, setReadOnly] = useState(false);

  const initializeWorkspace = (template: EditorFile[]) => {
    setFiles(template);
    setOpenFiles([]);
    setActiveFileId(null);
    setTerminalLogs([{ type: 'info', message: 'Workspace initialized...', timestamp: Date.now() }]);
    
    // Auto open README if exists
    const readme = template.find(f => f.name.toLowerCase() === 'readme.md');
    if (readme) {
      setOpenFiles([readme.id]);
      setActiveFileId(readme.id);
    }
  };

  const openFile = (fileId: string) => {
    if (!openFiles.includes(fileId)) {
      setOpenFiles(prev => [...prev, fileId]);
    }
    setActiveFileId(fileId);
  };

  const closeFile = (fileId: string) => {
    const newOpenFiles = openFiles.filter(id => id !== fileId);
    setOpenFiles(newOpenFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const updateFileContent = (fileId: string, content: string) => {
    if (isReadOnly) return;
    
    const updateRecursive = (list: EditorFile[]): EditorFile[] => {
      return list.map(f => {
        if (f.id === fileId) return { ...f, content, isModified: true };
        if (f.children) return { ...f, children: updateRecursive(f.children) };
        return f;
      });
    };
    setFiles(prev => updateRecursive(prev));
  };

  const createFile = (name: string, isFolder: boolean, parentId?: string) => {
    if (isReadOnly) return;
    const newFile: EditorFile = {
      id: `f_${Date.now()}`,
      name,
      content: isFolder ? '' : '// New file',
      isFolder,
      children: isFolder ? [] : undefined,
      language: name.endsWith('.ts') ? 'typescript' : name.endsWith('.json') ? 'json' : name.endsWith('.html') ? 'html' : 'javascript'
    };

    if (!parentId) {
      setFiles(prev => [...prev, newFile]);
    } else {
      const addToParent = (list: EditorFile[]): EditorFile[] => {
        return list.map(f => {
          if (f.id === parentId && f.isFolder) {
            return { ...f, children: [...(f.children || []), newFile] };
          }
          if (f.children) return { ...f, children: addToParent(f.children) };
          return f;
        });
      };
      setFiles(prev => addToParent(prev));
    }
    
    if (!isFolder) openFile(newFile.id);
  };

  const deleteFile = (fileId: string) => {
    if (isReadOnly) return;
    const removeRecursive = (list: EditorFile[]): EditorFile[] => {
      return list.filter(f => f.id !== fileId).map(f => ({
        ...f,
        children: f.children ? removeRecursive(f.children) : undefined
      }));
    };
    setFiles(prev => removeRecursive(prev));
    closeFile(fileId);
  };

  const addTerminalLog = (message: string, type: TerminalLog['type'] = 'info') => {
    setTerminalLogs(prev => [...prev, { message, type, timestamp: Date.now() }]);
  };

  const clearTerminal = () => setTerminalLogs([]);

  const getActiveFile = () => {
    const findFile = (list: EditorFile[]): EditorFile | undefined => {
      for (const f of list) {
        if (f.id === activeFileId) return f;
        if (f.children) {
          const found = findFile(f.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findFile(files);
  };

  return (
    <EditorContext.Provider value={{
      files, activeFileId, openFiles, terminalLogs, activePanelTab, isReadOnly,
      initializeWorkspace, openFile, closeFile, updateFileContent, createFile, deleteFile,
      setActivePanelTab, addTerminalLog, clearTerminal, setReadOnly, getActiveFile
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used within EditorProvider");
  return context;
};
