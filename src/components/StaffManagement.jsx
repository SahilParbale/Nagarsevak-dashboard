import React, { useState } from 'react';
import { Users, Clock, AlertOctagon, CheckCircle2, ListTodo, Plus, X, Search, Filter, MoreVertical, Calendar, Paperclip, Briefcase } from 'lucide-react';

export default function StaffManagement() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const staffMembers = [
    { id: 1, name: 'Amit Sharma', role: 'Chief Admin Assistant', status: 'online', activeTasks: 3, resolvedToday: 12, workload: 40 },
    { id: 2, name: 'Priya Desai', role: 'Field Coordinator', status: 'field', activeTasks: 5, resolvedToday: 8, workload: 85 },
    { id: 3, name: 'Rajesh Patil', role: 'Public Relations PA', status: 'meeting', activeTasks: 2, resolvedToday: 15, workload: 30 },
    { id: 4, name: 'Sneha Rao', role: 'Data Entry Operator', status: 'leave', activeTasks: 0, resolvedToday: 0, workload: 0 },
  ];

  const escalatedTasks = [
    { id: 'TKT-8992', title: 'Water contamination in Ward 2', assignedTo: 'Priya Desai', slaBreach: true, hoursOverdue: 4 },
    { id: 'LTR-042', title: 'VIP Letter from Mayor Office', assignedTo: 'Amit Sharma', slaBreach: false, timeRemaining: '2 hours' },
    { id: 'TKT-9011', title: 'Road collapse near Sector 4', assignedTo: 'Unassigned', slaBreach: true, hoursOverdue: 12 },
  ];

  const allTasks = [
    { id: 'TKT-8992', title: 'Water contamination in Ward 2', assignedTo: 'Priya Desai', priority: 'High', status: 'In Progress', due: 'Today' },
    { id: 'TKT-8995', title: 'Streetlight repair in Sector 1', assignedTo: 'Rajesh Patil', priority: 'Medium', status: 'Pending', due: 'Tomorrow' },
    { id: 'LTR-042', title: 'Draft response for Mayor Office', assignedTo: 'Amit Sharma', priority: 'High', status: 'In Progress', due: 'Today' },
    { id: 'TKT-9004', title: 'Collect survey data from Ward 5', assignedTo: 'Priya Desai', priority: 'Low', status: 'Pending', due: 'In 3 days' },
    { id: 'TKT-9011', title: 'Road collapse near Sector 4', assignedTo: 'Unassigned', priority: 'Critical', status: 'Open', due: 'Overdue' },
  ];

  const handleAssignTask = (staffName) => {
    setSelectedAssignee(staffName);
    setIsTaskModalOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-slide-in">
      
      {/* High-Level KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Staff</p>
            <h3 className="text-xl font-black text-slate-800">3<span className="text-lg text-slate-400 font-medium ml-1">/ 4</span></h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Tasks Pending</p>
            <h3 className="text-xl font-black text-slate-800">28</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
            <ListTodo size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Resolved Today</p>
            <h3 className="text-xl font-black text-emerald-600">35</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="glass-card p-6 flex items-center justify-between hover:shadow-md transition-shadow bg-gradient-to-br from-rose-50 to-white border-rose-100">
          <div>
            <p className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-1">SLA Breaches</p>
            <h3 className="text-xl font-black text-rose-700">2</h3>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-sm animate-pulse">
            <AlertOctagon size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Escalation Alerts (Takes 1 column) */}
        <div className="glass-card p-6 flex flex-col h-full bg-gradient-to-br from-rose-50 to-white border border-rose-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-rose-100 pb-4">
            <div className="p-3 rounded-xl bg-rose-100 text-rose-600 shadow-sm">
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Escalations</h3>
              <p className="text-sm text-slate-500 font-medium">SLA Breaches & Priority Action</p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {escalatedTasks.map(task => (
              <div key={task.id} className={`p-5 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${task.slaBreach ? 'border-rose-300' : 'border-amber-300'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-black text-slate-800">{task.id}</span>
                  {task.slaBreach ? (
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-extrabold rounded border border-rose-200 animate-pulse">
                      {task.hoursOverdue}H OVERDUE
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-extrabold rounded border border-amber-200">
                      {task.timeRemaining} LEFT
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-3 leading-snug">{task.title}</h4>
                <div className="flex items-center justify-between text-sm font-medium pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Assigned: <span className={task.assignedTo === 'Unassigned' ? 'text-rose-500 font-bold' : 'text-slate-800 font-bold'}>{task.assignedTo}</span></span>
                  <button className="text-sky-600 hover:text-sky-800 font-bold">Intervene →</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Assignment Tracker (Takes 2 columns) */}
        <div className="glass-card p-6 xl:col-span-2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-100 text-sky-600 shadow-sm">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Staff Workload Tracker</h3>
                <p className="text-base text-slate-500 font-medium">Live status and assignment distribution</p>
              </div>
            </div>
            <button 
              onClick={() => { setSelectedAssignee(''); setIsTaskModalOpen(true); }}
              className="px-5 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} /> New Task
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-xs">
                  <th className="pb-4 pr-4">Staff Member</th>
                  <th className="pb-4 px-4">Status</th>
                  <th className="pb-4 px-4 w-48">Workload</th>
                  <th className="pb-4 px-4 text-center">Active / Done</th>
                  <th className="pb-4 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffMembers.map(staff => (
                  <tr key={staff.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-5 pr-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-black text-slate-600 border border-slate-300">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800 text-base">{staff.name}</div>
                          <div className="text-xs font-bold text-slate-500">{staff.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase border flex items-center gap-1.5 w-fit ${
                        staff.status === 'online' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        staff.status === 'field' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                        staff.status === 'meeting' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {staff.status === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {staff.status === 'field' && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
                        {staff.status === 'meeting' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        {staff.status === 'leave' && <span className="w-2 h-2 rounded-full bg-slate-400"></span>}
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div 
                            className={`h-full rounded-full ${
                              staff.workload > 80 ? 'bg-rose-500' : 
                              staff.workload > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${staff.workload}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-600 w-8">{staff.workload}%</span>
                      </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                         <span className="font-black text-slate-700">{staff.activeTasks}</span>
                         <span className="text-slate-300">|</span>
                         <span className="font-black text-emerald-600">{staff.resolvedToday}</span>
                      </div>
                    </td>
                    <td className="py-5 pl-4 text-right">
                      <button 
                        onClick={() => handleAssignTask(staff.name)}
                        disabled={staff.status === 'leave'}
                        className="px-4 py-2 bg-white border border-slate-200 text-sky-600 font-bold text-sm rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task Management Data Table */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
                <Briefcase size={24} />
             </div>
             <div>
               <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">All Active Tasks</h3>
               <p className="text-sm text-slate-500 font-medium">Manage and track ongoing activities</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search tasks..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 w-64" />
            </div>
            <button className="p-2 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                <th className="pb-3 pr-4">Task ID</th>
                <th className="pb-3 px-4">Title</th>
                <th className="pb-3 px-4">Assignee</th>
                <th className="pb-3 px-4">Priority</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Due Date</th>
                <th className="pb-3 pl-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {allTasks.map((task) => (
                 <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                   <td className="py-4 pr-4 font-black text-slate-700">{task.id}</td>
                   <td className="py-4 px-4 font-bold text-slate-800">{task.title}</td>
                   <td className="py-4 px-4 text-slate-600 font-medium">{task.assignedTo}</td>
                   <td className="py-4 px-4">
                     <span className={`px-2 py-1 rounded text-xs font-black uppercase border ${getPriorityColor(task.priority)}`}>
                       {task.priority}
                     </span>
                   </td>
                   <td className="py-4 px-4 font-bold text-slate-700">{task.status}</td>
                   <td className="py-4 px-4 text-slate-500 font-medium flex items-center gap-1">
                      <Calendar size={14}/> {task.due}
                   </td>
                   <td className="py-4 pl-4 text-right">
                     <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                     </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Task Modal Overlay */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">Assign New Task</h2>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wide">Task Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                  placeholder="e.g., Review Ward 4 Sanitation Report"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wide">Assign To</label>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm"
                    defaultValue={selectedAssignee}
                  >
                    <option value="">-- Select Staff --</option>
                    {staffMembers.filter(s => s.status !== 'leave').map(staff => (
                      <option key={staff.id} value={staff.name}>{staff.name} ({staff.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wide">Priority</label>
                  <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 shadow-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical (SLA Tracked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wide">Description</label>
                <textarea 
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-medium text-slate-800 placeholder-slate-400 shadow-sm resize-none"
                  placeholder="Provide task details or instructions..."
                ></textarea>
              </div>

              <div className="pt-2">
                 <button className="flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 transition-colors text-sm px-4 py-2 bg-sky-50 rounded-xl border border-sky-100">
                    <Paperclip size={16} /> Attach Files / Letters
                 </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
