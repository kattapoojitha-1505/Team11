import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import projectService from '../services/projectService';
import MyProjects from '../components/dashboard/MyProjects';
import ProjectActions from '../components/dashboard/ProjectActions';
import Loader from '../components/common/Loader';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Refresh projects trigger
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchUserProjects = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await projectService.getProjects();
        // Filter projects authored by the logged-in user
        const userProjects = data.filter(p => p.userId === user?.id);
        setProjects(userProjects);
      } catch (err) {
        setError('Failed to fetch published projects telemetry.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserProjects();
    }
  }, [user, refreshKey]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this workspace module?")) {
      try {
        await projectService.deleteProject(id);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        alert(err.message || 'Deletion failed');
      }
    }
  };

  const handleActionCompleted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-150 pt-10 pb-20 cyber-grid text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Console Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-900 pb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Developer Console</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and monitor your published interactive application containers.</p>
          </div>
          <button
            onClick={() => navigate('/publish')}
            className="inline-flex items-center justify-center bg-indigo-650 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/15 active:scale-95 text-xs self-start sm:self-center cursor-pointer"
          >
            ➕ Publish New Project
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}

        {/* Dashboard Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Left Project List */}
          <div className="lg:col-span-8">
            {loading ? (
              <Loader />
            ) : (
              <MyProjects projects={projects} onDelete={handleDelete} />
            )}
          </div>

          {/* Sidebar Control Panel */}
          <div className="lg:col-span-4">
            <ProjectActions projectId={null} onRedeployCompleted={handleActionCompleted} />
          </div>

        </div>

      </div>
    </div>
  );
}