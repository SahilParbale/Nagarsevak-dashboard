import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, ShieldOff, LogIn, X, ChevronLeft, Building, User, Phone, Mail, Award, CheckCircle2, ShieldAlert, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { getTenants, createTenant, updateTenant, subscribeToTenants } from '../../services/tenantService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CustomSelect = ({ value, onChange, options, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer ${className}`}
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onChange({ target: { value: opt } });
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-sky-50 transition-colors ${value === opt ? 'bg-sky-50 font-bold text-sky-700' : 'text-slate-700 font-medium'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function TenantManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchedCredentials, setFetchedCredentials] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [isFetchingCreds, setIsFetchingCreds] = useState(false);

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

  const [newTenant, setNewTenant] = useState({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', state: 'Maharashtra', vidhanSabhaNo: '', vidhanSabhaName: '', loksabhaKramank: '', loksabhaName: '', ministryLevel: 'State', ministryName: '', email: '', mobile: '', plan: 'Nagarsevak', version: 'Basic', endDate: '', loginEmail: '', password: '', representativeName: '', representativeContact: '' });

  const handleAddTenant = async (e) => {
    e.preventDefault();
    
    // Extract credentials, keep everything else for the DB
    const { loginEmail, password, id, created_at, ...dbTenantData } = newTenant;
    
    if (isEditing) {
      // Handle Update
      const fullUpdatedTenant = { ...dbTenantData };
      
      // Optimistically update UI
      setTenants(tenants.map(t => t.id === newTenant.id ? { ...t, ...fullUpdatedTenant } : t));
      setShowAddModal(false);
      
      // Sync with Supabase Database
      const { success, error } = await updateTenant(newTenant.id, fullUpdatedTenant);
      if (!success) {
        console.warn('Failed to update in Supabase backend:', error);
        alert(`Failed to update customer: ${error?.message || JSON.stringify(error)}`);
      } else {
        alert("Customer updated successfully!");
        if (selectedCustomer && selectedCustomer.id === newTenant.id) {
           setSelectedCustomer({ ...selectedCustomer, ...fullUpdatedTenant });
        }
      }
    } else {
      // Handle Create
      const fullNewTenant = { 
        ...dbTenantData, 
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        subdomain: dbTenantData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || `tenant-${Date.now()}`,
        representativeName: dbTenantData.representativeName || 'Not Assigned', 
        representativeContact: dbTenantData.representativeContact || 'N/A', 
        status: 'Active', 
        lastActive: 'Just now', 
        citizenCount: '0', 
        workerCount: 1 
      };

      // Optimistically update UI
      setTenants([...tenants, fullNewTenant]);
      setShowAddModal(false);

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
    }
    
    // Reset state
    setNewTenant({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', state: 'Maharashtra', vidhanSabhaNo: '', vidhanSabhaName: '', loksabhaKramank: '', loksabhaName: '', ministryLevel: 'State', ministryName: '', email: '', mobile: '', plan: 'Nagarsevak', version: 'Basic', endDate: '', loginEmail: '', password: '', representativeName: '', representativeContact: '' });
    setIsEditing(false);
  };

  const handleEditClick = (customer) => {
    setNewTenant({
      ...customer,
      loginEmail: '', // Cannot edit login email directly through this form once created
      password: ''    // Cannot edit password directly through this form once created
    });
    setIsEditing(true);
    setShowAddModal(true);
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
  let mainContent = null;
  if (selectedCustomer) {
    mainContent = (
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
            <button 
              onClick={() => handleEditClick(selectedCustomer)} 
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg px-6 py-3 rounded-xl transition-colors"
            >
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
            {selectedCustomer.plan === 'Amdar' ? (
              <div className="space-y-8">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">State</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.state || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Vidhan Sabha No.</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.vidhanSabhaNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Vidhan Sabha Name</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.vidhanSabhaName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : selectedCustomer.plan === 'Khasdar' ? (
              <div className="space-y-8">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">State</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.state || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Lok Sabha No.</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.loksabhaKramank || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Lok Sabha Name</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.loksabhaName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : selectedCustomer.plan === 'Minister' ? (
              <div className="space-y-8">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">State / Government</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.state || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Ministry Level</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.ministryLevel || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Ministry Name</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.ministryName || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Mahanagar Palika</p>
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.mahanagarPalika || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Ward Number</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.ward || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Prabhag</p>
                    <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.prabhag || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
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
                  <p className="text-lg font-extrabold text-slate-900 font-mono">{selectedCustomer.version || selectedCustomer.plan}</p>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Subscription Period</p>
                <p className="text-xl font-extrabold text-slate-900">
                  {selectedCustomer.created_at ? format(new Date(selectedCustomer.created_at), 'yyyy-MM-dd') : 'N/A'} to {selectedCustomer.endDate || 'N/A'}
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-3">Account Security</p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-500 mb-1">Login Associated Email</p>
                      <p className="text-lg font-bold text-slate-900">{selectedCustomer.email}</p>
                    </div>
                    <button 
                      onClick={async () => {
                        if (showCredentials) {
                          setShowCredentials(false);
                        } else {
                          if (!fetchedCredentials) {
                            setIsFetchingCreds(true);
                            const { getTenantCredentials } = await import('../../services/tenantService');
                            const creds = await getTenantCredentials(selectedCustomer.id);
                            if (creds) setFetchedCredentials(creds);
                            setIsFetchingCreds(false);
                          }
                          setShowCredentials(true);
                        }
                      }}
                      className="px-4 py-2 bg-sky-100 text-sky-700 font-bold rounded-lg hover:bg-sky-200 transition-colors flex items-center gap-2"
                    >
                      {isFetchingCreds ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : showCredentials ? (
                        <><EyeOff size={16} /> Hide Credentials</>
                      ) : (
                        <><Eye size={16} /> Show Credentials</>
                      )}
                    </button>
                  </div>
                  
                  {showCredentials && fetchedCredentials && (
                    <div className="p-4 bg-white border border-slate-200 rounded-lg animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Login ID</p>
                          <p className="font-mono text-sm font-bold text-slate-800">{fetchedCredentials.loginEmail}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Password</p>
                          <p className="font-mono text-sm font-bold text-slate-800">{fetchedCredentials.loginPassword}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
  } else {
    // --- LIST VIEW COMPONENT ---
    const filteredTenants = tenants.filter(t => 
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.party?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    mainContent = (
      <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers by name, ID, or party..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button 
          onClick={() => {
            setNewTenant({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', state: 'Maharashtra', vidhanSabhaNo: '', vidhanSabhaName: '', loksabhaKramank: '', loksabhaName: '', ministryLevel: 'State', ministryName: '', email: '', mobile: '', plan: 'Nagarsevak', version: 'Basic', endDate: '', loginEmail: '', password: '', representativeName: '', representativeContact: '' });
            setIsEditing(false);
            setShowAddModal(true);
          }}
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
                <th className="py-3 px-6">Subscription Period</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500 font-medium">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTenants.map(tenant => (
                  <tr 
                    key={tenant.id} 
                    onClick={() => {
                      setSelectedCustomer(tenant);
                      setFetchedCredentials(null);
                      setShowCredentials(false);
                    }}
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
                    {tenant.plan === 'Amdar' ? (
                      <>
                        <div className="text-slate-900 font-bold text-sm">{tenant.vidhanSabhaName || 'N/A'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Vidhan Sabha {tenant.vidhanSabhaNo || 'N/A'} ({tenant.state || 'N/A'})</div>
                      </>
                    ) : tenant.plan === 'Khasdar' ? (
                      <>
                        <div className="text-slate-900 font-bold text-sm">{tenant.loksabhaName || 'N/A'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Lok Sabha {tenant.loksabhaKramank || 'N/A'} ({tenant.state || 'N/A'})</div>
                      </>
                    ) : tenant.plan === 'Minister' ? (
                      <>
                        <div className="text-slate-900 font-bold text-sm">{tenant.ministryName || 'N/A'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{tenant.ministryLevel || 'N/A'} Minister ({tenant.state || 'N/A'})</div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-900 font-bold text-sm">{tenant.mahanagarPalika || 'N/A'}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Ward {tenant.ward || 'N/A'} (Prabhag {tenant.prabhag || 'N/A'})</div>
                      </>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 bg-sky-50 text-sky-700 rounded-lg text-xs font-bold tracking-wide">
                      {tenant.plan} {tenant.version || 'Basic'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold text-sm">
                      {tenant.created_at ? format(new Date(tenant.created_at), 'yyyy-MM-dd') : 'N/A'} to {tenant.endDate || 'N/A'}
                    </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    );
  }

  return (
    <>
      {mainContent}
      
      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{isEditing ? 'Edit Customer Details' : 'Add New Customer'}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{isEditing ? 'Update the details for this tenant workspace.' : 'Fill in the details to create a new tenant workspace.'}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                
                {/* LEFT COLUMN */}
                <div className="space-y-4">
                  {/* Politician Details */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14}/> Politician Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">Full Name</label>
                        <input type="text" required value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Ramesh Patil" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">Political Party</label>
                        <CustomSelect 
                          value={newTenant.party} 
                          onChange={e => setNewTenant({...newTenant, party: e.target.value})} 
                          options={['BJP', 'Shiv Sena', 'NCP', 'Congress', 'Other']}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all font-medium text-slate-800 hover:border-sky-300"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Subscription & Contact */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Award size={14}/> Subscription & Contact</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Mobile Number</label>
                          <input type="tel" required value={newTenant.mobile} onChange={e => setNewTenant({...newTenant, mobile: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Email Address</label>
                          <input type="email" required value={newTenant.email} onChange={e => setNewTenant({...newTenant, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="admin@ward42.com" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Plan</label>
                          <CustomSelect 
                            value={newTenant.plan} 
                            onChange={e => setNewTenant({...newTenant, plan: e.target.value})} 
                            options={['Nagarsevak', 'Amdar', 'Khasdar', 'Minister']}
                            className="w-full px-3 py-2 bg-sky-50 border border-sky-100 rounded-lg text-sm transition-all font-bold text-sky-700 hover:border-sky-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Version</label>
                          <CustomSelect 
                            value={newTenant.version} 
                            onChange={e => setNewTenant({...newTenant, version: e.target.value})} 
                            options={['Basic', 'Pro', 'Advanced']}
                            className="w-full px-3 py-2 bg-sky-50 border border-sky-100 rounded-lg text-sm transition-all font-bold text-sky-700 hover:border-sky-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">End Date</label>
                          <DatePicker 
                            selected={newTenant.endDate ? new Date(newTenant.endDate) : null}
                            onChange={(date) => setNewTenant({...newTenant, endDate: date ? format(date, 'yyyy-MM-dd') : ''})}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800"
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select Date"
                            wrapperClassName="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-4">
                  {/* Jurisdiction */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2"><Building size={14}/> Jurisdiction Info</h4>
                    {newTenant.plan === 'Amdar' ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">State</label>
                          <input type="text" required value={newTenant.state || ''} onChange={e => setNewTenant({...newTenant, state: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Maharashtra" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Vidhan Sabha No.</label>
                          <input type="text" required value={newTenant.vidhanSabhaNo || ''} onChange={e => setNewTenant({...newTenant, vidhanSabhaNo: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. 15" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Vidhan Sabha Name</label>
                          <input type="text" required value={newTenant.vidhanSabhaName || ''} onChange={e => setNewTenant({...newTenant, vidhanSabhaName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Colaba" />
                        </div>
                      </div>
                    ) : newTenant.plan === 'Khasdar' ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">State</label>
                          <input type="text" required value={newTenant.state || ''} onChange={e => setNewTenant({...newTenant, state: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Maharashtra" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Lok Sabha No.</label>
                          <input type="text" required value={newTenant.loksabhaKramank || ''} onChange={e => setNewTenant({...newTenant, loksabhaKramank: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. 31" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Lok Sabha Name</label>
                          <input type="text" required value={newTenant.loksabhaName || ''} onChange={e => setNewTenant({...newTenant, loksabhaName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Mumbai South" />
                        </div>
                      </div>
                    ) : newTenant.plan === 'Minister' ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">State / Govt</label>
                          <input type="text" required value={newTenant.state || ''} onChange={e => setNewTenant({...newTenant, state: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Maharashtra" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Ministry Level</label>
                          <CustomSelect 
                            value={newTenant.ministryLevel || 'State'} 
                            onChange={e => setNewTenant({...newTenant, ministryLevel: e.target.value})} 
                            options={['State', 'Central', 'Cabinet', 'MoS']}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all font-medium text-slate-800 hover:border-sky-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Ministry Name</label>
                          <input type="text" required value={newTenant.ministryName || ''} onChange={e => setNewTenant({...newTenant, ministryName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Finance" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Mahanagar Palika</label>
                          <input type="text" required value={newTenant.mahanagarPalika || ''} onChange={e => setNewTenant({...newTenant, mahanagarPalika: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. BMC" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Ward No.</label>
                          <input type="text" required value={newTenant.ward || ''} onChange={e => setNewTenant({...newTenant, ward: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="42" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Prabhag</label>
                          <CustomSelect 
                            value={newTenant.prabhag || 'A'} 
                            onChange={e => setNewTenant({...newTenant, prabhag: e.target.value})} 
                            options={['A', 'B', 'C', 'D']}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm transition-all font-medium text-slate-800 hover:border-sky-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Management App Login Credentials */}
                  {!isEditing && (
                    <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-100">
                      <div className="mb-3 flex justify-between items-center">
                        <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14}/> Login Credentials</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Login Email</label>
                          <input type="email" value={newTenant.loginEmail} onChange={e => setNewTenant({...newTenant, loginEmail: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="admin@ward42.com" />
                        </div>
                        <div>
                          <label className="block text-[13px] font-bold text-slate-700 mb-1">Account Password</label>
                          <input type="text" value={newTenant.password} onChange={e => setNewTenant({...newTenant, password: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Ward42@2026!" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Representative Details */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={14}/> Representative / PA</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">Representative Name</label>
                        <input type="text" value={newTenant.representativeName} onChange={e => setNewTenant({...newTenant, representativeName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="e.g. Suresh Kumar" />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-1">Representative Mobile</label>
                        <input type="tel" value={newTenant.representativeContact} onChange={e => setNewTenant({...newTenant, representativeContact: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-800" placeholder="+91 98765 12345" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm shadow-sky-600/20 transition-all">
                  {isEditing ? 'Save Changes' : 'Create Customer Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
