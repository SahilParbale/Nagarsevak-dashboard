import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { IndianRupee, TrendingUp, CheckCircle } from 'lucide-react';

export default function AnalyticsCharts() {
  const pieData = [
    { name: 'Water Supply', value: 24, color: '#0ea5e9' },
    { name: 'Drainage & Sewage', value: 35, color: '#a855f7' },
    { name: 'Street Lights', value: 18, color: '#f59e0b' },
    { name: 'Roads & Potholes', value: 15, color: '#ef4444' },
    { name: 'Solid Waste', value: 12, color: '#10b981' }
  ];

  const areaData = [
    { name: 'May 01', newComplaints: 8, resolved: 6 },
    { name: 'May 05', newComplaints: 15, resolved: 10 },
    { name: 'May 10', newComplaints: 12, resolved: 14 },
    { name: 'May 15', newComplaints: 22, resolved: 16 },
    { name: 'May 20', newComplaints: 14, resolved: 18 },
    { name: 'May 25', newComplaints: 9, resolved: 15 },
    { name: 'May 30', newComplaints: 19, resolved: 20 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg text-sm">
          <p className="font-bold text-slate-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
      <div className="glass-card p-6 lg:col-span-2 flex flex-col h-[420px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Resolution Rate Trend</h3>
            <p className="text-sm text-slate-500 font-medium">Comparing new vs resolved tickets (last 30 days)</p>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
            <TrendingUp size={16} />
            +8.3% speed
          </div>
        </div>

        <div className="flex-1 w-full text-sm font-medium text-slate-600">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} style={{ fontSize: '13px' }} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} style={{ fontSize: '13px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: '14px' }} />
              <Area type="monotone" name="New Complaints" dataKey="newComplaints" stroke="#ef4444" fillOpacity={1} fill="url(#colorNew)" strokeWidth={2} />
              <Area type="monotone" name="Resolved Cases" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col h-[420px]">
        <div className="mb-6">
          <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Tickets by Category</h3>
          <p className="text-sm text-slate-500 font-medium">Distribution of active reported issues</p>
        </div>

        <div className="flex-1 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={60} iconSize={12} iconType="circle" layout="horizontal" wrapperStyle={{ bottom: -10, fontSize: '13px', color: '#334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-6 lg:col-span-3 flex flex-col sm:flex-row justify-between items-stretch gap-8">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 border border-purple-200">
                <IndianRupee size={24} />
              </div>
              <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Sanctioned Ward Budget</h4>
            </div>
            <p className="text-base text-slate-500 leading-normal mb-6 font-medium">
              Fiscal Year 2026-27 Development Allocation Tracker
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-slate-200 pt-6">
            <div>
              <span className="text-sm text-slate-500 font-bold block uppercase mb-1.5">Total Grant</span>
              <span className="text-2xl font-black text-slate-800">₹2.40 Cr</span>
            </div>
            <div>
              <span className="text-sm text-slate-500 font-bold block uppercase mb-1.5">Disbursed</span>
              <span className="text-2xl font-black text-purple-600">₹1.65 Cr</span>
            </div>
            <div>
              <span className="text-sm text-slate-500 font-bold block uppercase mb-1.5">Remaining</span>
              <span className="text-2xl font-black text-slate-500">₹75.0 L</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-5 bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-inner">
          <div className="flex justify-between items-center text-base font-bold">
            <span className="text-slate-700 flex items-center gap-2">
              <CheckCircle size={20} className="text-sky-500" />
              Overall Project Completion Rate
            </span>
            <span className="text-sky-600 text-2xl font-black">72.5%</span>
          </div>

          <div className="w-full h-5 rounded-full bg-slate-200 overflow-hidden border border-slate-300 shadow-inner">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 shadow-md transition-all duration-1000" style={{ width: '72.5%' }}></div>
          </div>

          <div className="flex justify-between text-sm text-slate-500 font-bold mt-2">
            <span>20/28 Projects Finished</span>
            <span>8 Active / Under Tender</span>
          </div>
        </div>
      </div>
    </div>
  );
}
