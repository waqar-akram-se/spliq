import React, { useState, useMemo } from "react";
import { Users, DollarSign, Plus, ArrowRight, CheckCircle2, ShieldEllipsis, AlertCircle } from "lucide-react";
import { GroupExpense, GroupExpenseSplit } from "../types";

export default function GroupSplittingTab() {
  const [activeTab, setActiveTab] = useState<"cabin" | "roommates">("cabin");
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newPayer, setNewPayer] = useState("You");
  const [newSplitType, setNewSplitType] = useState<"Equal" | "Custom">("Equal");

  // Initial cabin expense dataset
  const [cabinExpenses, setCabinExpenses] = useState<GroupExpense[]>([
    {
      id: "exp-1",
      title: "Cabin Rental Accommodation",
      totalAmount: 600,
      splitType: "Equal",
      paidBy: "You",
      splits: [
        { memberName: "You", amount: 150, sharePercent: 25 },
        { memberName: "Alex", amount: 150, sharePercent: 25 },
        { memberName: "Sarah", amount: 150, sharePercent: 25 },
        { memberName: "Jordan", amount: 150, sharePercent: 25 },
      ],
      date: "June 01, 2026",
    },
    {
      id: "exp-2",
      title: "Stocked Groceries & Fuel",
      totalAmount: 180,
      splitType: "Equal",
      paidBy: "Alex",
      splits: [
        { memberName: "You", amount: 45, sharePercent: 25 },
        { memberName: "Alex", amount: 45, sharePercent: 25 },
        { memberName: "Sarah", amount: 45, sharePercent: 25 },
        { memberName: "Jordan", amount: 45, sharePercent: 25 },
      ],
      date: "June 02, 2026",
    },
    {
      id: "exp-3",
      title: "National Park Entry & Gear Rental",
      totalAmount: 120,
      splitType: "Custom",
      paidBy: "Jordan",
      splits: [
        { memberName: "You", amount: 24, sharePercent: 20 },
        { memberName: "Alex", amount: 36, sharePercent: 30 },
        { memberName: "Sarah", amount: 48, sharePercent: 40 },
        { memberName: "Jordan", amount: 12, sharePercent: 10 },
      ],
      date: "June 02, 2026",
    }
  ]);

  // Initial Roommate expenses dataset
  const [roommateExpenses, setRoommateExpenses] = useState<GroupExpense[]>([
    {
      id: "exp-room-1",
      title: "Broadband Wifi & Fibre Router",
      totalAmount: 80,
      splitType: "Equal",
      paidBy: "Sarah",
      splits: [
        { memberName: "You", amount: 26.66, sharePercent: 33.3 },
        { memberName: "Sarah", amount: 26.66, sharePercent: 33.3 },
        { memberName: "Jordan", amount: 26.66, sharePercent: 33.3 },
      ],
      date: "June 01, 2026",
    }
  ]);

  const currentExpenses = activeTab === "cabin" ? cabinExpenses : roommateExpenses;
  const currentMembers = activeTab === "cabin" ? ["You", "Alex", "Sarah", "Jordan"] : ["You", "Sarah", "Jordan"];

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount || isNaN(parseFloat(newAmount))) return;

    const parsedAmount = parseFloat(newAmount);
    const splitCount = currentMembers.length;
    const splitShares: GroupExpenseSplit[] = [];

    if (newSplitType === "Equal") {
      const shareVal = parsedAmount / splitCount;
      currentMembers.forEach((m) => {
        splitShares.push({
          memberName: m,
          amount: parseFloat(shareVal.toFixed(2)),
          sharePercent: Math.round((1 / splitCount) * 100),
        });
      });
    } else {
      // Custom split simulation (weighted: You get 20%, others split remaining)
      const youShare = parsedAmount * 0.2;
      const otherShare = (parsedAmount - youShare) / (splitCount - 1);
      
      currentMembers.forEach((m) => {
        if (m === "You") {
          splitShares.push({ memberName: "You", amount: parseFloat(youShare.toFixed(2)), sharePercent: 20 });
        } else {
          splitShares.push({ 
            memberName: m, 
            amount: parseFloat(otherShare.toFixed(2)), 
            sharePercent: Math.round((80 / (splitCount - 1))) 
          });
        }
      });
    }

    const payload: GroupExpense = {
      id: `exp-user-${Date.now()}`,
      title: newTitle,
      totalAmount: parsedAmount,
      splitType: newSplitType,
      paidBy: newPayer,
      splits: splitShares,
      date: "Today",
    };

    if (activeTab === "cabin") {
      setCabinExpenses((prev) => [payload, ...prev]);
    } else {
      setRoommateExpenses((prev) => [payload, ...prev]);
    }

    setNewTitle("");
    setNewAmount("");
  };

  // Settle-up matrix synthesizer (Simple net balance matrix)
  const settlementSummary = useMemo(() => {
    const balances: { [name: string]: number } = {};
    currentMembers.forEach((m) => {
      balances[m] = 0;
    });

    currentExpenses.forEach((exp) => {
      currentMembers.forEach((m) => {
        // Find how much m owed for this expense
        const splitRecord = exp.splits.find((s) => s.memberName === m);
        const owed = splitRecord ? splitRecord.amount : 0;
        
        // If m was the payer, m gets back (totalAmount - what m owed themselves)
        if (exp.paidBy === m) {
          balances[m] += (exp.totalAmount - owed);
        } else {
          // If m didn't pay, they owe their split part
          balances[m] -= owed;
        }
      });
    });

    // Extract debtors and creditors
    const debtors: Array<{ name: string; amount: number }> = [];
    const creditors: Array<{ name: string; amount: number }> = [];

    Object.entries(balances).forEach(([name, bal]) => {
      if (bal < -0.1) {
        debtors.push({ name, amount: Math.abs(bal) });
      } else if (bal > 0.1) {
        creditors.push({ name, amount: bal });
      }
    });

    // Match them up for settlement tracking pairs
    const suggestions: Array<{ debtor: string; creditor: string; amount: number }> = [];
    let dIdx = 0;
    let cIdx = 0;

    // Deep clone lists in order to decrement matching balances
    const tempDebtors = debtors.map(d => ({ ...d }));
    const tempCreditors = creditors.map(c => ({ ...c }));

    while (dIdx < tempDebtors.length && cIdx < tempCreditors.length) {
      const debtor = tempDebtors[dIdx];
      const creditor = tempCreditors[cIdx];
      const settlementAmt = Math.min(debtor.amount, creditor.amount);

      suggestions.push({
        debtor: debtor.name,
        creditor: creditor.name,
        amount: parseFloat(settlementAmt.toFixed(2)),
      });

      debtor.amount -= settlementAmt;
      creditor.amount -= settlementAmt;

      if (debtor.amount < 0.1) dIdx++;
      if (creditor.amount < 0.1) cIdx++;
    }

    return { nettBalances: Object.entries(balances), suggestions };
  }, [currentExpenses, currentMembers]);

  return (
    <div id="group-splitting-showcase" className="w-full bg-[#121323] border border-white/5 rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
      
      {/* Visual Subheader Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h4 className="font-display font-semibold text-lg text-white">Splitwise Integration Sandbox</h4>
          <p className="text-xs text-slate-400 mt-0.5">Split bills seamlessly with roommate pods or trip groups.</p>
        </div>
        
        {/* Toggle active group buttons */}
        <div className="flex bg-brand-night p-1 rounded-lg border border-white/5">
          <button
            type="button"
            onClick={() => setActiveTab("cabin")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              activeTab === "cabin" 
                ? "bg-brand-violet text-white shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yosemite Cabin Trip
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("roommates")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
              activeTab === "roommates" 
                ? "bg-brand-violet text-white shadow-sm" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Roommates Hub
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Dynamic Settle Board & balances */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-brand-night/40 border border-white/5 rounded-xl p-4.5 flex flex-col gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Settlement Ledger</span>
            
            <div className="flex flex-col gap-2.5">
              {settlementSummary.nettBalances.map(([name, bal]) => {
                const isOwed = bal > 0.05;
                const isZero = Math.abs(bal) <= 0.05;
                return (
                  <div key={name} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                    <span className="font-medium text-slate-300">{name}</span>
                    <span className={`font-semibold ${isOwed ? "text-brand-teal" : isZero ? "text-slate-500" : "text-rose-400"}`}>
                      {isZero ? "Settled" : isOwed ? `is owed $${bal.toFixed(2)}` : `owes $${Math.abs(bal).toFixed(2)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-brand-teal/5 border border-brand-teal/10 rounded-xl p-4 flex flex-col gap-3">
            <span className="text-xs font-mono text-brand-teal uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Net Split
            </span>
            
            {settlementSummary.suggestions.length === 0 ? (
              <p className="text-slate-400 text-xs">All accounts are perfectly settled!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {settlementSummary.suggestions.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 bg-brand-night/50 border border-white/5 rounded-lg p-2.5 text-xs text-slate-200">
                    <span className="font-bold text-slate-300">{s.debtor}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span>pay</span>
                    <strong className="text-gradient font-bold">${s.amount.toFixed(2)}</strong>
                    <span>to</span>
                    <span className="font-bold text-slate-300">{s.creditor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle 5 Cols: Active Splitting List Ledger */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Group Bills</span>
          
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto scrollbar pr-1">
            {currentExpenses.map((exp) => (
              <div key={exp.id} className="bg-brand-night/65 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-brand-lavender/10 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-medium text-xs text-slate-200">{exp.title}</h5>
                    <span className="text-[10px] text-slate-500">{exp.date}</span>
                  </div>
                  <span className="text-sm font-bold text-gradient">
                    ${exp.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-2 font-sans">
                  <span>Paid by: <strong className="text-slate-200">{exp.paidBy}</strong></span>
                  <span className="px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-[9px] text-brand-lavender">
                    {exp.splitType} Partition
                  </span>
                </div>

                {/* Micro split avatars preview */}
                <div className="flex flex-wrap gap-1.5 items-center mt-1">
                  {exp.splits.map((s, idx) => (
                    <span key={idx} className="bg-brand-night border border-white/5 rounded px-2 py-0.5 text-[9px] text-slate-400">
                      {s.memberName}: ${s.amount} ({s.sharePercent}%)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 3 Cols: Form to Add Shared Expense */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Log Group Expense</span>
          
          <form onSubmit={handleCreateExpense} className="bg-[#18192a] border border-white/5 rounded-xl p-4 flex flex-col gap-3 shadow-inner">
            <div className="flex flex-col gap-1">
              <label htmlFor="split-title" className="text-[10px] text-slate-400 font-medium">EXPENSE DESCRIPTION</label>
              <input
                id="split-title"
                type="text"
                required
                className="bg-brand-night border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-violet"
                placeholder="Cabin Groceries, Uber, Gas..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="split-amount" className="text-[10px] text-slate-400 font-medium">TOTAL COST ($)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">$</span>
                <input
                  id="split-amount"
                  type="number"
                  step="any"
                  required
                  className="w-full bg-brand-night border border-white/10 rounded pl-6 pr-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="split-payer" className="text-[10px] text-slate-400 font-medium">WHO PAID?</label>
              <select
                id="split-payer"
                className="bg-brand-night border border-white/10 rounded py-1.5 px-2 text-xs text-slate-200 outline-none"
                value={newPayer}
                onChange={(e) => setNewPayer(e.target.value)}
              >
                {currentMembers.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">SPLIT MODE</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewSplitType("Equal")}
                  className={`flex-1 py-1 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    newSplitType === "Equal"
                      ? "bg-brand-violet/20 border-brand-violet text-brand-lavender"
                      : "border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Equal Shares
                </button>
                <button
                  type="button"
                  onClick={() => setNewSplitType("Custom")}
                  className={`flex-1 py-1 rounded border text-[10px] font-semibold transition-all cursor-pointer ${
                    newSplitType === "Custom"
                      ? "bg-brand-violet/20 border-brand-violet text-brand-lavender"
                      : "border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Custom (80% / 20%)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-brand-violet to-brand-lavender text-white rounded text-xs font-semibold hover:opacity-90 transform active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-brand-violet/10 mt-1"
            >
              <Plus className="w-3.5 h-3.5" /> Insert Shared Bill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
