const API_URL = import.meta.env.VITE_API_URL;

import React, { useState } from 'react';
// Corrected named imports for hooks from react-router-dom to ensure they are visible to the compiler
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { CartItem } from '../types';
import { Shield, Sparkles, Truck, RefreshCw, Star, ArrowLeft, ShoppingBag } from 'lucide-react';

interface ProductDetailProps {
  addToCart: (item: CartItem) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  if (!product) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
      <h1 className="text-3xl font-serif">Product Not Found</h1>
      <button onClick={() => navigate('/products')} className="text-cyan-400 font-bold">Return to Collection</button>
    </div>
  );

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedColor
    });
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={18} /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Product Images */}
        <div className="space-y-6 sticky top-24">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden glass border border-white/10 shadow-2xl">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-6 right-6">
              <div className="p-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-amber-400 flex flex-col items-center gap-1">
                <Star size={20} fill="currentColor" />
                <span className="text-[10px] font-bold text-white">4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-cyan-900/30 border border-cyan-500/30 rounded-full text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                {product.brand}
              </span>
            </div>
            <h1 className="text-5xl font-serif leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-white">₹{product.price.toLocaleString()}</span>
              <span className="text-slate-500 line-through">₹{(product.price * 1.2).toLocaleString()}</span>
              <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-1 rounded">20% Off</span>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Frame Color</label>
              <div className="flex gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${selectedColor === color ? 'bg-white text-slate-950 border-white' : 'bg-transparent text-white border-white/10 hover:border-white/30'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <div className="flex items-center bg-slate-900 border border-white/5 rounded-2xl px-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 text-slate-400 hover:text-white">-</button>
                <span className="px-6 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 text-slate-400 hover:text-white">+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-cyan-900/20 active:scale-95"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Features Tabs */}
          <div className="glass border border-white/10 rounded-[2rem] overflow-hidden">
             <div className="flex border-b border-white/10">
               {['details', 'materials', 'shipping'].map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-white/5 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   {tab}
                 </button>
               ))}
             </div>
             <div className="p-8">
                {activeTab === 'details' && (
                  <ul className="grid grid-cols-2 gap-6 text-sm">
                    <li className="flex items-center gap-3 text-slate-400"><Sparkles size={16} className="text-cyan-400" /> Precision Lens Fitting</li>
                    <li className="flex items-center gap-3 text-slate-400"><Shield size={16} className="text-cyan-400" /> 100% UV Protection</li>
                    <li className="flex items-center gap-3 text-slate-400"><Sparkles size={16} className="text-cyan-400" /> Anti-Glare Available</li>
                    <li className="flex items-center gap-3 text-slate-400"><Shield size={16} className="text-cyan-400" /> Scratch-Resistant Coating</li>
                  </ul>
                )}
                {activeTab === 'materials' && (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Crafted from {product.materials.join(' and ')}. Our frames are manufactured to ensure lasting performance and visual appeal.
                    </p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0"><Truck size={20} className="text-cyan-400" /></div>
                      <div>
                        <p className="text-sm font-bold">Standard Shipping</p>
                        <p className="text-xs text-slate-500">Reliable delivery. Arrives in 3-7 business days.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shrink-0"><RefreshCw size={20} className="text-emerald-400" /></div>
                      <div>
                        <p className="text-sm font-bold">Return Policy</p>
                        <p className="text-xs text-slate-500">14-day return period for unused products. Conditions apply.</p>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
