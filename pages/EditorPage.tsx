
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { EditorProvider, useEditor } from '../context/EditorContext';
import { EditorShell } from '../components/editor/EditorShell';
import { useSimulation } from '../context/SimulationContext';
import { EditorFile } from '../types';

// Templates for tasks (Mocking a backend fetch)
const getTemplateForTask = (taskId: string): EditorFile[] => {
    return [
        {
            id: 'f_readme',
            name: 'README.md',
            language: 'markdown',
            content: `# Task: ${taskId}\n\n## Objectives\n1. Refactor the authentication middleware.\n2. Ensure no race conditions exist.\n\n## Instructions\n- Edit the files in 'src/'.\n- Run tests before submitting.`
        },
        {
            id: 'f_src',
            name: 'src',
            isFolder: true,
            language: 'typescript',
            content: '',
            children: [
                {
                    id: 'f_index',
                    name: 'index.ts',
                    language: 'typescript',
                    content: `import { AuthMiddleware } from './auth';\n\nconst app = express();\napp.use(AuthMiddleware);\n\napp.listen(3000, () => {\n  console.log('Server started');\n});`
                },
                {
                    id: 'f_auth',
                    name: 'auth.ts',
                    language: 'typescript',
                    content: `export const AuthMiddleware = (req, res, next) => {\n  // TODO: Fix race condition here\n  const token = req.headers['authorization'];\n  if (token) {\n    next();\n  } else {\n    res.status(401).send('Unauthorized');\n  }\n};`
                }
            ]
        },
        {
            id: 'f_package',
            name: 'package.json',
            language: 'json',
            content: `{\n  "name": "task-solution",\n  "version": "1.0.0",\n  "dependencies": {\n    "express": "^4.17.1"\n  }\n}`
        }
    ];
};

const EditorContent: React.FC = () => {
    const { taskId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { tasks, submitTask, addNotification } = useSimulation();
    const { initializeWorkspace, setReadOnly, addTerminalLog } = useEditor();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const task = tasks.find(t => t.id === taskId);
    const viewMode = searchParams.get('view'); // 'review'

    useEffect(() => {
        if (!task) {
            navigate('/tasks');
            return;
        }

        // Initialize Virtual Workspace
        const template = getTemplateForTask(taskId || 'unknown');
        initializeWorkspace(template);

        if (viewMode === 'review') {
            setReadOnly(true);
            addTerminalLog('Editor opened in READ-ONLY review mode.', 'warning');
        } else {
            addTerminalLog(`Workspace initialized for task: ${task.title}`, 'info');
        }
    }, [taskId, viewMode]);

    const handleSave = () => {
        addTerminalLog('Workspace saved successfully.', 'success');
        addNotification('Saved', 'Project snapshot saved.', 'success');
    };

    const handleSubmit = async () => {
        if (!task) return;
        setIsSubmitting(true);
        addTerminalLog('Running final test suite...', 'info');
        
        setTimeout(async () => {
            // Mock submission process
            await submitTask(task.id, 'Code submission via IDE', 'Implemented mutex lock for token refresh.');
            setIsSubmitting(false);
            navigate('/tasks');
        }, 1500);
    };

    if (!task) return <div>Loading...</div>;

    return (
        <EditorShell 
            task={task} 
            onSave={handleSave} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
};

const EditorPage: React.FC = () => {
    return (
        <EditorProvider>
            <EditorContent />
        </EditorProvider>
    );
};

export default EditorPage;
