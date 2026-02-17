import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Users, Lock, ChevronRight } from 'lucide-react';
import { Button } from '../components/UI';

const Feature: React.FC<{ icon: any; title: string; text: string }> = ({ icon: Icon, title, text }) => (
  <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all hover:-translate-y-1">
    <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 text-indigo-400">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{text}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 cursor-pointer">
          SkillVerse AI
        </div>
        <div className="flex gap-4 items-center">
           <button onClick={() => navigate('/about')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</button>
           <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
           <Button onClick={() => navigate('/register')}>Get Started <ArrowRight size={16} /></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-medium mb-6">
            The World's First IT Company Simulator
          </span>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Master the <span className="text-indigo-500">Corporate World</span><br/>Before You Enter It.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Experience real-world Agile workflows, handle AI teammates, manage budgets, and climb the ladder from Junior Dev to CEO.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="px-8 py-4 text-lg" onClick={() => navigate('/register')}>Start Simulation</Button>
            <Button variant="secondary" className="px-8 py-4 text-lg" onClick={() => navigate('/about')}>Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <Feature 
          icon={Activity} 
          title="Real-time Metrics" 
          text="Track productivity, burnout, revenue, and code quality in real-time with our advanced engine."
        />
        <Feature 
          icon={Users} 
          title="AI Collaboration" 
          text="Work alongside AI agents that code, make mistakes, and have mood swings just like real humans."
        />
        <Feature 
          icon={Lock} 
          title="Career Progression" 
          text="Unlock higher roles through our verification engine. Prove your skills to become a Founder."
        />
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-3xl font-bold mb-12">Built for every role</h2>
           <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
             <img src="https://picsum.photos/1200/600?grayscale" alt="Dashboard Preview" className="w-full h-auto opacity-50" />
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <Button variant="outline" onClick={() => navigate('/login')}>Explore Dashboards <ChevronRight size={16}/></Button>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;