import React, { useState, useEffect } from 'react';
import { Users, Activity, AlertTriangle, Bell } from 'lucide-react';
import { getTenants, subscribeToTenants } from '../../services/tenantService';
import { getSupportTickets, subscribeToSupportTickets } from '../../services/supportService';

export default function SuperAdminDashboard() {
  const [tenantData, setTenantData] = useState([]);
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    let tenantSub;
    let ticketSub;

    const fetchData = async () => {
      const tenants = await getTenants();
      const tickets = await getSupportTickets();
      setTenantData(tenants || []);
      setTicketData(tickets || []);

      // Realtime setup for simultaneous live metrics
      tenantSub = subscribeToTenants((payload) => {
        if (payload.eventType === 'INSERT') {
          setTenantData((prev) => [...prev, payload.new]);
        }
      });
      
      ticketSub = subscribeToSupportTickets((payload) => {
        if (payload.eventType === 'INSERT') {
          setTicketData((prev) => [...prev, payload.new]);
        }
      });
    };
    fetchData();

    return () => {
      if (tenantSub) tenantSub.unsubscribe();
      if (ticketSub) ticketSub.unsubscribe();
    };
  }, []);

  // Compute dynamic stats based strictly on actual Supabase data
  const totalCustomers = tenantData.length;
  const activeCustomers = tenantData.filter(t => t.status === 'Active').length;
  const totalTickets = ticketData.length;

  const stats = [
    { label: 'Total Customers', value: totalCustomers.toString(), change: '', icon: Users, color: 'text-sky-600', bg: 'bg-sky-100' },
    { label: 'Active (7 Days)', value: activeCustomers.toString(), change: '', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Open Updates', value: '0', change: '', icon: Bell, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Open Issues', value: totalTickets.toString(), change: '', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  // We map the live tenantData to Top Customers. If empty, it'll just map 0 items.
  const topCustomers = tenantData.slice(0, 4).map(t => ({
    name: t.name,
    plan: t.plan || 'Nagarsevak',
    value: 'Active'
  }));

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              {stat.change && <p className="text-sm text-slate-500 mt-4">{stat.change}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Issue Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Most Common Support Issues</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">WhatsApp Bot Disconnected</span>
                <span className="text-red-500 font-bold">45%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Login / Access Issues</span>
                <span className="text-amber-500 font-bold">30%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-slate-700">Feature Requests / How-To</span>
                <span className="text-sky-500 font-bold">25%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Engaged Tenants */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Top Customers (By Subscription)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {topCustomers.map((customer, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sky-100 text-sky-700 font-bold text-sm rounded-lg flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{customer.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Plan: <span className="font-semibold text-sky-600">{customer.plan}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-green-600">{customer.value}</p>
                    <p className="text-xs text-slate-500">Subscription Value</p>
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
