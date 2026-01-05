
import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Activity, Bell, ChevronRight, MessageSquare, Database, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

const Admin: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'Overview' | 'Orders' | 'Inquiries'>('Overview');
  const [cloudOrders, setCloudOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCloudOrders(data);
    } catch (e: any) {
      console.error("Cloud Registry Error:", e);
      if (e.code === 'not-found' || e.message.includes('database')) {
        setError("Database (default) does not exist. Please go to Firebase Console > Firestore and click 'Create Database'.");
      } else {
        setError(e.message || "Unknown synchronization error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
  }, []);

  const totalRevenue = cloudOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const stats = [
    { label: 'Cloud Revenue', value: isLoading ? null : `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-900/20' },
    { label: 'Cloud Sales', value: isLoading ? null : cloudOrders.length.toString(), icon: Package, color: 'text-cyan-400', bg: 'bg-cyan-900/20' },
    { label: 'Sync Status', value: isLoading ? null : (error ? 'Offline' : 'Live'), icon: Activity, color: error ? 'text-rose-400' : 'text-indigo-400', bg: error ? 'bg-rose-900/20' : 'bg-indigo-900/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif">Executive Portal</h1>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-1">Cloud Infrastructure // Database (default)</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchRegistry} className="p-3 glass rounded-xl hover:text-cyan-400 transition-colors">
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-6 rounded-[2rem] border-white/5 space-y-4 hover:border-amber-500/30 transition-all group">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
              {stat.value === null ? (
                <div className="skeleton h-8 w-24 rounded-lg mt-1"></div>
              ) : (
                <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-3">
            {[
              { id: 'Overview', icon: Activity, label: 'Cloud Overview' },
              { id: 'Orders', icon: Database, label: 'Full Registry' },
              { id: 'Inquiries', icon: MessageSquare, label: 'Inquiries' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`w-full p-4 rounded-2xl flex items-center justify-between text-sm transition-all border ${currentTab === tab.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
              >
                <span className="flex items-center gap-3"><tab.icon size={18} /> {tab.label}</span>
                <ChevronRight size={14} className={currentTab === tab.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {error ? (
            <div className="glass p-12 rounded-[2.5rem] border-rose-500/20 text-center space-y-4">
              <AlertTriangle size={40} className="mx-auto text-rose-500" />
              <h4 className="text-white font-bold">Cloud Registry Unavailable</h4>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">{error}</p>
              <div className="pt-4">
                <a href="https://console.firebase.google.com/" target="_blank" className="text-cyan-400 font-bold uppercase text-[10px] tracking-widest border border-cyan-400/20 px-6 py-3 rounded-xl hover:bg-cyan-400/10 transition-all">Configure Firebase Console</a>
              </div>
            </div>
          ) : (
            <div className="glass rounded-[2.5rem] overflow-hidden border-white/5">
              <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-xl font-serif text-white">Registry Ledger</h3>
                <span className={`text-[10px] font-bold ${isLoading ? 'text-slate-500 animate-pulse' : 'text-emerald-400'}`}>
                  {isLoading ? 'SYNCING...' : 'ONLINE'}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
                      <th className="px-8 py-4">Reference</th>
                      <th className="px-8 py-4">Customer</th>
                      <th className="px-8 py-4">Total</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-8 py-6"><div className="skeleton h-4 w-24 rounded"></div></td>
                          <td className="px-8 py-6"><div className="skeleton h-4 w-40 rounded"></div></td>
                          <td className="px-8 py-6"><div className="skeleton h-4 w-16 rounded"></div></td>
                          <td className="px-8 py-6"><div className="skeleton h-6 w-16 rounded-full"></div></td>
                        </tr>
                      ))
                    ) : (
                      cloudOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6 text-xs font-mono text-cyan-500">{order.orderId}</td>
                          <td className="px-8 py-6 text-sm">{order.userEmail}</td>
                          <td className="px-8 py-6 text-sm font-bold">₹{order.totalAmount?.toLocaleString()}</td>
                          <td className="px-8 py-6">
                             <span className="px-2 py-1 bg-amber-900/30 text-amber-400 rounded text-[9px] font-bold uppercase">{order.orderStatus}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
