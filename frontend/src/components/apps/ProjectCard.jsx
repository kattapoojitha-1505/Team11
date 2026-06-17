import React from 'react';
import { Link } from 'react-router-dom';
import { parseTechStack, formatDate } from '../../utils/helpers';

export default function ProjectCard({ project }) {
  const techStackList = parseTechStack(project.techStack);

  return (
    <div className="bg-[#111827]/35 border border-gray-900 rounded-2xl overflow-hidden glass-panel-hover flex flex-col justify-between group">
      
      {/* Banner / Image preview */}
      <div className="relative aspect-video w-full bg-gray-950 overflow-hidden border-b border-gray-900/60">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-[#0B0F19]/90 border border-indigo-500/25 px-2.5 py-1 rounded-md">
            {project.category}
          </span>
        </div>
      </div>

      {/* Main Info */}
      <div className="p-5 flex-1 flex flex-col text-left justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mb-2">
            <span>By {project.author}</span>
            <span>{formatDate(project.createdAt)}</span>
          </div>

          <h3 className="text-lg font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack List & Links */}
        <div className="mt-5 space-y-4 pt-4 border-t border-gray-900/60">
          
          {/* Tech pills */}
          <div className="flex flex-wrap gap-1.5">
            {techStackList.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono font-bold text-gray-400 bg-gray-900/40 px-2 py-0.5 rounded-md border border-gray-900"
              >
                {tech}
              </span>
            ))}
            {techStackList.length > 4 && (
              <span className="text-[9px] font-mono text-gray-500 bg-gray-900/10 px-2 py-0.5 rounded-md">
                +{techStackList.length - 4} more
              </span>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            {/* View Details Link */}
            <Link
              to={`/projects/${project.id}`}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-200 flex items-center space-x-1"
            >
              <span>Inspect Container</span>
              <span>→</span>
            </Link>

            {/* Metrics */}
            <div className="flex items-center space-x-3 text-xs text-gray-500 font-mono">
              <span className="flex items-center space-x-1">
                <span>👁</span>
                <span>{project.views || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>★</span>
                <span>{project.stars || 0}</span>
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
