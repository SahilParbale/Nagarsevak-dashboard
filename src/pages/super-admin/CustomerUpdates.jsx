import React, { useState } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, Clock, Zap, FileText } from 'lucide-react';

export default function CustomerUpdates() {
  const [requests, setRequests] = useState([
    { id: 'REQ-001', subject: 'Mass SMS Campaign Addon', customer: 'Ward 42 (Ramesh Patil)', date: 'Today, 10:30 AM', priority: 'High', status: 'In Progress', category: 'Addon', votes: 45 },
    { id: 'REQ-002', subject: 'Custom WhatsApp Templates', customer: 'Ward 18 (Sunita Sharma)', date: 'Yesterday, 04:15 PM', priority: 'Medium', status: 'Under Review', category: 'Feature', votes: 28 },
    { id: 'REQ-003', subject: 'Voter Demographic Analytics', customer: 'Ward 05 (Amit Desai)', date: 'May 28, 2026', priority: 'Low', status: 'Planned', category: 'Enhancement', votes: 12 },
    { id: 'REQ-004', subject: 'Integration with Local News Portals', customer: 'Ward 12 (Pooja Rao)', date: 'Today, 09:15 AM', priority: 'High', status: 'Under Review', category: 'Addon', votes: 34 },
    { id: 'REQ-005', subject: 'Citizen Survey Builder', customer: 'Ward 24 (Kiran More)', date: 'May 30, 2026', priority: 'Low', status: 'In Progress', category: 'Feature', votes: 19 },
    { id: 'REQ-006', subject: 'Automated Birthday Greetings', customer: 'Ward 33 (Vivek Singh)', date: 'May 29, 2026', priority: 'Medium', status: 'Planned', category: 'Enhancement', votes: 52 },
    { id: 'REQ-007', subject: 'Fund Allocation Tracking Module', customer: 'Ward 55 (Sanjay Joshi)', date: 'May 25, 2026', priority: 'High', status: 'Under Review', category: 'Core Feature', votes: 61 },
    { id: 'REQ-008', subject: 'Multi-language Chatbot Support', customer: 'Ward 08 (Neha Gupta)', date: 'May 20, 2026', priority: 'Medium', status: 'In Progress', category: 'Addon', votes: 88 },
  ]);

  const handleReviewRequest = (req) => {
    alert(`Opening detailed review for: ${req.subject}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[500px]">
          <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search requested updates or addons..." 
            className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-6 py-4 text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 text-slate-700 rounded-xl text-xl font-bold hover:bg-slate-50 transition-colors shadow-md">
          <Filter size={28} />
          Filter
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xl border-collapse">
            <thead className="sticky top-0 z-10 shadow-sm bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-lg">
                <th className="py-6 px-10">Update Request</th>
                <th className="py-6 px-10">Customer</th>
                <th className="py-6 px-10">Status & Priority</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-6 px-10">
                    <div className="font-bold text-slate-900 text-2xl">{req.subject}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-slate-500 font-semibold text-lg">{req.id}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-sky-600 font-bold text-lg bg-sky-50 px-3 py-1 rounded-full">{req.category}</span>
                    </div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-slate-900 font-bold">{req.customer}</div>
                    <div className="text-slate-500 text-lg mt-1">{req.date}</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold w-max ${
                        req.status === 'In Progress' ? 'bg-sky-100 text-sky-800' :
                        req.status === 'Planned' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'In Progress' && <Zap size={20} className="mr-2" />}
                        {req.status === 'Planned' && <CheckCircle size={20} className="mr-2" />}
                        {req.status === 'Under Review' && <Clock size={20} className="mr-2" />}
                        {req.status}
                      </span>
                      <span className="text-lg font-bold text-slate-500">Urgency: {req.priority} ({req.votes} Votes)</span>
                    </div>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex items-center justify-end gap-6 text-slate-400">
                      <button onClick={() => handleReviewRequest(req)} className="hover:text-sky-600 flex items-center gap-2" title="Review Request">
                      <FileText size={28} />
                      <span className="font-bold text-lg">Review Request</span>
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
