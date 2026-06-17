import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import Loader from '../components/common/Loader';
import { formatDate, parseTechStack } from '../utils/helpers';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulated Sandbox Terminal Logs State
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [booting, setBooting] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const startSandboxSim = () => {
    setBooting(true);
    setTerminalLogs([`[nimbus-sys] Allocation request for node: ${project.title.toLowerCase().replace(/\s+/g, '-')}`]);

    const messages = [
      "⚙️ Spinup ephemeral docker container layer...",
      "🌐 Bind networks mapping: TCP Port 3000 (Internal) ↔ Port 443 (External)...",
      "📦 Pulling runtime image: node:18-alpine...",
      "📂 Syncing repository workspace assets...",
      "⚡ Injecting environment credentials variables...",
      "🚀 Starting application listener: 'npm run start'...",
      "💚 Connection verified. Health checks: OK (200 OK)",
      "📟 Terminal listener operational. Ready for input."
    ];

    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, `[nimbus-sys] ${msg}`]);
        if (idx === messages.length - 1) {
          setBooting(false);
          setBooted(true);
        }
      }, (idx + 1) * 750);
    });
  };

  if (loading) return <div className="min-h-screen bg-[#070A13] flex items-center justify-center"><Loader size="lg" /></div>;

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#070A13] text-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-red-500/5 border border-red-500/10 rounded-2xl max-w-md space-y-4">
          <span className="text-3xl">⚠️</span>
          <h2 className="text-lg font-bold">Registry Fetch Error</h2>
          <p className="text-sm text-gray-500">{error || 'Could not locate project details in target node.'}</p>
          <button onClick={() => navigate('/projects')} className="bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-4 py-2 rounded-xl transition-all">
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  const techStackList = parseTechStack(project.techStack);

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-150 pt-10 pb-24 font-sans text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-indigo-400 mb-6 transition-colors flex items-center space-x-1"
        >
          <span>← Back to Registry</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Info Left Column */}
          <div className="lg:col-span-7 space-y-8">

            {/* Banner */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-900 shadow-2xl relative">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-[#0B0F19]/90 border border-indigo-500/25 px-2.5 py-1.5 rounded-md">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Header Details */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{project.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-500 font-mono">
                <span>By <strong className="text-gray-300 font-bold">{project.author}</strong></span>
                <span>•</span>
                <span>Published: {formatDate(project.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center space-x-1 text-gray-400">
                  <span>👁 {project.views || 0} views</span>
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono">
                Project Parameters
              </h3>
              <p className="text-gray-305 text-sm leading-relaxed text-gray-300 whitespace-pre-line bg-[#111827]/10 p-5 rounded-2xl border border-gray-900/60">
                {project.description}
              </p>
            </div>

            {/* Tech stack */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-mono">
                Technical Blueprint
              </h3>
              <div className="flex flex-wrap gap-2">
                {techStackList.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono font-bold text-gray-300 bg-gray-900/40 px-3.5 py-1.5 rounded-lg border border-gray-900"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Right Column - Live host / Sandbox console */}
          <div className="lg:col-span-5 space-y-6">

            {/* Host Launcher */}
            <div className="bg-[#111827]/30 border border-gray-900 rounded-2xl p-6 space-y-5 backdrop-blur-sm shadow-xl">
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest font-mono border-b border-gray-900 pb-3">
                Deployment Node Target
              </h3>

              {project.demoUrl ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    This module has been allocated a live sandbox container URL directly at external ingress. Click below to inspect it.
                  </p>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-98"
                  >
                    🚀 Open Live Application ↗
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    No static external URL is registered. You can spin up an ephemeral container instance to compile and view application logs.
                  </p>

                  {!booted && !booting && (
                    <button
                      onClick={startSandboxSim}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all active:scale-98 cursor-pointer"
                    >
                      🔌 Instantiate Ephemeral Container
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sandbox Console Terminal */}
            {(booting || booted || project.demoUrl) && (
              <div className="bg-gray-950 border border-gray-900 rounded-2xl overflow-hidden shadow-2xl relative scanline text-left">
                <div className="bg-gray-900/60 px-4 py-3 border-b border-gray-900/80 flex items-center justify-between">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">sandbox telemetry logs</span>
                  <span></span>
                </div>
                <div className="p-4 font-mono text-[10px] text-gray-400 h-64 overflow-y-auto space-y-1.5">
                  {project.demoUrl && (
                    <>
                      <div className="text-gray-500">[system] Reading external module URL...</div>
                      <div className="text-indigo-400">[ingress] Route bind: {project.demoUrl}</div>
                      <div className="text-emerald-400">[ingress] Target response: HTTP/1.1 200 OK</div>
                    </>
                  )}
                  {terminalLogs.map((log, index) => (
                    <div
                      key={index}
                      className={log.includes('Health checks') || log.includes('operational') ? 'text-emerald-400' : 'text-gray-400'}
                    >
                      {log}
                    </div>
                  ))}
                  {booting && (
                    <div className="flex items-center space-x-2 text-indigo-400 animate-pulse mt-2">
                      <span className="h-2 w-2 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                      <span>Deploying build layers...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
