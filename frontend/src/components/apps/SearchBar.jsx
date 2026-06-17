import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full group">
      
      {/* Icon */}
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter by keyword (e.g. Docker, OAuth2, NLP)..."
        className="w-full bg-[#111827]/40 border border-gray-900 rounded-2xl pl-12 pr-5 py-4 text-sm text-gray-150 placeholder-gray-650 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all duration-300 font-sans shadow-inner backdrop-blur-sm"
      />
    </div>
  );
}
