import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 cyber-grid">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none glow-indigo"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-[120px] pointer-events-none glow-purple"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-indigo-400 tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping"></span>
              <span>Nimbus V2 Core Engine Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              Deploy sandboxes.<br />
              <span className="text-gradient">Showcase modules.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed">
              Explore and run isolated containerized modules, neural network APIs, secure middlewares, and responsive widgets built by developers globally.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/projects')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                Browse Sandboxes
              </button>
              <button
                onClick={() => navigate(isAuthenticated ? '/publish' : '/login')}
                className="bg-[#111827]/60 border border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm active:scale-95"
              >
                Deploy Your Module
              </button>
            </div>

            {/* Quick Tech Badges */}
            <div className="pt-4 border-t border-gray-900/60 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="font-semibold uppercase tracking-wider text-gray-400">Supported stack:</span>
              <span className="px-2.5 py-1 bg-[#111827]/40 rounded-md border border-gray-900 font-mono">Docker</span>
              <span className="px-2.5 py-1 bg-[#111827]/40 rounded-md border border-gray-900 font-mono">React/Vite</span>
              <span className="px-2.5 py-1 bg-[#111827]/40 rounded-md border border-gray-900 font-mono">FastAPI</span>
              <span className="px-2.5 py-1 bg-[#111827]/40 rounded-md border border-gray-900 font-mono">Go / gRPC</span>
            </div>

          </div>

          {/* Hero Right: Terminal Graphics */}
          <div className="lg:col-span-5">
            <div className="w-full bg-[#0B0F19]/90 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative scanline">
              
              {/* Terminal Title Bar */}
              <div className="bg-[#111827]/80 px-4 py-3 border-b border-gray-800/80 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">nimbus-cli bash</span>
                <span className="w-6"></span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-xs text-left space-y-3.5 overflow-x-auto text-gray-300">
                <div>
                  <span className="text-gray-500">$</span> <span className="text-indigo-400">nimbus</span> login --api-key nmb_live_x82f...
                </div>
                <div className="text-emerald-400">✓ Auth connection established successfully.</div>
                <div>
                  <span className="text-gray-500">$</span> <span className="text-indigo-400">nimbus</span> deploy --dir ./sandbox --port 8000
                </div>
                <div className="text-gray-500 font-light">
                  📡 Scanning directory structure...<br />
                  📦 Compiling containerized assembly...<br />
                  🚀 Deploying module target to Kubernetes cluster...
                </div>
                <div className="pt-2">
                  <div className="bg-[#111827]/60 border border-indigo-500/20 rounded-xl p-3.5 space-y-1 text-[11px] text-gray-300">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">🚀 Status:</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <div><span className="text-indigo-400">Endpoint URL:</span> https://nimbus.live/sandbox/ide</div>
                    <div><span className="text-indigo-400">Port Binding:</span> TCP 8000 ↔ 443</div>
                    <div><span className="text-indigo-400">Active Node:</span> pods/nimbus-core-89bc4</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
