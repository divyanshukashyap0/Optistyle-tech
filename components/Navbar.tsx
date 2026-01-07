const API_URL = import.meta.env.VITE_API_URL;

import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, Eye, Search, Cpu, HardDrive } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  cartCount: number;
  user: UserType;
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, user, logout }) => {
  const isAdm = user.isAdmin;
  const location = useLocation();
  const isAccountPage = location.pathname === '/account';
  const isHomePage = location.pathname === '/';
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 glass border-b transition-all duration-500 ${isAdm ? 'border-amber-500/30 py-1' : 'border-white/10'}`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section - Primary Home Link */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${isAdm ? 'bg-amber-600 rotate-90 scale-90' : 'bg-cyan-600 rounded-full group-hover:scale-110'} ${isHomePage && !isAdm ? 'ring-2 ring-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : ''}`}>
            {isAdm ? <Cpu className="text-white" size={24} /> : <Eye className="text-white" size={24} />}
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-2xl font-serif font-bold tracking-tight transition-all duration-500 ${isHomePage && !isAdm ? 'text-cyan-400' : (isAdm ? 'text-amber-500' : 'bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:text-white')}`}>
              OptiStyle
            </span>
            {isAdm && (
              <span className="text-[10px] font-mono text-amber-500/60 font-bold uppercase tracking-[0.2em]">Core Control</span>
            )}
          </div>
        </Link>

        {/* Middle Navigation - Redundant Home link removed for cleaner UI */}
        {!isAccountPage && (
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <NavLink to="/products" className={({isActive}) => `transition-colors ${isActive ? (isAdm ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400 hover:text-white'}`}>Inventory</NavLink>
            <NavLink to="/eye-test" className={({isActive}) => `transition-colors ${isActive ? (isAdm ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400 hover:text-white'}`}>Analytics</NavLink>
            <NavLink to="/about" className={({isActive}) => `transition-colors ${isActive ? (isAdm ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400 hover:text-white'}`}>System</NavLink>
            <NavLink to="/my-orders" className={({isActive}) => `transition-colors ${isActive ? (isAdm ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-400 hover:text-white'}`}>My Orders</NavLink>

            {isAdm && (
              <NavLink to="/admin" className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded flex items-center gap-2 animate-pulse">
                <HardDrive size={14} /> Command
              </NavLink>
            )}
            {user.isAuthenticated && !isAdm && (
               <NavLink to="/account" className={({isActive}) => `transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}>Account</NavLink>
            )}
          </div>
        )}

        {/* Right Actions Section */}
        <div className="flex items-center gap-4">
          {!isAccountPage && (
            <>
              <button className={`p-2 rounded-lg transition-colors ${isAdm ? 'hover:bg-amber-500/10 text-amber-500/60' : 'hover:bg-white/5 text-slate-300'}`}><Search size={20} /></button>
              {!isAdm && (
                <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors text-slate-300">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-cyan-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950 font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}
          
          {user.isAuthenticated ? (
            <div className="flex items-center gap-4">
              {!isAccountPage && <span className={`hidden lg:inline text-xs font-mono font-bold ${isAdm ? 'text-amber-500/60' : 'text-slate-500'}`}>{user.email}</span>}
              <button onClick={logout} className={`text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all ${isAdm ? 'bg-amber-900/30 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}>Logout</button>
            </div>
          ) : (
            !isAccountPage && (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
                <User size={18} />
                <span className="hidden sm:inline text-sm font-bold uppercase">Enter</span>
              </Link>
            )
          )}
          
          {!isAccountPage && <button className="md:hidden p-2 text-slate-300"><Menu size={24} /></button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
