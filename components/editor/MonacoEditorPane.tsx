
import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '../../context/EditorContext';
import { Terminal } from 'lucide-react';

export const MonacoEditorPane: React.FC = () => {
  const { activeFileId, getActiveFile, updateFileContent, isReadOnly } = useEditor();
  const activeFile = getActiveFile();

  if (!activeFileId || !activeFile) {
    return (
      <div className="flex-1 bg-[#1e1e1e] flex flex-col items-center justify-center text-slate-500">
        <Terminal size={64} className="opacity-20 mb-4" />
        <p>Select a file to start editing</p>
        <p className="text-xs mt-2 opacity-50">SkillVerse Code Engine v1.0</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1e1e1e] relative">
      <Editor
        height="100%"
        defaultLanguage={activeFile.language}
        language={activeFile.language}
        value={activeFile.content}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: isReadOnly,
          padding: { top: 16 }
        }}
        onChange={(value) => updateFileContent(activeFileId, value || '')}
      />
    </div>
  );
};
