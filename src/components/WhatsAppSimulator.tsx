import React, { useState, useEffect, useRef } from "react";
import { Send, CheckCheck, Landmark, MessageSquare, Plus, RefreshCw, Zap, ChevronLeft, Phone, Video, MoreVertical, Smile } from "lucide-react";
import { Transaction } from "../types";

interface WhatsAppSimulatorProps {
  onAddTransaction: (newTx: Omit<Transaction, "id" | "date" | "loggedBy">) => void;
  onAddMessageDirect?: (msg: any) => void;
}

export default function WhatsAppSimulator({ onAddTransaction, onAddMessageDirect }: WhatsAppSimulatorProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentTransaction, setRecentTransaction] = useState<any | null>(null);

  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; time: string; meta?: any }>>([
    {
      sender: "user",
      text: "spent $200 on banana shake",
      time: "4:32 PM",
    },
    {
      sender: "bot",
      text: "⚡ Auto-Logged by Spliq AI!\n💰 Amount: $200.00\n📂 Category: Food\n✏️ Description: Banana shake\n🎯 Spliq Expense & master stats boards updated instantly!",
      time: "4:32 PM",
      meta: { amount: 200, category: "Food", description: "banana shake" }
    },
    {
      sender: "user",
      text: "split Thailand Trip $3000 with Camron",
      time: "4:33 PM",
    },
    {
      sender: "bot",
      text: "⚡ Thailand Trip group split created!\n📊 Total: $3,000.00\n👥 Share per person: $1,500.00\n💼 Recorded instantly under Split Me dashboard.",
      time: "4:33 PM",
      meta: { amount: 1500, category: "Travel", description: "Thailand Trip" }
    }
  ]);

  const presetMessages = [
    "spent Rs200 for banana shake",
    "Spent $2450 on utility bills",
    "Spent $8000 on monthly rent",
    "borrowed $200 from Nabeel",
    "split Thailand Trip $3000 with Camron"
  ];

  // Auto scroll ref
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chatMessages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add user message
    setChatMessages((prev) => [...prev, { sender: "user", text: textToSend, time: currentTime }]);
    setInputText("");
    setIsLoading(true);

    // Call callback for direct syncing if available
    if (onAddMessageDirect) {
      onAddMessageDirect({ sender: "user", text: textToSend, id: `u-${Date.now()}` });
    }

    try {
      // 2. Call backend
      const response = await fetch("/api/whatsapp-parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const resData = await response.json();

      if (resData.success || resData.data) {
        const parsed = resData.data;

        // 3. Update global dashboard statistics
        onAddTransaction({
          amount: parsed.amount,
          category: parsed.category === "Dining" ? "Food" : parsed.category, // map Dining -> Food to sync
          description: parsed.description,
        });

        // 4. Bot Reply
        const botReply = `⚡ Auto-Logged by Spliq AI!\n💰 Amount: $${parsed.amount.toFixed(2)}\n📂 Category: ${parsed.category}\n✏️ Description: ${parsed.description}\n🎯 Budget updated instantly!`;

        setChatMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: botReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            meta: parsed
          }
        ]);
        setRecentTransaction(parsed);

        // sync callback for assistant simulation
        if (onAddMessageDirect) {
          onAddMessageDirect({ 
            sender: "bot", 
            text: `Logged ${parsed.description} (${parsed.category}) valued at $${parsed.amount.toFixed(2)} to your Spliq ledgers.`, 
            id: `b-${Date.now()}` 
          });
        }
      }
    } catch (err: any) {
      console.error("Failed parsing message:", err);
      // Fallback response for offline sandbox
      const botFallback = `⚡ Spliq Sandbox logged expense: "${textToSend}" successfully! App synced.`;
      setChatMessages((prev) => [...prev, { sender: "bot", text: botFallback, time: currentTime }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="whatsapp-showcase" className="w-full grid lg:grid-cols-12 gap-8 items-center bg-[#0d0e1b] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
      
      {/* Glow backgrounds */}
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-brand-violet/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* WhatsApp Physical Device Simulator Frame (7 cols left) */}
      <div className="lg:col-span-7 flex flex-col items-center">
        
        {/* Physical outer smartphone container with camera notch & premium drop shadows */}
        <div className="w-full max-w-[380px] aspect-[9/19.5] bg-[#EFEAE2] border-[8px] border-slate-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col select-none ring-8 ring-slate-900/45 ring-offset-4 ring-offset-[#0d0e1b]">
          
          {/* Phone Top Notch / Speaker pill */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-center">
            <span className="w-2.5 h-2.5 bg-sky-950 rounded-full border border-sky-900 absolute left-4" />
            <span className="w-12 h-1 bg-slate-800 rounded-md" />
          </div>

          {/* Carrier Status Indicator line */}
          <div className="pt-8 px-5 pb-1 bg-[#075E54] text-white flex items-center justify-between text-[10px] font-semibold select-none">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex items-center gap-1">
              <span className="opacity-90">WhatsApp Online</span>
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Decorative subtle wallpaper pattern inside background (cream WhatsApp theme) */}
          <div className="absolute inset-0 opacity-8 bg-[radial-gradient(#395e4d_1px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

          {/* WhatsApp Branded Header: Title "Spliq" with Verified Badge */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between z-10 shadow-md">
            <div className="flex items-center gap-1.5 pt-1">
              <button type="button" className="text-white hover:opacity-80">
                <ChevronLeft className="w-4 h-4 -mx-1" />
              </button>
              
              {/* Split S logo with verified icon badge */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-emerald-400 flex items-center justify-center font-bold text-teal-400 font-mono text-xs shadow-md">
                  S
                </div>
                {/* Green Verified Circle Tick Checkmark matching screenshot integration */}
                <span className="absolute bottom-0 -right-0.5 bg-emerald-500 ring-1 ring-[#075E54] text-[6.5px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center text-white scale-90" title="Verified Spliq WhatsApp channel">
                  ✓
                </span>
              </div>

              <div className="flex flex-col text-left">
                <div className="font-bold text-xs tracking-wide flex items-center gap-0.5">
                  Spliq
                  <span className="w-3 h-3 bg-emerald-400 text-[#075E54] rounded-full text-[7.5px] font-sans flex items-center justify-center font-black relative" title="Verified Account">
                    ✓
                  </span>
                </div>
                <span className="text-[8px] text-teal-100 font-medium">Business Account</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white opacity-90 pt-1">
              <button type="button" className="hover:opacity-100"><Video className="w-4 h-4" /></button>
              <button type="button" className="hover:opacity-100"><Phone className="w-3.5 h-3.5" /></button>
              <button type="button" className="hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          {/* WhatsApp Subheading Status Warning */}
          <div className="bg-[#FFEEDB] border-b border-[#F5E0C3] text-[9px] text-[#5c4013] text-center py-1 px-3 font-normal tracking-wide z-10 leading-snug">
            🔒 Messages on this simulator log to Spliq dashboard below in real-time.
          </div>

          {/* WhatsApp Message Logs Container */}
          <div 
            ref={containerRef} 
            className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 relative z-10 scrollbar" 
            id="chat-messages-container"
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] flex flex-col gap-0.5 ${
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-3 py-1.5 text-[11px] leading-normal whitespace-pre-line shadow-sm relative ${
                    msg.sender === "user"
                      ? "bg-[#D9FDD3] text-[#111B21] rounded-tr-none border border-[#D5EFA2]/20"
                      : "bg-[#FFFFFF] text-[#111B21] rounded-tl-none border border-slate-250"
                  }`}
                >
                  {msg.text}
                  
                  <div className="flex justify-end items-center gap-1 mt-1 text-[8px] text-slate-400">
                    <span>{msg.time}</span>
                    {msg.sender === "user" && (
                      <span className="text-sky-500 font-extrabold text-[8px] leading-none">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="self-start flex items-center gap-1.5 bg-[#FFFFFF] border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] text-slate-500 shadow-sm animate-pulse">
                <RefreshCw className="w-2.5 h-2.5 animate-spin text-emerald-600" />
                Processing expense...
              </div>
            )}
          </div>

          {/* WhatsApp Bottom Send Action bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-[#F0F0F0] border-t border-slate-200 flex gap-2 items-center relative z-10 shrink-0 cursor-default"
          >
            <div className="flex-1 bg-white rounded-full flex items-center px-4 py-2 border border-slate-200 shadow-sm min-h-[42px]">
              <Smile className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer mr-2 shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none py-0.5"
                placeholder="Type expense..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                id="whatsapp-text-input"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-10 h-10 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center shadow-lg transition-colors duration-200 disabled:opacity-50 shrink-0"
              aria-label="Send WhatsApp message"
              id="whatsapp-send-btn"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>

          {/* Android bottom gesture bar */}
          <div className="bg-[#EFEAE2] h-4 flex items-center justify-center pb-1 z-15 relative shrink-0">
            <span className="w-24 h-1 bg-slate-400 rounded-full" />
          </div>

        </div>

        {/* Device subtitle label */}
        <div className="text-center mt-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="text-xs font-mono text-slate-400">
            Phone 1: WhatsApp Bot Channel
          </span>
        </div>

      </div>

      {/* Guided Side Controls Column (5 cols right) */}
      <div className="lg:col-span-5 flex flex-col gap-5 justify-center text-left">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold mb-3 border border-emerald-500/20">
            <Zap className="w-3 h-3 text-emerald-400" /> WhatsApp Integration
          </div>
          <h3 className="font-display font-semibold text-2xl text-white tracking-tight leading-snug">
            Simple Text Expense Capture
          </h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Spliq reads language parameters inside WhatsApp text messages synchronously to extract values. Select any pre-configured statement below to see it trigger instantly.
          </p>
        </div>

        {/* Click presets rows */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-slate-400">Click a message to transmit to WhatsApp:</span>
          <div className="flex flex-col gap-1.5 font-sans">
            {presetMessages.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(preset)}
                disabled={isLoading}
                className="text-left text-xs bg-[#111221] hover:bg-white/5 border border-white/5 hover:border-emerald-500/40 text-slate-300 rounded-xl p-2.5 transition-all duration-200 flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate pr-4">"{preset}"</span>
                <span className="p-1 rounded bg-white/5 hover:bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              </button>
            ))}
          </div>
        </div>

        {recentTransaction && (
          <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/10 p-4 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Landmark className="w-4 h-4 text-emerald-400" /> Ledger Synced
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-normal">
              Detected <strong className="text-white">${recentTransaction.amount.toFixed(2)}</strong> for <strong className="text-white">"{recentTransaction.description}"</strong> logged as <strong className="text-brand-lavender">{recentTransaction.category}</strong>.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
