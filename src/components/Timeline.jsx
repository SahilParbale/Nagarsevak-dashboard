import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, UserCheck, Clock, Check, RefreshCw } from 'lucide-react';

export default function Timeline({ items, onResolveItem }) {
  const [filter, setFilter] = useState('all');

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getIcon = (type) => {
    if (type === 'whatsapp') return { icon: MessageSquare, color: 'text-emerald-600 bg-emerald-100 border-emerald-200' };
    if (type === 'complaint') return { icon: AlertTriangle, color: 'text-amber-600 bg-amber-100 border-amber-200' };
    return { icon: UserCheck, color: 'text-sky-600 bg-sky-100 border-sky-200' };
  };

  return (
    <div className="glass-card p-8 flex flex-col h-full">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Live Activity Stream</h3>
          <p className="text-sm text-slate-500 font-medium">Chronological feed of citizen interactions</p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2">
          {['all', 'whatsapp', 'complaint', 'visitor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-sky-50 border-sky-300 text-sky-700'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline items */}
      <div className="flex-1 relative pl-8 space-y-8 max-h-[420px] overflow-y-auto pr-4">
        {/* Continuous Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200"></div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <RefreshCw size={32} className="animate-spin mb-3 text-slate-400" />
            <span className="text-sm font-medium">No records matching selected filter</span>
          </div>
        ) : (
          filteredItems.map((item) => {
            const { icon: Icon, color } = getIcon(item.type);
            return (
              <div key={item.id} className="relative group animate-slide-in">
                {/* Timeline Icon */}
                <div className={`absolute -left-[31px] top-1 p-2 rounded-xl border ${color} z-10 transition-transform group-hover:scale-110 shadow-sm`}>
                  <Icon size={16} />
                </div>

                {/* Content Box */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-slate-300 group-hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <span className="text-sm font-bold text-slate-800">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 shrink-0 font-bold">
                      <Clock size={14} />
                      {item.time}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4 font-medium">
                    {item.description}
                  </p>

                  {/* Actions / Meta Row */}
                  <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-4 mt-2">
                    <span className="font-bold text-slate-500">
                      BY: <span className="text-slate-700">{item.citizenName}</span> • {item.area}
                    </span>

                    {item.status === 'pending' && (
                      <button
                        onClick={() => onResolveItem(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 font-bold transition-all cursor-pointer"
                      >
                        <Check size={14} />
                        Resolve
                      </button>
                    )}
                    
                    {item.status === 'resolved' && (
                      <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 font-extrabold border border-slate-200">
                        RESOLVED
                      </span>
                    )}

                    {item.status === 'synced' && (
                      <span className="px-3 py-1 rounded-lg bg-sky-50 text-sky-600 font-extrabold border border-sky-200">
                        SYNCED TO CRM
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
