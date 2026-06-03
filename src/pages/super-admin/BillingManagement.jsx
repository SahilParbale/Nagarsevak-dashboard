import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Search, Filter, RefreshCw, MessageCircle, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import InvoiceModal from './InvoiceModal';
import { getBillingRecords, subscribeToBillingRecords } from '../../services/billingService';

export default function BillingManagement() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let subscription;

    const fetchBilling = async () => {
      setIsLoading(true);
      const data = await getBillingRecords();
      if (data && data.length > 0) {
        setInvoices(data);
      }
      setIsLoading(false);

      subscription = subscribeToBillingRecords((payload) => {
        if (payload.eventType === 'INSERT') {
          setInvoices((prev) => [payload.new, ...prev]);
        }
      });
    };

    fetchBilling();

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleRenew = (tenantName) => {
    alert(`Successfully renewed subscription for ${tenantName} by 1 Month.`);
  };

  const handlePaymentLink = (tenantName) => {
    const text = `Dear ${tenantName}, your subscription is pending renewal. Please complete the payment using this link: https://pay.nagarsevak.in/xyz`;
    navigator.clipboard.writeText(text);
    alert('Payment reminder message copied to clipboard! You can paste it in WhatsApp.');
  };

  // Calculate dynamic stats from invoices
  const calculateTotal = (statusFilter) => {
    return invoices
      .filter(inv => statusFilter.includes(inv.status))
      .reduce((total, inv) => {
        const numericAmount = parseFloat((inv.amount || '0').toString().replace(/[^0-9.-]+/g, ""));
        return total + (isNaN(numericAmount) ? 0 : numericAmount);
      }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const monthlyRevenue = calculateTotal(['Paid']);
  const pendingOverdue = calculateTotal(['Pending', 'Overdue']);

  return (
    <div className="space-y-8">

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Revenue</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{formatCurrency(monthlyRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Pending & Overdue</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{formatCurrency(pendingOverdue)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Active Subscriptions</p>
            <p className="text-lg font-extrabold text-slate-900 mt-0.5">{invoices.length}</p>
          </div>
        </div>
      </div>
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-[400px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search invoices or customers..." 
            className="w-full bg-white border border-slate-300 rounded-lg pl-12 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                <th className="py-3 px-6">Invoice ID</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Contact Email</th>
                <th className="py-3 px-6">Amount / Plan</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{(invoice.id || '').split('-')[0]}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{new Date(invoice.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-slate-900 font-bold text-sm">{invoice.customer}</div>
                    <div className="text-slate-500 text-xs mt-0.5">Customer ID: {(invoice.id || '').split('-')[0]}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sky-600 font-semibold text-sm">Via Dashboard</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900 text-sm">{invoice.amount}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{invoice.plan} Plan</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      invoice.status === 'Paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3 text-slate-400">
                      {invoice.status !== 'Paid' && (
                        <button onClick={() => handlePaymentLink(invoice.tenant)} className="hover:text-green-600 flex items-center gap-1" title="Copy WhatsApp Payment Link">
                          <MessageCircle size={16} />
                          <span className="font-bold text-[11px] hidden lg:inline">Remind</span>
                        </button>
                      )}
                      <button onClick={() => handleRenew(invoice.name)} className="hover:text-purple-600 flex items-center gap-1" title="1-Click Renew (+1 Month)">
                        <RefreshCw size={16} />
                        <span className="font-bold text-[11px] hidden lg:inline">Renew</span>
                      </button>
                      <button onClick={() => setSelectedInvoice(invoice)} className="text-slate-400 hover:text-sky-600 transition-colors ml-2" title="Download PDF">
                        <Download size={18} />
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
