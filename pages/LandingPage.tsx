import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Activity, Users, Lock, ChevronRight, BrainCircuit, 
  Briefcase, TrendingUp, Shield, Zap, Layout, CheckCircle, PlayCircle 
} from 'lucide-react';
import { Button, Badge, Card } from '../components/UI';
import { useSimulation } from '../context/SimulationContext';

const DashboardPreview: React.FC<{ role: string; image: string; features: string[] }> = ({ role, image, features }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
    <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
      </div>
      <div className="bg-slate-900 px-3 py-1 rounded text-[10px] text-slate-500 flex-1 text-center font-mono">
        skillverse.ai/dashboard/{role.toLowerCase()}
      </div>
    </div>
    <div className="relative group cursor-pointer">
        <img src={image} alt={`${role} Dashboard`} className="w-full h-[300px] object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="text-2xl font-bold text-white mb-2">{role} Dashboard</h3>
            <div className="flex flex-wrap gap-2">
                {features.map(f => (
                    <Badge key={f} color="blue">{f}</Badge>
                ))}
            </div>
        </div>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { availableCompanies } = useSimulation();
  const [activePreview, setActivePreview] = useState<'Employee' | 'Manager' | 'CEO'>('Employee');

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <BrainCircuit className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              SkillVerse AI
            </span>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-9 text-sm" onClick={() => navigate('/login')}>Login</Button>
             <Button className="h-9 text-sm" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge color="purple" className="mb-6 px-4 py-1 text-sm">v1.0 Now Live: Enhanced AI Hiring Engine</Badge>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
            The Enterprise <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Simulation Platform</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Master the corporate world before you enter it. Experience real-world Agile workflows, manage AI employees, and climb the ladder from Junior Dev to CEO in a risk-free environment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="px-8 py-4 text-lg shadow-xl shadow-indigo-900/20" onClick={() => navigate('/register')}>
                Initialize Simulation <ArrowRight size={20} />
            </Button>
            <Button variant="secondary" className="px-8 py-4 text-lg" onClick={() => document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })}>
                View Dashboard Demo
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center gap-8 text-slate-500 grayscale opacity-60">
             <div className="flex items-center gap-2"><Zap size={16}/> Instant Feedback</div>
             <div className="flex items-center gap-2"><Lock size={16}/> Secure Environment</div>
             <div className="flex items-center gap-2"><Users size={16}/> Multi-Role System</div>
          </div>
        </div>
      </section>

      {/* Role Preview Section */}
      <section id="preview" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">One Platform, Every Perspective</h2>
                <p className="text-slate-400">Switch roles instantly to understand the entire business ecosystem.</p>
            </div>

            <div className="flex justify-center gap-4 mb-12">
                {['Employee', 'Manager', 'CEO'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setActivePreview(role as any)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activePreview === role ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                    >
                        {role} View
                    </button>
                ))}
            </div>

            <div className="max-w-5xl mx-auto">
                {activePreview === 'Employee' && (
                    <DashboardPreview 
                        role="Employee" 
                        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                        features={['Task Management', 'Skill Radar', 'Coding Challenges', 'Peer Reviews']} 
                    />
                )}
                {activePreview === 'Manager' && (
                    <DashboardPreview 
                        role="Manager" 
                        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2340" 
                        features={['Team Allocation', 'Hiring Pipeline', 'Performance Reviews', 'Burnout Monitoring']} 
                    />
                )}
                {activePreview === 'CEO' && (
                    <DashboardPreview 
                        role="CEO" 
                        image="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340" 
                        features={['Financial Projections', 'Market Strategy', 'Company Methodology', 'Investor Relations']} 
                    />
                )}
            </div>
        </div>
      </section>

      {/* Workflow Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-indigo-500 transition-colors group">
                <div className="w-14 h-14 bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                    <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real-Time Metrics</h3>
                <p className="text-slate-400 leading-relaxed">
                    Our engine calculates revenue, trust scores, and team velocity in real-time based on your decisions. Every commit matters.
                </p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-emerald-500 transition-colors group">
                <div className="w-14 h-14 bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                    <BrainCircuit size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Coworkers</h3>
                <p className="text-slate-400 leading-relaxed">
                    Collaborate with "Sentinel AI" agents. They write code, attend meetings, and even have mood swings based on project stress.
                </p>
            </div>
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-amber-500 transition-colors group">
                <div className="w-14 h-14 bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                    <Shield size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Verification Engine</h3>
                <p className="text-slate-400 leading-relaxed">
                    Prove your worth. Upload documents, pass AI interviews, and earn verification badges to unlock senior roles and admin privileges.
                </p>
            </div>
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-24 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Choose Your Path</h2>
                    <p className="text-slate-400">Select a company that fits your working style.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/register')}>View All Openings</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availableCompanies.map((company) => (
                    <div key={company.id} className="bg-slate-950 border border-slate-800 p-6 rounded-xl hover:border-indigo-500 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-indigo-900/20 transition-colors">
                                <Layout size={24} className="text-indigo-400" />
                            </div>
                            <Badge color="blue">{company.methodology}</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                        <p className="text-sm text-slate-400 mb-6 line-clamp-2">{company.description}</p>
                        
                        <div className="space-y-3 pt-6 border-t border-slate-800">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">AI Model</span>
                                <span className="text-slate-300 font-mono">{company.aiModel}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Market Cap</span>
                                <span className="text-emerald-400 font-bold">${(company.revenue / 1000000).toFixed(1)}M</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* AI Interview Teaser */}
      <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/10 -skew-y-3 transform origin-top-left"></div>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                  <Badge color="purple" className="mb-4">New Feature</Badge>
                  <h2 className="text-4xl font-bold text-white mb-6">AI-Driven Interview Process</h2>
                  <p className="text-lg text-slate-400 mb-8">
                      Before you can join a team, you must pass a rigorous interview with "Sentinel AI". 
                      It analyzes your resume, asks contextual technical questions, and scores your responses in real-time.
                  </p>
                  <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-slate-300">
                          <CheckCircle className="text-emerald-400" size={20} />
                          <span>Resume PDF Analysis & Parsing</span>
                      </li>
                      <li className="flex items-center gap-3 text-slate-300">
                          <CheckCircle className="text-emerald-400" size={20} />
                          <span>Adaptive Questioning Engine</span>
                      </li>
                      <li className="flex items-center gap-3 text-slate-300">
                          <CheckCircle className="text-emerald-400" size={20} />
                          <span>Voice & Text Modalities</span>
                      </li>
                  </ul>
                  <Button onClick={() => navigate('/register')} className="gap-2">
                      <PlayCircle size={20} /> Try the Interview
                  </Button>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl relative">
                  <div className="absolute -top-4 -right-4 bg-indigo-600 px-4 py-1 rounded text-xs font-bold text-white shadow-lg">LIVE DEMO</div>
                  <div className="flex gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                          <BrainCircuit className="text-white" size={24} />
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl rounded-tl-none text-sm text-slate-200 flex-1">
                          <p>Based on your resume, you have 3 years of React experience. Explain how you would optimize a large list rendering performance.</p>
                      </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                          <div className="text-xs font-bold text-white">YOU</div>
                      </div>
                      <div className="bg-indigo-900/30 border border-indigo-500/30 p-4 rounded-xl rounded-tr-none text-sm text-white flex-1">
                          <p>I would use virtualization techniques like windowing to only render items in the viewport...</p>
                      </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center text-xs text-slate-500">
                      <span>Sentiment: <span className="text-emerald-400">Professional</span></span>
                      <span>Score: <span className="text-indigo-400 font-bold">92/100</span></span>
                  </div>
              </div>
          </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-20 pb-10 px-6">
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to enter the simulation?</h2>
              <p className="text-slate-400 mb-10">Join thousands of users mastering the corporate meta. No credit card required.</p>
              <div className="flex justify-center gap-4 mb-16">
                  <Button onClick={() => navigate('/register')} className="px-8 py-3 text-lg">Start Free Simulation</Button>
                  <Button variant="outline" onClick={() => navigate('/login')} className="px-8 py-3 text-lg">Log In</Button>
              </div>
              <div className="text-slate-600 text-sm">
                  &copy; 2024 SkillVerse AI. All rights reserved. System Version 1.0.5
              </div>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;