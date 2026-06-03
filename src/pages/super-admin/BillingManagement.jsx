import React, { useState } from 'react';
import { CreditCard, Download, Search, Filter, RefreshCw, MessageCircle, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

export default function BillingManagement() {
  const [invoices] = useState([
    { id: 'INV-2026-081', name: 'Ramesh Patil', ward: 'Ward 42', email: 'ramesh.p@nagarsevak.in', amount: '₹15,000', date: '2026-06-01', status: 'Paid', plan: 'Nagarsevak' },
    { id: 'INV-2026-080', name: 'Sunita Sharma', ward: 'Ward 18', email: 'sunita.s@nagarsevak.in', amount: '₹25,000', date: '2026-05-28', status: 'Pending', plan: 'Amdar' },
    { id: 'INV-2026-079', name: 'Amit Desai', ward: 'Ward 05', email: 'amit.d@nagarsevak.in', amount: '₹5,000', date: '2026-05-15', status: 'Overdue', plan: 'Khasdar' },
    { id: 'INV-2026-078', name: 'Pooja Rao', ward: 'Ward 12', email: 'pooja.r@nagarsevak.in', amount: '₹15,000', date: '2026-05-10', status: 'Paid', plan: 'Nagarsevak' },
    { id: 'INV-2026-077', name: 'Kiran More', ward: 'Ward 24', email: 'kiran.m@nagarsevak.in', amount: '₹5,000', date: '2026-05-05', status: 'Paid', plan: 'Minister' },
    { id: 'INV-2026-076', name: 'Vivek Singh', ward: 'Ward 33', email: 'vivek.s@nagarsevak.in', amount: '₹25,000', date: '2026-05-01', status: 'Pending', plan: 'Amdar' },
    { id: 'INV-2026-075', name: 'Neha Gupta', ward: 'Ward 08', email: 'neha.g@nagarsevak.in', amount: '₹15,000', date: '2026-04-20', status: 'Overdue', plan: 'Nagarsevak' },
    { id: 'INV-2026-074', name: 'Sanjay Joshi', ward: 'Ward 55', email: 'sanjay.j@nagarsevak.in', amount: '₹5,000', date: '2026-04-15', status: 'Paid', plan: 'Khasdar' },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleRenew = (tenantName) => {
    alert(`Successfully renewed subscription for ${tenantName} by 1 Month.`);
  };

  const handlePaymentLink = (tenantName) => {
    const text = `Dear ${tenantName}, your subscription is pending renewal. Please complete the payment using this link: https://pay.nagarsevak.in/xyz`;
    navigator.clipboard.writeText(text);
    alert('Payment reminder message copied to clipboard! You can paste it in WhatsApp.');
  };

  return (
    <div className="space-y-8">

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-500">Monthly Revenue</p>
            <p className="text-4xl font-extrabold text-slate-900 mt-1">₹4.2L</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-500">Pending & Overdue</p>
            <p className="text-4xl font-extrabold text-slate-900 mt-1">₹70,000</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <CreditCard size={32} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-500">Active Subscriptions</p>
            <p className="text-4xl font-extrabold text-slate-900 mt-1">42</p>
          </div>
        </div>
      </div>
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[500px]">
          <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search invoices or customers..." 
            className="w-full bg-white border border-slate-300 rounded-xl pl-16 pr-6 py-4 text-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 text-slate-700 rounded-xl text-xl font-bold hover:bg-slate-50 transition-colors shadow-md">
          <Filter size={28} />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xl border-collapse">
            <thead className="sticky top-0 z-10 shadow-sm bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-lg">
                <th className="py-6 px-10">Invoice ID</th>
                <th className="py-6 px-10">Customer Name</th>
                <th className="py-6 px-10">Contact Email</th>
                <th className="py-6 px-10">Amount / Plan</th>
                <th className="py-6 px-10">Status</th>
                <th className="py-6 px-10 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-6 px-10">
                    <div className="font-bold text-slate-900 text-2xl">{invoice.id}</div>
                    <div className="text-slate-500 text-lg mt-2">{invoice.date}</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-slate-900 font-bold text-2xl">{invoice.name}</div>
                    <div className="text-slate-500 text-lg mt-1">{invoice.ward}</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-sky-600 font-semibold text-lg">{invoice.email}</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="font-bold text-slate-900 text-2xl">{invoice.amount}</div>
                    <div className="text-slate-500 text-lg mt-2">{invoice.plan} Plan</div>
                  </td>
                  <td className="py-6 px-10">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex items-center justify-end gap-6 text-slate-400">
                      {invoice.status !== 'Paid' && (
                        <button onClick={() => handlePaymentLink(invoice.tenant)} className="hover:text-green-600 flex items-center gap-2" title="Copy WhatsApp Payment Link">
                          <MessageCircle size={28} />
                          <span className="font-bold text-lg hidden lg:inline">Remind</span>
                        </button>
                      )}
                      <button onClick={() => handleRenew(invoice.name)} className="hover:text-purple-600 flex items-center gap-2" title="1-Click Renew (+1 Month)">
                        <RefreshCw size={28} />
                        <span className="font-bold text-lg hidden lg:inline">Renew</span>
                      </button>
                      <button onClick={() => setSelectedInvoice(invoice)} className="text-slate-400 hover:text-sky-600 transition-colors ml-4" title="Download PDF">
                        <Download size={28} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Invoice Modal Overlay */}
      <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
    </div>
  );
}
