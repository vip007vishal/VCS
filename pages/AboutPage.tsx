import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { ArrowLeft, BrainCircuit, Users, Shield, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl font-bold text-white cursor-pointer" onClick={() => navigate('/')}>
                    <BrainCircuit className="text-indigo-500" /> SkillVerse AI
                </div>
                <Button variant="outline" onClick={() => navigate('/')}>
                    <ArrowLeft size={16} /> Back to Home
                </Button>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-6">About the Simulation</h1>
                <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                    SkillVerse AI is an advanced enterprise simulation platform designed to prepare professionals for the complexities of modern IT environments. By simulating Agile workflows, AI collaboration, and corporate hierarchy, we provide a safe sandbox to master real-world skills.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card title="The Mission" icon={TrendingUp}>
                        <p className="text-slate-300">
                            To bridge the gap between theoretical knowledge and practical application in the tech industry. We believe in learning by doing, even if that means failing in a simulated environment first.
                        </p>
                    </Card>
                    <Card title="AI Behavior Engine" icon={BrainCircuit}>
                        <p className="text-slate-300">
                            Our proprietary AI engine acts as your teammate, manager, or employee. It features dynamic mood states, confidence levels, and can even "hallucinate" code errors for you to catch.
                        </p>
                    </Card>
                    <Card title="Role-Based Ecosystem" icon={Users}>
                        <p className="text-slate-300">
                            Experience the company from every angle. Start as a Junior Developer, get promoted to Manager, or run the show as a CEO. Each role has unique dashboards and responsibilities.
                        </p>
                    </Card>
                    <Card title="Verification & Trust" icon={Shield}>
                        <p className="text-slate-300">
                            Just like the real world, trust is earned. Our verification engine tracks your reliability and performance, unlocking deeper levels of the simulation as you prove your worth.
                        </p>
                    </Card>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to enter the simulation?</h2>
                    <p className="text-slate-400 mb-6">Join thousands of users mastering the corporate meta.</p>
                    <Button onClick={() => navigate('/register')} className="px-8 py-3">Initialize User Profile</Button>
                </div>
            </main>
            
            <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
                &copy; 2024 SkillVerse AI. All rights reserved. System Version 1.0.4
            </footer>
        </div>
    );
};

export default AboutPage;