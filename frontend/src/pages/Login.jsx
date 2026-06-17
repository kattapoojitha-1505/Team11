import React from 'react';
import LoginForm from '../components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-[calc(100-16)] bg-[#070A13] flex flex-col justify-center py-16 sm:px-6 lg:px-8 cyber-grid relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h2 className="text-3xl font-black text-white tracking-tight">Access Developer Sandbox</h2>
        <p className="mt-2 text-sm text-gray-500">
          Authenticate credentials to configure your hosting nodes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#111827]/40 border border-gray-900 px-6 py-10 rounded-2xl backdrop-blur-sm sm:px-10 shadow-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
