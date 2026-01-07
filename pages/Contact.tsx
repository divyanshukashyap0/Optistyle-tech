
import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2, AlertTriangle, Terminal, Info } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    // Constructing data for FormSubmit.co
    const payload = {
      name: `${formData.get('firstName')} ${formData.get('lastName')}`,
      email: formData.get('email'),
      subject: `OptiStyle Inquiry: ${formData.get('type')}`,
      message: formData.get('message'),
      _template: 'table', // FormSubmit specific configuration
      _captcha: 'false'   // Can be set to true if you want to enable reCAPTCHA
    };

    try {
      // Using FormSubmit.co AJAX endpoint
      const response = await fetch('https://formsubmit.co/ajax/divyanshu00884466@gmail.com', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success === 'true') {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Transmission node rejected the packet.');
      }
    } catch (err: any) {
      console.error('Contact Submission Error:', err);
      setError(err.message || 'Network instability detected. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-serif text-white">Reach Out.</h1>
            <p className="text-slate-400 text-lg">Our vision concierges are available 24/7 to assist with your inquiries.</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-cyan-900/20 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Global Headquarters</h4>
                <p className="text-slate-400">Suite 404, Vision Plaza, Bangalore, India</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                <Phone size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Concierge Line</h4>
                <p className="text-slate-400">+91 800-OPTISTYLE</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-14 h-14 bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Inquiries</h4>
                <p className="text-slate-400">concierge@optistyle.com</p>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl border-white/10 inline-flex items-center gap-4 hover:border-cyan-500/30 transition-all cursor-pointer">
             <MessageSquare className="text-cyan-400" />
             <span className="font-bold text-white">Live Chat with an Optician</span>
          </div>
        </div>

        {submitted ? (
          <div className="glass p-12 rounded-[3rem] border-white/10 space-y-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-emerald-900/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-3xl font-serif text-white">Message Transmitted</h3>
            <p className="text-slate-400">
              Your inquiry has been successfully transmitted via our cloud gateway. A vision specialist will contact you shortly.
            </p>
            <button onClick={() => {setSubmitted(false); setError(null);}} className="text-cyan-400 font-bold uppercase text-xs tracking-widest hover:text-cyan-300 transition-colors">Send Another Correspondence</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass p-12 rounded-[3rem] border-white/10 space-y-8 relative overflow-hidden">
            <h3 className="text-2xl font-serif text-white mb-4">Direct Correspondence</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">First Name</label>
                <input name="firstName" required className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                <input name="lastName" required className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
              <input name="email" type="email" required className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Inquiry Type</label>
              <select name="type" className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-cyan-500 focus:bg-slate-900 outline-none appearance-none cursor-pointer">
                <option>Product Inquiries</option>
                <option>Eye Screening Questions</option>
                <option>Order Status</option>
                <option>Heritage Tour</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Message</label>
              <textarea name="message" required rows={4} className="w-full bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-white focus:border-cyan-500 focus:bg-slate-900 outline-none transition-all resize-none"></textarea>
            </div>
            
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex gap-3 text-rose-400 text-xs">
                <AlertTriangle className="shrink-0" size={16} />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-white text-slate-950 font-bold rounded-2xl hover:bg-cyan-50 transition-all shadow-xl flex items-center justify-center gap-2 disabled:bg-slate-300 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></span>
              ) : (
                <><Send size={18} /> Transmit Message</>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">
              <Info size={12} /> Powered by Cloud Gateway
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
