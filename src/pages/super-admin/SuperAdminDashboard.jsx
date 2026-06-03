import React from 'react';
import { Users, Activity, AlertTriangle, Bell } from 'lucide-react';

export default function SuperAdminDashboard() {
  const stats = [
    { label: 'Total Customers', value: '45', change: '+2 this week', icon: Users, color: 'text-sky-600', bg: 'bg-sky-100' },
    { label: 'Active (7 Days)', value: '38', change: '7 Dormant', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Open Updates', value: '24', change: '12 pending review', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Open Issues', value: '14', change: '4 High Priority', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const topCustomers = [
    { name: 'Ward 42 (Ramesh Patil)', plan: 'Minister', value: '₹1,50,000/yr' },
    { name: 'Ward 18 (Sunita Sharma)', plan: 'Minister', value: '₹1,50,000/yr' },
    { name: 'Ward 05 (Amit Desai)', plan: 'Khasdar', value: '₹75,000/yr' },
    { name: 'Ward 12 (Pooja Rao)', plan: 'Amdar', value: '₹50,000/yr' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-md p-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-medium text-slate-500">{stat.label}</p>
                  <p className="text-5xl font-extrabold text-slate-900 mt-4">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl ${stat.bg}`}>
                  <Icon size={40} className={stat.color} />
                </div>
              </div>
              <p className="text-lg text-slate-500 mt-6">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Issue Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md">
          <div className="px-10 py-6 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Most Common Support Issues</h3>
          </div>
          <div className="p-10 space-y-10">
            <div>
              <div className="flex justify-between text-xl mb-4">
                <span className="font-semibold text-slate-700">WhatsApp Bot Disconnected</span>
                <span className="text-red-500 font-bold">45%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div className="bg-red-500 h-4 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-4">
                <span className="font-semibold text-slate-700">Login / Access Issues</span>
                <span className="text-amber-500 font-bold">30%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div className="bg-amber-500 h-4 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xl mb-4">
                <span className="font-semibold text-slate-700">Feature Requests / How-To</span>
                <span className="text-sky-500 font-bold">25%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div className="bg-sky-500 h-4 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Engaged Tenants */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md">
          <div className="px-10 py-6 border-b border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900">Top Customers (By Subscription)</h3>
          </div>
          <div className="p-10">
            <div className="space-y-8">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-sky-100 text-sky-700 font-bold text-2xl rounded-xl flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{customer.name}</p>
                      <p className="text-lg text-slate-500 mt-1">
                        Plan: <span className="font-semibold text-sky-600">{customer.plan}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-green-600">{customer.value}</p>
                    <p className="text-base text-slate-500">Subscription Value</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
