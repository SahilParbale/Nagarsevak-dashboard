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
  Bell,
  ArrowLeft
} from 'lucide-react';

export default function SuperAdminLayout({ onBackToPortal }) {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeAdminTab') || 'dashboard';
  });

  const handleSetTab = (tabId) => {
    setActiveTab(tabId);
    localStorage.setItem('activeAdminTab', tabId);
  };

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
      <aside className="w-64 bg-sky-900 text-sky-100 flex flex-col border-r border-sky-800 shadow-xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-sky-800 bg-sky-950">
          <div className="flex items-center gap-3 text-white">
            <Building size={24} className="text-sky-300" />
            <span className="font-bold text-lg tracking-wide">Owner Portal</span>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-2 px-4">
          <div className="px-4 text-xs font-bold text-sky-300/60 uppercase tracking-widest mb-4">Management</div>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSetTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-sky-800 text-white shadow-inner' 
                    : 'text-sky-200 hover:bg-sky-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-sky-300' : 'opacity-80'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {onBackToPortal && (
          <div className="p-4 mt-auto border-t border-sky-800">
            <button 
              onClick={onBackToPortal}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sky-950 text-sky-300 rounded-lg text-sm font-bold hover:bg-sky-900 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Portal
            </button>
          </div>
        )}
      </aside>

      {/* Main Content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">{getPageTitle()}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500">Super Admin (Owner)</span>
            <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
              SA
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto w-full">
          {renderContent()}
        </main>
      </div>

    </div>
  );
}
