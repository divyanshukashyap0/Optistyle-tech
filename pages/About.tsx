
import React from 'react';
const API_URL = import.meta.env.VITE_API_URL;

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <h1 className="text-6xl font-serif leading-tight">Focus On <br /><span className="text-cyan-500 italic">Quality.</span></h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            OptiStyle is dedicated to providing high-quality eyewear that combines functional performance with contemporary aesthetics.
          </p>
          <div className="space-y-4 text-slate-400">
            <p>We work with quality materials including lightweight titanium and high-grade acetates to ensure our products meet daily use standards for durability and style.</p>
            <p>Every pair of OptiStyle frames is inspected for finish and fit, ensuring you receive a product that provides both visual clarity and a comfortable experience.</p>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800" className="rounded-[4rem] shadow-2xl relative z-10" alt="OptiStyle Display" />
          <div className="absolute -top-10 -right-10 w-full h-full border border-cyan-500/20 rounded-[4rem] z-0"></div>
        </div>
      </section>

      <section className="bg-slate-900/30 rounded-[3rem] p-12 md:p-24 border border-white/5 text-center space-y-12">
        <h2 className="text-4xl font-serif">Our Standards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4">
             <div className="text-5xl font-serif text-cyan-400">Quality</div>
             <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Component Inspection</p>
             <p className="text-slate-400 text-sm">We maintain rigorous inspection standards across all frame components for structural integrity.</p>
          </div>
          <div className="space-y-4">
             <div className="text-5xl font-serif text-cyan-400">Finish</div>
             <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Hand-Inspected</p>
             <p className="text-slate-400 text-sm">Our polishing and finish inspection ensures every frame arrives in excellent condition.</p>
          </div>
          <div className="space-y-4">
             <div className="text-5xl font-serif text-cyan-400">Standards</div>
             <p className="text-xs uppercase tracking-widest font-bold text-slate-500">Industry Compliance</p>
             <p className="text-slate-400 text-sm">Our lenses and frames comply with international standards for safety and UV protection.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
