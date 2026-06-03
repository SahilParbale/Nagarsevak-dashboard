import React from 'react';
import { 
  LayoutDashboard, 
  Map,
  BarChart3,
  Users,
  AlertCircle, 
  Mail, 
  Calendar, 
  Activity, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Ward Map (GIS)', icon: Map },
    { id: 'analytics', label: 'Analytics & Budget', icon: BarChart3 },
    { id: 'complaints', label: 'Complaints', icon: AlertCircle },
    { id: 'staff', label: 'Staff & Tasks', icon: Users },
    { id: 'letters', label: 'Letters Tracker', icon: Mail },
    { id: 'diary', label: 'Diary & Schedule', icon: Calendar },
    { id: 'logs', label: 'System Logs', icon: Activity },
  ];

  return (
    <aside 
      className={`glass-sidebar fixed top-0 left-0 h-screen transition-all duration-300 z-30 flex flex-col ${
        collapsed ? 'w-24' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-slate-200">
        <div className={`flex items-center gap-4 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="p-3 rounded-2xl bg-sky-100 border border-sky-200 text-sky-600 shadow-sm shrink-0">
            <ShieldAlert size={20} className="animate-pulse" />
          </div>
          {!collapsed && (
            <span className="font-black text-lg bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-widest whitespace-nowrap">
              NAGARSEVAK
            </span>
          )}
        </div>
        
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)}
            className="p-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 group cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 text-sky-700 shadow-sm' 
                  : 'border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <Icon 
                size={24} 
                className={`shrink-0 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-sky-600' : 'group-hover:scale-110 group-hover:text-slate-700'
                }`}
              />
              {!collapsed && (
                <span className="font-extrabold text-base tracking-wide whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Collapsed Toggle for small width */}
      {collapsed && (
        <div className="p-5 border-t border-slate-200 flex justify-center">
          <button 
            onClick={() => setCollapsed(false)}
            className="p-3 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 hover:bg-sky-100 shadow-sm transition-all cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Footer Branding Info */}
      {!collapsed && (
        <div className="p-6 border-t border-slate-200 text-center bg-slate-50">
          <div className="text-sm text-slate-500 tracking-widest font-black uppercase">
            Ward No. 42 • Admin Portal
          </div>
        </div>
      )}
    </aside>
  );
}
