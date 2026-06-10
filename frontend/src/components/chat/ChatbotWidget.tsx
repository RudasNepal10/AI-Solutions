"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
}

const PRESET_RESPONSES: Record<string, string> = {
  "hello": "Hi there! I'm the AI-Solutions Virtual Assistant. How can I help you improve your digital employee experience today?",
  "pricing": "Our solutions are custom-tailored to your organization. Please visit our Contact page to schedule a personalised demo and discuss pricing.",
  "services": "We offer AI Virtual Assistants, Rapid Prototyping, Predictive Analytics, System Integration, Process Automation, and AI Security. What are you most interested in?",
  "demo": "You can schedule a free demo by heading over to our Contact Us page and filling out the form!",
  "contact": "You can reach us at contact@aisolutions.com or by filling out the Contact form on our website.",
  "default": "That's an interesting question! Our AI specialists would love to discuss this with you. Please reach out via our Contact form for a detailed consultation.",
};

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your AI Virtual Assistant. Ask me anything about our software solutions.",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMessage: Message = { id: Date.now().toString(), text: userText, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call OpenRouter API directly from the frontend
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json",
          "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
          "X-OpenRouter-Title": "AI-Solutions",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // Using a stable model. (Can change to openai/gpt-5.2 if needed)
          messages: [
            { role: "system", content: "You are the AI-Solutions Virtual Assistant. You help users with digital employee experiences, prototyping, predictive analytics, and process automation." },
            ...messages.filter(m => m.id !== "welcome").map(m => ({
              role: m.isBot ? "assistant" : "user",
              content: m.text
            })),
            { role: "user", content: userText }
          ]
        })
      });
      
      let responseText = "I'm sorry, I couldn't process your request.";
      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          responseText = data.choices[0].message.content;
        }
      } else {
        console.error("OpenRouter Error:", await response.text());
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: responseText, isBot: true },
      ]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), text: "Sorry, I am having trouble connecting to the AI server.", isBot: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl flex items-center justify-center glow-brand hover:-translate-y-1 transition-transform"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col glass-card rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-indigo-600">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">AI Virtual Assistant</h3>
                  <p className="text-xs text-indigo-300">Online | Ready to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-indigo-200 hover:text-white transition-colors rounded-lg hover:bg-indigo-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50 dark:bg-[#0a0a0f]/50">
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.isBot ? "self-start" : "self-end flex-row-reverse"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.isBot ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                  }`}>
                    {msg.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.isBot 
                      ? "bg-white dark:bg-[#16161f] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-tl-none" 
                      : "bg-indigo-600 text-white rounded-tr-none"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[85%] self-start items-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 text-white">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-[#16161f] border border-slate-200 dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#111118]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="w-full bg-slate-50 dark:bg-[#16161f] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 pr-12 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg transition-colors"
                >
                  {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
