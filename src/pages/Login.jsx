import React, { useState } from 'react';
import { Building, TrendingUp, Users, ShieldAlert, Lock, ArrowLeft, Mail, Key, LogIn } from 'lucide-react';

export default function Login({ onLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const demoEmail = 'info@codecraft.net.in';
  const demoPassword = 'Krishnaniti@123';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === demoEmail && password === demoPassword) {
      setError('');
      onLogin();
    } else {
      setError('Invalid email or password. Please use the demo credentials provided below.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-[45%] bg-[#032352] flex-col justify-center items-center relative overflow-hidden p-12 text-center rounded-r-[40px] shadow-2xl z-10">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-800/30 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#02183b] to-transparent"></div>
        
        {/* Orange Accent Curve at bottom right */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-[80px] opacity-20"></div>

        <div className="relative z-10 text-white flex flex-col items-center max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center">
              <Building size={56} className="text-amber-400" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-serif font-bold tracking-tight text-white leading-none">Codecraft</h1>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-white leading-none">Innovations</h1>
            </div>
          </div>
          
          <div className="w-full flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent"></div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Manage. Connect. Serve.</h2>
          <p className="text-sky-200 text-sm font-medium mb-12">
            Building a better tomorrow, together.
          </p>
          
          {/* Feature Icons */}
          <div className="flex justify-center gap-8 text-sky-200">
             <div className="flex flex-col items-center gap-2">
                <Users size={24} className="text-amber-400" />
                <span className="text-[10px] text-center font-bold">People<br/>Management</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <TrendingUp size={24} className="text-amber-400" />
                <span className="text-[10px] text-center font-bold">Data & Insight<br/>Analytics</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <ShieldAlert size={24} className="text-amber-400" />
                <span className="text-[10px] text-center font-bold">Secure<br/>Ecosystem</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center items-center p-6 sm:p-8 lg:px-24 xl:px-32 relative overflow-y-auto">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm">
              Login to dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-start gap-3 shadow-sm">
                <ShieldAlert className="shrink-0 mt-0.5" size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors sm:text-sm"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key size={18} strokeWidth={1.5} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors sm:text-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors mt-4"
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
