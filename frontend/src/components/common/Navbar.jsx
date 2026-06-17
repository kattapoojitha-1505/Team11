import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                N
              </div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors duration-200">
                NIMBUS<span className="text-indigo-500 font-normal text-xs ml-0.5 font-mono">.live</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1.5">
            <Link
              to="/projects"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/projects')
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/40 border border-transparent'
              }`}
            >
              Explore Modules
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/40 border border-transparent'
                  }`}
                >
                  Console
                </Link>
                <Link
                  to="/publish"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/publish')
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/40 border border-transparent'
                  }`}
                >
                  Deploy Module
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white uppercase border border-purple-500/30">
                    {user?.username?.substring(0, 2) || 'US'}
                  </div>
                  <span className="text-sm font-bold text-gray-200">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 border border-gray-800 hover:border-red-500/20 px-3.5 py-2 rounded-lg bg-gray-900/50 transition-all duration-200 active:scale-95"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/30 active:scale-[0.97]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-gray-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Explore Modules
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Console Dashboard
              </Link>
              <Link
                to="/publish"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Deploy New Module
              </Link>
              
              <div className="pt-4 border-t border-gray-800/80 flex flex-col space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white uppercase">
                    {user?.username?.substring(0, 2) || 'US'}
                  </div>
                  <span className="text-sm font-bold text-gray-200">{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-sm font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl border border-red-500/20 transition-all duration-200"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-gray-800/80 flex flex-col space-y-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-gray-300 hover:text-white py-3 rounded-xl hover:bg-gray-800/40 border border-transparent"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl shadow-lg shadow-indigo-600/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
