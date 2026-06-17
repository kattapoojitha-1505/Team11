import React from 'react';

export default function Stats() {
  const statsList = [
    { label: 'Active Sandboxes', value: '420+', desc: 'Live hosting containers running isolate code.' },
    { label: 'Platform Uptime', value: '99.99%', desc: 'Kubernetes cluster health check telemetry.' },
    { label: 'Module Deployments', value: '12.8K+', desc: 'Total applications hosted and cataloged.' },
    { label: 'Instantiating Velocity', value: '< 12s', desc: 'Average time from CLI compile to live URL.' }
  ];

  return (
    <div className="bg-[#090D18] border-y border-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsList.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#111827]/20 border border-gray-900 hover:border-gray-800/80 p-6 rounded-2xl transition-all duration-300 backdrop-blur-sm text-left group"
            >
              <div className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors duration-200">
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400/80 mt-2">
                {stat.label}
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
