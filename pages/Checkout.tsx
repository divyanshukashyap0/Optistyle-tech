
import React, { useState } from 'react';
import { CartItem, User } from '../types';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ShoppingBag, AlertCircle, Download, FileText, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  user: User;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, clearCart, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderInfo, setOrderInfo] = useState<{ id: string, invoiceNumber: string, invoiceUrl?: string } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + (subtotal > 10000 ? 0 : 500);

  const generateAndDownloadLocalPDF = (invNumber: string, customerName: string, address: string) => {
    const doc = new jsPDF();
    const primaryColor = "#0EA5E9";
    const darkColor = "#020617";
    
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor("#FFFFFF");
    doc.setFontSize(22);
    doc.text("OptiStyle", 20, 25);
    doc.setFontSize(10);
    doc.text("Premium Eye Care & Eyewear", 20, 32);
    doc.setFontSize(18);
    doc.text("TAX INVOICE", 190, 25, { align: 'right' });

    doc.setTextColor(darkColor);
    doc.setFontSize(10);
    doc.text("SELLER DETAILS", 20, 55);
    doc.text("OptiStyle Optical Hub", 20, 62);
    doc.text("Gahoi Colony, Near Vatika, Datia, MP", 20, 67);
    doc.text("Email: support@optistyle.in", 20, 72);

    doc.text("BILL TO", 130, 55);
    doc.text(customerName, 130, 62);
    doc.text(user.email, 130, 67);
    doc.text(address, 130, 72);

    doc.setFillColor("#F8FAFC");
    doc.rect(20, 85, 170, 20, 'F');
    doc.text("INVOICE NO:", 25, 97);
    doc.setTextColor(primaryColor);
    doc.text(invNumber, 55, 97);
    doc.setTextColor(darkColor);
    doc.text("DATE:", 140, 97);
    doc.text(new Date().toLocaleDateString(), 155, 97);

    doc.setFillColor(primaryColor);
    doc.rect(20, 115, 170, 10, 'F');
    doc.setTextColor("#FFFFFF");
    doc.text("PRODUCT", 25, 122);
    doc.text("QTY", 120, 122);
    doc.text("PRICE", 145, 122);
    doc.text("TOTAL", 175, 122);

    let y = 135;
    doc.setTextColor(darkColor);
    cart.forEach(item => {
      doc.text(item.name, 25, y);
      doc.text(item.quantity.toString(), 122, y);
      doc.text(item.price.toLocaleString(), 145, y);
      doc.text((item.price * item.quantity).toLocaleString(), 175, y);
      y += 10;
    });

    const tax = total * 0.18;
    const base = total - tax;
    doc.line(20, y, 190, y);
    y += 15;
    doc.text("Subtotal:", 140, y);
    doc.text(base.toLocaleString(), 175, y);
    y += 10;
    doc.text("GST (18%):", 140, y);
    doc.text(tax.toLocaleString(), 175, y);
    y += 15;
    doc.setFillColor(primaryColor);
    doc.rect(130, y - 8, 60, 12, 'F');
    doc.setTextColor("#FFFFFF");
    doc.text("Grand Total:", 135, y);
    doc.text(`INR ${total.toLocaleString()}`, 170, y);

    doc.save(`Invoice_${invNumber}.pdf`);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const customerName = formData.get('fullName') as string;
    const address = formData.get('address') as string;

    const payload = {
      userEmail: user.email,
      customerName,
      address,
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      products: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        color: item.selectedColor
      })),
      totalAmount: total,
      orderId: `OPT-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`
    };

    try {
      // Calling the backend API for secure email relay and document storage
      const response = await fetch('import.meta.env.VITE_API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'The synchronization engine rejected the packet.');
      }

      const result = await response.json();

      if (result.success) {
        setOrderInfo({
          id: result.orderId,
          invoiceNumber: result.invoiceNumber,
          invoiceUrl: result.invoiceUrl
        });
        setIsSuccess(true);
        // Instant backup download for user
        generateAndDownloadLocalPDF(result.invoiceNumber, customerName, address);
        clearCart();
      }
    } catch (err: any) {
      setError(err.message === 'Failed to fetch' 
        ? "Backend Offline: Ensure 'node backend/server.js' is running on port 5000."
        : err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess && orderInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 bg-emerald-900/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
          <h1 className="text-5xl font-serif text-white">Order Vaulted.</h1>
          <p className="text-slate-400 text-lg">Transaction finalized. Your official tax invoice has been generated, emailed to admin, and downloaded locally.</p>
          <div className="glass p-8 rounded-3xl border-white/10 max-w-sm mx-auto space-y-4">
             <div>
               <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Invoice Ref</p>
               <p className="text-xl font-mono text-cyan-400">{orderInfo.invoiceNumber}</p>
             </div>
             <div className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
               <ShieldCheck size={14} /> SMTP Notification Dispatched
             </div>
          </div>
        </div>
        <button onClick={() => window.location.hash = '/'} className="px-10 py-4 bg-white text-slate-950 font-bold rounded-2xl shadow-xl hover:bg-cyan-50 transition-all">Return to Sanctuary</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-cyan-900/20 rounded-2xl flex items-center justify-center text-cyan-400">
          <ShoppingBag size={24} />
        </div>
        <h1 className="text-4xl font-serif text-white">Finalize Purchase</h1>
      </div>
      
      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <section className="space-y-6">
            <h3 className="text-xl font-serif flex items-center gap-3 text-white"><Truck size={24} className="text-cyan-400" /> Delivery Concierge</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Full Name</label>
                <input name="fullName" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="Julian Vane" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Street Address</label>
                <input name="address" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="123 Luxury Ave" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">City</label>
                <input name="city" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="Mumbai" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Postal Code</label>
                <input name="postalCode" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="400001" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-serif flex items-center gap-3 text-white"><CreditCard size={24} className="text-cyan-400" /> Payment Architecture</h3>
            <div className="glass p-8 rounded-[2.5rem] border-white/10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Card Member</label>
                <input required className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="JULIAN VANE" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Card Number</label>
                <input required className="w-full bg-slate-950 border border-white/5 rounded-xl p-4 text-white focus:border-cyan-500 outline-none" placeholder="•••• •••• •••• ••••" />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="glass p-8 rounded-[2.5rem] border-white/10 sticky top-24 space-y-8 shadow-2xl">
              <h3 className="text-2xl font-serif text-white">Investment Summary</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map(item => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex justify-between items-center text-sm">
                    <div className="flex gap-4 items-center">
                       <img src={item.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
                       <div>
                         <p className="font-bold text-white text-xs">{item.name}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">{item.quantity}x</p>
                       </div>
                    </div>
                    <p className="font-bold text-white text-xs">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-white/10 space-y-4">
                 <div className="flex justify-between items-end">
                   <span className="text-lg font-serif text-white">Total</span>
                   <span className="text-3xl font-bold text-cyan-400">₹{total.toLocaleString()}</span>
                 </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col gap-3 text-rose-400 text-xs text-left">
                  <div className="flex gap-3">
                    <AlertCircle size={16} />
                    <p className="font-bold">Protocol Error</p>
                  </div>
                  <p className="opacity-80 leading-relaxed">{error}</p>
                </div>
              )}

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Synchronizing Core...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Authorize & Dispatch Invoice
                  </>
                )}
              </button>
              <p className="text-center text-[9px] text-slate-500 uppercase tracking-widest">PDF & SMTP Dispatch Hub Enabled</p>
           </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
