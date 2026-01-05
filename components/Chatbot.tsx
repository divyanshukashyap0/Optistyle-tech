
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, BrainCircuit, Bot, User, Loader2, ChevronDown, ShieldCheck, Zap } from 'lucide-react';

interface Message {
  role: 'user' | 'bot';
  text: string;
  isThinking?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Welcome to the OptiStyle Sanctuary. I am your Vision Concierge. How may I assist your visual journey today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [useDeepThinking, setUseDeepThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = input.trim();
  setInput('');
  setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
  setIsTyping(true);

  try {
const response = await fetch("https://optistyle-backend.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        deepThinking: useDeepThinking,
      }),
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();

    const botResponse =
      data.reply ||
      "My apologies, the OptiStyle intelligence network is momentarily unavailable.";

    setMessages(prev => [
      ...prev,
      { role: 'bot', text: botResponse, isThinking: useDeepThinking },
    ]);
  } catch (error) {
    console.error("Chat Error:", error);
    setMessages(prev => [
      ...prev,
      {
        role: 'bot',
        text: "Forgive me, I’m unable to connect to the OptiStyle intelligence network at this moment.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {/* Premium Chat Window */}
      {isOpen && (
        <div className="w-[440px] h-[680px] glass-dark rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-8 animate-in slide-in-from-bottom-12 fade-in duration-500">
          {/* Elegant Header */}
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-cyan-950/40 via-transparent to-transparent flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-cyan-900/30 ring-4 ring-white/5">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Concierge AI</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Authorized Link Active</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-white">
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Intelligence Switcher */}
          <div className="px-8 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrainCircuit size={16} className={useDeepThinking ? "text-amber-400" : "text-slate-600"} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Cognitive Enhancement</span>
            </div>
            <button 
              onClick={() => setUseDeepThinking(!useDeepThinking)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${useDeepThinking ? 'bg-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.4)]' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md ${useDeepThinking ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Interactive Message Canvas */}
          <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'animate-luxury-in'}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                  msg.role === 'user' 
                  ? 'bg-slate-800 border-white/10 text-slate-400' 
                  : 'bg-cyan-950 border-cyan-500/30 text-cyan-400'
                }`}>
                  {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                </div>
                <div className={`max-w-[85%] p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-xl ${
                  msg.role === 'user' 
                  ? 'bg-white text-slate-900 rounded-tr-none font-semibold' 
                  : 'glass text-slate-200 rounded-tl-none border-white/10'
                }`}>
                  {msg.text}
                  {msg.isThinking && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 opacity-50">
                      <Zap size={12} className="text-amber-500" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em]">Deep Thinking Protocol Active</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/50 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="glass p-5 rounded-[1.5rem] rounded-tl-none border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Synthesizing Response...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Luxury Input Bar */}
          <div className="p-8 bg-slate-950/50 border-t border-white/5">
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Inquire about heritage, tech, or styling..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-[1.5rem] px-6 py-5 text-sm focus:outline-none focus:border-cyan-500 transition-all pr-16 font-medium text-white placeholder:text-slate-600"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white rounded-2xl transition-all flex items-center justify-center shadow-lg active:scale-90"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3 text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] opacity-60">
              <ShieldCheck size={12} /> Encrypted Concierge Session
            </div>
          </div>
        </div>
      )}

      {/* Signature Floating Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:scale-110 active:scale-95 border group relative ${
          isOpen ? 'bg-white text-slate-950 border-white' : 'bg-gradient-to-br from-cyan-600 to-blue-700 text-white border-white/10'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black text-slate-950 border-4 border-slate-950 shadow-lg">
            !
          </span>
        )}
      </button>
    </div>
  );
};


const API_URL = import.meta.env.VITE_BACKEND_URL;

const response = await fetch(`${API_URL}/api/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userMessage,
    deepThinking: useDeepThinking,
  }),
});


export default Chatbot;
