import React, { useState } from "react";
import { 
  ArrowUpRight, Sparkles, Zap, Users, Landmark, PiggyBank, Scale, 
  MessageSquare, ChevronRight, CheckCircle2, ShieldAlert, Star, Play, Activity, X 
} from "lucide-react";

// Components imports
import Navbar from "./components/Navbar";
import WhatsAppSimulator from "./components/WhatsAppSimulator";
import DashboardPreview from "./components/DashboardPreview";
import GroupSplittingTab from "./components/GroupSplittingTab";
import AIAdvisorChat from "./components/AIAdvisorChat";
import ComparisonTable from "./components/ComparisonTable";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import SpliqMobileAppSimulator from "./components/SpliqMobileAppSimulator";

// Types
import { Transaction, SavingsGoal, FamilyMember, Testimonial } from "./types";

export default function App() {
  const [advisorQuestion, setAdvisorQuestion] = useState<string>("");

  // Global transactional simulation states linking WhatsApp chat to the live dashboard metrics!
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-initial-1",
      amount: 1120.00,
      category: "Family",
      description: "Shared Household mortgage payment",
      date: "June 01, 2026",
      loggedBy: "Elena (partner)"
    },
    {
      id: "tx-initial-2",
      amount: 245.50,
      category: "Groceries",
      description: "Whole Foods family supply",
      date: "June 02, 2026",
      loggedBy: "You"
    },
    {
      id: "tx-initial-3",
      amount: 120.00,
      category: "Utilities",
      description: "Gas & electricity monthly prepay",
      date: "June 02, 2026",
      loggedBy: "WhatsApp Bot"
    },
    {
      id: "tx-initial-4",
      amount: 95.00,
      category: "Dining",
      description: "Chipotle Friday dinner delivery",
      date: "May 28, 2026",
      loggedBy: "Elena (partner)"
    },
    {
      id: "tx-initial-5",
      amount: 15.49,
      category: "Entertainment",
      description: "Netflix premium account",
      date: "May 26, 2026",
      loggedBy: "You"
    }
  ]);

  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: "goal-1",
      name: "Emergency Buffer",
      target: 10000,
      current: 6500,
      category: "Emergency Fund",
      deadline: "Aug 2026"
    },
    {
      id: "goal-2",
      name: "Summer Vacation",
      target: 4000,
      current: 2400,
      category: "Vacation",
      deadline: "July 2026"
    },
    {
      id: "goal-3",
      name: "New Family SUV",
      target: 45000,
      current: 12000,
      category: "Car",
      deadline: "June 2027"
    },
    {
      id: "goal-4",
      name: "Home Downpayment",
      target: 120000,
      current: 85000,
      category: "Home",
      deadline: "Dec 2026"
    }
  ]);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      name: "Elena (partner)",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      role: "Domestic co-manager",
      spentThisMonth: 1215,
    },
    {
      name: "You",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      role: "Primary Account Owner",
      spentThisMonth: 1395,
    }
  ]);

  // Append new parsed WhatsApp data into live metrics!
  const handleAddLiveTransaction = (parsed: Omit<Transaction, "id" | "date" | "loggedBy">) => {
    const newTx: Transaction = {
      id: `wat-${Date.now()}`,
      amount: parsed.amount,
      category: parsed.category,
      description: parsed.description,
      date: "Just now",
      loggedBy: "WhatsApp Bot"
    };

    setTransactions(prev => [newTx, ...prev]);

    // Top up member spending list
    setFamilyMembers(prev => prev.map(m => {
      if (m.name === "You") {
        return { ...m, spentThisMonth: m.spentThisMonth + parsed.amount };
      }
      return m;
    }));

    // Trigger AI round-save auto micro tops for Vacation Vault!
    setGoals(prev => prev.map(g => {
      if (g.name === "Summer Vacation") {
        return { ...g, current: Math.min(g.target, g.current + 8) };
      }
      return g;
    }));
  };

  // Add Transaction via manual logging button on the ledger
  const handleAddManualTransaction = (cat: any, amt: number, label: string) => {
    handleAddLiveTransaction({
      amount: amt,
      category: cat,
      description: label
    });
  };

  // --- Interactive Screenshot Simulator States (Screenshot 1-8 Replica Setup) ---
  const [simulatorTransactions, setSimulatorTransactions] = useState<any[]>([
    {
      id: "sim-tx-1",
      amount: 200,
      category: "Food",
      description: "banana shake",
      date: "Jun 2, 2026",
      loggedBy: "You"
    },
    {
      id: "sim-tx-2",
      amount: 2450,
      category: "Utilities",
      description: "utility bills",
      date: "Jun 1, 2026",
      loggedBy: "You"
    },
    {
      id: "sim-tx-3",
      amount: 8000,
      category: "General",
      description: "monthly rent",
      date: "Jun 1, 2026",
      loggedBy: "You"
    },
    {
      id: "sim-tx-4",
      amount: 200,
      category: "General",
      description: "borrowed from Nabeel",
      date: "Jun 1, 2026",
      loggedBy: "You"
    }
  ]);

  const [simulatorSplitEvent, setSimulatorSplitEvent] = useState<any>({
    total: 3000,
    people: [
      { name: "Trump", paid: 3000, owed: 1000 },
      { name: "Camron Cates", paid: 0, owed: 1000 },
      { name: "Elena (partner)", paid: 0, owed: 1000 }
    ]
  });

  const [simulatorSplitExpenses, setSimulatorSplitExpenses] = useState<any[]>([
    {
      id: "sim-se-1",
      description: "Thailand Trip Accommodation",
      amount: 3000,
      paidBy: "Trump",
      date: "Jun 1, 2026"
    }
  ]);

  const [simulatorAdvisorMessages, setSimulatorAdvisorMessages] = useState<any[]>([]);
  const [simulatorIncome, setSimulatorIncome] = useState<number>(50000);

  const handleSyncWhatsAppToSimulator = (parsed: Omit<Transaction, "id" | "date" | "loggedBy">) => {
    // 1. Log globally
    handleAddLiveTransaction(parsed);

    // 2. Log within interactive phone mockup
    const categoryMapped = parsed.category === "Dining" ? "Food" : parsed.category;
    const newTx = {
      id: `sim-wt-${Date.now()}`,
      amount: parsed.amount,
      category: categoryMapped,
      description: parsed.description,
      date: "Jun 2, 2026",
      loggedBy: "You"
    };

    setSimulatorTransactions(prev => [newTx, ...prev]);

    // Check if user requests splitting
    const descLower = parsed.description.toLowerCase();
    if (descLower.includes("split") || descLower.includes("trip") || descLower.includes("thailand")) {
      setSimulatorSplitEvent(prev => {
        const newTotal = prev.total + parsed.amount;
        const totalPeople = prev.people.length;
        const splitShare = newTotal / totalPeople;
        const remapped = prev.people.map((p: any) => {
          if (p.name === "Trump") {
            return { ...p, paid: p.paid + parsed.amount, owed: splitShare };
          }
          return { ...p, owed: splitShare };
        });
        return {
          ...prev,
          total: newTotal,
          people: remapped
        };
      });

      setSimulatorSplitExpenses(prev => [{
        id: `sim-se-${Date.now()}`,
        description: parsed.description,
        amount: parsed.amount,
        paidBy: "Trump",
        date: "Jun 2, 2026"
      }, ...prev]);
    }
  };

  const handleAddSimulatorSplitExpense = (se: any) => {
    setSimulatorSplitExpenses(prev => [se, ...prev]);
    setSimulatorSplitEvent(prev => {
      const newTotal = prev.total + se.amount;
      const totalPeople = prev.people.length;
      const splitShare = newTotal / totalPeople;
      const remapped = prev.people.map((p: any) => {
        if (p.name === "Trump") {
          return { ...p, paid: p.paid + se.amount, owed: splitShare };
        }
        return { ...p, owed: splitShare };
      });
      return {
        ...prev,
        total: newTotal,
        people: remapped
      };
    });
  };

  const handleAddMessageDirect = (msg: any) => {
    setSimulatorAdvisorMessages(prev => [...prev, {
      id: msg.id || `adv-${Date.now()}`,
      sender: msg.sender === "bot" ? "advisor" : "user",
      text: msg.text
    }]);
  };

  const handleAddToSimulatorTransactions = (tx: any) => {
    setSimulatorTransactions(prev => [tx, ...prev]);
  };

  const handleRemoveFromSimulatorTransactions = (id: string) => {
    setSimulatorTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddToAdvisorMessages = (text: string) => {
    const userMsg = { id: `u-${Date.now()}`, sender: "user", text };
    setSimulatorAdvisorMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let adviceText = `💡 High Savings Alert! Based on PKR ${simulatorIncome} income, keeping daily overhead low will clear Rs 15,800/mo straight to goals!`;
      const query = text.toLowerCase();
      if (query.includes("how") || query.includes("split") || query.includes("fairly")) {
        adviceText = `💡 Coordinated splits are automated! Look at the 'Split Me' dashboard inside the phone simulator. You can customize participants and settled dues instantly.`;
      } else if (query.includes("car") || query.includes("iphone") || query.includes("reach")) {
        adviceText = `💡 car goal: At PKR 6,230/mo rate you will reach "car" in 38 months. Try upgrading micro contributions of monthly rent back into savings!`;
      }

      setSimulatorAdvisorMessages(prev => [...prev, {
        id: `adv-rep-${Date.now()}`,
        sender: "advisor",
        text: adviceText
      }]);
    }, 900);
  };

  // Auto-scrolling bridge when user triggers a question in Dashboard synced buttons
  const handleAskSyncQuestion = (q: string) => {
    setAdvisorQuestion(q);
    const el = document.getElementById("ai-advisor-node");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const featureCardsList = [
    {
      title: "WhatsApp Expense Logging",
      description: "Eradicate dashboard manual input friction entirely. Message Spliq like checking a friend, and let are server parsing index handle categories dynamically.",
      whatsappMessage: '"Spent $25 on groceries"',
      icon: <MessageSquare className="w-5 h-5 text-brand-teal" />,
      accentColor: "border-brand-teal/20"
    },
    {
      title: "Monthly Budget Envelopes",
      description: "Formulate set income paths, configure envelope category limitations, receive instant alerts ahead of overdraft risks, and optimize savings.",
      whatsappMessage: '"Spent $15 for dinner"',
      icon: <PiggyBank className="w-5 h-5 text-brand-lavender" />,
      accentColor: "border-brand-lavender/20"
    },
    {
      title: "Family Expense Syncing",
      description: "Integrate shared family budget pools seamlessly without sharing passwords. Both members log individually, updating visual metrics in real-time.",
      whatsappMessage: '"Elena logged $45 Groceries"',
      icon: <Users className="w-5 h-5 text-rose-400" />,
      accentColor: "border-rose-500/20"
    },
    {
      title: "Group Expense Splitting",
      description: "Manage splits for roommate bills, shared vacations, weddings, or events. Recalculate nett debt balances and pay back instantly inspired by Splitwise.",
      whatsappMessage: '"split cabin $600 with Jordan"',
      icon: <Scale className="w-5 h-5 text-brand-amber" />,
      accentColor: "border-brand-amber/20"
    },
    {
      title: "Target Vault Goals",
      description: "Create designated vaults for Emergency Buffers, Trip Vacations, or Vehicles. Watch cash surpluses head straight to secure goals automatically.",
      whatsappMessage: '"Summer Vacation Vault updated"',
      icon: <Landmark className="w-5 h-5 text-emerald-400" />,
      accentColor: "border-emerald-500/20"
    },
    {
      title: "AI Financial Advisor",
      description: "Consult personal money advice with context-aware generative insights. Identify specific micro trimming chances to book flights weeks early.",
      whatsappMessage: '"dining represents 18% of budget"',
      icon: <Sparkles className="w-5 h-5 text-pink-400" />,
      accentColor: "border-pink-500/20"
    }
  ];

  const testimonialsList: Testimonial[] = [
    {
      name: "Marcus Vance",
      role: "Director of Product",
      company: "Mercury Tech",
      rating: 5,
      quote: "WhatsApp expense logging is a revelation. I shoot a message when paying at the register, and our family master budget updates before I grab the change. No apps, no logins, total magic.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      tag: "WhatsApp Logging"
    },
    {
      name: "Sarah Jenkins",
      role: "Lead Brand Designer",
      company: "Linear Studio",
      rating: 5,
      quote: "Before Spliq, coordinated family planning always triggered excel file clashes. Now, we both maintain transparent household visibility via unified synched limits in modern dark aesthetics.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
      tag: "Family Budgeting"
    },
    {
      name: "David Chen",
      role: "Co-Founder",
      company: "Loom App",
      rating: 5,
      quote: "The personalized Gemini advisor pointed out we spent 18% above average on fast dining this month. Trimming that as advised allowed us to fund our Vacation vault 2 months early. Phenomenal guidance.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      tag: "AI Advisor"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white flex flex-col selection:bg-brand-violet/30 selection:text-white" id="hero">
      
      {/* Translucent premium Navigation bar */}
      <Navbar />

      {/* Decorative ambient glowing grids behind hero content */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-full max-w-7xl h-[620px] pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-1/4 w-[380px] h-[380px] bg-brand-violet/15 rounded-full filter blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[380px] h-[380px] bg-brand-teal/10 rounded-full filter blur-[120px]" />
      </div>

      {/* Subtle Background Textures */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-[#6C5CE7] to-transparent"></div>
        <div className="absolute top-1/2 right-40 w-px h-96 bg-gradient-to-b from-transparent via-[#00CEC9] to-transparent"></div>
      </div>

      <main className="flex-1 flex flex-col gap-24 pt-28 md:pt-36">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative" id="hero-core">
          
          {/* Hero Left col: High impact copy (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center gap-6 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 text-[#A29BFE] text-xs font-semibold uppercase tracking-wider w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#6C5CE7] animate-pulse"></span>
              Next-Gen Personal Finance
            </div>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
              Take Control of <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-[#6C5CE7] via-[#00CEC9] to-[#FDCB6E] bg-clip-text text-transparent underline decoration-[#6C5CE7]/30 decoration-8 underline-offset-8">Every Dollar</span>
            </h1>
            
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-lg">
              Manage personal, family, and group expenses effortlessly. Integrated with WhatsApp and powered by intelligent AI financial insights.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2">
              <a 
                href="#whatsapp-sandbox"
                className="bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white px-8 py-4 rounded-xl text-sm font-bold shadow-2xl shadow-[#6C5CE7]/30 hover:scale-[1.02] flex items-center gap-2 tracking-wide transition-all duration-300 cursor-pointer"
              >
                Start Free Now <ArrowUpRight className="w-4 h-4" />
              </a>

              <a 
                href="#dashboard"
                className="flex items-center gap-3 px-8 py-4 rounded-xl border border-white/10 bg-white/5 font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                Watch Demo
              </a>
            </div>

            {/* Backed trust icons */}
            <div className="mt-6 border-t border-white/5 pt-5 flex flex-col gap-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Trusted by product leads at:</span>
              <div className="flex flex-wrap gap-5 text-sm font-semibold tracking-wider text-slate-400/70 font-display">
                <span>Ramp Bank</span>
                <span>Mercury</span>
                <span>Linear</span>
                <span>Loom</span>
              </div>
            </div>
          </div>

          {/* Hero Right col: Dashboard Mockup Preview (7 cols) */}
          <div className="lg:col-span-7 relative w-full h-auto">
            <div className="w-full h-auto bg-[#111222]/70 rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-violet/10 rounded-full filter blur-[90px] pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-brand-amber" />
                  <span className="w-3 h-3 rounded-full bg-brand-teal" />
                  <span className="text-[10px] text-slate-500 font-mono ml-2">secure-spliq-dashboard-v2.finance</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[9px] font-mono">
                  ● LIVE ENVIRONMENT
                </div>
              </div>

              {/* Simplified mini metric showcase for immediate high visual impact */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-brand-night p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono">ACCOUNT BALANCE</span>
                    <p className="text-sm font-bold mt-1 text-slate-100">$8,500.00</p>
                  </div>
                  <div className="bg-brand-night p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono">SAFE MONTHLY LIMIT</span>
                    <p className="text-sm font-bold mt-1 text-slate-150 text-brand-teal">$4,200.00</p>
                  </div>
                  <div className="bg-brand-night p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-500 font-mono">TOTAL RECORDED OUT</span>
                    <p className="text-xs font-bold mt-1.5 text-gradient-primary">
                      ${transactions.reduce((acc, c) => acc + c.amount, 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Floating analytics insight mockup */}
                <div className="bg-[#191a2f] rounded-xl border border-brand-violet/20 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center">
                      <Sparkles className="w-4.5 h-4.5 text-brand-lavender animate-pulse" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-white">Spliq AI Recommendation</h5>
                      <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">Trimming fast delivery by $100 transfers funds straight to Summer Vacation goal!</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAskSyncQuestion("Can you construct a customized dynamic savings plan for our Summer Vacation goal?")}
                    className="p-1 px-2.5 rounded bg-brand-violet text-white text-[10px] font-semibold hover:bg-brand-lavender cursor-pointer flex-shrink-0 transition-colors"
                  >
                    View advice
                  </button>
                </div>
              </div>
            </div>
            
            {/* Ambient visual badge decoration */}
            <div className="absolute -bottom-5 -right-5 bg-[#0e0f1d] border border-white/10 rounded-xl p-3 shadow-xl backdrop-blur flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[11px] text-slate-100 font-medium">Synced with Elena 8 seconds ago</span>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WHATSAPP & MOBILE APP SANDBOX */}
        <section className="bg-[#0b0c15] py-16" id="whatsapp-sandbox">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
            
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2 pb-4">
              <span className="text-xs font-mono text-brand-teal uppercase tracking-widest font-bold">1. Try the core integration</span>
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-white tracking-tight leading-tight uppercase sm:normal-case">
                Interactive Multi-Screen Simulator
              </h2>
              <p className="text-sm text-slate-400">
                Log variable expenses in our verified WhatsApp profile on the left. The metrics, split events, and advisors synchronize inside our 6-tab simulated phone app on the right.
              </p>
            </div>

            {/* SIDE BY SIDE LAYOUT CHROME */}
            <div className="grid xl:grid-cols-12 gap-10 items-start">
              
              {/* LEFT HAND SIDE: WHATSAPP BOT CHAT SCREEN */}
              <div className="xl:col-span-12 flex flex-col gap-4">
                <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold w-fit">
                  💬 STEP 1: MESSAGE THE BOT
                </div>
                <WhatsAppSimulator 
                  onAddTransaction={handleSyncWhatsAppToSimulator} 
                  onAddMessageDirect={handleAddMessageDirect}
                />
              </div>

              {/* RIGHT HAND SIDE: MOBILE CLIENT APP SIMULATION */}
              <div className="xl:col-span-12 flex flex-col gap-4 mt-8">
                <div className="px-5 py-3 rounded-2xl bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 text-[#A29BFE] text-xs font-semibold w-fit">
                  📱 STEP 2: TAP PHONE TABS & VERIFY LEDGERS (SCREEN REPLICAS)
                </div>
                <SpliqMobileAppSimulator
                  appTransactions={simulatorTransactions}
                  onAddTxFromApp={handleAddToSimulatorTransactions}
                  onRemoveTxFromApp={handleRemoveFromSimulatorTransactions}
                  appSplitEvent={simulatorSplitEvent}
                  onUpdateSplitEvent={setSimulatorSplitEvent}
                  advisorMessages={simulatorAdvisorMessages}
                  onAddAdvisorMessage={handleAddToAdvisorMessages}
                  appIncome={simulatorIncome}
                  appSplitExpenses={simulatorSplitExpenses}
                  onAddSplitExpense={handleAddSimulatorSplitExpense}
                />
              </div>

            </div>

          </div>
        </section>

        {/* HIGH FIDELITY LIVE DASHBOARD PREVIEW */}
        <section className="max-w-7xl mx-auto px-6 flex flex-col gap-8" id="dashboard">
          <div className="text-left">
            <span className="text-xs font-mono text-brand-lavender uppercase tracking-widest font-bold">2. Master Financial Console</span>
            <h2 className="font-display font-semibold text-3xl text-white mt-1.5 tracking-tight uppercase sm:normal-case">
              Your Dynamic Spending & Budget Envelopes
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              All categories log directly below. Check out your cash flow trends, sync status, active savings locks, and transactions board.
            </p>
          </div>

          <DashboardPreview 
            transactions={transactions} 
            goals={goals} 
            familyMembers={familyMembers}
            onAddTransaction={handleAddManualTransaction}
            onAskAdvisor={handleAskSyncQuestion}
          />
        </section>

        {/* CORE FEATURES GRID SECTION (6 STUNNING CARDS) */}
        <section className="bg-[#0b0c15] py-16" id="features">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
              <span className="text-xs font-mono text-brand-teal uppercase tracking-widest font-bold">Comprehensive Suite</span>
              <h2 className="font-display font-bold text-3xl text-white tracking-tight uppercase sm:normal-case">
                Everything required to master family revenue
              </h2>
              <p className="text-xs text-slate-400">
                Designed to consolidate personal accounts, domestics synchronizations, and trip splitting curves into a cohesive visual ledger.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" id="features-grid">
              {featureCardsList.map((card, i) => (
                <div 
                  key={i}
                  className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-[#6C5CE7]/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between cursor-default shadow-xl"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6C5CE7]/20 flex items-center justify-center text-[#6C5CE7] group-hover:scale-105 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>WHATSAPP SUPPORT</span>
                    <span className="text-brand-lavender font-semibold font-mono tracking-wide">{card.whatsappMessage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GROUP EXPENSE SPLITTING SECTION (SPLITWISE SANDBOX) */}
        <section className="max-w-7xl mx-auto px-6 flex flex-col gap-8" id="group">
          <div>
            <span className="text-xs font-mono text-brand-lavender uppercase tracking-widest font-bold">Group Vaults Splits</span>
            <h2 className="font-display font-semibold text-3xl text-white mt-1.5 tracking-tight uppercase sm:normal-case">
              Group Expenses & Settle Boards
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
              Rent roommates bills, trip cars, wedding caterers without spreadsheet hassles. Simply split bills equally or customized percentages.
            </p>
          </div>

          <GroupSplittingTab />
        </section>

        {/* AI FINANCIAL ADVISOR EXPANDED (REAL GEMINI INTERFACE) */}
        <section className="bg-[#0b0c15] py-16" id="advisor">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-8" id="ai-advisor-node">
            <AIAdvisorChat 
              currentQuestion={advisorQuestion} 
              onQuestionHandled={() => setAdvisorQuestion("")} 
            />
          </div>
        </section>

        {/* WHY SPLIQ SECTION (COMPARISON COMPONENT) */}
        <section className="max-w-7xl mx-auto px-6">
          <ComparisonTable />
        </section>

        {/* TESTIMONIALS CARDS (3 PREMIUM TIERS WITH RATINGS) */}
        <section className="bg-[#0b0c15] py-16" id="testimonials">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-10">
            <div className="text-center max-w-lg mx-auto flex flex-col gap-2">
              <span className="text-xs font-mono text-brand-teal uppercase tracking-widest font-bold font-semibold">User Endorsements</span>
              <h2 className="font-display font-bold text-3xl text-white tracking-tight uppercase sm:normal-case">
                What modern families are saying
              </h2>
              <p className="text-xs text-slate-400">Read reviews from engineers, leads and designers planning financial milestones on our infrastructure.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6" id="testimonials-grid">
              {testimonialsList.map((t, i) => (
                <div 
                  key={i} 
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-[#6C5CE7]/30 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex flex-col gap-4">
                    {/* Stars ranking */}
                    <div className="flex items-center gap-1 text-[#00CEC9]">
                      {[...Array(t.rating)].map((_, starsIdx) => (
                        <Star key={starsIdx} className="w-3.5 h-3.5 fill-[#00CEC9] text-[#00CEC9]" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-300 italic leading-relaxed">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-white/5">
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="w-10 h-10 rounded-full border border-[#6C5CE7]/25"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-display font-semibold text-xs text-slate-200">{t.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {t.role} • <strong className="text-brand-lavender font-semibold">{t.company}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING PLANS COMPONENT */}
        <section className="max-w-5xl mx-auto px-6" id="pricing">
          <div className="text-center flex flex-col gap-2 mb-10">
            <span className="text-xs font-mono text-brand-lavender uppercase tracking-widest font-bold">Uncomplicated pricing plans</span>
            <h2 className="font-display font-semibold text-3xl text-white tracking-tight">Zero risk. Start tracking today.</h2>
            <p className="text-xs text-slate-400">Choose the perfect tier matching your monthly household objectives.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 relative" id="pricing-tiers-cards">
            {/* Standard Tier */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-[#6C5CE7]/30 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-slate-400 tracking-wider">INDIVIDUAL LEDGER</span>
                <h3 className="font-display font-bold text-2xl text-slate-100">Spliq Basic</h3>
                <p className="text-xs text-slate-400 leading-normal">Optimized for single users intending to capture spending streams with WhatsApp easily.</p>
                
                <div className="font-display font-bold text-4xl text-white mt-1">
                  $0<span className="text-sm font-normal text-slate-500"> / month</span>
                </div>

                <ul className="flex flex-col gap-2.5 mt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> 50 WhatsApp logs / month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> Dynamic budget categories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> Standard savings vault goals
                  </li>
                  <li className="flex items-center gap-2 text-slate-500 line-through">
                    <X className="w-4 h-4 text-rose-500/40" /> Family Shared Budgets syncing
                  </li>
                </ul>
              </div>

              <a 
                href="#whatsapp-sandbox" 
                className="w-full text-center py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-xs mt-8 cursor-pointer hover:bg-white/10 transition-colors"
                id="basic-start-btn"
              >
                Get Started Free
              </a>
            </div>

            {/* Premium Synchronized tier */}
            <div className="p-8 rounded-2xl bg-white/[0.03] border border-[#6C5CE7] hover:border-[#A29BFE] transition-all duration-300 flex flex-col justify-between shadow-2xl shadow-[#6C5CE7]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1 px-4.5 bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] text-[#0a0b14] font-display font-extrabold text-[10px] tracking-wider uppercase rounded-bl-xl shadow-sm">
                Most Popular
              </div>
              
              <div className="flex flex-col gap-4">
                <span className="text-xs font-mono text-[#A29BFE] tracking-wider">ALL-IN-ONE AUTOMATED VAULT</span>
                <h3 className="font-display font-bold text-2xl text-slate-100">Spliq Pro Synced</h3>
                <p className="text-xs text-slate-400 leading-normal">Designed for partners, roommates and families seeking unified budgets synced synchronously.</p>
                
                <div className="font-display font-bold text-4xl text-gradient-primary mt-1">
                  $8<span className="text-sm font-normal text-slate-500"> / month billed annually</span>
                </div>

                <ul className="flex flex-col gap-2.5 mt-4 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9] animate-pulse" /> <strong>Unlimited</strong> real-time WhatsApp logs
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> Conversational AI Finance Advisor
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> Coordinated Family synchronizations (sync 2 accounts)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> Group cabins splitwise settlements trackers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00CEC9]" /> High interest goal envelopes
                  </li>
                </ul>
              </div>

              <a 
                href="#final-cta" 
                className="w-full text-center py-3.5 rounded-xl bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white font-bold text-xs mt-8 cursor-pointer transition-all shadow-lg shadow-[#6C5CE7]/20 hover:scale-[1.01]"
                id="pro-start-btn"
              >
                Unlock Pro Synced Free
              </a>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="px-6" id="faq">
          <FAQ />
        </section>

        {/* FINAL CONVERSION SECTION CALL-TO-ACTION */}
        <section className="max-w-5xl mx-auto px-6 w-full mb-10" id="final-cta">
          <div className="bg-gradient-to-r from-[#17162f] to-[#121323] border border-brand-violet/30 rounded-3xl p-8 md:p-14 text-center flex flex-col gap-6 relative overflow-hidden">
            
            {/* Background glowing decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[220px] bg-brand-violet/15 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="max-w-2xl mx-auto flex flex-col gap-3 z-10">
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-white tracking-tight uppercase sm:normal-case">
                Start Managing Money Smarter
              </h2>
              <p className="text-xs md:text-sm text-slate-300">
                Join thousands of designers and product managers using Spliq to automate expense logging, streamline family savings, and settle roommate splits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 z-10">
              <a 
                href="#whatsapp-sandbox" 
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-lavender text-white font-semibold text-xs transform hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-brand-violet/20 w-full sm:w-auto cursor-pointer"
              >
                Log an Expense on WhatsApp
              </a>

              <a 
                href="#advisor" 
                className="px-6 py-3 rounded-xl bg-brand-night hover:bg-white/5 border border-white/5 text-slate-300 font-semibold text-xs w-full sm:w-auto cursor-pointer transition-colors"
              >
                Ask live AI Advisor
              </a>
            </div>

            <p className="text-[10px] text-slate-500 font-mono z-10">
              ⚡ Safe testing: no credit card input required • Cancel anytime easily.
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER SECTION */}
      <Footer />

    </div>
  );
}
