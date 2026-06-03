import React, { useState } from 'react';
import SuperAdminDashboard from './SuperAdminDashboard';
import TenantManagement from './TenantManagement';
import SupportTicketsAdmin from './SupportTicketsAdmin';
import CustomerUpdates from './CustomerUpdates';
import BillingManagement from './BillingManagement';
import { 
  LayoutDashboard, 
  Users,
  Headset,
  CreditCard,
  Building,
  Bell
} from 'lucide-react';

export default function SuperAdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tenants', label: 'Customers', icon: Users },
    { id: 'tickets', label: 'Support Issues', icon: Headset },
    { id: 'updates', label: 'Updates', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <SuperAdminDashboard />;
      case 'tenants': return <TenantManagement />;
      case 'tickets': return <SupportTicketsAdmin />;
      case 'updates': return <CustomerUpdates />;
      case 'billing': return <BillingManagement />;
      default: return <SuperAdminDashboard />;
    }
  };

  const getPageTitle = () => {
    return menuItems.find(m => m.id === activeTab)?.label || 'Super Admin';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900 relative z-50">
      
      {/* Sidebar */}
      <aside className="w-80 bg-sky-900 text-sky-100 flex flex-col border-r border-sky-800 shadow-xl z-20">
        <div className="h-28 flex items-center px-10 border-b border-sky-800 bg-sky-950">
          <div className="flex items-center gap-6 text-white">
            <Building size={40} className="text-sky-300" />
            <span className="font-bold text-2xl tracking-wide">Owner Portal</span>
          </div>
        </div>

        <nav className="flex-1 py-10 space-y-4 px-6">
          <div className="px-4 text-base font-bold text-sky-300/60 uppercase tracking-widest mb-6">Management</div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-6 px-6 py-5 rounded-xl text-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-sky-800 text-white shadow-inner' 
                    : 'text-sky-200 hover:bg-sky-800 hover:text-white'
                }`}
              >
                <Icon size={28} className={isActive ? 'text-sky-300' : 'opacity-80'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-28 bg-white border-b border-slate-200 flex items-center justify-between px-12 shadow-sm">
          <h1 className="text-4xl font-extrabold text-slate-800">{getPageTitle()}</h1>
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-slate-500">Super Admin (Owner)</span>
            <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-10 overflow-y-auto w-full">
          {renderContent()}
        </main>
      </div>

    </div>
  );
}
