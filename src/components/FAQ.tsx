import React, { useState } from "react";
import { ChevronDown, HelpCircle, Shield, KeyRound, Zap } from "lucide-react";
import { FAQItem } from "../types";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqList: FAQItem[] = [
    {
      category: "WhatsApp Logging",
      question: "How does the WhatsApp expense tracking work?",
      answer: "When you register, you are paired with a verified, secure Spliq WhatsApp contact. Sending text statements like 'Spent $45 on family dinner' or 'split fuel bill $80 with Sarah' prompts our server-side parser (powered by Gemini models) to extract numerical values, standardize descriptions, and sync them with your dashboard in under 2 seconds."
    },
    {
      category: "Family Budgeting",
      question: "How are family accounts managed between partners?",
      answer: "Spliq offers multi-member synchronization. When you pair accounts with a partner or family member, they obtain separate secure profiles. Each member logs spending individually via WhatsApp or the app, which populates a unified master budget with custom limits, sparing you from password sharing or spreadsheet conflicts."
    },
    {
      category: "Group Splits",
      question: "Can we use group splitting for roommates or trips?",
      answer: "Absolutely! Spliq integrates Splitwise-style features natively. You can establish group pods for vacation trips, wedding events, or household rental utilities. Members can log expenses paid on behalf of others; Spliq's algorithm immediately charts net balances and outputs optimal pay-back settlement instructions to simplify settle-ups."
    },
    {
      category: "Security",
      question: "Is my personal financial data secure?",
      answer: "Data security is our foundation. Spliq implements bank-grade AES-256 encryption for both database storage and networking. Furthermore, we operate under read-only transaction parameters and do not store or sell your raw credentials to third-party marketing brokers."
    },
    {
      category: "AI Advisor",
      question: "How does the AI Finance Advisor calculate savings guidance?",
      answer: "Our Generative Money Advisor monitors your monthly cash inflow, categorical spending speeds, and goal targets. It acts as an interactive coach rather than a static calculator, identifying spending peaks (e.g., spending 18% too much on takeout) and suggesting precisely modeled cuts that direct funds to high-yield vaults."
    },
    {
      category: "Savings Goals",
      question: "How does savings goal tracking operate?",
      answer: "Users can build specific vaults for targets such as Home Downpayment, Vacation Trips, Emergency Buffers, or Vehicles. When family expenses are completed within budget limits, surplus cash is directed into these vaults. The visual interface charts deadlines with a smart trajectory timeline that alerts you if targets are at risk."
    }
  ];

  return (
    <div id="faq-section" className="w-[100%] max-w-4xl mx-auto flex flex-col gap-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[11px] font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h3 className="font-display font-semibold text-3xl text-white tracking-tight">
          Everything You Need to Know
        </h3>
        <p className="text-xs text-slate-400 mt-2">Have extra queries? Contact our help center for dedicated live support.</p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {faqList.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className={`border rounded-xl transition-all duration-300 ${
                isOpen 
                  ? "bg-[#121323] border-brand-violet/40 shadow-lg shadow-brand-violet/5" 
                  : "bg-[#121323]/40 border-white/5 hover:border-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono font-bold text-brand-teal tracking-widest uppercase bg-brand-teal/10 border border-brand-teal/20 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <h4 className="font-display font-medium text-sm text-slate-200">
                    {item.question}
                  </h4>
                </div>
                <div className={`p-1.5 rounded-lg bg-brand-night border border-white/5 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-brand-teal" : "text-slate-400"
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5 animate-fade-in">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
