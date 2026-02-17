import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';
import { Methodology } from '../types';
import { Calendar, Clock, Video, Mic, MicOff, PhoneOff, Bot, User } from 'lucide-react';

const MeetingRoom: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { aiState } = useSimulation();
    const [isMuted, setIsMuted] = useState(false);
    
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="aspect-video bg-slate-800 rounded-lg flex flex-col items-center justify-center relative overflow-hidden border border-slate-700">
                    <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-xs text-white">
                        AI Copilot
                    </div>
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-2 animate-pulse">
                        <Bot size={40} className="text-white" />
                    </div>
                    <div className="flex gap-2 text-xs">
                        <Badge color={aiState.mood === 'Stressed' ? 'red' : 'green'}>{aiState.mood}</Badge>
                        <Badge color="blue">Conf: {aiState.confidence}%</Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/50 p-2 rounded text-[10px] text-slate-300 backdrop-blur-sm">
                        Talking: "I've analyzed the sprint velocity..."
                    </div>
                </div>

                <div className="aspect-video bg-slate-800 rounded-lg flex flex-col items-center justify-center relative border border-slate-700">
                     <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-xs text-white">
                        You
                    </div>
                    <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center">
                        <User size={40} className="text-slate-300" />
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg mb-6 h-40 overflow-y-auto border border-slate-800">
                <p className="text-xs font-bold text-indigo-400 mb-1">AI Copilot</p>
                <p className="text-sm text-slate-300 mb-3">Based on current burn rate, we need to deploy the hotfix by 4 PM.</p>
                <p className="text-xs font-bold text-slate-400 mb-1">Manager</p>
                <p className="text-sm text-slate-300 mb-3">Agreed. Lets prioritize ticket #455.</p>
            </div>

            <div className="flex justify-center gap-4">
                <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-4 rounded-full ${isMuted ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-700 hover:bg-slate-600'} text-white transition-colors`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button 
                    onClick={onClose}
                    className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

const MeetingsPage: React.FC = () => {
    const { meetings, company } = useSimulation();
    const [activeTab, setActiveTab] = useState('');
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);
    const [tabs, setTabs] = useState<string[]>([]);

    useEffect(() => {
        let newTabs: string[] = [];
        if (company.methodology === Methodology.KANBAN) {
            newTabs = ['Daily Sync', 'Replenishment', 'Service Delivery', '1:1'];
        } else if (company.methodology === Methodology.WATERFALL) {
             newTabs = ['Status Update', 'Phase Review', 'Steering Comm.', '1:1'];
        } else {
             newTabs = ['Standup', 'Sprint Planning', 'Retro', '1:1', 'Townhall'];
        }
        setTabs(newTabs);
        setActiveTab(newTabs[0]);
    }, [company.methodology]);


    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">Meetings & Events</h2>
                 <Badge color="blue">{company.methodology} Protocol</Badge>
             </div>

            <div className="flex space-x-2 border-b border-slate-800 pb-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                            activeTab === tab 
                            ? 'bg-slate-800 text-indigo-400 border-t border-x border-slate-700' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={`Upcoming ${activeTab}s`} icon={Calendar}>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-900/30 p-3 rounded-lg text-indigo-400">
                                    <Video size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200">{activeTab} - Team Alpha</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <Clock size={12} />
                                        <span>10:00 AM - 10:15 AM</span>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                        <span>Starting in 5m</span>
                                    </div>
                                    <div className="flex -space-x-2 mt-2">
                                        {['A','B','C'].map((i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button onClick={() => setIsMeetingOpen(true)}>Join Now</Button>
                        </div>
                    </div>
                </Card>

                <Card title="Meeting Notes (AI Generated)" icon={Bot}>
                    <div className="space-y-4 text-sm">
                        <div className="p-3 bg-slate-800 rounded border-l-2 border-emerald-500">
                            <p className="font-bold text-slate-300 mb-1">Previous Summary</p>
                            <ul className="list-disc list-inside text-slate-400 space-y-1">
                                <li>Velocity increased by 15%.</li>
                                <li>Deployment pipeline needs optimization.</li>
                                <li>AI Copilot accuracy was 92%.</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-slate-800 rounded border-l-2 border-amber-500">
                            <p className="font-bold text-slate-300 mb-1">Action Items</p>
                            <p className="text-slate-400">Review PR #882 by EOD. Schedule follow-up on API latency.</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Modal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} title="Live Meeting">
                <MeetingRoom onClose={() => setIsMeetingOpen(false)} />
            </Modal>
        </div>
    );
};

export default MeetingsPage;