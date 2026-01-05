
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Microscope, Layers, PlayCircle } from 'lucide-react';
import { PRODUCTS } from '../constants';

const Home: React.FC = () => {
  return (
    <div className="space-y-40 pb-32">
      {/* Cinematic Landing Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover opacity-40 animate-scale-in" 
            alt="Luxury Vision" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/20 to-slate-950"></div>
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/60"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="max-w-3xl space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase animate-reveal stagger-1">
              <Sparkles size={14} className="animate-pulse" />
              The Pinnacle of Ocular Engineering
            </div>
            <h1 className="text-7xl md:text-9xl font-serif leading-[1.05] tracking-tight text-white animate-reveal stagger-2">
              Visual <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent italic shimmer-text">Excellence.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-medium animate-reveal stagger-3">
              Where avant-garde medical technology meets artisanal Italian craftsmanship. Experience clarity redefined in our luxury vision sanctuary.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 pt-4 animate-reveal stagger-4">
              <Link 
                to="/products" 
                className="px-10 py-5 bg-white text-slate-950 font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:-translate-y-1 active:scale-95"
              >
                Enter Collection <ArrowRight size={20} />
              </Link>
              <Link 
                to="/eye-test" 
                className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-extrabold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95"
              >
                Diagnostic Hub <PlayCircle size={20} className="text-cyan-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 animate-float">
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Scroll to Discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-[4rem] overflow-hidden animate-reveal">
          <div className="p-16 space-y-8 bg-slate-950/40 backdrop-blur-3xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Microscope size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Optical Precision</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Every lens is digitally surfaced to 0.01 micron accuracy, ensuring distortion-free peripheral vision.</p>
          </div>
          <div className="p-16 space-y-8 bg-slate-950/40 backdrop-blur-3xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <Sparkles size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">Titanium Core</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Our Aerospace-grade Titanium frames offer weightless strength and hypoallergenic comfort for life.</p>
          </div>
          <div className="p-16 space-y-8 bg-slate-950/40 backdrop-blur-3xl hover:bg-white/5 transition-colors group">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Heritage Service</h3>
            <p className="text-slate-400 leading-relaxed text-sm">Complimentary professional adjustment and maintenance for every piece in our collection, indefinitely.</p>
          </div>
        </div>
      </section>

      {/* Featured Masterpieces Teaser */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 animate-reveal">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-cyan-500">
              <Layers size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Curation v4.2</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif text-white">Heritage Designs</h2>
            <p className="text-slate-400 max-w-lg text-lg leading-relaxed">A glimpse into our most coveted pieces, selected for their timeless architecture.</p>
          </div>
          <Link to="/products" className="group px-8 py-4 glass rounded-2xl text-white font-bold flex items-center gap-3 hover:bg-white/5 transition-all hover-lift">
            View All Inventory <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {PRODUCTS.slice(0, 3).map((product, idx) => (
            <Link key={product.id} to={`/product/${product.id}`} className={`group relative animate-reveal stagger-${idx + 1}`}>
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 transition-all duration-700 group-hover:border-cyan-500/40 group-hover:-translate-y-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="text-2xl font-serif text-white">{product.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{product.brand}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
