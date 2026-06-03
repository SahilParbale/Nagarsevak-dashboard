import React, { useState } from 'react';
import WardMap from './WardMap';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  X,
  MapPin,
  Camera
} from 'lucide-react';

export default function ComplaintsModule() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock KPI Data
  const kpis = {
    total: 342,
    pending: 45,
    critical: 12,
    resolvedToday: 18
  };

  // Mock Complaints Data
  const complaintsList = [
    { id: 'TKT-9042', citizen: 'Rajesh Kumar', phone: '+91 9876543210', category: 'Sanitation', ward: 'Ward 2', status: 'Pending', sla: '2 days', priority: 'High' },
    { id: 'TKT-9041', citizen: 'Sneha Patel', phone: '+91 8765432109', category: 'Water Supply', ward: 'Ward 4', status: 'In Progress', sla: '4 hours', priority: 'Critical' },
    { id: 'TKT-9040', citizen: 'Vikram Singh', phone: '+91 7654321098', category: 'Roads', ward: 'Sector 1', status: 'Resolved', sla: '-', priority: 'Medium' },
    { id: 'TKT-9039', citizen: 'Priya Desai', phone: '+91 6543210987', category: 'Electricity', ward: 'Ward 2', status: 'Pending', sla: '5 days', priority: 'Low' },
    { id: 'TKT-9038', citizen: 'Amit Sharma', phone: '+91 9998887776', category: 'Garbage', ward: 'Sector 4', status: 'Pending', sla: '1 day', priority: 'High' },
    { id: 'TKT-9037', citizen: 'Suresh Rao', phone: '+91 8887776665', category: 'Water Supply', ward: 'Ward 3', status: 'Resolved', sla: '-', priority: 'Critical' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'In Progress': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'Pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-slide-in">
      
      {/* High-Level KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Complaints</p>
            <h3 className="text-xl font-black text-slate-800">{kpis.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Resolution</p>
            <h3 className="text-xl font-black text-slate-800">{kpis.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
            <Clock size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-rose-50 to-white border-rose-100">
          <div>
            <p className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-1">Escalated / SLA</p>
            <h3 className="text-xl font-black text-rose-700">{kpis.critical}</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm animate-pulse">
            <ShieldAlert size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Resolved Today</p>
            <h3 className="text-xl font-black text-emerald-600">{kpis.resolvedToday}</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Main Split View Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
        
        {/* Left Panel: Complaints Data Table */}
        <div className="glass-card p-6 xl:col-span-2 flex flex-col h-full min-h-[500px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
               <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
                  <AlertCircle size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Active Complaints</h3>
                 <p className="text-sm text-slate-500 font-medium">Manage and track citizen issues</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search by ID or Name..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 w-64" />
              </div>
              <button className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors">
                <Filter size={18} />
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Plus size={18} /> Log Issue
              </button>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                  <th className="pb-3 pr-4">Ticket ID</th>
                  <th className="pb-3 px-4">Citizen</th>
                  <th className="pb-3 px-4">Category</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Priority / SLA</th>
                  <th className="pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {complaintsList.map((complaint) => (
                   <tr key={complaint.id} className="hover:bg-slate-50 transition-colors group">
                     <td className="py-4 pr-4 font-black text-slate-700">{complaint.id}</td>
                     <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{complaint.citizen}</div>
                        <div className="text-xs text-slate-500">{complaint.phone}</div>
                     </td>
                     <td className="py-4 px-4 font-bold text-slate-600 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          {complaint.category === 'Sanitation' || complaint.category === 'Garbage' ? '🗑️' : 
                           complaint.category === 'Water Supply' ? '💧' : 
                           complaint.category === 'Electricity' ? '⚡' : '🛣️'}
                        </div>
                        {complaint.category}
                     </td>
                     <td className="py-4 px-4">
                       <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${getStatusColor(complaint.status)}`}>
                         {complaint.status}
                       </span>
                     </td>
                     <td className="py-4 px-4">
                       <div className="flex flex-col gap-1">
                         <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getPriorityColor(complaint.priority)}`}>
                           {complaint.priority}
                         </span>
                         {complaint.sla !== '-' && (
                           <span className={`text-xs font-bold ${complaint.priority === 'Critical' ? 'text-rose-600' : 'text-slate-500'}`}>
                             Due: {complaint.sla}
                           </span>
                         )}
                       </div>
                     </td>
                     <td className="py-4 pl-4 text-right">
                       <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors font-bold text-xs uppercase tracking-wider flex items-center gap-1 ml-auto">
                          View
                       </button>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: GIS Ward Map */}
        <div className="xl:col-span-1 h-[600px] xl:h-auto min-h-[500px]">
           {/* Passing a custom height class to WardMap so it fills the parent column */}
           <WardMap className="h-full border-none shadow-none" />
        </div>

      </div>

      {/* Log New Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
                  <AlertCircle size={24} />
                </div>
                <h2 className="text-lg font-black text-slate-800">Log New Complaint</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Left Column: Citizen Details */}
              <div className="space-y-6">
                <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">Citizen Details</h3>
                
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Citizen Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm" placeholder="e.g., Ramesh Kumar" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Phone Number</label>
                  <input type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Notify Citizen via WhatsApp?</label>
                  <div className="flex items-center gap-3 mt-2">
                     <button className="px-4 py-2 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-bold flex-1 hover:bg-emerald-200 transition-colors">Yes, Send Updates</button>
                     <button className="px-4 py-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold flex-1 hover:bg-slate-200 transition-colors">No Notification</button>
                  </div>
                </div>
              </div>

              {/* Right Column: Issue Details */}
              <div className="space-y-6">
                 <h3 className="font-extrabold text-slate-800 uppercase tracking-wider text-sm border-b border-slate-100 pb-2">Issue Details</h3>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Category</label>
                     <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm">
                       <option>Water Supply</option>
                       <option>Sanitation & Garbage</option>
                       <option>Roads & Potholes</option>
                       <option>Streetlights</option>
                       <option>Other</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Location (Ward/Sector)</label>
                     <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm">
                       <option>Ward 1</option>
                       <option>Ward 2</option>
                       <option>Ward 3</option>
                       <option>Ward 4</option>
                     </select>
                   </div>
                 </div>

                 <div>
                    <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase tracking-wide">Issue Description</label>
                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 placeholder-slate-400 shadow-sm resize-none" placeholder="Describe the issue in detail..."></textarea>
                 </div>

                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors text-sm px-4 py-3 bg-sky-50 rounded-xl border border-sky-100 w-full justify-center">
                       <Camera size={18} /> Attach Photo Evidence
                    </button>
                    <button className="flex items-center gap-2 text-slate-600 font-bold hover:text-slate-700 transition-colors text-sm px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full justify-center">
                       <MapPin size={18} /> Drop Map Pin
                    </button>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200 flex items-center gap-2"
              >
                <Plus size={18} /> Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
