import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, Zap, FileText, ChevronDown } from 'lucide-react';
import { getUpdates, subscribeToUpdates, updateRequestStatus } from '../../services/updatesService';

const CustomSelect = ({ value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer ${className}`}
      >
        <span>{options.find(o => o.value === value)?.label || value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-[70] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-sky-50 transition-colors ${value === opt.value ? 'bg-sky-50 font-bold text-sky-700' : 'text-slate-700 font-medium'}`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function CustomerUpdates() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

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

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic update
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    await updateRequestStatus(id, newStatus);
  };

  const handleReviewRequest = (req) => {
    alert(`Opening detailed review for: ${req.subject}`);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.customer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requested updates or addons..." 
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border ${showFilters ? 'border-sky-500 text-sky-600' : 'border-slate-300 text-slate-700'} rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm`}
          >
            <Filter size={16} />
            Filter
            {filterStatus !== 'All' && (
              <span className="w-2 h-2 rounded-full bg-sky-500 absolute top-0 right-0 -mt-1 -mr-1"></span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                  <CustomSelect 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'All', label: 'All Statuses' },
                      { value: 'Under Review', label: 'Under Review' },
                      { value: 'Planned', label: 'Planned' },
                      { value: 'In Progress', label: 'In Progress' }
                    ]}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all font-medium text-slate-800 hover:border-sky-300"
                  />
                </div>
                <button 
                  onClick={() => { setFilterStatus('All'); setSearchQuery(''); }}
                  className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
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
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
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
                        <CustomSelect 
                          value={req.status}
                          onChange={(e) => handleStatusChange(req.id, e.target.value)}
                          options={[
                            { value: 'Under Review', label: 'Under Review' },
                            { value: 'Planned', label: 'Planned' },
                            { value: 'In Progress', label: 'In Progress' }
                          ]}
                          className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-bold w-max outline-none cursor-pointer border-transparent ${
                            req.status === 'In Progress' ? 'bg-sky-100 text-sky-800 hover:bg-sky-200' :
                            req.status === 'Planned' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        />
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
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No updates found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
