import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, ShieldOff, LogIn, X, ChevronLeft, Building, User, Phone, Mail, Award, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getTenants, createTenant, subscribeToTenants } from '../../services/tenantService';

export default function TenantManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    let subscription;
    
    const loadTenants = async () => {
      setIsLoading(true);
      const data = await getTenants();
      if (data && data.length > 0) {
        setTenants(data);
      } else {
        // Fallback removed as requested. It will now show strictly live DB data (even if empty).
        setTenants([]);
      }
      setIsLoading(false);
      
      // Setup Realtime Sync
      subscription = subscribeToTenants((payload) => {
        // If a new tenant is added from the other dashboard, instantly append it!
        if (payload.eventType === 'INSERT') {
          setTenants((prev) => [...prev, payload.new]);
        }
        // Could also handle UPDATE and DELETE here
      });
    };
    
    loadTenants();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const [newTenant, setNewTenant] = useState({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', email: '', mobile: '', plan: 'Nagarsevak', endDate: '', loginEmail: '', password: '' });

  const handleAddTenant = async (e) => {
    e.preventDefault();
    const newId = `T-00${tenants.length + 1}`;
    
    // Extract credentials, keep everything else for the DB
    const { loginEmail, password, ...dbTenantData } = newTenant;
    
    const fullNewTenant = { 
      ...dbTenantData, 
      subdomain: dbTenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `tenant-${Date.now()}`,
      representativeName: 'Not Assigned', 
      representativeContact: 'N/A', 
      status: 'Active', 
      lastActive: 'Just now', 
      citizenCount: '0', 
      workerCount: 1 
    };

    // Optimistically update UI
    setTenants([...tenants, fullNewTenant]);
    setShowAddModal(false);
    setNewTenant({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', email: '', mobile: '', plan: 'Nagarsevak', endDate: '', loginEmail: '', password: '' });

    // Sync with Supabase Database (passing credentials if filled)
    const credentials = (loginEmail && password) 
      ? { loginEmail, password } 
      : null;

    const { success, error } = await createTenant(fullNewTenant, credentials);
    if (!success) {
      console.warn('Failed to sync to Supabase backend:', error);
      alert(`Failed to create customer: ${error.message || JSON.stringify(error)}`);
    } else {
      alert("Customer created successfully! The login credentials are now active.");
    }
  };

  const handleImpersonate = (tenantName, e) => {
    if (e) e.stopPropagation();
    alert(`Logging in as ${tenantName}. You will now see the dashboard exactly as they see it.`);
  };

  const getPartyColor = (party) => {
    switch(party) {
      case 'BJP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Shiv Sena': return 'bg-orange-50 text-orange-600 border-orange-100'; // Saffron
      case 'NCP': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Congress': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // --- PROFILE VIEW COMPONENT ---
  if (selectedCustomer) {
    return (
      <div className="space-y-6 w-full">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button 
            onClick={() => setSelectedCustomer(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-sky-600 font-bold transition-colors"
          >
            <ChevronLeft size={24} />
            Back to Customers
          </button>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={(e) => handleImpersonate(selectedCustomer.name, e)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg px-6 py-3 rounded-xl transition-colors"
            >
              <LogIn size={20} /> Login as Customer
            </button>
            <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg px-6 py-3 rounded-xl transition-colors">
              <Edit size={20} /> Edit Details
            </button>
          </div>
        </div>

        {/* Top Identification Block */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="w-24 h-24 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
            {selectedCustomer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-lg font-extrabold text-slate-900">{selectedCustomer.name}</h2>
              <span className={`px-4 py-1 border rounded-md text-sm font-bold tracking-widest uppercase ${getPartyColor(selectedCustomer.party)}`}>
                {selectedCustomer.party}
              </span>
              <span className={`px-4 py-1 border rounded-md text-sm font-bold tracking-widest uppercase ${
                selectedCustomer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {selectedCustomer.status}
              </span>
            </div>
            <p className="text-xl text-slate-500 font-medium">Customer ID: {selectedCustomer.id}</p>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Political Jurisdiction */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <Building size={24} className="text-sky-600" />
              <h3 className="text-xl font-extrabold text-slate-800">Political Jurisdiction</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Mahanagar Palika</p>
                <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.mahanagarPalika}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Ward Number</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.ward}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Prabhag</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.prabhag}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <User size={24} className="text-sky-600" />
              <h3 className="text-xl font-extrabold text-slate-800">Contact Information</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Politician Phone</p>
                <p className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Phone size={24} className="text-slate-400" /> {selectedCustomer.mobile}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Politician Email</p>
                <p className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <Mail size={24} className="text-slate-400" /> {selectedCustomer.email}
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Representative / PA</p>
                <p className="text-xl font-extrabold text-slate-900">{selectedCustomer.representativeName}</p>
                <p className="text-lg font-bold text-sky-600 flex items-center gap-3 mt-2">
                  <Phone size={24} /> {selectedCustomer.representativeContact}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Subscription & System */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <Award size={24} className="text-sky-600" />
              <h3 className="text-xl font-extrabold text-slate-800">Subscription & System</h3>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Current Plan</p>
                  <p className="text-lg font-black text-sky-600">{selectedCustomer.plan}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Software Version</p>
                  <p className="text-lg font-extrabold text-slate-900 font-mono">{selectedCustomer.version || 'v1.0.0'}</p>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Expiry Date</p>
                <p className="text-xl font-extrabold text-slate-900">{selectedCustomer.endDate}</p>
              </div>
              
              <div className="pt-6 flex gap-6">
                <button className="flex-1 px-6 py-4 text-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl transition-colors">
                  Upgrade Plan
                </button>
                {selectedCustomer.status === 'Active' && (
                  <button className="flex-1 px-6 py-4 text-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors">
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // --- LIST VIEW COMPONENT ---
  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Customer
        </button>
      </div>

      {/* Simplified Customers Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Party</th>
                <th className="py-3 px-6">Jurisdiction</th>
                <th className="py-3 px-6">Plan</th>
                <th className="py-3 px-6">Version</th>
                <th className="py-3 px-6">Valid Upto</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map(tenant => (
                <tr 
                  key={tenant.id} 
                  onClick={() => setSelectedCustomer(tenant)}
                  className="hover:bg-sky-50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm group-hover:text-sky-700 transition-colors">{tenant.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{tenant.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-0.5 border rounded text-[11px] font-bold ${getPartyColor(tenant.party)}`}>
                      {tenant.party}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold text-sm">{tenant.mahanagarPalika}</div>
                    <div className="text-slate-500 text-xs mt-0.5">Ward {tenant.ward} (Prabhag {tenant.prabhag})</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold text-sm">{tenant.plan}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold text-[11px] font-mono">
                      {tenant.version || 'v1.0.0'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold text-sm">{tenant.endDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      tenant.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => handleImpersonate(tenant.name, e)} 
                        className="hover:text-sky-600 text-slate-400 p-1.5 rounded hover:bg-white transition-colors" 
                        title="Login As Customer"
                      >
                        <LogIn size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-extrabold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Personal Details */}
                <div className="col-span-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-1.5">Politician Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" required value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g. Ramesh Patil" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Political Party</label>
                  <select value={newTenant.party} onChange={e => setNewTenant({...newTenant, party: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                    <option value="BJP">BJP</option>
                    <option value="Shiv Sena">Shiv Sena</option>
                    <option value="NCP">NCP</option>
                    <option value="Congress">Congress</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Jurisdiction */}
                <div className="col-span-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-1.5 mt-4">Jurisdiction Info</h4>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Mahanagar Palika</label>
                  <input type="text" required value={newTenant.mahanagarPalika} onChange={e => setNewTenant({...newTenant, mahanagarPalika: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g. BMC" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Ward No.</label>
                    <input type="text" required value={newTenant.ward} onChange={e => setNewTenant({...newTenant, ward: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="42" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Prabhag</label>
                    <select value={newTenant.prabhag} onChange={e => setNewTenant({...newTenant, prabhag: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="col-span-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-1.5 mt-4">Subscription & Account</h4>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Mobile Number</label>
                  <input type="tel" required value={newTenant.mobile} onChange={e => setNewTenant({...newTenant, mobile: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" required value={newTenant.email} onChange={e => setNewTenant({...newTenant, email: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="admin@ward42.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Subscription Plan</label>
                  <select value={newTenant.plan} onChange={e => setNewTenant({...newTenant, plan: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                    <option value="Nagarsevak">Nagarsevak</option>
                    <option value="Amdar">Amdar</option>
                    <option value="Khasdar">Khasdar</option>
                    <option value="Minister">Minister</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Subscription End Date</label>
                  <input type="date" required value={newTenant.endDate} onChange={e => setNewTenant({...newTenant, endDate: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                </div>
                
                {/* Management App Login Credentials */}
                <div className="col-span-2">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-1.5 mt-4">Management App Login</h4>
                  <p className="text-xs text-slate-500 mb-4">Set the login credentials they will use to access the Nagarsevak Management App.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Login Email</label>
                  <input type="email" value={newTenant.loginEmail} onChange={e => setNewTenant({...newTenant, loginEmail: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="admin@ward42.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Account Password</label>
                  <input type="text" value={newTenant.password} onChange={e => setNewTenant({...newTenant, password: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g. Ward42@2026!" />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors">
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
