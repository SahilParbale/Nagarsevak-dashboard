import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, CheckCircle, Video, Play, FileText, LayoutList } from 'lucide-react';

export default function DiaryWidgets() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const scheduleItems = [
    { id: 1, title: "Ward General Meeting", time: "10:30 AM - 12:00 PM", location: "Main Office, Ward 42", type: "official", attendees: 12, status: "upcoming", date: "Today" },
    { id: 2, title: "Road Inspection (Sector 4)", time: "02:00 PM - 04:00 PM", location: "Sector 4 Main Road", type: "field", attendees: 5, status: "upcoming", date: "Today" },
    { id: 3, title: "Citizen Grievance Video Conf", time: "05:00 PM - 06:00 PM", location: "Google Meet", type: "virtual", attendees: 20, status: "upcoming", date: "Today" },
    { id: 4, title: "Inauguration of Public Park", time: "09:00 AM - 10:30 AM", location: "Greenbelt Park", type: "event", attendees: 150, status: "completed", date: "Yesterday" }
  ];

  const filteredSchedule = scheduleItems.filter(item => activeTab === 'upcoming' ? item.status === 'upcoming' : item.status === 'completed');

  const getTypeStyle = (type) => {
    return {
      official: 'text-indigo-600 bg-indigo-100 border-indigo-200',
      field: 'text-emerald-600 bg-emerald-100 border-emerald-200',
      virtual: 'text-sky-600 bg-sky-100 border-sky-200',
      event: 'text-amber-600 bg-amber-100 border-amber-200'
    }[type] || 'text-slate-600 bg-slate-100 border-slate-200';
  };

  const getTypeIcon = (type) => {
    if (type === 'virtual') return <Video size={18} />;
    if (type === 'field') return <MapPin size={18} />;
    if (type === 'official') return <FileText size={18} />;
    return <Users size={18} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in h-full">
      <div className="glass-card p-8 lg:col-span-2 flex flex-col h-full">
        <div className="flex justify-between items-center border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-sky-100 text-sky-600 border border-sky-200 shadow-sm">
              <Calendar size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Daily Schedule & Itinerary</h3>
              <p className="text-base text-slate-500 font-medium mt-1">Manage appointments and events</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 border border-sky-700 text-white text-base font-bold hover:bg-sky-700 transition-all cursor-pointer shadow-md active:scale-95">
            <Plus size={20} /> New Event
          </button>
        </div>

        <div className="flex gap-6 mb-8 border-b border-slate-200">
          <button onClick={() => setActiveTab('upcoming')} className={`pb-3 text-base font-extrabold uppercase tracking-wide transition-all ${activeTab === 'upcoming' ? 'text-sky-600 border-b-[3px] border-sky-500' : 'text-slate-400 hover:text-slate-700 border-b-[3px] border-transparent'}`}>
            Upcoming Today
          </button>
          <button onClick={() => setActiveTab('completed')} className={`pb-3 text-base font-extrabold uppercase tracking-wide transition-all ${activeTab === 'completed' ? 'text-slate-800 border-b-[3px] border-slate-800' : 'text-slate-400 hover:text-slate-700 border-b-[3px] border-transparent'}`}>
            Past Events
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-3">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-medium text-lg">No events scheduled for this view.</div>
          ) : (
            filteredSchedule.map((item) => (
              <div key={item.id} className="group flex flex-col sm:flex-row gap-6 p-6 rounded-3xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all cursor-pointer shadow-sm relative overflow-hidden">
                <div className={`absolute left-0 top-0 bottom-0 w-2 ${item.status === 'completed' ? 'bg-slate-300' : 'bg-sky-500'}`}></div>
                
                <div className="shrink-0 flex flex-col items-start sm:items-end w-40 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-6">
                  <span className="text-lg font-black text-slate-800">{item.time.split(' - ')[0]}</span>
                  <span className="text-sm text-slate-400 font-bold mb-2">to {item.time.split(' - ')[1]}</span>
                  <span className={`mt-auto px-3 py-1 rounded-lg text-xs font-extrabold uppercase border shadow-sm ${getTypeStyle(item.type)}`}>{item.type}</span>
                </div>

                <div className="flex-1">
                  <h4 className="text-xl font-extrabold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h4>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
                    <div className="flex items-center gap-2.5 text-base text-slate-500 font-medium">{getTypeIcon(item.type)} {item.location}</div>
                    <div className="flex items-center gap-2.5 text-base text-slate-500 font-medium"><Users size={18} /> {item.attendees} expected</div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center justify-center shrink-0">
                  <button className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white text-slate-500 hover:text-sky-600 transition-all opacity-0 group-hover:opacity-100 shadow-sm"><Play size={24} className="fill-current" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-card p-8 flex flex-col h-full bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
          <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-3">
            <LayoutList size={24} className="text-purple-600" /> Priority Tasks
          </h3>
          <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            3 Pending
          </span>
        </div>

        <div className="flex-1 space-y-4">
          {[
            { text: "Review water pipeline budget proposal", urgent: true, done: false },
            { text: "Call Commissioner regarding Sector 4", urgent: false, done: false },
            { text: "Approve 5 vendor invoices for park work", urgent: true, done: false },
            { text: "Sign dispatch register for May", urgent: false, done: true },
          ].map((task, idx) => (
            <div key={idx} className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${task.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-purple-300'}`}>
              <div className="mt-1 text-slate-400 hover:text-purple-600">
                <CheckCircle size={22} className={task.done ? "text-emerald-500" : ""} />
              </div>
              <div className="flex-1">
                <p className={`text-base font-bold leading-relaxed ${task.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{task.text}</p>
                {task.urgent && !task.done && (
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold uppercase">Urgent</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 text-slate-500 text-base font-bold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-400 transition-all">+ Add Quick Task</button>
      </div>
    </div>
  );
}
