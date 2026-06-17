import React, { useState } from 'react';

export default function ProjectActions({ projectId, onRedeployCompleted }) {
  const [loadingAction, setLoadingAction] = useState(null);
  const [logs, setLogs] = useState([]);

  const triggerAction = (actionName, duration, message) => {
    setLoadingAction(actionName);
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Initializing ${actionName}...`, ...prev]);
    
    setTimeout(() => {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Action completed: ${message}`,
        ...prev
      ]);
      setLoadingAction(null);
      if (onRedeployCompleted) onRedeployCompleted();
    }, duration);
  };

  return (
    <div className="bg-[#111827]/40 border border-gray-900 rounded-2xl p-6 text-left space-y-5 backdrop-blur-sm">
      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest font-mono border-b border-gray-950 pb-3">
        Container Control Panel
      </h3>

      {/* Button Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => triggerAction('Redeploy', 2000, 'Re-instantiated Docker build container.')}
          disabled={loadingAction !== null}
          className="bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-40"
        >
          {loadingAction === 'Redeploy' ? 'Rebuilding...' : '🔄 Rebuild Container'}
        </button>

        <button
          onClick={() => triggerAction('Cache Clear', 1500, 'All local build layers and packages purged.')}
          disabled={loadingAction !== null}
          className="bg-purple-600/10 border border-purple-500/20 hover:border-purple-500/45 text-purple-400 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-40"
        >
          {loadingAction === 'Cache Clear' ? 'Purging...' : '🧹 Clear Build Cache'}
        </button>

        <button
          onClick={() => triggerAction('Audit Check', 1200, 'Vulnerabilities scan: 0 alerts found.')}
          disabled={loadingAction !== null}
          className="bg-cyan-600/10 border border-cyan-500/20 hover:border-cyan-500/45 text-cyan-400 text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer active:scale-95 disabled:opacity-40"
        >
          {loadingAction === 'Audit Check' ? 'Auditing...' : '🛡 Security Scan'}
        </button>
      </div>

      {/* Action Logs Box */}
      {logs.length > 0 && (
        <div className="bg-gray-950 border border-gray-900 rounded-xl p-4 space-y-1 font-mono text-[10px] text-gray-400 max-h-36 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className={log.includes('completed') ? 'text-emerald-400' : 'text-gray-500'}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
