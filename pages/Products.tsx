const API_URL = import.meta.env.VITE_API_URL;

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../constants';
import { Filter, SlidersHorizontal, Search, Eye } from 'lucide-react';

const Products: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    }

    return result;
  }, [selectedCategory, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <div className="space-y-6 text-center max-w-3xl mx-auto animate-reveal">
        <h1 className="text-6xl font-serif tracking-tight">Curated Inventory</h1>
        <p className="text-slate-400 text-lg">Our complete archive of artisanal frames. Explore heritage designs and modern breakthroughs.</p>
      </div>

      {/* Advanced Filter Bar */}
      <div className="sticky top-24 z-40 glass rounded-[2.5rem] p-4 lg:p-6 space-y-4 shadow-2xl animate-reveal stagger-1">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all whitespace-nowrap border ${selectedCategory === cat ? 'bg-white text-slate-950 border-white shadow-xl shadow-white/5' : 'hover:bg-white/5 text-slate-500 border-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-grow max-w-md relative group">
            <input 
              type="text" 
              placeholder="Search frames or brands..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-3.5 pl-12 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-950 transition-all text-sm font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-400 transition-colors" size={18} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/50 rounded-2xl px-6 py-3.5 border border-white/5">
              <SlidersHorizontal size={14} className="text-cyan-500" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none appearance-none cursor-pointer font-bold uppercase tracking-wider"
              >
                <option className="bg-slate-900">Newest</option>
                <option className="bg-slate-900">Price: L to H</option>
                <option className="bg-slate-900">Price: H to L</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid with Staggered Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredAndSortedProducts.map((product, idx) => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className={`group animate-reveal stagger-${(idx % 8) + 1}`}
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-900 border border-white/5 transition-all duration-700 hover:border-cyan-500/30 group-hover:-translate-y-3 shadow-xl hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              <div className="absolute top-6 left-6">
                <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-[9px] uppercase font-black tracking-[0.2em] text-cyan-400 shadow-xl">
                  {product.brand}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-serif text-white">{product.name}</h3>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                   <p className="text-xl font-bold text-white">₹{product.price.toLocaleString()}</p>
                   <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[9px] tracking-widest">
                     View <Eye size={14} />
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-40 glass rounded-[4rem] border-dashed animate-reveal">
          <Search size={48} className="mx-auto text-slate-700 mb-6" />
          <h3 className="text-3xl font-serif mb-4">No assets identified</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Adjust your frequency parameters or explore the full registry.</p>
          <button 
            onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}
            className="mt-10 px-10 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-50 transition-all uppercase text-[10px] tracking-widest"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
