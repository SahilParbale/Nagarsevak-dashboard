import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function AIBriefingCard({ userName }) {
  // Mock AI summary
  const summary = `You have 3 VIP letters pending review. Garbage collection complaints spiked by 15% in Sector 4 today. You have an upcoming meeting with the Commissioner at 3:00 PM.`;

  return (
    <div className="mb-8 relative overflow-hidden glass-card border-none bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 p-[1px] shadow-lg shadow-indigo-200 animate-slide-in">
      <div className="bg-white/95 backdrop-blur-3xl p-6 sm:p-8 rounded-[15px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        
        {/* Subtle background glow inside the card */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-[50px] pointer-events-none"></div>

        <div className="flex items-start md:items-center gap-5 relative z-10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 text-indigo-600 shadow-inner flex-shrink-0">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Daily Briefing
              </span>
              <span className="text-sm font-bold text-slate-400 font-normal">for {userName}</span>
            </h2>
            <p className="text-base text-slate-600 font-medium leading-relaxed max-w-3xl">
              {summary}
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm shrink-0 whitespace-nowrap active:scale-95">
          Take Action <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
