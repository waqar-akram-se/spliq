import React, { useMemo } from "react";
import { 
  PiggyBank, ArrowDownRight, ArrowUpRight, ShieldAlert, Users, Compass, 
  Sparkles, Plus, Wallet, HeartHandshake, Home, Plane, Car, AlertCircle
} from "lucide-react";
import { Transaction, SavingsGoal, FamilyMember } from "../types";

interface DashboardPreviewProps {
  transactions: Transaction[];
  goals: SavingsGoal[];
  familyMembers: FamilyMember[];
  onAddTransaction: (category: any, amount: number, description: string) => void;
  onAskAdvisor: (question: string) => void;
}

export default function DashboardPreview({ 
  transactions, 
  goals, 
  familyMembers, 
  onAddTransaction,
  onAskAdvisor 
}: DashboardPreviewProps) {
  
  // Dashboard Metrics calculations
  const monthlyIncome = 8500;
  const setBudgetLimit = 4200;

  const totalSpent = useMemo(() => {
    return transactions.reduce((acc, curr) => acc + curr.amount, 0);
  }, [transactions]);

  const remainingBudget = useMemo(() => {
    return Math.max(0, setBudgetLimit - totalSpent);
  }, [totalSpent, setBudgetLimit]);

  const savingsRate = useMemo(() => {
    const totalSaved = monthlyIncome - totalSpent;
    return Math.max(0, Math.round((totalSaved / monthlyIncome) * 100));
  }, [totalSpent, monthlyIncome]);

  // Aggregate by category
  const categorySummary = useMemo(() => {
    const initial = {
      Groceries: { spent: 610, limit: 1200, color: "bg-emerald-500", text: "text-emerald-400" },
      Dining: { spent: 480, limit: 1000, color: "bg-brand-violet", text: "text-brand-lavender" },
      Travel: { spent: 540, limit: 1200, color: "bg-brand-teal", text: "text-brand-teal" },
      Entertainment: { spent: 180, limit: 600, color: "bg-pink-500", text: "text-pink-400" },
      Utilities: { spent: 290, limit: 600, color: "bg-brand-amber", text: "text-brand-amber" },
      Shopping: { spent: 310, limit: 800, color: "bg-sky-500", text: "text-sky-400" },
      Family: { spent: 450, limit: 1200, color: "bg-rose-500", text: "text-rose-400" },
      Miscellaneous: { spent: 90, limit: 400, color: "bg-slate-500", text: "text-slate-400" },
    };

    transactions.forEach(t => {
      if (initial[t.category]) {
        // Only sum client transactions logged beyond initial setup
        if (t.id.startsWith("wat-")) {
          initial[t.category].spent += t.amount;
        }
      }
    });

    return initial;
  }, [transactions]);

  // SVG Line coordinates representing monthly spending index (simulated forecast curves)
  const lineCoords = useMemo(() => {
    const dataPoints = [80, 140, 190, 240, 210, 230, 280, 310, 410, 480, 520, 590];
    const width = 500;
    const height = 150;
    const maxVal = 700;
    
    return dataPoints.map((val, i) => {
      const x = (i / (dataPoints.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    }).join(" ");
  }, []);

  return (
    <div id="interactive-dashboard" className="w-full flex flex-col gap-6" role="region" aria-label="Aesthetic Dashboard Panel">
      
      {/* 4 Cards Stats layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#121323] border border-white/5 rounded-xl p-4.5 flex flex-col relative overflow-hidden group hover:border-brand-lavender/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MONTHLY INCOME</span>
            <Wallet className="w-3.5 h-3.5 text-brand-teal" />
          </div>
          <div className="font-display font-bold text-2xl text-white mt-1.5 tracking-tight">
            $8,500<span className="text-[11px] text-slate-400 font-normal">.00</span>
          </div>
          <p className="text-[10px] text-brand-teal flex items-center gap-1 mt-1 font-sans">
            <span className="font-semibold">⚡ Direct Deposit Connected</span>
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#121323] border border-white/5 rounded-xl p-4.5 flex flex-col relative overflow-hidden group hover:border-brand-lavender/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SET BUDGET LIMIT</span>
            <PiggyBank className="w-3.5 h-3.5 text-brand-lavender" />
          </div>
          <div className="font-display font-bold text-2xl text-white mt-1.5 tracking-tight">
            ${setBudgetLimit.toLocaleString()}<span className="text-[11px] text-slate-400 font-normal">.00</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            Shared domestic limit set
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#121323] border border-white/5 rounded-xl p-4.5 flex flex-col relative overflow-hidden group hover:border-brand-lavender/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL SPENT</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="font-display font-bold text-2xl text-white mt-1.5 tracking-tight text-gradient-primary">
            ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-sans">
            <span className="text-brand-lavender font-semibold">
              {Math.round((totalSpent / setBudgetLimit) * 100)}%
            </span> of safe-spending threshold
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#121323] border border-white/5 rounded-xl p-4.5 flex flex-col relative overflow-hidden group hover:border-brand-teal/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SAVINGS RATE</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-brand-teal" />
          </div>
          <div className="font-display font-bold text-2xl text-brand-teal mt-1.5 tracking-tight">
            {savingsRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-sans">
            Targeting 35% this quarter
          </p>
        </div>
      </div>

      {/* Main Grid: Forecast chart & Category progress */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Spend Category Progress Meter (5 Cols) */}
        <div className="lg:col-span-5 bg-[#121323] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-slate-200">Budget Envelopes</h4>
            <span className="text-[11px] text-slate-400 font-mono">Month-to-Date</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {(Object.entries(categorySummary) as [string, any][]).map(([cat, info]) => {
              const spentPct = Math.round((info.spent / info.limit) * 100);
              const isOver = spentPct > 100;
              return (
                <div key={cat} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{cat}</span>
                    <span className="text-slate-400">
                      <strong className="text-slate-100">${info.spent.toFixed(0)}</strong> / ${info.limit} 
                      <span className={`ml-1.5 font-semibold ${isOver ? "text-rose-400" : info.text}`}>
                        {spentPct}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-brand-night rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${info.color}`}
                      style={{ width: `${Math.min(100, spentPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Forecast trend & Savings Goals (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Glowing custom forecast spline */}
          <div className="bg-[#121323] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display font-semibold text-sm text-slate-200">Smart Cashflow Forecast</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">Interactive spending index prediction mapping out month-end trajectory.</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-mono font-bold">
                ● Optimizing
              </span>
            </div>

            {/* Neon SVG Spline Chart */}
            <div className="relative w-full h-[140px] mt-2 mb-2">
              <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible" aria-hidden="true">
                {/* Horizontal grid guide lines */}
                <line x1="0" y1="37" x2="500" y2="37" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="112" x2="500" y2="112" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Underglow Gradient Fill */}
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Closed Area path */}
                <path
                  d={`M 0,150 L ${lineCoords} L 500,150 Z`}
                  fill="url(#chartGradient)"
                />

                {/* Spline Path */}
                <polyline
                  fill="none"
                  stroke="url(#lineColorGradient)"
                  strokeWidth="3.5"
                  points={lineCoords}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_4px_12px_rgba(108,92,231,0.5)]"
                />

                {/* Color Gradient for trend line */}
                <defs>
                  <linearGradient id="lineColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="50%" stopColor="#A29BFE" />
                    <stop offset="100%" stopColor="#00CEC9" />
                  </linearGradient>
                </defs>

                {/* Interactive hot-dot indicator (current day) */}
                <circle cx="480" cy="52" r="6" fill="#00CEC9" className="animate-pulse" />
                <circle cx="480" cy="52" r="2.5" fill="#FFF" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mt-2" aria-hidden="true">
              <span>Day 1</span>
              <span>Day 10 (Direct Deposit)</span>
              <span>Day 20 (Utilities due)</span>
              <span className="text-brand-teal font-semibold">Today (Optimized)</span>
            </div>
          </div>

          {/* Core savings vault goals */}
          <div className="grid grid-cols-2 gap-4">
            {goals.map((goal) => {
              const roundedPct = Math.round((goal.current / goal.target) * 100);
              return (
                <div key={goal.id} className="bg-[#121323] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-brand-lavender/20 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-medium text-xs text-slate-200">{goal.name}</span>
                    {goal.category === "Vacation" && <Plane className="w-3.5 h-3.5 text-brand-lavender" />}
                    {goal.category === "Emergency Fund" && <AlertCircle className="w-3.5 h-3.5 text-brand-teal" />}
                    {goal.category === "Home" && <Home className="w-3.5 h-3.5 text-brand-amber" />}
                    {goal.category === "Car" && <Car className="w-3.5 h-3.5 text-rose-400" />}
                  </div>

                  <div className="mt-3.5">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-gradient font-bold text-lg">
                        ${goal.current.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        of ${goal.target.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-brand-night rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-teal transition-all duration-700"
                          style={{ width: `${roundedPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-brand-teal font-bold font-mono">
                        {roundedPct}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Family spend visibility list & Master history list */}
      <div className="grid lg:grid-cols-12 gap-6" id="family">
        
        {/* Family spending visibility (4 Cols) */}
        <div className="lg:col-span-5 bg-[#121323] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-lavender" /> Family Sync Hub
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              🏡 active sync
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {familyMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between bg-brand-night/40 rounded-xl p-2.5 border border-white/5 hover:border-brand-lavender/15 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-8.5 h-8.5 rounded-full border border-brand-violet/20"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121323] rounded-full" />
                  </div>
                  <div>
                    <h5 className="font-medium text-xs text-slate-200">{member.name}</h5>
                    <p className="text-[10px] text-slate-400">{member.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-semibold text-slate-200">
                    ${member.spentThisMonth.toFixed(0)} spent
                  </span>
                  <div className="text-[9px] text-slate-500 tracking-wider">THIS MONTH</div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={() => onAskAdvisor("How can I audit our family grocery spending more effectively?")}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-brand-violet/10 hover:bg-brand-violet/20 border border-brand-violet/20 text-brand-lavender font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-teal" /> Ask AI to Audit Sync Limits
          </button>
        </div>

        {/* Master Transactions Ledger Table (7 columns) */}
        <div className="lg:col-span-7 bg-[#121323] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-semibold text-sm text-slate-200">Active Transactions</h4>
              <p className="text-[11px] text-slate-400">Stream of transaction logs synced directly from family members or WhatsApp.</p>
            </div>
            <button 
              type="button"
              onClick={() => onAddTransaction("Dining", 38.5, "Starbucks Coffee")}
              className="py-1.5 px-3 rounded-lg bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-semibold hover:bg-brand-teal/25 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Quick $38.50
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  <th className="pb-2.5 font-medium">DESCRIPTION</th>
                  <th className="pb-2.5 font-medium">CATEGORY</th>
                  <th className="pb-2.5 font-medium">SENDER</th>
                  <th className="pb-2.5 font-medium text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((t, index) => {
                  const isNew = t.id.startsWith("wat-");
                  return (
                    <tr 
                      key={t.id} 
                      className={`border-b border-white/5 text-xs group hover:bg-white/1 transition-all ${
                        isNew && index === 0 ? "bg-brand-teal/5 animate-pulse" : ""
                      }`}
                    >
                      <td className="py-3 flex items-center gap-2">
                        <div>
                          <div className="font-medium text-slate-200 flex items-center gap-1.5">
                            {t.description}
                            {isNew && (
                              <span className="px-1.5 py-0.2 rounded bg-brand-teal/10 border border-brand-teal/30 text-[8px] text-brand-teal font-bold font-mono">
                                whatsapp
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{t.date}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-slate-400">{t.loggedBy}</td>
                      <td className="py-3 text-right font-semibold text-slate-200">
                        -${t.amount.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
