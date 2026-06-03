import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function Header({ activeTab, activeUser, setActiveUser, users, setIsSuperAdmin }) {
  const [time, setTime] = useState(new Date());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notificationsList = [
    { id: 1, text: 'Urgent: Water pipeline leak in Ward Sector-4 reported by 15 residents.', time: '5m ago', read: false },
    { id: 2, text: 'Remind: Meeting with Municipal Commissioner at 3:30 PM.', time: '1h ago', read: false },
    { id: 3, text: 'System Bot successfully synced 45 new WhatsApp complaint tickets.', time: '3h ago', read: true },
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTabName = (tab) => {
    if (tab === 'logs') return 'System & Login Logs';
    if (tab === 'letters') return 'Letters & Dispatch Tracker';
    if (tab === 'diary') return 'Daily Work Diary';
    return tab.charAt(0).toUpperCase() + tab.slice(1);
  };

  return (
    <header className="glass-header sticky top-0 z-20 h-20 flex items-center justify-between px-6 shadow-sm">
      {/* Title / Tab Name */}
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold text-slate-800 tracking-wide">
          {formatTabName(activeTab)}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Ward No. 42 Management Console
        </p>
      </div>

      {/* Middle Search Input */}
      <div className="hidden md:flex items-center w-96 relative">
        <Search size={18} className="absolute left-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search complaints, letters, or contacts..." 
          className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-12 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all focus:ring-2 focus:ring-sky-100"
        />
      </div>

      {/* Right Side: Clock, Alerts, Profile */}
      <div className="flex items-center gap-5">
        {/* Dynamic Clock */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-600">
          <Clock size={16} className="text-sky-600" />
          <span>
            {time.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} • {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Notifications Dropdown Toggle */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-slide-in">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-800">Recent Notifications</span>
                <span className="text-xs text-sky-600 cursor-pointer hover:underline font-medium">Mark all read</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {notificationsList.map(n => (
                  <div key={n.id} className={`p-3 rounded-xl text-xs leading-relaxed border transition-colors ${
                    n.read ? 'bg-slate-50 border-transparent text-slate-500' : 'bg-sky-50 border-sky-100 text-slate-800'
                  }`}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-bold text-slate-700">{n.time}</span>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-sky-500"></span>}
                    </div>
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile / Switcher Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 text-sm font-bold">
              {activeUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-extrabold text-sm">{activeUser.name}</div>
              <div className="text-slate-500 font-medium">{activeUser.role}</div>
            </div>
            <ChevronDown size={16} className="text-slate-500" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-slide-in">
              <div className="px-4 py-3 text-xs text-slate-500 font-bold border-b border-slate-100 mb-2 uppercase tracking-wider">
                Switch Admin Profile
              </div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    setActiveUser(u);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center justify-between ${
                    activeUser.id === u.id 
                      ? 'bg-sky-50 text-sky-700 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div>
                    <div>{u.name}</div>
                    <div className={`text-xs ${activeUser.id === u.id ? 'text-sky-600/80' : 'text-slate-500'}`}>{u.role}</div>
                  </div>
                  {activeUser.id === u.id && <CheckCircle size={16} className="text-sky-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <button
                  onClick={() => {
                    setIsSuperAdmin(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-colors flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-bold"
                >
                  <ShieldAlert size={16} />
                  <span>Super Admin Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
