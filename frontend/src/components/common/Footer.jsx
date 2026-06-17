import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#05070E] border-t border-gray-900/95 py-12 text-gray-500 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                N
              </div>
              <span className="text-base font-black tracking-tight text-white">
                NIMBUS<span className="text-indigo-500 font-normal text-xs font-mono ml-0.5">.live</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Decentralized deployment sandbox for hosting developer utility microservices, neural algorithms, and frontend showcases.
            </p>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/projects?category=Development" className="hover:text-indigo-400 transition-colors">Development</Link>
              </li>
              <li>
                <Link to="/projects?category=Data%20Science" className="hover:text-indigo-400 transition-colors">Data Science</Link>
              </li>
              <li>
                <Link to="/projects?category=Security" className="hover:text-indigo-400 transition-colors">Security</Link>
              </li>
              <li>
                <Link to="/projects?category=DevOps" className="hover:text-indigo-400 transition-colors">DevOps</Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="hover:text-indigo-400 cursor-pointer transition-colors">API Endpoint Specs</li>
              <li className="hover:text-indigo-400 cursor-pointer transition-colors">Kubernetes Sandboxing</li>
              <li className="hover:text-indigo-400 cursor-pointer transition-colors">Cli Hosting Guide</li>
              <li className="hover:text-indigo-400 cursor-pointer transition-colors">Developer Portal</li>
            </ul>
          </div>

          {/* Status Metrics */}
          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4">Live Telemetry</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-gray-300 font-medium">Sandbox Cluster: Operational</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">Uptime: 99.98%</p>
              <p className="text-xs text-gray-400 font-mono">Containers active: 1,424 nodes</p>
            </div>
          </div>

        </div>

        {/* Lower row */}
        <div className="pt-8 border-t border-gray-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Nimbus-Showcase. Operating in Sandbox Cluster Area.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Security Protocol</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Host</span>
            <span className="hover:text-gray-300 cursor-pointer">Telemetry Logs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
