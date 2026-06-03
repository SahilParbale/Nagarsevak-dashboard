import React from 'react';
import { Building, X, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function InvoiceModal({ invoice, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format string amount to number to calculate tax
  // Assuming amount is string like '₹15,000'
  const numericAmount = parseInt(invoice.amount.replace(/[^0-9]/g, ''), 10) || 0;
  const subtotal = numericAmount;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const formatCurrency = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-6 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:backdrop-blur-none">
      
      {/* Invoice Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative print:w-full print:shadow-none print:rounded-none">
        
        {/* Floating Action Bar (Hidden when printing) */}
        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 print:hidden">
          <div className="flex items-center gap-3 text-slate-800">
            <FileText size={24} className="text-sky-600" />
            <h2 className="text-xl font-bold">Invoice {invoice.id}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-colors shadow-md"
            >
              <Download size={20} />
              Save PDF
            </button>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div className="p-12 print:p-6">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b-2 border-sky-600 pb-8">
            <div className="flex items-center gap-4 text-sky-900">
              <Building size={48} className="text-sky-600" />
              <div>
                <h1 className="text-xl font-black uppercase tracking-widest">Nagarsevak</h1>
                <p className="text-sky-600 font-bold tracking-widest uppercase text-sm mt-1">IT Solutions Pvt Ltd</p>
              </div>
            </div>
            <div className="text-right text-slate-500">
              <h2 className="text-lg font-extrabold text-slate-200 uppercase tracking-widest mb-4">Tax Invoice</h2>
              <p className="font-medium">123 Tech Park, Phase 1</p>
              <p className="font-medium">Mumbai, Maharashtra 400001</p>
              <p className="font-medium mt-1">GSTIN: 27AAAAA0000A1Z5</p>
              <p className="font-medium mt-1">support@nagarsevak.in</p>
            </div>
          </div>

          {/* Invoice Meta & Billed To */}
          <div className="flex justify-between mb-12">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
              <h3 className="text-lg font-bold text-slate-900">{invoice.name}</h3>
              <p className="text-lg text-slate-600 font-medium mt-1">{invoice.ward}</p>
              <p className="text-lg text-sky-600 font-medium mt-1">{invoice.email}</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 min-w-[250px]">
              <div className="flex justify-between mb-3">
                <span className="text-slate-500 font-medium">Invoice No.</span>
                <span className="font-bold text-slate-900">{invoice.id}</span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-slate-500 font-medium">Issue Date</span>
                <span className="font-bold text-slate-900">{invoice.date}</span>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                <span className="text-slate-500 font-medium">Status</span>
                {invoice.status === 'Paid' ? (
                  <span className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                    <CheckCircle2 size={16} /> PAID
                  </span>
                ) : (
                  <span className="text-amber-600 font-bold bg-amber-50 px-3 py-1 rounded-full text-sm uppercase">
                    {invoice.status}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-4 px-6 rounded-tl-xl font-bold">Description</th>
                  <th className="py-4 px-6 font-bold text-center">Qty</th>
                  <th className="py-4 px-6 font-bold text-right">Unit Price</th>
                  <th className="py-4 px-6 rounded-tr-xl font-bold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 border-b border-slate-200">
                <tr className="text-lg">
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-900">Nagarsevak Dashboard - {invoice.plan} Plan</div>
                    <div className="text-slate-500 text-sm mt-1">Monthly Subscription Renewal</div>
                  </td>
                  <td className="py-4 px-6 text-center font-medium text-slate-700">1</td>
                  <td className="py-4 px-6 text-right font-medium text-slate-700">{formatCurrency(subtotal)}</td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900">{formatCurrency(subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-16">
            <div className="w-1/2">
              <div className="flex justify-between py-3 text-lg">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg border-b border-slate-200">
                <span className="text-slate-500 font-medium">IGST (18%)</span>
                <span className="font-bold text-slate-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between py-4 text-lg">
                <span className="text-slate-800 font-black">Total Due</span>
                <span className="font-black text-sky-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t-2 border-slate-100 text-sm text-slate-500 space-y-2">
            <p><strong className="text-slate-700">Payment Terms:</strong> Payment is due within 7 days of invoice issue date.</p>
            <p><strong className="text-slate-700">Bank Details:</strong> Nagarsevak IT Solutions | Acct: 1234567890 | IFSC: HDFC0001234</p>
            <p className="mt-6 italic">Thank you for choosing Nagarsevak Dashboard!</p>
          </div>

        </div>
      </div>
    </div>
  );
}
