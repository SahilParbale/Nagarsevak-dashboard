import React, { useState } from 'react';
import { Mail, ArrowUpRight, ArrowDownLeft, Search, Eye, Plus, Send, X, Calendar } from 'lucide-react';

export default function LettersTracker({ letters, onAddLetter }) {
  const [activeSubTab, setActiveSubTab] = useState('incoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formType, setFormType] = useState('incoming');
  const [formRef, setFormRef] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formStatus, setFormStatus] = useState('pending');

  const filteredLetters = letters.filter(letter => {
    const matchesTab = letter.type === activeSubTab;
    const matchesSearch = 
      letter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.senderOrReceiver.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const style = {
      pending: 'bg-amber-100 border-amber-200 text-amber-700',
      action_taken: 'bg-emerald-100 border-emerald-200 text-emerald-700',
      forwarded: 'bg-sky-100 border-sky-200 text-sky-700'
    }[status] || 'bg-slate-100 border-slate-200 text-slate-600';

    const text = {
      pending: 'PENDING ACTION',
      action_taken: 'ACTION TAKEN',
      forwarded: 'FORWARDED'
    }[status] || status;

    return <span className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border shadow-sm ${style}`}>{text}</span>;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formRef || !formSubject || !formDept) return;
    const newLetter = {
      id: Date.now(),
      type: formType,
      refNo: formRef,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      subject: formSubject,
      department: formDept,
      senderOrReceiver: formContact,
      status: formStatus,
      summary: `Letter logged regarding ${formSubject}. Forwarded for processing in department ${formDept}.`
    };
    onAddLetter(newLetter);
    setShowAddModal(false);
    setFormRef(''); setFormSubject(''); setFormDept(''); setFormContact(''); setFormStatus('pending');
  };

  return (
    <div className="glass-card p-8 flex flex-col h-full animate-slide-in">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-6 mb-8">
        <div className="flex bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner">
          <button onClick={() => setActiveSubTab('incoming')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeSubTab === 'incoming' ? 'bg-white text-sky-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}> 
            <ArrowDownLeft size={18} /> Incoming Letters
          </button>
          <button onClick={() => setActiveSubTab('outgoing')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeSubTab === 'outgoing' ? 'bg-white text-sky-700 border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}> 
            <ArrowUpRight size={18} /> Outgoing Letters
          </button>
        </div>

        <div className="flex gap-4 w-full md:w-auto items-center">
          <div className="relative flex-1 md:w-80">
            <Search size={18} className="absolute left-4 top-3 text-slate-400" />
            <input type="text" placeholder="Search by subject or Ref No..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 shadow-sm" />
          </div>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 border border-sky-700 text-white text-sm font-bold hover:bg-sky-700 shadow-md transition-all cursor-pointer shrink-0">
            <Plus size={18} /> Log Letter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-sm">
              <th className="pb-4 pr-4">Ref No</th>
              <th className="pb-4 px-4">Date</th>
              <th className="pb-4 px-4 w-1/3">Subject</th>
              <th className="pb-4 px-4">Department</th>
              <th className="pb-4 px-4">{activeSubTab === 'incoming' ? 'From' : 'To'}</th>
              <th className="pb-4 px-4">Status</th>
              <th className="pb-4 pl-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLetters.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-20 text-center text-slate-500">
                  <Mail size={48} className="mx-auto mb-4 text-slate-300" />
                  <span className="text-lg font-medium">No correspondence recorded</span>
                </td>
              </tr>
            ) : (
              filteredLetters.map((letter) => (
                <tr key={letter.id} className="group hover:bg-slate-50 transition-colors text-sm">
                  <td className="py-5 pr-4 font-mono font-bold text-sky-600 text-base">{letter.refNo}</td>
                  <td className="py-5 px-4 text-slate-500 whitespace-nowrap font-medium text-base">{letter.date}</td>
                  <td className="py-5 px-4 font-bold text-slate-800 text-base max-w-sm truncate">{letter.subject}</td>
                  <td className="py-5 px-4 text-slate-600 font-bold text-base">{letter.department}</td>
                  <td className="py-5 px-4 text-slate-500 font-medium text-base">{letter.senderOrReceiver}</td>
                  <td className="py-5 px-4">{getStatusBadge(letter.status)}</td>
                  <td className="py-5 pl-4 text-right">
                    <button onClick={() => setSelectedLetter(letter)} className="p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 shadow-sm transition-all cursor-pointer">
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedLetter && (
        <div className="fixed inset-0 bg-slate-800/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-2xl bg-white border border-slate-200 p-10 rounded-3xl relative shadow-2xl animate-slide-in">
            <button onClick={() => setSelectedLetter(null)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 rounded-2xl bg-sky-100 text-sky-600 border border-sky-200 shadow-sm"><Mail size={28} /></div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-800">Dispatch Details</h4>
                <p className="text-sm text-slate-500 font-mono font-bold mt-1.5">Ref No: {selectedLetter.refNo}</p>
              </div>
            </div>
            <div className="space-y-8 text-base">
              <div className="grid grid-cols-2 gap-6 border-y border-slate-200 py-6">
                <div>
                  <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">Date Logged</span>
                  <p className="font-bold text-slate-700 mt-2 text-lg">{selectedLetter.date}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">Type</span>
                  <p className="font-bold text-sky-600 mt-2 uppercase text-lg">{selectedLetter.type}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">Department</span>
                  <p className="font-bold text-slate-700 mt-2 text-lg">{selectedLetter.department}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">{selectedLetter.type === 'incoming' ? 'Sender Detail' : 'Recipient Detail'}</span>
                  <p className="font-bold text-slate-700 mt-2 text-lg">{selectedLetter.senderOrReceiver}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">Subject</span>
                <p className="text-xl font-extrabold text-slate-800 mt-2.5 leading-relaxed">{selectedLetter.subject}</p>
              </div>
              <div>
                <span className="text-sm text-slate-500 uppercase font-extrabold tracking-wide">Action & Summary</span>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-3 text-slate-700 leading-relaxed font-medium shadow-inner text-lg">
                  {selectedLetter.summary}
                </div>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                <div>{getStatusBadge(selectedLetter.status)}</div>
                <button onClick={() => setSelectedLetter(null)} className="px-8 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold shadow-sm cursor-pointer transition-colors text-base">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-800/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-lg bg-white border border-slate-200 p-8 rounded-3xl relative shadow-2xl animate-slide-in">
            <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"><X size={24} /></button>
            <h4 className="text-xl font-extrabold text-slate-800 mb-8 flex items-center gap-3">
              <Mail size={24} className="text-sky-600" /> Log New Correspondence
            </h4>
            <form onSubmit={handleAddSubmit} className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base">
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">Ref / Dispatch No</label>
                  <input type="text" required placeholder="e.g. IN-2026-948" value={formRef} onChange={(e) => setFormRef(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base placeholder-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">Subject</label>
                <input type="text" required placeholder="e.g. Road renovation request" value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base placeholder-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">Department</label>
                  <input type="text" required placeholder="e.g. PWD, Water" value={formDept} onChange={(e) => setFormDept(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base placeholder-slate-400" />
                </div>
                <div>
                  <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">{formType === 'incoming' ? 'Sender' : 'Recipient'}</label>
                  <input type="text" required placeholder="e.g. Rohit Kumar" value={formContact} onChange={(e) => setFormContact(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base placeholder-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-500 font-extrabold uppercase mb-2">Initial Status</label>
                <select value={formStatus} onChange={(e) => setFormStatus(e.target.value)} className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3 text-slate-700 font-bold focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 text-base">
                  <option value="pending">Pending Action</option>
                  <option value="forwarded">Forwarded to Department</option>
                  <option value="action_taken">Action Taken (Closed)</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-bold cursor-pointer transition-colors shadow-sm text-base">Cancel</button>
                <button type="submit" className="px-6 py-3 rounded-xl bg-sky-600 border border-sky-700 text-white font-bold hover:bg-sky-700 shadow-md transition-all cursor-pointer text-base">Save Correspondence</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
