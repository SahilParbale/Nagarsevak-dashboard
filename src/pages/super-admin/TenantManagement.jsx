import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, ShieldOff, LogIn, X, ChevronLeft, Building, User, Phone, Mail, Award, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TenantManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [tenants, setTenants] = useState([
    { id: 'T-001', name: 'Ramesh Patil', party: 'BJP', mahanagarPalika: 'BMC', ward: '42', prabhag: 'A', email: 'ramesh.p@nagarsevak.in', mobile: '+91 98765 43210', representativeName: 'Suresh Kumar', representativeContact: '+91 88888 11111', plan: 'Nagarsevak', version: 'v2.1.0', endDate: '2026-12-31', status: 'Active', lastActive: '2 hrs ago', citizenCount: '45,200', workerCount: 14 },
    { id: 'T-002', name: 'Sunita Sharma', party: 'Shiv Sena', mahanagarPalika: 'PMC', ward: '18', prabhag: 'B', email: 'sunita.s@nagarsevak.in', mobile: '+91 98765 43211', representativeName: 'Amit Joshi', representativeContact: '+91 88888 22222', plan: 'Amdar', version: 'v2.1.0', endDate: '2027-03-15', status: 'Active', lastActive: '10 mins ago', citizenCount: '38,100', workerCount: 25 },
    { id: 'T-003', name: 'Amit Desai', party: 'NCP', mahanagarPalika: 'NMMC', ward: '05', prabhag: 'C', email: 'amit.d@nagarsevak.in', mobile: '+91 98765 43212', representativeName: 'Priya Rao', representativeContact: '+91 88888 33333', plan: 'Khasdar', version: 'v1.8.4', endDate: '2026-06-30', status: 'Suspended', lastActive: '12 days ago', citizenCount: '29,500', workerCount: 3 },
    { id: 'T-004', name: 'Pooja Rao', party: 'Congress', mahanagarPalika: 'TMC', ward: '12', prabhag: 'A', email: 'pooja.r@nagarsevak.in', mobile: '+91 98765 43213', representativeName: 'Ravi Singh', representativeContact: '+91 88888 44444', plan: 'Nagarsevak', version: 'v2.1.0', endDate: '2026-10-15', status: 'Active', lastActive: '5 hrs ago', citizenCount: '52,300', workerCount: 18 },
    { id: 'T-005', name: 'Kiran More', party: 'BJP', mahanagarPalika: 'BMC', ward: '24', prabhag: 'D', email: 'kiran.m@nagarsevak.in', mobile: '+91 98765 43214', representativeName: 'Anita Desai', representativeContact: '+91 88888 55555', plan: 'Minister', version: 'v2.0.0', endDate: '2026-08-01', status: 'Active', lastActive: '1 day ago', citizenCount: '15,600', workerCount: 6 },
    { id: 'T-006', name: 'Vivek Singh', party: 'Shiv Sena', mahanagarPalika: 'PMC', ward: '33', prabhag: 'B', email: 'vivek.s@nagarsevak.in', mobile: '+91 98765 43215', representativeName: 'Vikram Joshi', representativeContact: '+91 88888 66666', plan: 'Amdar', version: 'v2.1.0', endDate: '2028-01-01', status: 'Active', lastActive: '30 mins ago', citizenCount: '78,900', workerCount: 42 },
  ]);

  const [newTenant, setNewTenant] = useState({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', email: '', mobile: '', plan: 'Nagarsevak', endDate: '' });

  const handleAddTenant = (e) => {
    e.preventDefault();
    const newId = `T-00${tenants.length + 1}`;
    setTenants([...tenants, { ...newTenant, id: newId, representativeName: 'Not Assigned', representativeContact: 'N/A', status: 'Active', lastActive: 'Just now', citizenCount: '0', workerCount: 1 }]);
    setShowAddModal(false);
    setNewTenant({ name: '', party: 'BJP', mahanagarPalika: '', ward: '', prabhag: 'A', email: '', mobile: '', plan: 'Nagarsevak', endDate: '' });
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
        <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-24 h-24 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-bold text-4xl shrink-0">
            {selectedCustomer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-4xl font-extrabold text-slate-900">{selectedCustomer.name}</h2>
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
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <Building size={32} className="text-sky-600" />
              <h3 className="text-3xl font-extrabold text-slate-800">Political Jurisdiction</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Mahanagar Palika</p>
                <p className="text-4xl font-extrabold text-slate-900">{selectedCustomer.mahanagarPalika}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Ward Number</p>
                  <p className="text-4xl font-extrabold text-slate-900">{selectedCustomer.ward}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Prabhag</p>
                  <p className="text-4xl font-extrabold text-slate-900">{selectedCustomer.prabhag}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Contact Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <User size={32} className="text-sky-600" />
              <h3 className="text-3xl font-extrabold text-slate-800">Contact Information</h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Politician Phone</p>
                <p className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Phone size={24} className="text-slate-400" /> {selectedCustomer.mobile}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Politician Email</p>
                <p className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Mail size={24} className="text-slate-400" /> {selectedCustomer.email}
                </p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Representative / PA</p>
                <p className="text-3xl font-extrabold text-slate-900">{selectedCustomer.representativeName}</p>
                <p className="text-2xl font-bold text-sky-600 flex items-center gap-3 mt-2">
                  <Phone size={24} /> {selectedCustomer.representativeContact}
                </p>
              </div>
            </div>
          </div>

          {/* Column 3: Subscription & System */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
              <Award size={32} className="text-sky-600" />
              <h3 className="text-3xl font-extrabold text-slate-800">Subscription & System</h3>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Current Plan</p>
                  <p className="text-4xl font-black text-sky-600">{selectedCustomer.plan}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Software Version</p>
                  <p className="text-4xl font-extrabold text-slate-900 font-mono">{selectedCustomer.version || 'v1.0.0'}</p>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-2">Expiry Date</p>
                <p className="text-3xl font-extrabold text-slate-900">{selectedCustomer.endDate}</p>
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
        <div className="relative w-full sm:w-1/2 lg:w-[500px]">
          <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-6 py-4 text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xl font-bold transition-colors shadow-md"
        >
          <Plus size={28} />
          Add Customer
        </button>
      </div>

      {/* Simplified Customers Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xl border-collapse">
            <thead className="sticky top-0 z-10 shadow-sm bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-lg">
                <th className="py-6 px-10">Customer Name</th>
                <th className="py-6 px-10">Party</th>
                <th className="py-6 px-10">Jurisdiction</th>
                <th className="py-6 px-10">Plan</th>
                <th className="py-6 px-10">Version</th>
                <th className="py-6 px-10">Valid Upto</th>
                <th className="py-6 px-10">Status</th>
                <th className="py-6 px-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tenants.map(tenant => (
                <tr 
                  key={tenant.id} 
                  onClick={() => setSelectedCustomer(tenant)}
                  className="hover:bg-sky-50 cursor-pointer transition-colors group"
                >
                  <td className="py-6 px-10">
                    <div className="font-bold text-slate-900 text-2xl group-hover:text-sky-700 transition-colors">{tenant.name}</div>
                    <div className="text-slate-500 text-lg mt-1">{tenant.id}</div>
                  </td>
                  <td className="py-6 px-10">
                    <span className={`inline-flex px-3 py-1 border rounded-lg text-lg font-bold ${getPartyColor(tenant.party)}`}>
                      {tenant.party}
                    </span>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-slate-900 font-bold text-xl">{tenant.mahanagarPalika}</div>
                    <div className="text-slate-500 text-lg font-semibold mt-1">Ward {tenant.ward} (Prabhag {tenant.prabhag})</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-slate-900 font-bold">{tenant.plan}</div>
                  </td>
                  <td className="py-6 px-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-100 text-slate-600 font-bold text-lg font-mono">
                      {tenant.version || 'v1.0.0'}
                    </span>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-slate-900 font-bold text-lg">{tenant.endDate}</div>
                  </td>
                  <td className="py-6 px-10">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                      tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button 
                        onClick={(e) => handleImpersonate(tenant.name, e)} 
                        className="hover:text-sky-600 text-slate-400 p-2 rounded-lg hover:bg-white transition-colors" 
                        title="Login As Customer"
                      >
                        <LogIn size={28} />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-3xl font-extrabold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowAddModal(false)} className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                <X size={32} />
              </button>
            </div>
            
            <form onSubmit={handleAddTenant} className="p-10 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-10 mb-10">
                {/* Personal Details */}
                <div className="col-span-2">
                  <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2">Politician Details</h4>
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Full Name</label>
                  <input type="text" required value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g. Ramesh Patil" />
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Political Party</label>
                  <select value={newTenant.party} onChange={e => setNewTenant({...newTenant, party: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                    <option value="BJP">BJP</option>
                    <option value="Shiv Sena">Shiv Sena</option>
                    <option value="NCP">NCP</option>
                    <option value="Congress">Congress</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {/* Jurisdiction */}
                <div className="col-span-2">
                  <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 mt-6">Jurisdiction Info</h4>
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Mahanagar Palika</label>
                  <input type="text" required value={newTenant.mahanagarPalika} onChange={e => setNewTenant({...newTenant, mahanagarPalika: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g. BMC" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xl font-bold text-slate-700 mb-3">Ward No.</label>
                    <input type="text" required value={newTenant.ward} onChange={e => setNewTenant({...newTenant, ward: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="42" />
                  </div>
                  <div>
                    <label className="block text-xl font-bold text-slate-700 mb-3">Prabhag</label>
                    <select value={newTenant.prabhag} onChange={e => setNewTenant({...newTenant, prabhag: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="col-span-2">
                  <h4 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-4 border-b pb-2 mt-6">Subscription & Account</h4>
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Mobile Number</label>
                  <input type="tel" required value={newTenant.mobile} onChange={e => setNewTenant({...newTenant, mobile: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Email Address</label>
                  <input type="email" required value={newTenant.email} onChange={e => setNewTenant({...newTenant, email: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="admin@ward42.com" />
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Subscription Plan</label>
                  <select value={newTenant.plan} onChange={e => setNewTenant({...newTenant, plan: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                    <option value="Nagarsevak">Nagarsevak</option>
                    <option value="Amdar">Amdar</option>
                    <option value="Khasdar">Khasdar</option>
                    <option value="Minister">Minister</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-3">Subscription End Date</label>
                  <input type="date" required value={newTenant.endDate} onChange={e => setNewTenant({...newTenant, endDate: e.target.value})} className="w-full px-5 py-4 border border-slate-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
                </div>
              </div>

              <div className="flex justify-end gap-6 pt-8 border-t border-slate-200 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-4 text-xl font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-4 text-xl font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md transition-colors">
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
