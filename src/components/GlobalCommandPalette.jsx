import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, User, FileText, AlertCircle, X, Terminal } from 'lucide-react';

export default function GlobalCommandPalette({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Mock global search results
  const allResults = [
    { id: 1, type: 'citizen', title: 'Vikram Singh', subtitle: 'Phone: +91-9876543210', icon: User, color: 'text-sky-600 bg-sky-100' },
    { id: 2, type: 'citizen', title: 'Priya Desai', subtitle: 'Ward 2 Resident', icon: User, color: 'text-sky-600 bg-sky-100' },
    { id: 3, type: 'complaint', title: 'Ticket #4402 - Street Light', subtitle: 'Pending Resolution • Sector 4', icon: AlertCircle, color: 'text-amber-600 bg-amber-100' },
    { id: 4, type: 'complaint', title: 'Ticket #4390 - Drainage', subtitle: 'Resolved • Main Market', icon: AlertCircle, color: 'text-emerald-600 bg-emerald-100' },
    { id: 5, type: 'letter', title: 'IN-2026-042: Road Resurfacing', subtitle: 'From: Public Works Dept', icon: FileText, color: 'text-purple-600 bg-purple-100' },
    { id: 6, type: 'location', title: 'Greenbelt Park', subtitle: 'Inauguration Location', icon: MapPin, color: 'text-rose-600 bg-rose-100' },
  ];

  const filteredResults = query
    ? allResults.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-4 animate-slide-in" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Area */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center gap-4 bg-slate-50/50">
          <Terminal size={24} className="text-sky-500 hidden sm:block" />
          <Search size={24} className="text-slate-400 sm:hidden" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search citizens, complaints, letters (Ctrl + K)"
            className="flex-1 bg-transparent text-xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[50vh] overflow-y-auto p-4 sm:p-6">
          {!query ? (
            <div className="text-center py-10 text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Start typing to search across the entire dashboard...</p>
              <div className="flex justify-center gap-3 mt-6 text-sm font-bold">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-500 border border-slate-200">#tickets</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-500 border border-slate-200">@citizens</span>
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-slate-500 border border-slate-200">doc:</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-lg font-medium">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-2">Global Results</div>
              {filteredResults.map(res => {
                const Icon = res.icon;
                return (
                  <button 
                    key={res.id} 
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-sky-50 hover:border-sky-200 border border-transparent transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${res.color} transition-transform group-hover:scale-110`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-800 group-hover:text-sky-700 transition-colors">{res.title}</h4>
                        <p className="text-sm text-slate-500 font-medium">{res.subtitle}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-400 shadow-sm">
                      Select ↵
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-bold">
          <span>Navigation</span>
          <div className="flex gap-4">
            <span><kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 shadow-sm">↑↓</kbd> to navigate</span>
            <span><kbd className="px-2 py-1 bg-white border border-slate-200 rounded text-slate-700 shadow-sm">esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
