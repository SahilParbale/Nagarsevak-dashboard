import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, Zap, FileText } from 'lucide-react';
import { getUpdates, subscribeToUpdates } from '../../services/updatesService';

export default function CustomerUpdates() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const fetchUpdates = async () => {
      setIsLoading(true);
      const data = await getUpdates();
      if (data && data.length > 0) {
        setRequests(data);
      }
      setIsLoading(false);

      subscription = subscribeToUpdates((payload) => {
        if (payload.eventType === 'INSERT') {
          setRequests((prev) => [payload.new, ...prev]);
        }
      });
    };

    fetchUpdates();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleReviewRequest = (req) => {
    alert(`Opening detailed review for: ${req.subject}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search requested updates or addons..." 
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                <th className="py-3 px-6">Update Request</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Status & Priority</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{req.subject}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 font-semibold text-xs">{(req.id || '').split('-')[0]}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sky-600 font-bold text-[10px] bg-sky-50 px-2 py-0.5 rounded">{req.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold">{req.customer}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{req.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold w-max ${
                        req.status === 'In Progress' ? 'bg-sky-100 text-sky-800' :
                        req.status === 'Planned' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'In Progress' && <Zap size={14} className="mr-1" />}
                        {req.status === 'Planned' && <CheckCircle size={14} className="mr-1" />}
                        {req.status === 'Under Review' && <Clock size={14} className="mr-1" />}
                        {req.status}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 mt-1">Urgency: {req.priority} ({req.votes} Votes)</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button onClick={() => handleReviewRequest(req)} className="hover:text-sky-600 flex items-center gap-1" title="Review Request">
                      <FileText size={16} />
                      <span className="font-bold text-xs">Review Request</span>
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
