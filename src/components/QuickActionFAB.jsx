import React, { useState } from 'react';
import { Plus, Users, AlertTriangle, FileText, X } from 'lucide-react';

export default function QuickActionFAB({ onAddVisitor, onAddComplaint }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {/* Expanded Menu Actions */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        <button 
          onClick={() => { onAddVisitor(); setIsOpen(false); }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl hover:border-sky-300 group transition-all"
        >
          <span className="text-sm font-bold text-slate-700 group-hover:text-sky-700">Log Walk-in Visitor</span>
          <div className="p-2 rounded-lg bg-sky-100 text-sky-600"><Users size={18} /></div>
        </button>
        
        <button 
          onClick={() => { onAddComplaint(); setIsOpen(false); }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl hover:border-amber-300 group transition-all"
        >
          <span className="text-sm font-bold text-slate-700 group-hover:text-amber-700">New Complaint</span>
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600"><AlertTriangle size={18} /></div>
        </button>

        <button 
          onClick={() => { setIsOpen(false); }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200 shadow-xl hover:border-purple-300 group transition-all"
        >
          <span className="text-sm font-bold text-slate-700 group-hover:text-purple-700">Quick Note</span>
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><FileText size={18} /></div>
        </button>
      </div>

      {/* Main FAB Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-45' 
            : 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white'
        }`}
      >
        <Plus size={28} className="transition-transform duration-300" />
      </button>
    </div>
  );
}
