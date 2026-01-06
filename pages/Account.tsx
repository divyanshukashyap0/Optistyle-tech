
import React, { useState, useEffect } from 'react';
import { User, Package, Shield, ChevronRight, Clock, ExternalLink, Sparkles, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface AccountProps {
  user: UserType;
}
const API_URL = import.meta.env.VITE_API_URL;

const Account: React.FC<AccountProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'order' | 'security'>('overview');
  const [order, setorder] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchorder = async () => {
      if (!user.email) return;
      setIsLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, "order"), 
          where("userEmail", "==", user.email)
        );
        
        const querySnapshot = await getDocs(q);
        const orderList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const sortedorder = orderList.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA; 
        });

        setorder(sortedorder);
      } catch (err: any) {
        console.error("Fetch Cloud order Error:", err);
        if (err.code === 'not-found') {
          setError("Database node not found. Please contact support.");
        } else if (err.message.includes('index')) {
          setError("The system is optimizing indices. Please try again in a moment.");
        } else {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchorder();
  }, [user.email]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="lg:w-1/4 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/10 text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white truncate px-2">{user.email.split('@')[0]}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Verified Node</p>
            </div>
          </div>

          <nav className="glass p-4 rounded-[2.5rem] border-white/10 space-y-2">
            {[
              { id: 'overview', label: 'Dashboard', icon: Sparkles },
              { id: 'order', label: 'Order History', icon: Package },
              { id: 'security', label: 'Security & Privacy', icon: Shield }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm transition-all ${
                  activeTab === item.id 
                    ? 'bg-cyan-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </span>
                <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </nav>
        </aside>

        <main className="lg:w-3/4 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          {error ? (
            <div className="glass p-12 rounded-[2.5rem] border-rose-500/20 text-center space-y-4">
              <AlertCircle size={40} className="mx-auto text-rose-500" />
              <h4 className="text-white font-bold">Cloud Sync Error</h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Transactions</p>
                      {isLoading ? <div className="skeleton h-8 w-12 rounded-lg"></div> : <p className="text-3xl font-bold text-white">{order.length}</p>}
                    </div>
                    <div className="glass p-6 rounded-3xl border-white/5 space-y-2">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status</p>
                      <p className="text-3xl font-bold text-cyan-400">Elite</p>
                    </div>
                  </div>
                  <section className="glass p-10 rounded-[3rem] border-white/10 space-y-6">
                    <h3 className="text-2xl font-serif text-white">Identity Access</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email Node</p>
                        {isLoading ? <div className="skeleton h-5 w-48 rounded-full"></div> : <p className="text-white font-medium">{user.email}</p>}
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cloud Security</p>
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <Shield size={14} /> Firestore Encrypted
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'order' && (
                <div className="space-y-6">
                  <h3 className="text-3xl font-serif text-white px-2">Purchase History</h3>
                  
                  {isLoading ? (
                    // Staggered Skeleton rows
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6 w-full">
                            <div className="skeleton w-16 h-16 rounded-2xl shrink-0"></div>
                            <div className="space-y-3 w-full max-w-sm">
                              <div className="skeleton h-3 w-24 rounded-full"></div>
                              <div className="skeleton h-5 w-full rounded-lg"></div>
                              <div className="skeleton h-3 w-40 rounded-full"></div>
                            </div>
                          </div>
                          <div className="skeleton h-8 w-24 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : order.length === 0 ? (
                    <div className="glass p-12 rounded-[2.5rem] border-white/5 text-center space-y-4">
                      <ShoppingBag size={24} className="mx-auto text-slate-600" />
                      <h4 className="text-white font-bold">No cloud records identified</h4>
                      <p className="text-sm text-slate-500">Acquisitions will appear here in real-time.</p>
                      <button onClick={() => window.location.hash = '/products'} className="text-cyan-400 font-bold uppercase text-[10px] tracking-widest pt-2">Explore Store</button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {order.map((order) => (
                        <div key={order.id} className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/30 transition-all">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/5 overflow-hidden">
                              <Package size={24} />
                            </div>
                            <div>
                              <p className="text-xs font-mono text-cyan-500 mb-1">{order.orderId}</p>
                              <h4 className="text-lg font-bold text-white">
                                {order.products?.[0]?.name || 'OptiStyle Frame'} {order.products?.length > 1 ? `+ ${order.products.length - 1} more` : ''}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 font-bold uppercase">
                                <span className="flex items-center gap-1"><Clock size={12} /> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Syncing...'}</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span>Total: ₹{order.totalAmount?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400">
                              {order.ordertatus || 'Processing'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div className="glass p-12 rounded-[3rem] border-white/10 space-y-6">
                   <h3 className="text-2xl font-serif text-white">Encryption Protocol</h3>
                   <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400">
                      <Shield size={24} />
                      <p className="text-sm font-bold uppercase tracking-wider">Cloud Auth & Firestore Sync Active</p>
                   </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Account;
