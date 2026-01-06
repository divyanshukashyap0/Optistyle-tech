import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  BrainCircuit,
  Bot,
  User,
  Loader2,
  ChevronDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
  isThinking?: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Welcome to the OptiStyle Sanctuary. I am your Vision Concierge. How may I assist your visual journey today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [useDeepThinking, setUseDeepThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
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

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botResponse, isThinking: useDeepThinking },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Forgive me, I’m unable to connect to the OptiStyle intelligence network at this moment.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[440px] h-[680px] glass-dark rounded-[3rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden mb-8">
          {/* Header */}
          <div className="p-8 border-b border-white/5 bg-gradient-to-br from-cyan-950/40 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center text-white">
                <Bot size={28} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  Concierge AI
                </h3>
                <span className="text-[10px] text-emerald-400 uppercase">
                  Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <ChevronDown size={24} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-8 space-y-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : ""
                }`}
              >
                <div
                  className={`p-4 rounded-2xl text-sm max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-white text-black"
                      : "bg-cyan-950 text-white"
                  }`}
                >
                  {msg.text}
                  {msg.isThinking && (
                    <div className="mt-2 text-[10px] opacity-60 flex gap-1 items-center">
                      <Zap size={10} /> Deep Thinking Active
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center opacity-70">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-xs">Thinking…</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/10">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about lenses, frames, or care…"
                className="flex-1 p-4 rounded-xl bg-slate-900 text-white outline-none"
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="bg-cyan-600 p-4 rounded-xl text-white"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="mt-3 flex justify-center text-[10px] text-slate-500 gap-1">
              <ShieldCheck size={12} /> Secure Session
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-blue-700 text-white flex items-center justify-center shadow-xl"
      >
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
      </button>
    </div>
  );
};

export default Chatbot;
