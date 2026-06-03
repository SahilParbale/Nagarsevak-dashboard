import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { IndianRupee, MessageSquareHeart, Users } from 'lucide-react';

export default function AdvancedAnalytics() {
  const fundData = [
    { name: 'Roads & Infra', value: 85, color: '#0ea5e9' },
    { name: 'Sanitation', value: 45, color: '#10b981' },
    { name: 'Parks & Rec', value: 20, color: '#a855f7' },
    { name: 'Health/Medical', value: 15, color: '#f59e0b' },
  ];

  const sentimentData = [
    { day: 'Mon', positive: 65, negative: 20, neutral: 15 },
    { day: 'Tue', positive: 60, negative: 25, neutral: 15 },
    { day: 'Wed', positive: 75, negative: 15, neutral: 10 },
    { day: 'Thu', positive: 80, negative: 10, neutral: 10 },
    { day: 'Fri', positive: 70, negative: 20, neutral: 10 },
    { day: 'Sat', positive: 85, negative: 5, neutral: 10 },
    { day: 'Sun', positive: 90, negative: 5, neutral: 5 },
  ];

  const demographicsData = [
    { age: '18-25', count: 120 },
    { age: '26-35', count: 350 },
    { age: '36-50', count: 410 },
    { age: '51-65', count: 280 },
    { age: '65+', count: 150 },
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-in pb-8">
      
      {/* 1. Fund Utilization Doughnut */}
      <div className="glass-card p-8 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600 shadow-sm border border-purple-200"><IndianRupee size={24} /></div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Fund Utilization</h3>
            <p className="text-sm text-slate-500 font-medium">Breakdown of Ward Development Funds (Lakhs)</p>
          </div>
        </div>
        <div className="flex-1 relative w-full flex items-center justify-center mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={fundData} cx="50%" cy="45%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                {fundData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={40} iconSize={12} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Label for Doughnut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <span className="text-3xl font-black text-slate-800">165L</span>
            <span className="text-sm font-bold text-slate-500 uppercase">Utilized</span>
          </div>
        </div>
      </div>

      {/* 2. Sentiment Analysis Trend */}
      <div className="glass-card p-8 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-rose-100 text-rose-600 shadow-sm border border-rose-200"><MessageSquareHeart size={24} /></div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Public Sentiment</h3>
            <p className="text-sm text-slate-500 font-medium">AI analysis of Bot chats & Social Media (7 Days)</p>
          </div>
        </div>
        <div className="flex-1 w-full text-sm font-medium">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sentimentData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tickLine={false} style={{ fontSize: '13px' }} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} style={{ fontSize: '13px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
              <Line type="monotone" name="Positive (%)" dataKey="positive" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" name="Negative (%)" dataKey="negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Citizen Demographics Bar Chart */}
      <div className="glass-card p-8 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-sky-100 text-sky-600 shadow-sm border border-sky-200"><Users size={24} /></div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Voter Demographics</h3>
            <p className="text-sm text-slate-500 font-medium">Age distribution of citizens interacting with office</p>
          </div>
        </div>
        <div className="flex-1 w-full text-sm font-medium">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={demographicsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="age" stroke="#64748b" tickLine={false} style={{ fontSize: '13px' }} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} style={{ fontSize: '13px' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={<CustomTooltip />} />
              <Bar dataKey="count" name="Citizens" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Contractor Status Mini-table */}
      <div className="glass-card p-8 flex flex-col h-[400px]">
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h3 className="text-xl font-extrabold text-slate-800 uppercase tracking-wider">Contractor Status</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Active vendor progress & payments</p>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            {[
              { id: 'CNT-01', vendor: 'Ravi Infra Co', project: 'Sector 4 Road', progress: 80, status: 'On Track' },
              { id: 'CNT-02', vendor: 'Eco Cleaners', project: 'Ward Sanitation', progress: 45, status: 'Delayed' },
              { id: 'CNT-03', vendor: 'Bright Lights', project: 'LED Streetlamps', progress: 100, status: 'Paid' },
            ].map(contract => (
              <div key={contract.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{contract.vendor}</h4>
                    <p className="text-sm font-medium text-slate-500">{contract.project}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase border ${
                    contract.status === 'On Track' ? 'bg-sky-100 text-sky-700 border-sky-200' :
                    contract.status === 'Delayed' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                    'bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}>
                    {contract.status}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
                  <div 
                    className={`h-full rounded-full ${contract.progress === 100 ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                    style={{ width: `${contract.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
