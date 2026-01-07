import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import EyeTest from "./pages/EyeTest";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Account from "./pages/Account";
import MyOrders from "./pages/MyOrders";
import Chatbot from "./components/Chatbot";
import { CartItem, User } from "./types";
import { ShieldCheck, Eye } from "lucide-react";

import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "./firebase";

/* ---------------- Animation Wrapper ---------------- */
const AnimatedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-reveal">
      {children}
    </div>
  );
};

/* ---------------- Main App ---------------- */
const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("optistyle_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User>({
    email: "",
    isAuthenticated: false,
    isAdmin: false,
  });

  const [loginError, setLoginError] = useState("");
  const [isVerifying, setIsVerifying] = useState(true);

  /* ---------------- Auth Listener ---------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || "",
          isAuthenticated: true,
          isAdmin: firebaseUser.email === "divyanshu00884466@gmail.com",
        });
      } else {
        setUser({ email: "", isAuthenticated: false, isAdmin: false });
      }
      setIsVerifying(false);
    });

    return () => unsubscribe();
  }, []);

  /* ---------------- Cart Persistence ---------------- */
  useEffect(() => {
    localStorage.setItem("optistyle_cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------------- Cart Logic ---------------- */
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedColor === item.selectedColor
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedColor === item.selectedColor
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, color: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.selectedColor === color)));
  };

  const updateQuantity = (id: string, color: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedColor === color
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  /* ---------------- Login / Signup ---------------- */
  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setLoginError("");
    const form = e.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      type === "login"
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.hash = "/";
  };

  /* ---------------- Splash Screen ---------------- */
  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-[#020617] flex items-center justify-center">
        <Eye className="text-cyan-400 animate-pulse" size={48} />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <HashRouter>
      <Navbar
        cartCount={cart.reduce((a, i) => a + i.quantity, 0)}
        user={user}
        logout={logout}
      />

      <main className="pt-20 min-h-screen">
        <AnimatedRoutes>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route path="/eye-test" element={<EyeTest />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
            />
            <Route
              path="/checkout"
              element={
                user.isAuthenticated ? (
                  <Checkout cart={cart} clearCart={() => setCart([])} user={user} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/account"
              element={user.isAuthenticated ? <Account user={user} /> : <Navigate to="/login" />}
            />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/admin" element={user.isAdmin ? <Admin /> : <Navigate to="/" />} />

            {/* ---------- Login Page ---------- */}
            <Route
              path="/login"
              element={
                user.isAuthenticated ? (
                  <Navigate to="/account" />
                ) : (
                  <form
                    className="max-w-md mx-auto mt-20 p-8 glass-dark rounded-xl"
                    onSubmit={(e) => {
                      const btn = (e.nativeEvent as any).submitter.name;
                      handleAuth(e, btn);
                    }}
                  >
                    <input name="email" required placeholder="Email" />
                    <input name="password" required type="password" placeholder="Password" />
                    {loginError && <p className="text-red-400">{loginError}</p>}
                    <button name="login">Login</button>
                    <button name="signup">Signup</button>
                  </form>
                )
              }
            />
          </Routes>
        </AnimatedRoutes>
      </main>

      <Footer isAdmin={user.isAdmin} />
      <Chatbot />
    </HashRouter>
  );
};

export default App;
