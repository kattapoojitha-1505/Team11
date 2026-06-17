import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, parseTechStack } from '../../utils/helpers';

export default function MyProjects({ projects = [], onDelete }) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl bg-[#111827]/10 flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl text-gray-700">⚙️</div>
        <p className="text-gray-500 text-sm font-medium">You haven't instantiated any software modules yet.</p>
        <button
          onClick={() => navigate('/publish')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors active:scale-95"
        >
          Deploy First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-2xl border border-gray-900 bg-[#111827]/20 backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-900 bg-gray-950/60 text-gray-400 font-bold uppercase tracking-widest font-mono">
              <th className="py-4.5 px-6">Module / Category</th>
              <th className="py-4.5 px-6">Tech Stack</th>
              <th className="py-4.5 px-6 hidden sm:table-cell">Telemetry Stats</th>
              <th className="py-4.5 px-6 hidden md:table-cell">Created Date</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/60 font-sans">
            {projects.map((project) => {
              const techList = parseTechStack(project.techStack);
              return (
                <tr key={project.id} className="hover:bg-gray-800/10 transition-colors">
                  
                  {/* Title & Category */}
                  <td className="py-4 px-6 space-y-1">
                    <div className="font-bold text-white text-sm">{project.title}</div>
                    <span className="inline-block text-[9px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {project.category}
                    </span>
                  </td>

                  {/* Tech stack */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1">
                      {techList.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-gray-900 text-gray-400 font-mono text-[9px] rounded border border-gray-900/60">
                          {t}
                        </span>
                      ))}
                      {techList.length > 3 && (
                        <span className="text-[8px] text-gray-500 font-mono">+{techList.length - 3}</span>
                      )}
                    </div>
                  </td>

                  {/* Telemetry Stats */}
                  <td className="py-4 px-6 hidden sm:table-cell font-mono text-gray-400 space-y-0.5">
                    <div>👁 Views: {project.views || 0}</div>
                    <div>★ Stars: {project.stars || 0}</div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 hidden md:table-cell text-gray-500 font-mono">
                    {formatDate(project.createdAt)}
                  </td>

                  {/* Edit / Delete Buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => navigate(`/edit-project/${project.id}`)}
                        className="text-gray-300 hover:text-white bg-[#1F2937]/80 hover:bg-[#1F2937] px-3.5 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-all text-xs font-semibold active:scale-95 cursor-pointer"
                      >
                        Modify
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 px-3.5 py-1.5 rounded-lg border border-red-500/15 hover:border-red-500/30 transition-all text-xs font-semibold active:scale-95 cursor-pointer"
                      >
                        Destroy
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
