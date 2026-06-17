import React, { useState } from 'react';

export default function ProjectForm({ initialData = {}, onSubmit, buttonText = "Publish Project Module" }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || 'Development',
    techStack: initialData.techStack || '',
    demoUrl: initialData.demoUrl || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Project Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Cloud Sandbox IDE"
          className="w-full bg-[#161D30] border border-gray-800 rounded-xl px-5 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe what your live application module does..."
          className="w-full bg-[#161D30] border border-gray-800 rounded-xl px-5 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 resize-none"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#161D30] border border-gray-800 rounded-xl px-5 py-3.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200 cursor-pointer"
          >
            <option value="Development">Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Security">Security</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tech Stack Tags</label>
          <input
            type="text"
            name="techStack"
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g., React, FastAPI, Docker"
            className="w-full bg-[#161D30] border border-gray-800 rounded-xl px-5 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Live Demo Sandbox URL (Optional)</label>
        <input
          type="url"
          name="demoUrl"
          value={formData.demoUrl}
          onChange={handleChange}
          placeholder="https://nimbus.live/sandbox/your-app"
          className="w-full bg-[#161D30] border border-gray-800 rounded-xl px-5 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/20 active:scale-[0.99] mt-4"
      >
        {buttonText}
      </button>
    </form>
  );
}