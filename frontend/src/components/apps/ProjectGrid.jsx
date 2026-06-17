import React from 'react';
import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects = [] }) {
  if (projects.length === 0) {
    return (
      <div className="w-full text-center py-20 border border-dashed border-gray-900 rounded-2xl bg-[#111827]/10 flex flex-col items-center justify-center space-y-3">
        <div className="text-3xl text-gray-700">⚡</div>
        <h4 className="text-lg font-bold text-gray-300">No Modules Listed</h4>
        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
          No deployments matching your search query or selected category were found in this node registry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
