import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectService from '../services/projectService';
import ProjectForm from '../components/publish/ProjectForm';
import ThumbnailUpload from '../components/publish/ThumbnailUpload';
import Loader from '../components/common/Loader';

export default function EditProject() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectService.getProjectById(id);
        setProject(data);
        setThumbnail(data.thumbnail || '');
      } catch (err) {
        setError('Failed to load project details for adjustment.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdateSubmit = async (formData) => {
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      thumbnail: thumbnail
    };

    try {
      await projectService.updateProject(id, payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update project configurations.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A13] flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-100 font-sans pt-12 pb-24 text-left cyber-grid">
      <div className="max-w-3xl mx-auto px-4">
        
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold tracking-wide text-gray-500 hover:text-indigo-400 transition-colors duration-200 uppercase mb-4 block"
        >
          ← Cancel Adjustments
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Modify Settings</h1>
          <p className="text-sm text-gray-450 mt-1">
            Updating core deployment structural data variables for module sequence key: <span className="text-indigo-400 font-mono font-bold">#{id}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-6 font-mono">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-[#111827]/40 border border-gray-900 rounded-2xl p-6 sm:p-10 space-y-8 backdrop-blur-sm shadow-xl relative">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Project Banner / Preview Image</label>
            <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
          </div>

          <hr className="border-gray-900/60" />

          {project && (
            <ProjectForm
              initialData={{
                title: project.title,
                description: project.description,
                category: project.category,
                techStack: project.techStack,
                demoUrl: project.demoUrl
              }}
              onSubmit={handleUpdateSubmit}
              buttonText={submitting ? "Propagating Changes..." : "Save & Propagate Changes"}
            />
          )}
        </div>

      </div>
    </div>
  );
}