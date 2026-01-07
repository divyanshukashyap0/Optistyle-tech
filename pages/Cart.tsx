
import React from 'react';
// Re-typed Link import from react-router-dom to fix missing named export recognition error
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';
const API_URL = import.meta.env.VITE_API_URL;

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, color: string, delta: number) => void;
  removeFromCart: (id: string, color: string) => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart }) => {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 500;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag size={40} className="text-slate-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif">Your cart is empty</h1>
          <p className="text-slate-400 max-w-md mx-auto">It seems you haven't added any of our masterpieces to your collection yet.</p>
        </div>
        <Link 
          to="/products" 
          className="inline-flex px-10 py-5 bg-cyan-600 text-white font-bold rounded-2xl hover:bg-cyan-500 transition-all shadow-xl"
        >
          Begin Selection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12">Shopping Collection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={`${item.id}-${item.selectedColor}`} className="glass p-6 rounded-[2rem] border-white/10 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow space-y-1 text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">{item.brand}</p>
                <h3 className="text-xl font-serif">{item.name}</h3>
                <p className="text-sm text-slate-500">Color: {item.selectedColor}</p>
                <p className="text-lg font-bold text-white mt-2">₹{item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-950 rounded-xl p-1 border border-white/5">
                <button 
                  onClick={() => updateQuantity(item.id, item.selectedColor, -1)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-bold">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.selectedColor, 1)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id, item.selectedColor)}
                className="p-4 text-slate-500 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2rem] border-white/10 sticky top-24 space-y-6">
            <h3 className="text-xl font-serif pb-4 border-b border-white/5">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Shipping</span>
                <span className="text-emerald-400">{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Taxes</span>
                <span className="text-white">Calculated at checkout</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <span className="text-lg font-serif">Estimated Total</span>
                <span className="text-2xl font-bold text-cyan-400">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              to="/checkout" 
              className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-50 transition-all shadow-xl shadow-white/5"
            >
              Proceed to Checkout <ArrowRight size={20} />
            </Link>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest font-bold">Secure Global Delivery</p>
              <div className="flex justify-center gap-4 opacity-30 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
