import React from 'react';

export default function Loader({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <div className="relative">
        {/* Outer Glow Ring */}
        <div className={`animate-ping absolute inset-0 rounded-full bg-indigo-500/20 blur-xl ${
          size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-12 w-12' : 'h-16 w-16'
        }`}></div>
        
        {/* Spinner */}
        <div className={`animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-purple-500 border-l-transparent ${sizeClasses[size]}`}></div>
      </div>
      {size !== 'sm' && (
        <span className="text-xs font-mono font-bold tracking-widest text-indigo-400/80 uppercase animate-pulse">
          Connecting to Sandbox...
        </span>
      )}
    </div>
  );
}
