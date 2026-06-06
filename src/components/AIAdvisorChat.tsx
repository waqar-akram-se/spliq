import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, RefreshCw, AlertCircle, HelpCircle, ArrowUpRight } from "lucide-react";

interface AIAdvisorChatProps {
  currentQuestion?: string;
  onQuestionHandled?: () => void;
}

export default function AIAdvisorChat({ currentQuestion, onQuestionHandled }: AIAdvisorChatProps) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "advisor"; text: string; id: string }>>([
    {
      id: "init-1",
      sender: "advisor",
      text: "Hello! I am your Spliq AI Financial Advisor. I look across your personal budgets, shared family accounts, group trips, and savings vaults to forecast healthy cash flow strategies.\n\nAsk me anything! For example: *'Can I afford a $150 dinner tonight?'* or *'How can I save $400 faster?'*",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "Can I afford a $150 dinner tonight?",
    "How can I hit my Summer Vacation savings goal 2 months faster?",
    "Where am I overspending this month?",
  ];

  // Auto scroll within internal container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isLoading]);

  // Handle external question triggers (e.g., from family sync button clicks)
  useEffect(() => {
    if (currentQuestion) {
      handleSendMessage(currentQuestion);
      if (onQuestionHandled) {
        onQuestionHandled();
      }
    }
  }, [currentQuestion]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: "user", text }]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          income: 8500,
          budget: 4200,
          totalSpent: 2650,
          goals: [
            { name: "Summer Vacation", target: 4000, current: 2400 },
            { name: "Emergency Buffer", target: 10000, current: 6500 }
          ]
        }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `adv-${Date.now()}`,
          sender: "advisor",
          text: data.advice || "I will look into that further. Could you refine your query?",
        }
      ]);
    } catch (err: any) {
      console.error("Advisor calling failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `adv-${Date.now()}`,
          sender: "advisor",
          text: "I was unable to synchronize with our real-time advisor server. Please check that process.env.GEMINI_API_KEY is configured correctly under Settings > Secrets. Sticking to household budgets is recommended in the meantime!",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-advisor" className="w-full grid lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Visual Header & presets (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-between py-2">
        <div className="flex flex-col gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-violet/10 text-brand-lavender text-[11px] font-semibold border border-brand-violet/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" /> Conversational Money Intelligence
            </div>
            <h3 className="font-display font-semibold text-2xl text-white tracking-tight leading-tight">
              A Personal AI CFO in Your Pocket
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Spliq leverages deep-learning models to analyze family income cash flows and group balances synchronously. It acts as an elite, customized advisor looking for optimization paths to reach savings goals days ahead of schedule.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-lavender" /> Click a prompt to consult AI:
            </span>
            <div className="flex flex-col gap-2">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="text-left text-xs bg-[#121323] hover:bg-white/5 border border-white/5 hover:border-brand-lavender/30 text-slate-300 rounded-xl p-3 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                >
                  <span>{q}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-teal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security / Compliance Badge */}
        <div className="bg-brand-night/40 border border-white/5 rounded-xl p-3 flex items-center gap-2.5 mt-4">
          <AlertCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
          <p className="text-[10px] text-slate-400 leading-normal">
            Your data is bank-grade encrypted. Spliq never shares personal account balances or family synced datasets with public model servers.
          </p>
        </div>
      </div>

      {/* Chat workspace UI (7 cols) */}
      <div className="lg:col-span-7 bg-[#121323] border border-white/5 rounded-2xl p-5 flex flex-col h-[480px] shadow-xl relative overflow-hidden">
        
        {/* Decorative background gradients */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-violet/5 rounded-full filter blur-3xl pointer-events-none" />

        {/* Banner with avatar */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-violet to-brand-lavender flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-brand-night" strokeWidth={2.5} />
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-2 border-[#121323] rounded-full" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-xs text-slate-200">Spliq AI Advisor</h4>
            <p className="text-[10px] text-slate-400">Available 24/7 • Gemini 3.5-Flash Core</p>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div ref={containerRef} className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 scrollbar">
          {messages.map((m) => {
            const isBot = m.sender === "advisor";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[85%] ${
                  isBot ? "self-start" : "self-end flex-row-reverse"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isBot 
                      ? "bg-brand-violet/10 text-brand-lavender border border-brand-violet/20" 
                      : "bg-[#18192a] text-brand-teal border border-brand-teal/20"
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble speech */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs h-auto whitespace-pre-wrap leading-relaxed ${
                      isBot
                        ? "bg-brand-night/40 border border-white/5 text-slate-200"
                        : "bg-brand-violet text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="self-start flex gap-3 max-w-[85%]">
              <div className="w-7 h-7 rounded-lg bg-brand-violet/10 text-brand-lavender border border-brand-violet/20 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-brand-night/40 border border-white/5 rounded-2xl px-4 py-2.5 text-xs text-brand-lavender flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-teal" />
                Advisor is calculating budgets...
              </div>
            </div>
          )}
        </div>

        {/* Chat input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="mt-2 flex gap-2 items-center"
        >
          <input
            type="text"
            className="flex-1 bg-brand-night border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-violet"
            placeholder="Type 'Will I reach my Vacation goal by August?'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            id="advisor-text-input"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-brand-violet hover:bg-brand-lavender text-white transition-all disabled:opacity-45 cursor-pointer"
            id="advisor-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
