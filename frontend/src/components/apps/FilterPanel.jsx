import React from 'react';
import { CATEGORIES } from '../../utils/constants';

export default function FilterPanel({ selectedCategory, onSelectCategory }) {
  const allCategories = ['', ...CATEGORIES];

  return (
    <div className="w-full flex flex-col space-y-4 text-left">
      <h3 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
        Registry Categories
      </h3>
      
      {/* Category List */}
      <div className="flex flex-wrap md:flex-col gap-2.5">
        {allCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const displayLabel = cat || 'All Categories';
          
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2.5 md:w-full text-left text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer active:scale-98 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                  : 'bg-[#111827]/40 border-gray-900 text-gray-400 hover:text-gray-250 hover:bg-gray-800/40 hover:border-gray-800'
              }`}
            >
              <span className="flex items-center justify-between">
                <span>{displayLabel}</span>
                {isSelected && (
                  <span className="hidden md:inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
