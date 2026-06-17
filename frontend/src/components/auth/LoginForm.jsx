import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      
      {/* Alert Banner */}
      {localError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4.5 py-3 rounded-xl text-left">
          ⚠️ {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Developer Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="srini@nimbus.dev"
            className="w-full bg-[#111827]/40 border border-gray-900 rounded-xl px-4 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            Password Key
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full bg-[#111827]/40 border border-gray-900 rounded-xl px-4 py-3.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-sm font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 active:scale-[0.99] mt-3 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Decrypting Session...</span>
            </>
          ) : (
            <span>Authenticate Identity</span>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500 pt-4">
        <span>Need a workspace profile? </span>
        <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
          Register Key
        </Link>
      </div>

    </div>
  );
}
