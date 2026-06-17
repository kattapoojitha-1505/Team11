import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100-16)] bg-[#070A13] flex items-center justify-center p-6 cyber-grid relative overflow-hidden text-left">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

      <div className="bg-[#111827]/40 border border-gray-900 rounded-2xl p-8 sm:p-12 max-w-lg w-full backdrop-blur-sm shadow-xl text-center space-y-6 relative z-10 scanline">
        
        {/* Connection Failure Graphic */}
        <div className="flex justify-center space-x-2 text-red-500 text-sm font-mono animate-pulse">
          <span>[!]</span>
          <span>HTTP/1.1 404 MODULE_NOT_FOUND</span>
          <span>[!]</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-white font-mono tracking-tighter">404</h1>
          <h2 className="text-xl font-bold text-gray-250 text-gray-200">Session Route Unresolved</h2>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto font-mono">
            The cluster load balancer was unable to map your request headers to any active sandbox node.
          </p>
        </div>

        {/* Back home */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg active:scale-97 cursor-pointer"
          >
            Re-route to Central Node
          </button>
        </div>

      </div>
    </div>
  );
}
