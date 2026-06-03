import React from 'react';
import { Users, Bot, AlertTriangle, CheckSquare, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

export default function StatCards({ stats, onAddVisitor, onAddComplaint, onAddInteraction }) {
  const cards = [
    {
      id: 'visitors',
      title: "Today's Visitors",
      value: stats.visitors,
      change: "+8.3%",
      isPositive: true,
      icon: Users,
      color: "sky",
      glowClass: "glass-card-glow",
      sparkline: [20, 30, 25, 40, 35, 55, 60, stats.visitors % 100],
      action: { label: "Log Visitor", onClick: onAddVisitor }
    },
    {
      id: 'interactions',
      title: "Bot Interactions",
      value: stats.interactions,
      change: "+24.1%",
      isPositive: true,
      icon: Bot,
      color: "emerald",
      glowClass: "glass-card-glow-emerald",
      sparkline: [120, 150, 180, 160, 210, 240, 260, stats.interactions % 300],
      action: { label: "Simulate Sync", onClick: onAddInteraction }
    },
    {
      id: 'complaints',
      title: "Pending Complaints",
      value: stats.pendingComplaints,
      change: "-4.2%",
      isPositive: true, // positive meaning it decreased, which is good
      icon: AlertTriangle,
      color: "amber",
      glowClass: "glass-card-glow-amber",
      sparkline: [35, 32, 28, 30, 27, 25, 23, stats.pendingComplaints],
      action: { label: "Add Ticket", onClick: onAddComplaint }
    },
    {
      id: 'completed',
      title: "Works Completed",
      value: stats.completedWorks,
      change: "+3 new this week",
      isPositive: true,
      icon: CheckSquare,
      color: "purple",
      glowClass: "glass-card-glow-purple",
      sparkline: [40, 41, 41, 42, 43, 44, 45, stats.completedWorks],
      action: null
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in">
      {cards.map((card) => {
        const Icon = card.icon;
        
        // Dynamic colors configuration (Light theme optimized)
        const colorConfig = {
          sky: {
            text: 'text-sky-600',
            bg: 'bg-sky-100',
            border: 'border-sky-200',
            stroke: '#0ea5e9'
          },
          emerald: {
            text: 'text-emerald-600',
            bg: 'bg-emerald-100',
            border: 'border-emerald-200',
            stroke: '#10b981'
          },
          amber: {
            text: 'text-amber-600',
            bg: 'bg-amber-100',
            border: 'border-amber-200',
            stroke: '#f59e0b'
          },
          purple: {
            text: 'text-purple-600',
            bg: 'bg-purple-100',
            border: 'border-purple-200',
            stroke: '#a855f7'
          }
        }[card.color];

        return (
          <div
            key={card.id}
            className={`glass-card p-6 flex flex-col justify-between group hover:-translate-y-1 ${card.glowClass}`}
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  {card.title}
                </span>
                <div className="text-4xl font-black text-slate-800 tracking-tight mt-2 group-hover:scale-105 transition-transform duration-200 origin-left">
                  {card.value.toLocaleString()}
                </div>
              </div>
              
              <div className={`p-3 rounded-xl border ${colorConfig.bg} ${colorConfig.border} ${colorConfig.text}`}>
                <Icon size={24} className="transition-transform group-hover:rotate-6" />
              </div>
            </div>

            {/* Sparkline & Mini Graph Area */}
            <div className="h-12 mt-4 relative overflow-hidden flex items-end">
              <svg className="w-full h-10" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={colorConfig.stroke} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={colorConfig.stroke} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d={`M 0 30 ${card.sparkline.map((val, idx) => {
                    const x = (idx / (card.sparkline.length - 1)) * 100;
                    const minVal = Math.min(...card.sparkline);
                    const maxVal = Math.max(...card.sparkline) || 1;
                    const y = 25 - ((val - minVal) / (maxVal - minVal || 1)) * 20;
                    return `L ${x} ${y}`;
                  }).join(' ')} L 100 30 Z`}
                  fill={`url(#grad-${card.id})`}
                />
                {/* Stroke path */}
                <path
                  d={card.sparkline.map((val, idx) => {
                    const x = (idx / (card.sparkline.length - 1)) * 100;
                    const minVal = Math.min(...card.sparkline);
                    const maxVal = Math.max(...card.sparkline) || 1;
                    const y = 25 - ((val - minVal) / (maxVal - minVal || 1)) * 20;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke={colorConfig.stroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-4">
              <span className="text-xs text-slate-600 flex items-center gap-1.5 font-bold">
                {card.isPositive ? (
                  <ArrowUpRight size={16} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={16} className="text-rose-500" />
                )}
                <span className={card.id === 'complaints' ? 'text-emerald-600' : 'text-slate-700'}>{card.change}</span>
              </span>

              {card.action && (
                <button
                  onClick={card.action.onClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer transition-all active:scale-95`}
                >
                  <Plus size={14} />
                  {card.action.label}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
