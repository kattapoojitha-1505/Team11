import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService from '../services/projectService';
import ProjectForm from '../components/publish/ProjectForm';
import ThumbnailUpload from '../components/publish/ThumbnailUpload';

export default function Publish() {
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePublishSubmit = async (formData) => {
    setSubmitting(true);
    setError('');

    const payload = {
      ...formData,
      thumbnail: thumbnail || undefined // fallback to service default if empty
    };

    try {
      await projectService.createProject(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to instantiate project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A13] text-gray-100 font-sans pt-12 pb-24 text-left cyber-grid">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Back Link UI */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs font-bold tracking-wide text-gray-500 hover:text-indigo-400 transition-colors duration-200 uppercase mb-4 block"
        >
          ← Return to Console
        </button>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Deploy New Module</h1>
          <p className="text-sm text-gray-450 mt-1">Fill out the parameters below to configure your sandbox workspace instance.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl mb-6">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-[#111827]/40 border border-gray-900 rounded-2xl p-6 sm:p-10 space-y-8 backdrop-blur-sm shadow-xl relative">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Project Banner / Preview Image</label>
            <ThumbnailUpload value={thumbnail} onChange={setThumbnail} />
          </div>
          
          <hr className="border-gray-900/60" />
          
          <ProjectForm
            onSubmit={handlePublishSubmit}
            buttonText={submitting ? "Compiling Layers..." : "Instantiate & Host Project"}
          />
        </div>

      </div>
    </div>
  );
}