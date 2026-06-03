import React, { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, CheckCircle, X } from 'lucide-react';
import { getSupportTickets, subscribeToSupportTickets } from '../../services/supportService';

export default function SupportTicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const loadTickets = async () => {
      setIsLoading(true);
      const data = await getSupportTickets();
      if (data && data.length > 0) {
        setTickets(data);
      }
      setIsLoading(false);

      subscription = subscribeToSupportTickets((payload) => {
        if (payload.eventType === 'INSERT') {
          setTickets((prev) => [payload.new, ...prev]);
        }
      });
    };

    loadTickets();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

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
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                <th className="py-3 px-6">Ticket Details</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Status & Time</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setActiveTicket(ticket)}>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{ticket.issue}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-slate-500 text-xs">{(ticket.id || '').split('-')[0]} • {ticket.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        ticket.priority === 'High' ? 'border-red-200 text-red-600 bg-red-50' :
                        ticket.priority === 'Medium' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-sky-200 text-sky-600 bg-sky-50'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-bold text-sm">
                    {ticket.customer}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold w-max ${
                        ticket.status === 'Open' ? 'bg-sky-100 text-sky-800' :
                        ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status}
                      </span>
                      <span className="text-slate-500 font-semibold text-xs mt-1">Open: {ticket.timeOpen}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button onClick={() => setActiveTicket(ticket)} className="hover:text-sky-600 flex items-center gap-1 text-xs" title="Reply to Ticket">
                      <MessageSquare size={16} />
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-start bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeTicket.issue}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-sky-600">{activeTicket.customer}</span>
                  <span className="text-slate-500 text-xs">{activeTicket.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-sm hover:bg-green-200 transition-colors">
                  Mark Resolved
                </button>
                <button onClick={() => setActiveTicket(null)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
              
              <div className="flex gap-4 max-w-2xl">
                <div className="w-10 h-10 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  T
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <p className="text-sm text-slate-800">{activeTicket.issue}</p>
                  <p className="text-slate-400 text-xs mt-2 font-semibold">{activeTicket.time}</p>
                </div>
              </div>

              {activeTicket.status === 'In Progress' && (
                <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
                  <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    SA
                  </div>
                  <div className="bg-sky-600 p-4 rounded-xl shadow-sm">
                    <p className="text-sm text-white">Hello Ramesh, looking into this right now. It appears to be a rate limit issue from Meta's side. We are applying a patch.</p>
                    <p className="text-sky-200 text-xs mt-2 font-semibold">Yesterday, 04:30 PM</p>
                  </div>
                </div>
              )}

            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleSendReply} className="flex gap-4">
                <textarea 
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder="Type your reply to the tenant here..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none h-20"
                  required
                />
                <button type="submit" className="px-6 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                  <MessageSquare size={16} />
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
