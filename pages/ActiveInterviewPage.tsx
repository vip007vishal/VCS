
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from '../components/UI';
import { Video, Clock, Bot, User, Send, Mic, MicOff, Volume2, VolumeX, Loader, Camera, CameraOff, Maximize, Activity, Square, Hourglass, Shield, ShieldAlert } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Interview } from '../types';

const AIChatConsole: React.FC<{ interview: Interview; isProctored: boolean }> = ({ interview, isProctored }) => {
    const { submitInterviewResponse, logInterviewViolation, startInterview } = useSimulation();
    const [input, setInput] = useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const recognitionRef = useRef<any>(null);
    const baseInputRef = useRef('');

    // Proctor Mode State
    const [violations, setViolations] = useState<{type: string, time: string}[]>([]);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0);
    
    // Camera & Media State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [permissionError, setPermissionError] = useState(false);

    const isFinished = interview.status === 'DECISION_PENDING' || interview.status === 'COMPLETED';

    // TRIGGER START ON MOUNT
    useEffect(() => {
        if (interview.transcript.length === 0 && interview.status !== 'COMPLETED') {
            startInterview(interview.id);
        }
    }, [interview.id]);

    // Helper to calculate question weight/time
    const calculateTimeForQuestion = (text: string) => {
        let duration = 60; // Base time 60s
        const lowerText = text.toLowerCase();
        if (text.length > 150) duration += 30; 
        if (lowerText.includes('design') || lowerText.includes('architecture')) duration += 60; 
        if (lowerText.includes('example') || lowerText.includes('scenario')) duration += 30; 
        return duration;
    };

    // Initialize Camera
    useEffect(() => {
        let stream: MediaStream | null = null;
        const startMedia = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setMediaStream(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setPermissionError(false);
            } catch (err) {
                console.error("Camera access error:", err);
                setPermissionError(true);
            }
        };

        if (interview.status === 'IN_PROGRESS' || interview.status === 'SCHEDULED') {
            startMedia();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Toggle Tracks
    useEffect(() => {
        if (mediaStream) {
            mediaStream.getVideoTracks().forEach(t => t.enabled = cameraOn);
            mediaStream.getAudioTracks().forEach(t => t.enabled = micOn);
        }
    }, [cameraOn, micOn, mediaStream]);

    // Proctor Logic
    useEffect(() => {
        if (!isProctored) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const msg = 'Tab Switch Detected';
                setViolations(prev => [...prev, { type: msg, time: new Date().toLocaleTimeString() }]);
                logInterviewViolation(interview.id, msg);
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                const msg = 'Exited Fullscreen';
                setViolations(prev => [...prev, { type: msg, time: new Date().toLocaleTimeString() }]);
                logInterviewViolation(interview.id, msg);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Attempt to enter fullscreen on mount if proctored
        document.documentElement.requestFullscreen().catch(err => console.log("Auto-fullscreen blocked", err));

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if(document.fullscreenElement) document.exitFullscreen();
        };
    }, [isProctored, interview.id]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const latest = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                
                const currentBase = baseInputRef.current;
                const newText = currentBase + (currentBase && latest ? ' ' : '') + latest;
                setInput(newText);
            };

            recognitionRef.current.onerror = (event: any) => {
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setIsListening(false);
                }
            };
        }
    }, []);

    // Text-to-Speech & Timer Logic
    useEffect(() => {
        if (interview.transcript.length > 0) {
            const lastMessage = interview.transcript[interview.transcript.length - 1];
            
            if (lastMessage.sender === 'AI') {
                const time = calculateTimeForQuestion(lastMessage.text);
                setTimeLeft(time);

                if (audioEnabled) {
                    const utterance = new SpeechSynthesisUtterance(lastMessage.text);
                    utterance.pitch = 0.8;
                    utterance.rate = 1.1;
                    utterance.onstart = () => setIsSpeaking(true);
                    utterance.onend = () => setIsSpeaking(false);
                    window.speechSynthesis.speak(utterance);
                }
            }
        }
    }, [interview.transcript, audioEnabled]);

    // Timer Countdown
    useEffect(() => {
        let interval: any;
        if (timeLeft > 0 && !isFinished && !isSpeaking && !isListening) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timeLeft, isFinished, isSpeaking, isListening]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [interview.transcript]);

    const handleSend = () => {
        if (!input.trim()) return;
        submitInterviewResponse(interview.id, input);
        setInput('');
        baseInputRef.current = '';
        setTimeLeft(0);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            baseInputRef.current = input;
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic start error", e);
            }
        }
    };

    return (
        <div className={`flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all ${isProctored ? 'border-indigo-500 ring-2 ring-indigo-500/20' : ''}`}>
            {/* Header */}
            <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${isFinished ? 'bg-slate-200 dark:bg-slate-700' : 'bg-indigo-600'}`}>
                        <Bot size={20} className={isFinished ? 'text-slate-500 dark:text-slate-300' : 'text-white'} />
                        {isSpeaking && <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping"></span>}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Sentinel AI</h4>
                        <div className="flex items-center gap-2">
                             <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                {isFinished ? (
                                    <span className="text-slate-500">Session Ended</span>
                                ) : (
                                    <>
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Live Interview
                                    </>
                                )}
                            </p>
                            <span className="text-slate-500 text-[10px] hidden sm:inline">| ID: {interview.id.split('_')[1]}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isFinished && timeLeft > 0 && (
                        <div className={`flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 ${isListening ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : ''}`}>
                            {isListening ? (
                                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase animate-pulse">Timer Paused</span>
                            ) : (
                                <>
                                    <Hourglass size={14} className={timeLeft < 15 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                                    <span className={`text-sm font-mono font-bold ${timeLeft < 15 ? 'text-rose-500' : 'text-slate-700 dark:text-white'}`}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    
                    {isProctored && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
                            <Shield size={14} />
                            Proctor Active
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            setAudioEnabled(!audioEnabled);
                            window.speechSynthesis.cancel();
                        }} 
                        className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${audioEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}
                        title="Toggle AI Voice"
                    >
                        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
                {/* Proctor Violation Overlay */}
                {violations.length > 0 && isProctored && (
                    <div className="absolute top-4 right-4 z-50 bg-rose-50 dark:bg-rose-950/90 border border-rose-200 dark:border-rose-500/50 rounded-lg p-3 w-64 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-5">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2 border-b border-rose-200 dark:border-rose-800 pb-1">
                            <ShieldAlert size={16} />
                            <span className="font-bold text-xs uppercase">Security Alert</span>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                            {violations.map((v, i) => (
                                <div key={i} className="text-[10px] text-rose-700 dark:text-rose-200 flex justify-between">
                                    <span>{v.type}</span>
                                    <span className="opacity-70">{v.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Left Panel: Video Feed */}
                <div className="lg:w-[400px] bg-slate-100 dark:bg-black p-4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
                    <div className="relative flex-1 bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-800 group shadow-inner">
                        {permissionError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                <CameraOff size={48} className="mb-2 opacity-50"/>
                                <p className="text-sm">Camera Disabled</p>
                            </div>
                        ) : (
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                muted 
                                playsInline 
                                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
                            />
                        )}
                        
                        {!cameraOn && !permissionError && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-800 flex items-center justify-center">
                                     <User size={40} className="text-slate-500"/>
                                 </div>
                             </div>
                        )}

                        {/* Proctor Watermark */}
                        {isProctored && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                                <Shield size={120} className="text-white mix-blend-overlay" />
                            </div>
                        )}

                        {/* Overlays */}
                        <div className="absolute top-3 left-3 flex gap-2">
                            <div className="px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-bold rounded flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> REC
                            </div>
                            {isProctored && (
                                <div className="px-2 py-0.5 bg-indigo-600/90 text-white text-[10px] font-bold rounded flex items-center gap-1">
                                    <Shield size={8} /> MONITORED
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => setCameraOn(!cameraOn)}
                                className={`p-2 rounded-full text-white backdrop-blur-md transition-colors ${cameraOn ? 'bg-slate-900/50 hover:bg-slate-800/80' : 'bg-red-500/80 hover:bg-red-600/80'}`}
                            >
                                {cameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
                            </button>
                             <button 
                                onClick={() => setMicOn(!micOn)}
                                className={`p-2 rounded-full text-white backdrop-blur-md transition-colors ${micOn ? 'bg-slate-900/50 hover:bg-slate-800/80' : 'bg-red-500/80 hover:bg-red-600/80'}`}
                            >
                                {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                            </button>
                             <button className="p-2 rounded-full bg-slate-900/50 text-white backdrop-blur-md hover:bg-slate-800/80">
                                <Maximize size={18} />
                            </button>
                        </div>
                    </div>
                    
                    {/* Audio Visualizer Mockup */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
                                 <Activity size={12} /> Mic Activity
                             </span>
                             <span className={`text-[10px] ${micOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600'}`}>
                                 {micOn ? 'Active' : 'Muted'}
                             </span>
                         </div>
                         <div className="flex items-center gap-1 h-4">
                             {[...Array(20)].map((_, i) => (
                                 <div 
                                    key={i} 
                                    className={`flex-1 rounded-full transition-all duration-75 ${micOn ? 'bg-emerald-500/50' : 'bg-slate-300 dark:bg-slate-800'}`}
                                    style={{ height: micOn ? `${Math.random() * 100}%` : '20%' }}
                                 ></div>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right Panel: Chat Transcript */}
                <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/30">
                     <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                        {interview.transcript.length === 0 && (
                            <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center h-full">
                                <Loader className="animate-spin mb-4 text-indigo-500" size={32} />
                                <p className="font-medium text-slate-700 dark:text-slate-300">Initializing Sentinel AI...</p>
                                <p className="text-xs text-slate-500 mt-2">Connecting to secure neural network</p>
                            </div>
                        )}
                        {interview.transcript.map((t, idx) => (
                            <div key={idx} className={`flex gap-4 ${t.sender === 'AI' ? '' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${t.sender === 'AI' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                    {t.sender === 'AI' ? <Bot size={16} className="text-white"/> : <User size={16} className="text-slate-600 dark:text-slate-300"/>}
                                </div>
                                <div className={`p-4 rounded-xl max-w-[85%] text-sm leading-relaxed shadow-sm ${t.sender === 'AI' ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700' : 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-500/30 text-slate-800 dark:text-white rounded-tr-none'}`}>
                                    {t.text}
                                </div>
                            </div>
                        ))}
                        {isFinished && (
                            <div className="text-center py-4">
                                <Badge color="green">Interview Concluded</Badge>
                                <p className="text-sm text-slate-500 mt-2">The hiring manager will review your results shortly.</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleListening}
                                disabled={isFinished}
                                className={`p-3 rounded-lg transition-all flex items-center gap-2 font-bold text-xs ${isListening ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                title={isListening ? "Stop Recording" : "Click to Record"}
                            >
                                {isListening ? (
                                    <>
                                        <Square size={18} className="fill-current" /> Stop
                                    </>
                                ) : (
                                    <>
                                        <Mic size={18} /> Record
                                    </>
                                )}
                            </button>
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isFinished && handleSend()}
                                onPaste={(e) => isProctored && e.preventDefault()} 
                                placeholder={isListening ? "Recording answer..." : isFinished ? "Session ended." : isProctored ? "Type your answer... (Copy/Paste Disabled)" : "Type your answer..."}
                                disabled={isFinished || isListening}
                                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:border-indigo-500 outline-none disabled:opacity-50 transition-colors"
                            />
                            <Button onClick={handleSend} disabled={!input.trim() || isFinished || isListening}>
                                <Send size={18} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActiveInterviewPage: React.FC = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { interviews } = useSimulation();
    
    // Retrieve proctor state passed via navigation state, default to true if missing
    const isProctored = location.state?.proctorMode ?? true;

    const activeInterview = interviews.find(i => i.id === interviewId);

    if (!activeInterview) {
        return (
            <div className="flex items-center justify-center h-screen text-slate-500">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Interview Not Found</h2>
                    <Button onClick={() => navigate('/interviews')}>Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 h-full">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Session: {activeInterview.candidateName}</h3>
                <Button variant="outline" onClick={() => navigate('/interviews')}>Exit Session</Button>
            </div>
            <AIChatConsole interview={activeInterview} isProctored={isProctored} />
        </div>
    );
};

export default ActiveInterviewPage;
