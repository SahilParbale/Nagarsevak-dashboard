import React from 'react';
import { Building, TrendingUp, Users, ShieldAlert, Lock, Globe, Network, LogOut } from 'lucide-react';

export default function CompanyPortal({ onSelectApp, onLogout }) {
  const projects = [
    {
      id: 'nagarsevak',
      name: 'Nagarsevak Management',
      icon: Network,
      active: true,
    },
    {
      id: 'voter-pro',
      name: 'Voter Pro',
      icon: Users,
      active: false,
    },
    {
      id: 'builder-management',
      name: 'Builder Management System',
      icon: Building,
      active: false,
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-[45%] bg-[#032352] flex-col justify-center items-center relative overflow-hidden p-12 text-center rounded-r-[40px] shadow-2xl z-10">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-800/30 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#02183b] to-transparent"></div>
        
        {/* Orange Accent Curve at bottom right (mimicking image) */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500 rounded-full blur-[80px] opacity-20"></div>

        <div className="relative z-10 text-white flex flex-col items-center max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 flex items-center justify-center">
              <Building size={56} className="text-amber-400" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-serif font-bold tracking-tight text-white leading-none">Codecraft</h1>
              <h1 className="text-4xl font-serif font-bold tracking-tight text-white leading-none">Solutions</h1>
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

      {/* Right Panel - Login/Selection */}
      <div className="w-full lg:w-[55%] bg-[#F9FAFB] flex flex-col items-center justify-center p-6 sm:p-8 relative overflow-y-auto">

        {onLogout && (
          <button 
            onClick={onLogout}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        )}

        <div className="w-full max-w-lg flex flex-col items-center mt-16 sm:mt-12">
          
          {/* Top Logo & Heading */}
          <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-sky-600/30 text-white">
            <Network size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Codecraft Solutions</h2>
          <p className="text-slate-500 font-medium mb-12 text-lg">Select a project dashboard to continue</p>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
            {projects.map(project => {
              const Icon = project.icon;
              return (
                <div 
                  key={project.id}
                  onClick={() => project.active && onSelectApp(project.id)}
                  className={`
                    flex flex-col items-center justify-center p-8 rounded-2xl border transition-all duration-300 relative
                    ${project.active 
                      ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-xl hover:shadow-sky-900/5 cursor-pointer group' 
                      : 'bg-white/50 border-slate-200 opacity-70 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    project.active ? 'bg-sky-600 text-white group-hover:bg-sky-700' : 'bg-slate-300 text-slate-500'
                  }`}>
                    <Icon size={24} />
                  </div>
                  
                  <span className={`font-bold text-[15px] ${project.active ? 'text-slate-800' : 'text-slate-500'}`}>
                    {project.name}
                  </span>

                  {!project.active && (
                    <div className="absolute top-4 right-4 text-slate-400 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider">
                      <Lock size={10} /> Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
