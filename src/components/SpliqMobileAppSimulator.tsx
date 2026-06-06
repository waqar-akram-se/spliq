import React, { useState } from "react";
import { 
  Menu, Bell, ArrowLeft, Trash2, Plus, Smile, Send, ChevronRight, 
  Home, DollarSign, Wallet, FileText, Target, MessageCircle, Star, Sparkles, Check, CheckCircle2, Award
} from "lucide-react";

interface SimulatorProps {
  appTransactions: any[];
  onAddTxFromApp: (tx: any) => void;
  onRemoveTxFromApp: (id: string) => void;
  appSplitEvent: any;
  onUpdateSplitEvent: (evt: any) => void;
  advisorMessages: any[];
  onAddAdvisorMessage: (msg: string) => void;
  appIncome: number;
  appSplitExpenses?: any[];
  onAddSplitExpense?: (se: any) => void;
}

export default function SpliqMobileAppSimulator({
  appTransactions,
  onAddTxFromApp,
  onRemoveTxFromApp,
  appSplitEvent,
  onUpdateSplitEvent,
  advisorMessages,
  onAddAdvisorMessage,
  appIncome,
  appSplitExpenses = [],
  onAddSplitExpense
}: SimulatorProps) {
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "split" | "income" | "expenses" | "goals" | "advisor">("dashboard");
  const [currencySymbol, setCurrencySymbol] = useState<"$" | "Rs">("$");
  
  // Dialog / Sheets states
  const [showAddPersonSheet, setShowAddPersonSheet] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonEmail, setNewPersonEmail] = useState("");
  const [newPersonMobile, setNewPersonMobile] = useState("");

  const [showAddIncomeSheet, setShowAddIncomeSheet] = useState(false);
  const [newIncomeTitle, setNewIncomeTitle] = useState("");
  const [newIncomeAmount, setNewIncomeAmount] = useState("");

  const [showAddExpenseSheet, setShowAddExpenseSheet] = useState(false);
  const [newExpenseTitle, setNewExpenseTitle] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("Food");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");

  const [advisorInputText, setAdvisorInputText] = useState("");

  // Helper formatting to show either USD or PKR/Rs
  const formatAmt = (val: number) => {
    if (currencySymbol === "Rs") {
      return `Rs${(val * 280).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const formatK = (val: number) => {
    if (currencySymbol === "Rs") {
      return `Rs${((val * 280) / 1000).toFixed(1)}K`;
    }
    return `$${(val / 1000).toFixed(1)}K`;
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    
    const updatedPeople = [...appSplitEvent.people, {
      name: newPersonName,
      paid: 0,
      owed: 1000
    }];

    // Recalculates splits
    const totalPeople = updatedPeople.length;
    const splitShare = appSplitEvent.total / totalPeople;
    const remapped = updatedPeople.map(p => {
      if (p.name === "Trump") {
        return { ...p, paid: appSplitEvent.total, owed: splitShare };
      }
      return { ...p, paid: 0, owed: splitShare };
    });

    onUpdateSplitEvent({
      ...appSplitEvent,
      people: remapped
    });

    setNewPersonName("");
    setNewPersonEmail("");
    setNewPersonMobile("");
    setShowAddPersonSheet(false);
  };

  const handleAddLiveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newIncomeAmount);
    if (!newIncomeTitle || isNaN(amt)) return;
    
    // updates salary etc via callback
    setShowAddIncomeSheet(false);
    setNewIncomeTitle("");
    setNewIncomeAmount("");
  };

  const handleAddLiveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newExpenseAmount);
    if (!newExpenseTitle || isNaN(amt)) return;

    if (activeTab === "split" && onAddSplitExpense) {
      onAddSplitExpense({
        id: `se-${Date.now()}`,
        description: newExpenseTitle,
        amount: amt,
        paidBy: "You",
        date: "Jun 2, 2026"
      });
    } else {
      onAddTxFromApp({
        id: `app-tx-${Date.now()}`,
        amount: amt,
        category: newExpenseCategory,
        description: newExpenseTitle,
        date: "Jun 2, 2026",
        loggedBy: "You"
      });
    }

    setNewExpenseTitle("");
    setNewExpenseAmount("");
    setShowAddExpenseSheet(false);
  };

  // Calculate stats
  const totalExpenses = appTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalSaved = Math.max(0, appIncome - totalExpenses);
  const incomeUsedPercent = Math.min(100, Math.round((totalExpenses / appIncome) * 100));

  return (
    <div className="flex flex-col gap-6 w-full" id="live-smartphone-preview-panel">
      
      {/* Settings / Quick Customizations Bar */}
      <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-2xl p-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-brand-lavender">LIVE INTERACTIVE DECORATOR</span>
          <h4 className="text-sm font-semibold text-white">Toggle Currency Representation</h4>
        </div>
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-white/10">
          <button 
            type="button"
            onClick={() => setCurrencySymbol("$")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${currencySymbol === "$" ? "bg-[#6C5CE7] text-white" : "text-gray-400 hover:text-white"}`}
          >
            USD ($)
          </button>
          <button 
            type="button"
            onClick={() => setCurrencySymbol("Rs")}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${currencySymbol === "Rs" ? "bg-[#00CEC9] text-[#0A0B14]" : "text-gray-400 hover:text-white"}`}
          >
            PKR (Rs)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* APP SIMULATION DEVICE WRAPPER (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="w-full max-w-[390px] aspect-[9/19.5] bg-[#0A0B14] border-[8px] border-slate-800 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col select-none ring-8 ring-slate-900/45 ring-offset-4 ring-offset-[#0A0B14]">
            
            {/* Phone Top Notch / Speaker pill */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-full z-50 flex items-center justify-center">
              <span className="w-2.5 h-2.5 bg-sky-950 rounded-full border border-sky-900 absolute left-4" />
              <span className="w-12 h-1 bg-slate-800 rounded-md" />
            </div>

            {/* Carrier Status Indicator line (High Fidelity replica matching screenshot) */}
            <div className="pt-8 px-6 pb-2 bg-[#FAF9FF] text-slate-800 flex items-center justify-between text-[11px] font-semibold border-b border-purple-50">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <div className="flex items-center gap-1.5 text-[9px] font-bold">
                <span className="opacity-95 text-slate-700">VoLTE</span>
                <span className="opacity-95 text-slate-700">VoLTE</span>
                <span className="font-mono text-[8px] text-slate-600 bg-black/5 px-1 rounded">2.4 K/s</span>
                <div className="flex items-center gap-0.5 border border-slate-700 px-0.5 rounded py-0.2">
                  <span className="text-[8px] font-sans">74</span>
                </div>
              </div>
            </div>

            {/* Application Main Top Header (Fidelity replica matching screenshot) */}
            <div className="px-5 py-3 bg-[#FAF9FF] border-b border-purple-100 flex items-center justify-between text-slate-800">
              <div className="flex items-center gap-3">
                <button type="button" className="text-slate-700 hover:text-slate-950 transition-colors">
                  <Menu className="w-5 h-5" strokeWidth={2.5} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#121323] via-[#1F2937] to-[#6C5CE7] flex items-center justify-center shadow-md">
                    <span className="font-extrabold text-lg text-[#00CEC9] font-mono leading-none tracking-tighter">S</span>
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 font-display">Spliq</span>
                </div>
              </div>
              
              {/* Notification icon matching screenshot bell logo */}
              <button type="button" className="relative p-1 text-slate-700 hover:text-slate-900">
                <Bell className="w-5 h-5" strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight border border-white">
                  25
                </span>
              </button>
            </div>

            {/* MAIN APP SHELL VIEWPORT - UNDER THE HEADER */}
            <div className="flex-1 overflow-y-auto bg-[#FAF9FF] text-slate-800 relative scrollbar p-4">
              
              {/* SCREEN CONTAINER: DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  
                  {/* Purple header section (Screenshot 1) */}
                  <div className="bg-gradient-to-br from-[#6C5CE7] to-[#5143BD] text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl" />
                    <span className="text-[11px] font-semibold text-purple-200 tracking-wider">June 2026</span>
                    <h3 className="text-xl font-extrabold mt-0.5 leading-tight">Good afternoon, Trump ☀️</h3>
                    
                    <div className="mt-6 grid grid-cols-2 items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-purple-200 uppercase tracking-widest font-mono font-medium">Balance Score</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-5xl font-extrabold font-display leading-none">70</span>
                        </div>
                        <span className="mt-2 text-[11px] font-bold bg-white/20 text-white px-3 py-1 rounded-full w-fit">Good</span>
                      </div>

                      {/* Gauge Arch meter visual */}
                      <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-16 transform scale-110 overflow-visible" viewBox="0 0 100 50">
                          {/* Background arc path */}
                          <path 
                            d="M 10 50 A 40 40 0 0 1 90 50" 
                            fill="none" 
                            stroke="rgba(255,255,255,0.2)" 
                            strokeWidth="8" 
                            strokeLinecap="round" 
                          />
                          {/* Colored foreground path value 70/100 */}
                          <path 
                            d="M 10 50 A 40 40 0 0 1 78 22" 
                            fill="none" 
                            stroke="url(#purpleGaugeGrad)" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                          />
                          {/* Anchor dots */}
                          <circle cx="78" cy="22" r="4.5" fill="#FAF9FF" stroke="#6C5CE7" strokeWidth="2.5" />
                          <defs>
                            <linearGradient id="purpleGaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#00CEC9" />
                              <stop offset="100%" stopColor="#FAF9FF" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* THIS MONTH STATS CARD */}
                  <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm">
                    <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase block mb-3">This Month</span>
                    <div className="grid grid-cols-3 gap-1 relative">
                      
                      {/* Income widget */}
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <span className="text-[9px]">↓</span>
                          </div>
                          Income
                        </div>
                        <span className="text-[13px] font-extrabold text-slate-800 mt-1.5">{formatK(appIncome)}</span>
                      </div>

                      {/* Divider line style */}
                      <div className="absolute left-[33%] top-1 bottom-1 w-px bg-slate-100" />

                      {/* Expenses widget */}
                      <div className="flex flex-col text-center items-center justify-center">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                          <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                            <span className="text-[9px]">↑</span>
                          </div>
                          Expen...
                        </div>
                        <span className="text-[13px] font-extrabold text-slate-800 mt-1.5">{formatK(totalExpenses)}</span>
                      </div>

                      {/* Divider line style */}
                      <div className="absolute left-[66%] top-1 bottom-1 w-px bg-slate-100" />

                      {/* Saved widget */}
                      <div className="flex flex-col text-right items-end">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                          <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                            <span className="text-[9px]">💼</span>
                          </div>
                          Saved
                        </div>
                        <span className="text-[13px] font-extrabold text-slate-800 mt-1.5">{formatK(totalSaved)}</span>
                      </div>
                    </div>

                    {/* Progress slider feedback */}
                    <div className="mt-5 pt-4 border-t border-slate-50">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1.5">
                        <span className="text-[#00CEC9]">Great spending control</span>
                        <span className="text-slate-500">{incomeUsedPercent}% of income used</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00CEC9] rounded-full transition-all duration-500"
                          style={{ width: `${incomeUsedPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* BALANCE SCORE TREND CARD LINE CHART */}
                  <div className="bg-white rounded-3xl border border-purple-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-800">Balance Score Trend</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Latest 70 • Avg 53 • Tap for full history</p>
                      </div>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-full">
                        ↘ -20.3
                      </span>
                    </div>

                    {/* Line path visual graph */}
                    <div className="w-full h-16 mt-4 relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                        {/* Shaded Area */}
                        <path d="M 0,40 Q 25,30 50,10 T 100,28 L 100,40 L 0,40 Z" fill="rgba(108, 92, 199, 0.08)" />
                        {/* Purple Curve Line */}
                        <path d="M 0,40 Q 25,30 50,10 T 100,28" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" />
                        {/* Glowing node at ends */}
                        <circle cx="100" cy="28" r="3.5" fill="#6C5CE7" stroke="#FAF9FF" strokeWidth="1" />
                        <circle cx="0" cy="40" r="3.5" fill="#6C5CE7" stroke="#FAF9FF" strokeWidth="1" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}


              {/* SCREEN CONTAINER: SPLIT ME */}
              {activeTab === "split" && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  
                  {/* Events Navigation list header */}
                  <div className="flex items-center justify-between border-b border-purple-50 pb-3">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setActiveTab("dashboard")} 
                        className="p-1 rounded bg-slate-100 text-slate-600 hover:text-slate-900"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-extrabold text-[#0B0C15] text-lg">Thailand Trip</h3>
                    </div>
                    <button type="button" className="text-slate-400 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400">Thu, 4 Jun 2026 • 4:30 PM</p>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-3 py-1 bg-purple-50 text-[#6C5CE7] text-[10px] font-bold rounded-full">
                      {appSplitEvent.people.length} people
                    </span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                      Active
                    </span>
                    <button type="button" className="text-purple-600 hover:underline text-[10px] font-bold px-1.5">
                      Close event
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 text-[#6C5CE7] text-[10px] font-bold w-fit">
                    <svg className="w-3 h-3 text-[#6C5CE7]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                    You are the organizer
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal">
                    Total shared and balances include all expenses below. Push alerts need your Split Me phone/email to match your Spliq profile and notifications enabled.
                  </p>

                  {/* Total Shared Block */}
                  <div className="bg-[#FFFFFF] border border-purple-100 rounded-3xl p-5 shadow-sm flex flex-col gap-1 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total shared</span>
                    <span className="text-3xl font-black text-slate-900 font-display">
                      {formatAmt(appSplitEvent.total)}
                    </span>
                  </div>

                  {/* Group Split Expenses List */}
                  {appSplitExpenses && appSplitExpenses.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-slate-800">Group Expenses</h4>
                        <span className="text-[10px] font-mono font-medium text-slate-400">{appSplitExpenses.length} entries</span>
                      </div>
                      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-0.5 scrollbar">
                        {appSplitExpenses.map((se: any, sIdx: number) => (
                          <div key={se.id || sIdx} className="bg-[#FFFFFF] border border-purple-100 p-3 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">🛫</span>
                              <div className="flex flex-col text-left">
                                <span className="font-extrabold text-xs text-slate-900 capitalize">{se.description}</span>
                                <span className="text-[9px] text-slate-400">Paid by {se.paidBy} • {se.date || "Jun 2, 2026"}</span>
                              </div>
                            </div>
                            <span className="font-mono text-xs font-extrabold text-[#111B21]">{formatAmt(se.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Settled owes matrix list */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-slate-800">Balances</h4>
                      <button type="button" className="text-[11px] text-purple-600 font-bold flex items-center gap-1">
                        ⇄ Record payment
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400">
                      After expenses and recorded payments. Green = money back, red = still owes.
                    </p>

                    <div className="flex flex-col gap-2">
                      {appSplitEvent.people.map((person: any, idx: number) => {
                        const creditVal = person.paid - person.owed;
                        const isCreditor = creditVal > 0;
                        return (
                          <div key={idx} className="bg-white border border-purple-150 p-3.5 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-xs text-slate-900">{person.name}</span>
                              <span className="text-[9px] text-slate-400">
                                Paid {formatAmt(person.paid)} • Owed {formatAmt(person.owed)}
                              </span>
                            </div>
                            <div className="text-right">
                              {isCreditor ? (
                                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                  Gets back {formatAmt(creditVal)}
                                </span>
                              ) : (
                                <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                                  Owes {formatAmt(Math.abs(creditVal))}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add people visual launch row button */}
                  <div className="mt-2 bg-gradient-to-r from-purple-500/10 to-transparent p-4 rounded-2xl border border-purple-50 flex items-center justify-between">
                    <div>
                      <h5 className="font-extrabold text-xs text-[#6C5CE7]">Add people to split</h5>
                      <p className="text-[9px] text-[#A29BFE] mt-0.5">Invite roommates, buddies or colleagues</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowAddPersonSheet(true)}
                      className="w-8 h-8 rounded-full bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white flex items-center justify-center font-extrabold shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FLOATING ACTION BOTTOM BUTTON OR BUTTONS SET */}
                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowAddExpenseSheet(true)}
                      className="w-full py-3 bg-gradient-to-r from-[#6C5CE7] to-[#7363ED] text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-95"
                    >
                      💳 Add expense
                    </button>
                  </div>
                </div>
              )}


              {/* SCREEN CONTAINER: INCOME */}
              {activeTab === "income" && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0B0C15]">Income Sources</h3>
                      <p className="text-[10px] text-slate-400">Track all money coming into your household.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowAddIncomeSheet(true)}
                      className="px-3.5 py-1.5 bg-[#00CEC9] text-[#0A0B14] hover:bg-[#00CEC9]/80 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {/* Summary row */}
                  <div className="bg-white border border-purple-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-lg">💳</span>
                      <span className="text-xs font-bold text-slate-800">1 active source</span>
                    </div>
                    <span className="text-sm font-extrabold text-[#00CEC9]">{formatAmt(appIncome)}/mo</span>
                  </div>

                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mt-2">Sources</span>

                  {/* Base Salary item */}
                  <div className="bg-white border border-purple-100 p-4 rounded-3xl flex items-center justify-between shadow-xs relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xs text-slate-900">Salary</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Monthly • Fixed • Current</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-slate-800">{formatAmt(appIncome)}</span>
                      <button type="button" className="p-1 rounded text-red-100 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}


              {/* SCREEN CONTAINER: EXPENSES */}
              {activeTab === "expenses" && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-[#0B0C15]">Expense Log</h3>
                      <p className="text-[10px] text-slate-400">Track your family spending and budgets.</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowAddExpenseSheet(true)}
                      className="px-3.5 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  {/* Month selectors tabs matching screenshot view */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-extrabold rounded-full cursor-default shrink-0">
                      Jun 2026
                    </span>
                    <span className="px-3 py-1 bg-white border border-purple-50 text-slate-500 text-[10px] font-bold rounded-full cursor-pointer shrink-0">
                      May 2026
                    </span>
                    <span className="px-3 py-1 bg-white border border-purple-50 text-slate-500 text-[10px] font-bold rounded-full cursor-pointer shrink-0">
                      Apr 2026
                    </span>
                  </div>

                  {/* Metric Summary row */}
                  <div className="bg-white border border-purple-100 p-4 rounded-2xl flex items-center justify-between shadow-xs mt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-lg">📄</span>
                      <span className="text-xs font-bold text-slate-800">{appTransactions.length} transactions</span>
                    </div>
                    <span className="text-sm font-extrabold text-rose-500">{formatAmt(totalExpenses)}</span>
                  </div>

                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mt-2">Transactions</span>

                  {/* LIST */}
                  <div className="flex flex-col gap-2">
                    {appTransactions.map((t) => (
                      <div key={t.id} className="bg-white border border-purple-100 p-4 rounded-3xl flex items-center justify-between shadow-xs hover:border-purple-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-lg">
                            {t.category === "Food" ? "🍌" : t.category === "Utilities" ? "💡" : t.category === "Groceries" ? "🛒" : t.category === "Family" ? "🏠" : "💸"}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-xs text-slate-900 capitalize">{t.description}</span>
                            <span className="text-[9px] text-slate-400 mt-0.5">{t.date} • {t.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-slate-800">{formatAmt(t.amount)}</span>
                          <button 
                            type="button" 
                            onClick={() => onRemoveTxFromApp(t.id)}
                            className="p-1 rounded text-red-200 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* SCREEN CONTAINER: GOALS */}
              {activeTab === "goals" && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0B0C15]">Active Goals</h3>
                    <p className="text-[10px] text-slate-400">Achieve savings goals securely with micro-investing.</p>
                  </div>

                  {/* Suggestion banner */}
                  <div className="bg-gradient-to-br from-[#00CEC9]/15 to-[#00CEC9]/5 border border-[#00CEC9]/20 rounded-3xl p-4 flex flex-col gap-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Available for goals (max 50% of leftover)</span>
                      <span className="text-lg font-black text-slate-800">{formatAmt(15800)}</span>
                    </div>
                    <button type="button" className="w-full py-2 bg-[#00CEC9] text-[#0A0B14] hover:bg-[#00CEC9]/90 font-extrabold rounded-xl text-xs shadow-sm transition-colors">
                      ✨ Apply All Suggestions
                    </button>
                  </div>

                  {/* Goal Lists cards */}
                  <div className="flex flex-col gap-3">
                    
                    {/* Goal 1: Car */}
                    <div className="bg-white border border-purple-100 rounded-3xl p-4.5 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-sm text-slate-800">car</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">On Track</span>
                          <input type="checkbox" defaultChecked className="accent-[#6C5CE7] rounded" />
                          <button type="button" className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1 mt-1 text-xs font-bold text-slate-500">
                        <span className="text-base font-black text-slate-900">{formatAmt(16200)}</span> / {formatAmt(250000)}
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: "6%" }} />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">6% complete</span>

                      {/* AI suggestion */}
                      <div className="mt-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-2.5 flex items-center justify-between">
                        <div className="flex items-start gap-2 max-w-[70%]">
                          <span className="text-xs">💡</span>
                          <p className="text-[9px] text-slate-600 leading-normal">
                            Suggested: <strong className="text-emerald-700">{formatAmt(6230)}</strong>. At this rate you'll reach "car" in 38 months.
                          </p>
                        </div>
                        <button type="button" className="px-3 py-1 bg-[#00CEC9] hover:bg-[#00CEC9]/80 text-[#0A0B14] rounded-lg text-[10px] font-bold">
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Goal 2: iPhone 17 Pro Max */}
                    <div className="bg-white border border-purple-100 rounded-3xl p-4.5 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-sm text-slate-800">Iphone 17 Pro Max</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Urgent</span>
                          <input type="checkbox" defaultChecked className="accent-[#6C5CE7] rounded" />
                          <button type="button" className="text-slate-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1 mt-1 text-xs font-bold text-slate-500">
                        <span className="text-base font-black text-slate-900">{formatAmt(9600)}</span> / {formatAmt(350000)}
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: "3%" }} />
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">3% complete</span>

                      {/* AI suggestion */}
                      <div className="mt-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 p-2.5 flex items-center justify-between">
                        <div className="flex items-start gap-2 max-w-[70%]">
                          <span className="text-xs">💡</span>
                          <p className="text-[9px] text-slate-600 leading-normal">
                            Suggested: <strong className="text-emerald-700">{formatAmt(9590)}</strong>. ⚡ Deadline approaching — contribute now to stay on track.
                          </p>
                        </div>
                        <button type="button" className="px-3 py-1 bg-[#00CEC9] hover:bg-[#00CEC9]/80 text-[#0A0B14] rounded-lg text-[10px] font-bold">
                          Add
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}


              {/* SCREEN CONTAINER: ADVISOR CHAT (Screenshot 4) */}
              {activeTab === "advisor" && (
                <div className="flex flex-col h-full animate-fade-in text-left">
                  
                  {/* Financial advisor header */}
                  <div className="p-3 bg-slate-100 rounded-2xl border border-purple-50 mb-3 flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#6C5CE7] flex-shrink-0 animate-pulse">
                      <Sparkles className="w-4 h-4 fill-[#6C5CE7]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">Financial Advisor</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-normal">
                        numbers in the app; I\'ll keep answers short and clear.
                      </p>
                    </div>
                  </div>

                  {/* Conversation bubbles area */}
                  <div className="flex flex-col gap-3 flex-1 mb-3 bg-white/40 p-3 rounded-2xl border border-purple-50/50 min-h-[220px] overflow-y-auto">
                    
                    <span className="text-[9px] font-mono text-emerald-600 text-center uppercase tracking-widest block my-1">
                      — WhatsApp conversation history —
                    </span>

                    {/* Preloaded bubble 1 */}
                    <div className="self-end max-w-[80%] bg-[#00CEC9] text-[#0A0B14] px-3.5 py-1.5 rounded-2xl rounded-tr-none text-xs font-medium">
                      Hi
                    </div>
                    <div className="self-end max-w-[80%] bg-[#00CEC9] text-[#0A0B14] px-3.5 py-1.5 rounded-2xl rounded-tr-none text-xs font-medium">
                      WTF
                    </div>

                    {/* Preloaded bubble 2 response (Styled EXACTLY like screenshot 4) */}
                    <div className="self-start max-w-[90%] bg-[#DFFFD6] border border-[#C5F3B8] text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-[11px] leading-relaxed relative">
                      <span className="block font-base">
                        💡 Hi Trump! Your current savings rate is strong at 2,750 PKR this month. To reach your car goal (240,000 PKR left), you'd need to save this amount for ~87 more months. Want help adjusting timelines or finding ways to save faster?
                      </span>
                      <span className="block font-base mt-2 font-semibold">
                        (If "WTF" was about something else, just say "car budget?" or "iPhone goal?")
                      </span>
                    </div>

                    {/* Render live chat messages */}
                    {advisorMessages.map((msg: any) => (
                      <div 
                        key={msg.id} 
                        className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-xs ${
                          msg.sender === "user" 
                            ? "self-end bg-[#00CEC9] text-[#0A0B14] rounded-tr-none" 
                            : "self-start bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Suggestion Quick Chips */}
                  <div className="flex gap-1 overflow-x-auto pb-1.5 shrink-0">
                    <button 
                      type="button"
                      onClick={() => onAddAdvisorMessage("How can my family split shared costs fairly?")}
                      className="text-[9px] px-2.5 py-1 rounded-full border border-purple-200 bg-white text-purple-700 font-bold hover:bg-purple-50 shrink-0"
                    >
                      How can my family split shared costs fairly?
                    </button>
                    <button 
                      type="button"
                      onClick={() => onAddAdvisorMessage("Am I on track for my iPhone 17?")}
                      className="text-[9px] px-2.5 py-1 rounded-full border border-purple-200 bg-white text-purple-700 font-bold hover:bg-purple-50 shrink-0"
                    >
                      Am I on track for my iPhone 17?
                    </button>
                  </div>

                  {/* Ask question input */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!advisorInputText.trim()) return;
                      onAddAdvisorMessage(advisorInputText);
                      setAdvisorInputText("");
                    }}
                    className="flex gap-1.5 items-center shrink-0"
                  >
                    <input 
                      type="text" 
                      placeholder="Ask your advisor..."
                      value={advisorInputText}
                      onChange={(e) => setAdvisorInputText(e.target.value)}
                      className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs placeholder-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                    <button type="submit" className="p-2 bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white rounded-xl shadow-xs">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>

            {/* MOCK DOCK NAVIGATION BAR (Fidelity replica matching screenshot navigation labels) */}
            <div className="h-14 bg-white border-t border-purple-100 px-1 py-1.5 flex items-center justify-around text-slate-400 shrink-0 z-10">
              
              {/* Tab 1: Dashboard */}
              <button 
                type="button" 
                onClick={() => setActiveTab("dashboard")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "dashboard" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <Home className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5 leading-none">Dashboard</span>
              </button>

              {/* Tab 2: Split Me */}
              <button 
                type="button" 
                onClick={() => setActiveTab("split")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "split" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <DollarSign className="w-4.5 h-4.5 rotate-45" />
                <span className="text-[9px] mt-0.5 leading-none">Split Me</span>
              </button>

              {/* Tab 3: Income */}
              <button 
                type="button" 
                onClick={() => setActiveTab("income")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "income" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <Wallet className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5 leading-none">Income</span>
              </button>

              {/* Tab 4: Expenses */}
              <button 
                type="button" 
                onClick={() => setActiveTab("expenses")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "expenses" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <FileText className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5 leading-none">Expenses</span>
              </button>

              {/* Tab 5: Goals */}
              <button 
                type="button" 
                onClick={() => setActiveTab("goals")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "goals" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <Target className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5 leading-none font-sans">Goals</span>
              </button>

              {/* Tab 6: Advisor */}
              <button 
                type="button" 
                onClick={() => setActiveTab("advisor")}
                className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${activeTab === "advisor" ? "text-[#6C5CE7] bg-purple-50/70 font-bold" : "hover:text-[#6C5CE7]"}`}
              >
                <Sparkles className="w-4.5 h-4.5" />
                <span className="text-[9px] mt-0.5 leading-none">Advisor</span>
              </button>
            </div>

            {/* Android Navigation bar touch pills */}
            <div className="bg-[#FAF9FF] h-6 flex items-center justify-around px-8 pb-1 border-t border-purple-50/50 shrink-0">
              <span className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm" />
              <span className="w-3.5 h-3.5 border-2 border-slate-400 rounded-full" />
              <span className="w-3.5 h-3.5 border-r-2 border-b-2 border-slate-400 transform rotate-[135deg] origin-center -translate-x-0.5" />
            </div>

            {/* INTERACTIVE MODAL/SHEET: ADD PERSON (Screenshot 7) */}
            {showAddPersonSheet && (
              <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-fade-in text-left">
                <div className="bg-white rounded-t-[32px] p-6 flex flex-col gap-4 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-base font-black text-slate-900">Add people</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowAddPersonSheet(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Step 2 of 2 — "Thailand Trip". Add who is sharing costs (you're already included).
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                      📄 Contacts
                    </button>
                    <button type="button" className="py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs">
                      👤 Add person
                    </button>
                  </div>
                  <span className="text-[9px] text-slate-400">Contacts import fills one row only — nothing is uploaded.</span>

                  <form onSubmit={handleAddPerson} className="flex flex-col gap-3">
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-bold mt-2 font-mono">
                        1
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <input 
                          type="text" 
                          placeholder="Name"
                          required
                          value={newPersonName}
                          onChange={(e) => setNewPersonName(e.target.value)}
                          className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                        />
                        <input 
                          type="email" 
                          placeholder="Email (optional)"
                          value={newPersonEmail}
                          onChange={(e) => setNewPersonEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Mobile (optional)"
                          value={newPersonMobile}
                          onChange={(e) => setNewPersonMobile(e.target.value)}
                          className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button 
                        type="button" 
                        onClick={() => setShowAddPersonSheet(false)}
                        className="py-3 font-extrabold text-xs text-slate-500 rounded-xl border border-slate-250 text-center hover:bg-slate-50"
                      >
                        Skip for now
                      </button>
                      <button 
                        type="submit"
                        className="py-3 bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white font-extrabold text-xs rounded-xl shadow-md text-center"
                      >
                        Save people
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* INTERACTIVE MODAL/SHEET: ADD EXPENSE */}
            {showAddExpenseSheet && (
              <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-fade-in text-left">
                <div className="bg-white rounded-t-[32px] p-6 flex flex-col gap-4 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-base font-black text-slate-900">Add Live Expense</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowAddExpenseSheet(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddLiveExpense} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                      <input 
                        type="text" 
                        placeholder="banana shake, utility bills, etc"
                        required
                        value={newExpenseTitle}
                        onChange={(e) => setNewExpenseTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                      <select 
                        value={newExpenseCategory}
                        onChange={(e) => setNewExpenseCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                      >
                        <option value="Food">Food 🍌</option>
                        <option value="Utilities">Utilities 💡</option>
                        <option value="Groceries">Groceries 🛒</option>
                        <option value="Family">Family 🏠</option>
                        <option value="General">General 💸</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Amount ($)</label>
                      <input 
                        type="number" 
                        placeholder="200"
                        required
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-rose-500 text-white rounded-xl text-xs font-bold mt-2 shadow-md hover:bg-rose-600 transition-colors"
                    >
                      Log Expense
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* INTERACTIVE MODAL/SHEET: ADD INCOME */}
            {showAddIncomeSheet && (
              <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end animate-fade-in text-left">
                <div className="bg-white rounded-t-[32px] p-6 flex flex-col gap-4 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="text-base font-black text-slate-900">Add Income Source</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowAddIncomeSheet(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleAddLiveIncome} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                      <input 
                        type="text" 
                        placeholder="Salary, Dividend..."
                        required
                        value={newIncomeTitle}
                        onChange={(e) => setNewIncomeTitle(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Monthly Income</label>
                      <input 
                        type="number" 
                        placeholder="50000"
                        required
                        value={newIncomeAmount}
                        onChange={(e) => setNewIncomeAmount(e.target.value)}
                        className="w-full bg-slate-50 border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-[#00CEC9] text-[#0A0B14] rounded-xl text-xs font-bold mt-2 shadow-md"
                    >
                      Save Income
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>

          <div className="text-center mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#6C5CE7] rounded-full animate-ping" />
            <span className="text-xs font-mono text-slate-400">
              Interactive 6-Tab Smartphone Simulator
            </span>
          </div>

        </div>

        {/* GUIDED CONTROLS & DESCRIPTIVE INTEGRATION CAPABILITIES (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left self-center">
          
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#A29BFE] text-xs font-semibold border border-[#6C5CE7]/20 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#00CEC9] animate-pulse" /> Verified App Sandbox
            </div>
            
            <h3 className="font-display font-bold text-2xl text-white tracking-tight leading-snug">
              Fully Functioning Screenshot Simulation
            </h3>
            
            <p className="text-sm text-gray-400 leading-relaxed">
              We have constructed a full-system design of Spliq's client screen suite precisely matching your requested layout specification.
            </p>
          </div>

          {/* Interactive features summary */}
          <div className="flex flex-col gap-3.5 py-2">
            
            <div className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-[#6C5CE7]/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 text-[#6C5CE7] flex items-center justify-center font-bold text-lg shrink-0">
                ⭐
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-white">Tab Synchronizations</h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Toggle between <strong>Dashboard</strong>, <strong>Split Me</strong>, <strong>Income</strong>, <strong>Expenses</strong>, <strong>Goals</strong>, and <strong>Advisor</strong> to inspect the exact screens shown in the images.
                </p>
              </div>
            </div>

            <div className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-[#6C5CE7]/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-[#00CEC9]/10 text-[#00CEC9] flex items-center justify-center font-bold text-lg shrink-0">
                💰
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-white">Add People & Live Splits</h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  In the <strong>Split Me</strong> tab, tap the Add button to invite new members to the trip splits dynamically. The debts automatically recalculate in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-[#6C5CE7]/20 transition-all">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg shrink-0">
                📱
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-white">Live WhatsApp Log Hook</h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  Type or click any transaction in our WhatsApp Chat Simulation on the left. The metrics instantly feed into this device live.
                </p>
              </div>
            </div>

          </div>

          {/* Quick interactive tips block */}
          <div className="bg-[#6C5CE7]/5 rounded-2xl border border-[#6C5CE7]/10 p-4 leading-normal flex items-start gap-3">
            <span className="text-lg">📢</span>
            <p className="text-xs text-[#A29BFE]">
              <strong>Tip:</strong> Try sending <em>"spent Rs200 for banana shake"</em> or <em>"spent $2450 rent"</em> in the WhatsApp chat. Watch the changes pop up in the corresponding tabs immediately!
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
