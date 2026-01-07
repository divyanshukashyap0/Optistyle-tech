const API_URL = import.meta.env.VITE_API_URL;
import React from 'react';
import { Eye, Instagram, Twitter, Facebook, MapPin, Phone, Mail, Terminal, ExternalLink } from 'lucide-react';
// Re-typed 'Link' export to resolve react-router-dom module recognition issues
import { Link } from 'react-router-dom';

interface FooterProps {
  isAdmin?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isAdmin }) => {
  return (
    <footer className={`border-t pt-20 pb-10 overflow-hidden relative transition-colors duration-500 ${isAdmin ? 'bg-black border-amber-500/20' : 'bg-slate-950 border-white/5'}`}>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent to-transparent ${isAdmin ? 'via-amber-500/50' : 'via-cyan-500/30'}`}></div>
      
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${isAdmin ? 'bg-amber-600' : 'bg-cyan-600 rounded-full'}`}>
              <Eye className="text-white" size={18} />
            </div>
            <span className={`text-xl font-serif font-bold tracking-tight ${isAdmin ? 'text-amber-500' : 'text-white'}`}>OptiStyle</span>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {isAdmin 
              ? "System Management Console. v4.2.0 stable build. Enterprise licensing active."
              : "Defining the intersection of avant-garde medical technology and luxury artisanal craftsmanship. Our vision is your clarity."}
          </p>
          <div className="flex gap-4">
            <a href="#" className={`p-2 rounded-lg transition-colors ${isAdmin ? 'bg-amber-500/10 hover:text-amber-400' : 'bg-white/5 hover:text-cyan-400'}`}><Instagram size={18} /></a>
            <a href="#" className={`p-2 rounded-lg transition-colors ${isAdmin ? 'bg-amber-500/10 hover:text-amber-400' : 'bg-white/5 hover:text-cyan-400'}`}><Twitter size={18} /></a>
            <a href="#" className={`p-2 rounded-lg transition-colors ${isAdmin ? 'bg-amber-500/10 hover:text-amber-400' : 'bg-white/5 hover:text-cyan-400'}`}><Facebook size={18} /></a>
          </div>
        </div>

       

        <div>
          <h4 className={`font-bold uppercase tracking-widest text-xs mb-6 ${isAdmin ? 'text-amber-600' : 'text-white'}`}>Operations</h4>
          <ul className="space-y-4 text-sm font-bold text-slate-500">
            <li><Link to="/eye-test" className={`transition-colors ${isAdmin ? 'hover:text-amber-400' : 'hover:text-cyan-400'}`}>Diagnostic Hub</Link></li>
            <li><Link to="/about" className={`transition-colors ${isAdmin ? 'hover:text-amber-400' : 'hover:text-cyan-400'}`}>System Specs</Link></li>
            <li><Link to="/contact" className={`transition-colors ${isAdmin ? 'hover:text-amber-400' : 'hover:text-cyan-400'}`}>Support Tickets</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className={`font-bold uppercase tracking-widest text-xs mb-6 ${isAdmin ? 'text-amber-600' : 'text-white'}`}>Flagship Store</h4>
          <a 
            href="https://www.justdial.com/Datia/Eye-Care-Optical-Near-Gahoi-Vatika-Gahoi-Colony/9999P7522-7522-241125154706-Y5R9_BZDET" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block space-y-4"
          >
            <div className="flex items-start gap-3 text-sm text-slate-500 font-bold group-hover:text-white transition-colors">
              <MapPin size={18} className={`${isAdmin ? 'text-amber-500' : 'text-cyan-500'} shrink-0`} />
              <span>
                Eye Care Optical<br />
                Near Gahoi Vatika, Gahoi Colony<br />
                Datia, MP - 475661
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
              View on Map <ExternalLink size={12} />
            </div>
          </a>
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
              <Phone size={18} className={isAdmin ? 'text-amber-500' : 'text-cyan-500'} />
              <span>+91 8005343226</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
              <Terminal size={18} className={isAdmin ? 'text-amber-500' : 'text-cyan-500'} />
              <span>Admin@optistyle.in</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
        <p>© 2026 OptiStyle System Engine. Auth State</p>
        <div className="flex gap-6">
          <Link to="/privacy_policy" className={`transition-colors ${isAdmin ? 'hover:text-amber-400' : 'hover:text-cyan-400'}`}>Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
