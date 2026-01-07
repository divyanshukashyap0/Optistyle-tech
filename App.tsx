//const API_URL = import.meta.env.VITE_API_URL;
import MyOrders from "./pages/MyOrders";
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import EyeTest from './pages/EyeTest';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Account from './pages/Account';
import Chatbot from './components/Chatbot';
import { CartItem, User } from './types';
import { ShieldCheck, Eye } from 'lucide-react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from './firebase';

// Wrapper to trigger animation on route change
const AnimatedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-reveal">
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('optistyle_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User>({
    email: '',
    isAuthenticated: false,
    isAdmin: false
  });

  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = firebaseUser.email === 'divyanshu00884466@gmail.com';
        setUser({
          email: firebaseUser.email || '',
          isAuthenticated: true,
          isAdmin: isAdmin
        });
      } else {
        setUser({ email: '', isAuthenticated: false, isAdmin: false });
      }
      setIsVerifying(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('optistyle_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user.isAdmin) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, [user.isAdmin]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedColor === item.selectedColor);
      if (existing) {
        return prev.map(i => 
          i.id === item.id && i.selectedColor === item.selectedColor 
          ? { ...i, quantity: i.quantity + item.quantity } 
          : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedColor === color)));
  };

  const updateQuantity = (id: string, color: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.selectedColor === color) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const handleAuth = async (e: React.FormEvent, type: 'login' | 'signup') => {
    e.preventDefault();
    setLoginError('');
    const target = e.currentTarget as HTMLFormElement;
    const email = (target.elements.namedItem('email') as HTMLInputElement).value;
    const password = (target.elements.namedItem('password') as HTMLInputElement).value;

    try {
      if (type === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.hash = '/';
  };

  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-[#020617] z-[200] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-24 h-24 bg-cyan-600/20 rounded-full flex items-center justify-center animate-pulse">
            <Eye className="text-cyan-400" size={40} />
          </div>
          <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
        </div>
        <div className="mt-8 text-center space-y-2">
          <h1 className="text-2xl font-serif text-white tracking-widest">OPTISTYLE</h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Initializing Vision Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className={`flex flex-col min-h-screen relative z-10`}>
        <Navbar cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} user={user} logout={logout} />
        <main className="flex-grow pt-20">
          <AnimatedRoutes>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
              <Route path="/eye-test" element={<EyeTest />} />
              <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
              <Route path="/checkout" element={user.isAuthenticated ? <Checkout cart={cart} clearCart={() => setCart([])} user={user} /> : <Navigate to="/login" />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/account" element={user.isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin" element={user.isAdmin ? <Admin /> : <Navigate to="/" />} />
              
              <Route path="/login" element={
                user.isAuthenticated ? <Navigate to="/account" /> : (
                <div className="max-w-md mx-auto mt-20 p-8 glass-dark rounded-3xl border border-white/10 shadow-2xl animate-reveal">
                  <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                      <ShieldCheck size={32} />
                    </div>
                  </div>
                  <h2 className="text-3xl font-serif mb-2 text-center">OptiStyle Access</h2>
                  <p className="text-slate-500 text-center text-sm mb-8">Enter your credentials to continue.</p>
                  
                  <form className="space-y-5" onSubmit={(e) => {
                    const submitter = (e.nativeEvent as any).submitter.name;
                    handleAuth(e, submitter as 'login' | 'signup');
                  }}>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Email Address</label>
                      <input name="email" type="email" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Password</label>
                      <input name="password" type="password" required className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm" placeholder="••••••••" />
                    </div>
                    {loginError && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-bold text-center">{loginError}</div>}
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button type="submit" name="login" className="w-full flex items-center justify-center gap-2 bg-white text-slate-950 font-bold py-4 rounded-xl transition-all shadow-xl hover:bg-cyan-50 active:scale-[0.98] text-xs uppercase tracking-widest">
                        Login
                      </button>
                      <button type="submit" name="signup" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all uppercase tracking-widest text-xs">
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>
                )
              } />
            </Routes>
          </AnimatedRoutes>
        </main>
        <Footer isAdmin={user.isAdmin} />
        <Chatbot />
      </div>
    </HashRouter>
  );
};


<Route
  path="/my-orders"
  element={<MyOrders user={user} />}
/>

export default App;
