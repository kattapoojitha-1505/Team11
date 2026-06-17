import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import projectService from '../services/projectService';
import SearchBar from '../components/apps/SearchBar';
import FilterPanel from '../components/apps/FilterPanel';
import ProjectGrid from '../components/apps/ProjectGrid';
import Loader from '../components/common/Loader';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await projectService.getProjects(search, categoryParam);
        setProjects(data);
      } catch (err) {
        setError('Failed to query the node registry.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Simple debounce/instant trigger combo
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);

    return () => clearTimeout(timer);
  }, [search, categoryParam]);

  const handleSelectCategory = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-100 pt-10 pb-20 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Console */}
        <div className="border-b border-gray-900 pb-8 mb-10 text-left">
          <h1 className="text-3xl font-black text-white tracking-tight">Active Module Registry</h1>
          <p className="text-sm text-gray-450 mt-1">Explore containerized applications, secure microservices, and neural APIs.</p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Filters Column */}
          <div className="md:col-span-3">
            <div className="sticky top-24">
              <FilterPanel
                selectedCategory={categoryParam}
                onSelectCategory={handleSelectCategory}
              />
            </div>
          </div>

          {/* Search and Grid Column */}
          <div className="md:col-span-9 space-y-6">
            <SearchBar value={search} onChange={setSearch} />
            
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="text-center py-20 bg-red-500/5 border border-red-500/10 text-red-400 rounded-2xl text-xs font-mono">
                ⚠️ {error}
              </div>
            ) : (
              <ProjectGrid projects={projects} />
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
