import React, { useState } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, X } from 'lucide-react';

export default function SupportTicketsAdmin() {
  const [tickets, setTickets] = useState([
    { id: '#1045', subject: 'WhatsApp Bot not replying to citizens', tenant: 'Ward 42 (Ramesh Patil)', date: 'Today, 10:30 AM', priority: 'High', status: 'Open', category: 'Bug / Issue', timeOpen: '4 Hours' },
    { id: '#1044', subject: 'Need help exporting voter list', tenant: 'Ward 18 (Sunita Sharma)', date: 'Yesterday, 04:15 PM', priority: 'Medium', status: 'In Progress', category: 'How-To / Help', timeOpen: '1 Day' },
    { id: '#1043', subject: 'Billing issue for March invoice', tenant: 'Ward 05 (Amit Desai)', date: 'May 28, 2026', priority: 'Low', status: 'Resolved', category: 'Billing', timeOpen: 'Closed' },
    { id: '#1042', subject: 'Unable to login to staff account', tenant: 'Ward 12 (Pooja Rao)', date: 'Today, 09:15 AM', priority: 'High', status: 'Open', category: 'Bug / Issue', timeOpen: '5 Hours' },
    { id: '#1041', subject: 'How to add new complaints?', tenant: 'Ward 24 (Kiran More)', date: 'May 30, 2026', priority: 'Low', status: 'In Progress', category: 'How-To / Help', timeOpen: '2 Days' },
    { id: '#1040', subject: 'WhatsApp template approval pending', tenant: 'Ward 33 (Vivek Singh)', date: 'May 29, 2026', priority: 'Medium', status: 'Open', category: 'Feature Request', timeOpen: '3 Days' },
    { id: '#1039', subject: 'Error while uploading Excel file', tenant: 'Ward 55 (Sanjay Joshi)', date: 'May 25, 2026', priority: 'High', status: 'Resolved', category: 'Bug / Issue', timeOpen: 'Closed' },
    { id: '#1038', subject: 'Upgrade my plan to Enterprise', tenant: 'Ward 08 (Neha Gupta)', date: 'May 20, 2026', priority: 'Medium', status: 'Resolved', category: 'Billing', timeOpen: 'Closed' },
  ]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = (e) => {
    e.preventDefault();
    alert(`Reply sent to ${activeTicket.tenant}`);
    setReplyMessage('');
    setActiveTicket(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[500px]">
          <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-6 py-4 text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 text-slate-700 rounded-xl text-xl font-bold hover:bg-slate-50 transition-colors shadow-md">
          <Filter size={28} />
          Filter
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xl border-collapse">
            <thead className="sticky top-0 z-10 shadow-sm bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-lg">
                <th className="py-6 px-10">Ticket Details</th>
                <th className="py-6 px-10">Customer</th>
                <th className="py-6 px-10">Status & Time</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setActiveTicket(ticket)}>
                  <td className="py-6 px-10">
                    <div className="font-bold text-slate-900 text-2xl">{ticket.subject}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-slate-500 text-lg">{ticket.id} • {ticket.date}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                        ticket.category === 'Bug / Issue' ? 'border-red-200 text-red-600 bg-red-50' :
                        ticket.category === 'Billing' ? 'border-purple-200 text-purple-600 bg-purple-50' : 'border-sky-200 text-sky-600 bg-sky-50'
                      }`}>
                        {ticket.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-10 text-slate-900 font-bold text-xl">
                    {ticket.tenant}
                  </td>
                  <td className="py-6 px-10">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold w-max ${
                        ticket.status === 'Open' ? 'bg-sky-100 text-sky-800' :
                        ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-slate-500 font-semibold text-base mt-1">Open: {ticket.timeOpen}</span>
                    </div>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex items-center justify-end gap-6 text-slate-400">
                      <button onClick={() => setActiveTicket(ticket)} className="hover:text-sky-600 flex items-center gap-2" title="Reply to Ticket">
                      <MessageSquare size={28} />
                      View Chat
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Chat Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-10 py-8 border-b border-slate-200 flex justify-between items-start bg-slate-50">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900">{activeTicket.subject}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xl font-bold text-sky-600">{activeTicket.tenant}</span>
                  <span className="text-slate-500 text-xl">{activeTicket.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <button className="px-6 py-3 bg-green-100 text-green-800 rounded-xl font-bold text-xl hover:bg-green-200 transition-colors">
                  Mark Resolved
                </button>
                <button onClick={() => setActiveTicket(null)} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                  <X size={32} />
                </button>
              </div>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-10 bg-slate-100 space-y-8">
              
              <div className="flex gap-6 max-w-3xl">
                <div className="w-14 h-14 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  T
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xl text-slate-800">Hi Support, our WhatsApp bot is randomly stopping responses for citizens in Ward 42. It works sometimes but not always. Please check immediately as we are getting complaints.</p>
                  <p className="text-slate-400 text-base mt-4 font-semibold">{activeTicket.date}</p>
                </div>
              </div>

              {activeTicket.status === 'In Progress' && (
                <div className="flex gap-6 max-w-3xl ml-auto flex-row-reverse">
                  <div className="w-14 h-14 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    SA
                  </div>
                  <div className="bg-sky-600 p-6 rounded-2xl shadow-sm">
                    <p className="text-xl text-white">Hello Ramesh, looking into this right now. It appears to be a rate limit issue from Meta's side. We are applying a patch.</p>
                    <p className="text-sky-200 text-base mt-4 font-semibold">Yesterday, 04:30 PM</p>
                  </div>
                </div>
              )}

            </div>

            {/* Chat Input */}
            <div className="p-8 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendReply} className="flex gap-6">
                <textarea 
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to the tenant here..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none h-24"
                  required
                />
                <button type="submit" className="px-10 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xl font-bold transition-colors shadow-md flex items-center justify-center gap-3">
                  <MessageSquare size={28} />
                  Send Reply
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
