import React from "react";
import { Check, X, ShieldAlert, Sparkles, Activity } from "lucide-react";

export default function ComparisonTable() {
  const comparisonRows = [
    {
      feature: "WhatsApp Expense capture",
      spliqVal: "1.8s automatic natural text logging",
      spliqSupported: true,
      tradVal: "Manual entry forms inside heavy apps",
      tradSupported: false,
    },
    {
      feature: "AI Financial Advisor",
      spliqVal: "Generative forecasting based on synced ledger",
      spliqSupported: true,
      tradVal: "Static generic text banners",
      tradSupported: false,
    },
    {
      feature: "Family Budget Syncing",
      spliqVal: "Instant shared limits & multiple partner profiles",
      spliqSupported: true,
      tradVal: "Exposes raw passwords / single logins only",
      tradSupported: false,
    },
    {
      feature: "Group Trip Splits due",
      spliqVal: "Integrated Splitwise tracking & net debt settle curves",
      spliqSupported: true,
      tradVal: "Requires separate splitting websites",
      tradSupported: false,
    },
    {
      feature: "Multi-Goal Vault Planning",
      spliqVal: "Intelligent deadlines with dynamic trajectory advice",
      spliqSupported: true,
      tradVal: "Basic manual trackers without math insights",
      tradSupported: true,
    },
    {
      feature: "Smart cashflow forecasting",
      spliqVal: "SVG visual trend lines optimizing month-end safes",
      spliqSupported: true,
      tradVal: "Rows of raw transaction logs only",
      tradSupported: false,
    },
  ];

  return (
    <div id="compare-section" className="w-full bg-[#121323]/50 border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      
      {/* Table Title and Header */}
      <div className="mb-6">
        <h4 className="font-display font-semibold text-lg text-white">How Spliq Redefines Personal Finance</h4>
        <p className="text-xs text-slate-400 mt-1">A side-by-side comparison illustrating why traditional applications fall behind modern automated workflows.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              <th className="pb-3.5 font-medium w-1/3">CAPABILITY</th>
              <th className="pb-3.5 font-medium px-4 bg-brand-violet/10 text-brand-lavender border-x border-t border-brand-violet/20 rounded-t-lg">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-teal" /> SPLIQ FINANCE (AI AUTO)
                </div>
              </th>
              <th className="pb-3.5 font-medium px-4">TRADITIONAL BANKING APPS</th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, index) => (
              <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/1 transition-all text-xs">
                {/* Capability descriptor */}
                <td className="py-4 font-semibold text-slate-200">{row.feature}</td>

                {/* Spliq metric value */}
                <td className="py-4 px-4 bg-brand-violet/5 border-x border-brand-violet/10 text-slate-100 font-medium">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span>{row.spliqVal}</span>
                  </div>
                </td>

                {/* Traditional values */}
                <td className="py-4 px-4 text-slate-400">
                  <div className="flex items-start gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      row.tradSupported 
                        ? "bg-slate-800 text-slate-400" 
                        : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {row.tradSupported ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </div>
                    <span>{row.tradVal}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settle comparison row info banner */}
      <div className="mt-4.5 p-3 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center gap-2 text-[11px] text-brand-lavender">
        <Activity className="w-4 h-4 text-brand-teal animate-pulse" />
        <span>With Spliq, domestic sync operates under active automation, which reduces traditional finance planning spreadsheet clutter by up to <strong>94%</strong>.</span>
      </div>
    </div>
  );
}
