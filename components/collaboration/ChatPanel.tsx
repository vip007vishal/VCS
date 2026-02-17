import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { MessageSquare, MoreHorizontal, Paperclip, Send, Bot } from 'lucide-react';

const ChatBubble: React.FC<{ isAi?: boolean; text: string; time: string }> = ({ isAi, text, time }) => (
  <div className={`flex gap-3 ${isAi ? '' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAi ? 'bg-indigo-600' : 'bg-slate-600'}`}>
      {isAi ? <Bot size={16} className="text-white" /> : <span className="text-xs font-bold text-white">ME</span>}
    </div>
    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${isAi ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
      <p>{text}</p>
      <span className="text-[10px] opacity-60 mt-1 block">{time}</span>
    </div>
  </div>
);

export const ChatPanel: React.FC = () => {
    const { aiState } = useSimulation();
    const [chatMessage, setChatMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, isAi: true, text: "I've analyzed the backlog. Task #T-102 has high complexity risk.", time: "10:02 AM" },
        { id: 2, isAi: false, text: "Thanks, I'll break it down into subtasks.", time: "10:05 AM" },
        { id: 3, isAi: true, text: "Acknowledged. Updating sprint velocity metrics.", time: "10:05 AM" }
    ]);

    const handleSend = () => {
        if (!chatMessage.trim()) return;
        const newMsg = { id: Date.now(), isAi: false, text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMsg]);
        setChatMessage('');

        // Simulate AI Response
        setTimeout(() => {
            const aiResponses = [
                "I've updated the ticket status.",
                "Should I run the test suite for that?",
                "Noted. Logging to daily report.",
                "That aligns with the current sprint goal."
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            setMessages(prev => [...prev, { id: Date.now(), isAi: true, text: randomResponse, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1500);
    };

    return (
        <div className="w-80 flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm h-full">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <div className="flex flex-col">
                  <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                    <MessageSquare size={18} className="text-indigo-400" />
                    Team Chat
                  </h3>
                  <span className="text-[10px] text-slate-500 ml-6">via {aiState.model}</span>
              </div>
              <MoreHorizontal size={16} className="text-slate-500 cursor-pointer" />
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/30 flex flex-col">
              {messages.map(m => (
                  <ChatBubble key={m.id} isAi={m.isAi} text={m.text} time={m.time} />
              ))}
              {aiState.mood === 'Stressed' && (
                 <div className="text-xs text-rose-400 italic text-center">AI is re-calculating due to high load...</div>
              )}
            </div>

            <div className="p-3 bg-slate-800 border-t border-slate-700">
               <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors">
                  <Paperclip size={18} className="text-slate-500 cursor-pointer hover:text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Message team or @AI..." 
                    className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder:text-slate-600"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button className="text-indigo-500 hover:text-indigo-400" onClick={handleSend}>
                    <Send size={18} />
                  </button>
               </div>
            </div>
        </div>
    );
};