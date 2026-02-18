
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Badge, Input } from '../components/UI';
import { Video, Clock, CheckCircle, Upload, Bot, User, Send, PlayCircle, Mic, MicOff, Volume2, VolumeX, AlertTriangle, Loader, Camera, CameraOff, Maximize, Activity, PauseCircle, Square, Hourglass, Shield, ShieldAlert, EyeOff } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { Interview, ResumeStatus } from '../types';

const ResumeUploader: React.FC = () => {
    const { uploadResume, currentUser, resumes } = useSimulation();
    const [isUploading, setIsUploading] = useState(false);

    const myResume = resumes.find(r => r.userId === currentUser?.id);

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const file = e.target.files[0];
            try {
                await uploadResume(file);
            } catch (e) {
                console.error(e);
            } finally {
                setIsUploading(false);
            }
        }
    };

    if (myResume) {
        return (
            <div className={`p-6 border rounded-xl flex items-center justify-between ${myResume.status === ResumeStatus.APPROVED ? 'bg-slate-900/50 border-emerald-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${myResume.status === ResumeStatus.APPROVED ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Resume Status</h3>
                        <p className="text-sm text-slate-400">{myResume.fileName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {myResume.status === ResumeStatus.PENDING_VALIDATION && (
                        <Badge color="yellow">Pending Validation</Badge>
                    )}
                    {myResume.status === ResumeStatus.APPROVED && (
                        <Badge color="green">Ready for Interview</Badge>
                    )}
                    {myResume.status === ResumeStatus.REJECTED && (
                        <Badge color="red">Rejected</Badge>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl hover:border-indigo-500 transition-colors bg-slate-900/20 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400">
                <Upload size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Your Resume</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">To start the interview process, our AI needs to analyze your skills and experience. PDF supported.</p>
            
            <div className="relative inline-block">
                <Button disabled={isUploading}>
                    {isUploading ? 'Analyzing...' : 'Select File'}
                </Button>
                <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleFile}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isUploading}
                />
            </div>
        </div>
    );
};

const AIChatConsole: React.FC<{ interview: Interview; isProctored: boolean }> = ({ interview, isProctored }) => {
    const { submitInterviewResponse, logInterviewViolation } = useSimulation();
    const [input, setInput] = useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Proctor Mode State (Local tracking for UI, violations sent to context)
    const [violations, setViolations] = useState<{type: string, time: string}[]>([]);

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0);
    const [maxTime, setMaxTime] = useState(0);

    // Camera & Media State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [cameraOn, setCameraOn] = useState(true);
    const [micOn, setMicOn] = useState(true);
    const [permissionError, setPermissionError] = useState(false);

    const isFinished = interview.status === 'DECISION_PENDING' || interview.status === 'COMPLETED';

    // Helper to calculate question weight/time
    const calculateTimeForQuestion = (text: string) => {
        let duration = 60; // Base time 60s
        const lowerText = text.toLowerCase();
        
        // Complexity heuristics
        if (text.length > 150) duration += 30; // Long question
        if (lowerText.includes('design') || lowerText.includes('architecture')) duration += 60; // System design
        if (lowerText.includes('example') || lowerText.includes('scenario')) duration += 30; // Behavioral
        
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

        if (interview.status === 'IN_PROGRESS') {
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

    // Proctor Logic: Tab Switching & Fullscreen Detection
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
            recognitionRef.current.continuous = true; // Key change: Continuous recording
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        // Handle interim if needed
                        setInput(prev => prev); 
                    }
                }
                // Just grabbing the latest complete transcript for the input box
                const latest = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setInput(latest);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setIsListening(false);
                }
            };

            recognitionRef.current.onend = () => {
                // If we didn't explicitly stop it (isListening is still true), restart it
                // This handles silence timeouts
                // However, we are controlling state via button, so we handle logic there
            };
        }
    }, []);

    // Text-to-Speech & Timer Logic
    useEffect(() => {
        if (interview.transcript.length > 0) {
            const lastMessage = interview.transcript[interview.transcript.length - 1];
            
            // If AI just spoke, read it and set timer
            if (lastMessage.sender === 'AI') {
                // 1. Set Timer
                const time = calculateTimeForQuestion(lastMessage.text);
                setMaxTime(time);
                setTimeLeft(time);

                // 2. Speak
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
        // Pause timer if listening (recording)
        if (timeLeft > 0 && !isFinished && !isSpeaking && !isListening) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isFinished && !isSpeaking && interview.transcript.length > 0) {
            // Time ran out!
            // Optional: Auto-submit or warn
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
        setTimeLeft(0); // Stop timer while waiting
    };

    const toggleListening = () => {
        if (isListening) {
            // STOP RECORDING
            recognitionRef.current?.stop();
            setIsListening(false);
            // Auto submit when stopping recording
            if (input.trim().length > 0) {
                handleSend();
            }
        } else {
            // START RECORDING
            setInput('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic start error", e);
            }
        }
    };

    return (
        <div className={`flex flex-col h-[700px] bg-slate-900 border rounded-xl overflow-hidden shadow-2xl transition-all ${isProctored ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'}`}>
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${isFinished ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                        <Bot size={20} className="text-white" />
                        {isSpeaking && <span className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping"></span>}
                    </div>
                    <div>
                        <h4 className="font-bold text-white">Sentinel AI</h4>
                        <div className="flex items-center gap-2">
                             <p className="text-xs text-emerald-400 flex items-center gap-1">
                                {isFinished ? (
                                    <span className="text-slate-500">Session Ended</span>
                                ) : (
                                    <>
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Live Interview
                                    </>
                                )}
                            </p>
                            <span className="text-slate-600 text-[10px] hidden sm:inline">| ID: {interview.id.split('_')[1]}</span>
                        </div>
                       
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isFinished && timeLeft > 0 && (
                        <div className={`flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-700 ${isListening ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : ''}`}>
                            {isListening ? (
                                <span className="text-xs text-indigo-400 font-bold uppercase animate-pulse">Timer Paused</span>
                            ) : (
                                <>
                                    <Hourglass size={14} className={timeLeft < 15 ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                                    <span className={`text-sm font-mono font-bold ${timeLeft < 15 ? 'text-rose-500' : 'text-white'}`}>
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    
                    {isProctored && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            <Shield size={14} />
                            Proctor Active
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            setAudioEnabled(!audioEnabled);
                            window.speechSynthesis.cancel();
                        }} 
                        className={`p-2 rounded-full hover:bg-slate-700 transition-colors ${audioEnabled ? 'text-indigo-400' : 'text-slate-500'}`}
                        title="Toggle AI Voice"
                    >
                        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
                {/* Proctor Violation Overlay (If any) */}
                {violations.length > 0 && isProctored && (
                    <div className="absolute top-4 right-4 z-50 bg-rose-950/90 border border-rose-500/50 rounded-lg p-3 w-64 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-5">
                        <div className="flex items-center gap-2 text-rose-400 mb-2 border-b border-rose-800 pb-1">
                            <ShieldAlert size={16} />
                            <span className="font-bold text-xs uppercase">Security Alert</span>
                        </div>
                        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                            {violations.map((v, i) => (
                                <div key={i} className="text-[10px] text-rose-200 flex justify-between">
                                    <span>{v.type}</span>
                                    <span className="opacity-70">{v.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Left Panel: Video Feed */}
                <div className="lg:w-[400px] bg-black p-4 flex flex-col gap-4 border-b lg:border-b-0 lg:border-r border-slate-800">
                    <div className="relative flex-1 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 group">
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
                                 <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                                     <User size={40} className="text-slate-500"/>
                                 </div>
                             </div>
                        )}

                        {/* Proctor Watermark */}
                        {isProctored && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                                <Shield size={120} className="text-white" />
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
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-800">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1">
                                 <Activity size={12} /> Mic Activity
                             </span>
                             <span className={`text-[10px] ${micOn ? 'text-emerald-400' : 'text-slate-600'}`}>
                                 {micOn ? 'Active' : 'Muted'}
                             </span>
                         </div>
                         <div className="flex items-center gap-1 h-4">
                             {[...Array(20)].map((_, i) => (
                                 <div 
                                    key={i} 
                                    className={`flex-1 rounded-full transition-all duration-75 ${micOn ? 'bg-emerald-500/50' : 'bg-slate-800'}`}
                                    style={{ height: micOn ? `${Math.random() * 100}%` : '20%' }}
                                 ></div>
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right Panel: Chat Transcript */}
                <div className="flex-1 flex flex-col bg-slate-900/30">
                     <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                        {interview.transcript.length === 0 && (
                            <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                                <Loader className="animate-spin mb-2" />
                                <p>Initializing Sentinel AI...</p>
                            </div>
                        )}
                        {interview.transcript.map((t, idx) => (
                            <div key={idx} className={`flex gap-4 ${t.sender === 'AI' ? '' : 'flex-row-reverse'}`}>
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${t.sender === 'AI' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                    {t.sender === 'AI' ? <Bot size={16} className="text-white"/> : <User size={16} className="text-slate-300"/>}
                                </div>
                                <div className={`p-4 rounded-xl max-w-[85%] text-sm leading-relaxed ${t.sender === 'AI' ? 'bg-slate-800 text-slate-200 rounded-tl-none' : 'bg-indigo-900/30 border border-indigo-500/30 text-white rounded-tr-none'}`}>
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
                    <div className="p-4 bg-slate-800 border-t border-slate-700">
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleListening}
                                disabled={isFinished}
                                className={`p-3 rounded-lg transition-all flex items-center gap-2 font-bold text-xs ${isListening ? 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                                title={isListening ? "Stop & Submit" : "Click to Record"}
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
                                onPaste={(e) => isProctored && e.preventDefault()} // Disable Paste in Proctor Mode
                                placeholder={isListening ? "Recording answer..." : isFinished ? "Session ended." : isProctored ? "Type your answer... (Copy/Paste Disabled)" : "Type your answer..."}
                                disabled={isFinished || isListening}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none disabled:opacity-50"
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

const InterviewsPage: React.FC = () => {
    const { currentUser, interviews, startInterview, pauseInterview } = useSimulation();
    const [useProctor, setUseProctor] = useState(true); // Default to on

    // Filter interviews for the current user
    const myInterviews = interviews.filter(i => i.candidateId === currentUser?.id);
    const activeInterview = myInterviews.find(i => i.status === 'IN_PROGRESS');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">My Interviews</h2>

            {/* If in an active interview, show the console */}
            {activeInterview ? (
                <div className="max-w-6xl mx-auto">
                     <div className="mb-4">
                         <div onClick={() => pauseInterview(activeInterview.id)} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white cursor-pointer mb-2">
                             &larr; Exit Session (Progress Saved)
                         </div>
                     </div>
                     <AIChatConsole interview={activeInterview} isProctored={useProctor} />
                     <div className="mt-6">
                         <Card title="Interview Status">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Current Phase</span>
                                    <span className="text-indigo-400 font-bold">{activeInterview.currentPhase || 'Active'}</span>
                                </div>
                                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                     <div className="bg-indigo-500 h-full" style={{ width: '60%' }}></div>
                                </div>
                                <div className="pt-4 border-t border-slate-700">
                                    <p className="text-xs text-slate-500">
                                        <strong>Candidate Notice:</strong> Your camera and microphone are being streamed to the interview panel. 
                                        Ensure you are in a quiet, well-lit environment.
                                    </p>
                                </div>
                            </div>
                        </Card>
                     </div>
                </div>
            ) : (
                <>
                    <ResumeUploader />
                    
                    <div className="mt-8">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-xl font-bold text-white">Upcoming Schedule</h3>
                            {/* Dashboard Toggle for Proctor Mode */}
                            <button
                                onClick={() => setUseProctor(!useProctor)}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${useProctor ? 'bg-indigo-900/30 border-indigo-500/50 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                            >
                                <div className={`w-8 h-4 rounded-full relative transition-colors ${useProctor ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${useProctor ? 'translate-x-4' : ''}`}></div>
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold flex items-center gap-1">
                                        {useProctor ? <Shield size={12} /> : <EyeOff size={12} />}
                                        {useProctor ? 'Proctoring Enabled' : 'Normal Mode'}
                                    </div>
                                    <div className="text-[10px] opacity-70">Monitors fullscreen & focus</div>
                                </div>
                            </button>
                        </div>

                        {myInterviews.length === 0 ? (
                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500">
                                No interviews scheduled.
                                <br />
                                <span className="text-xs text-slate-600">Ensure your resume is approved by the Validation Center first.</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myInterviews.map(interview => (
                                    <div key={interview.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl flex justify-between items-center hover:border-indigo-500/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${interview.type === 'AI' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                                                {interview.type === 'AI' ? <Bot size={24}/> : <Video size={24}/>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{interview.type} Screening</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <Clock size={12}/>
                                                    <span>{interview.scheduledTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            {interview.status === 'SCHEDULED' ? (
                                                <Button onClick={() => startInterview(interview.id)}>
                                                    <PlayCircle size={16}/> Start Session
                                                </Button>
                                            ) : interview.status === 'PAUSED' ? (
                                                <Button onClick={() => startInterview(interview.id)} variant="secondary">
                                                    <PauseCircle size={16}/> Resume Session
                                                </Button>
                                            ) : interview.status === 'DECISION_PENDING' ? (
                                                <Badge color="yellow">Evaluation Pending</Badge>
                                            ) : (
                                                <Badge color={interview.status === 'HIRED' ? 'green' : 'red'}>{interview.status}</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default InterviewsPage;
