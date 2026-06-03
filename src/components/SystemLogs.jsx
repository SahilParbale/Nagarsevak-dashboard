import React, { useState } from 'react';
import { ShieldCheck, Search, Activity, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SystemLogs({ logs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredLogs = logs.filter(log => {
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    if (status === 'success') {
      return (
        <span className="flex items-center gap-2 text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-sm w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Success
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2 text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-extrabold tracking-wide uppercase shadow-sm w-fit">
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
        Failed
      </span>
    );
  };

  const getCategoryColor = (cat) => {
    return {
      auth: 'text-indigo-700 bg-indigo-100 border-indigo-200',
      bot: 'text-emerald-700 bg-emerald-100 border-emerald-200',
      action: 'text-sky-700 bg-sky-100 border-sky-200',
    }[cat] || 'text-slate-600 border-slate-200 bg-slate-100';
  };

  return (
    <div className="glass-card p-8 flex flex-col h-full animate-slide-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6 mb-8">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-3">
            <ShieldCheck size={28} className="text-sky-600" /> Security & System Audit Trails
          </h3>
          <p className="text-base text-slate-500 font-medium mt-2">Real-time log of administrative logins and automation processes</p>
        </div>
        <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200 shrink-0 shadow-inner">
          {['all', 'auth', 'bot', 'action'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${categoryFilter === cat ? 'bg-white text-sky-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat === 'all' ? 'ALL LOGS' : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-8 w-full sm:w-[450px]">
        <Search size={20} className="absolute left-4 top-3 text-slate-400" />
        <input type="text" placeholder="Search by action, user, or IP..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-base text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 shadow-sm" />
      </div>

      <div className="flex-1 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-base border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-sm">
              <th className="pb-4 pr-4">Timestamp</th>
              <th className="pb-4 px-4">Category</th>
              <th className="pb-4 px-4">Operator / Node</th>
              <th className="pb-4 px-4">Action Description</th>
              <th className="pb-4 px-4">Source IP</th>
              <th className="pb-4 pl-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {paginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-500">
                  <Activity size={48} className="mx-auto mb-4 text-slate-300 animate-pulse" />
                  <span className="text-lg">No matching logs found</span>
                </td>
              </tr>
            ) : (
              paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-5 pr-4 text-slate-500 whitespace-nowrap font-mono">{log.timestamp}</td>
                  <td className="py-5 px-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border ${getCategoryColor(log.category)}`}>
                      {log.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-slate-800 font-bold">{log.user}</td>
                  <td className="py-5 px-4 text-slate-600 max-w-lg leading-relaxed">{log.description}</td>
                  <td className="py-5 px-4 font-mono text-slate-500">{log.ip}</td>
                  <td className="py-5 pl-4 text-right flex justify-end">{getStatusBadge(log.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center border-t border-slate-200 pt-6 mt-6 text-base text-slate-500 font-bold">
        <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm"><ChevronLeft size={20} /></button>
          <span className="px-5 font-extrabold text-slate-700 bg-slate-100 py-2 rounded-xl border border-slate-200">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm"><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}
