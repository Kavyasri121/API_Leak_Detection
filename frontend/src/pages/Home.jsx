import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Search, Lock } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
          <Lock className="w-3 h-3" /> Passive Detection Engine
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
          Detect. Protect. Secure.
        </h1>
        <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          KeyShield AI is a modern cybersecurity platform simulating real-time detection of exposed API keys and secrets in your code, logs, and public repos.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/scanner" 
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl overflow-hidden active:scale-95 transition-all outline-none focus:ring-4 focus:ring-indigo-500/50 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25"
        >
          <Search className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:scale-110 transition-transform" />
          Start Scanning
        </Link>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-16 text-left">
        {[
          { icon: <Search className="text-pink-400" />, title: "Instant Detection", desc: "Scan massive logs and codebases in milliseconds with highly optimized regex engines." },
          { icon: <ShieldCheck className="text-emerald-400" />, title: "Wide Coverage", desc: "Recognize patterns for AWS, OpenAI, and other high-value secrets." },
          { icon: <Lock className="text-indigo-400" />, title: "Passive Only", desc: "No keys are stored or actively validated against provider endpoints. 100% simulated." },
        ].map((feat, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center mb-4 border border-slate-800">
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">{feat.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Home;
