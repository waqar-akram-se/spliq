import React from "react";
import { Activity, Github, Twitter, MessageSquare, Mail, ShieldAlert } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "SaaS Features", href: "#features" },
      { name: "Family sync Hub", href: "#family" },
      { name: "Group Splitwise", href: "#group" },
      { name: "AI Advisory Service", href: "#advisor" },
      { name: "Pricing Tiers", href: "#pricing" },
    ],
    resources: [
      { name: "FAQ Desk", href: "#faq" },
      { name: "Platform Status", href: "#hero" },
      { name: "Security Architecture", href: "#faq" },
      { name: "Developer documentation", href: "#hero" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "GDPR Compliance", href: "#" },
      { name: "Security Audits", href: "#" },
    ]
  };

  return (
    <footer className="w-full bg-[#07080e] border-t border-white/5 pt-16 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-8 mb-12">
        
        {/* Brand details Column (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-violet to-brand-teal flex items-center justify-center shadow-lg shadow-brand-violet/20">
              <Activity className="w-4 h-4 text-brand-night" strokeWidth={3} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              Spliq<span className="text-brand-teal">.</span>
            </span>
          </div>
          <p className="leading-relaxed text-slate-400 max-w-sm">
            Spliq represents the pinnacle of AI-driven home and group personal finance. Log spending via WhatsApp, coordinate family limits synchronously, split collective trip bills, and achieve financial liberty under generous automated guidance.
          </p>

          {/* Social Icons row */}
          <div className="flex items-center gap-3.5 mt-2">
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-brand-violet/10 hover:text-white border border-white/5 transition-all" aria-label="Spliq on Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-brand-violet/10 hover:text-white border border-white/5 transition-all" aria-label="Spliq on Github">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-brand-violet/10 hover:text-white border border-white/5 transition-all" aria-label="Spliq Discord Community">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="mailto:support@spliq.finance" className="p-2 rounded-lg bg-white/5 hover:bg-brand-violet/10 hover:text-white border border-white/5 transition-all" aria-label="Email Spliq Support">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Link Columns (2/2/2 cols) */}
        <div className="md:col-span-2 col-span-6 flex flex-col gap-3">
          <h5 className="font-display font-semibold text-slate-200 tracking-wider text-[11px] uppercase">Product</h5>
          <div className="flex flex-col gap-2">
            {footerLinks.product.map((l, i) => (
              <a key={i} href={l.href} className="hover:text-white transition-colors">{l.name}</a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 col-span-6 flex flex-col gap-3">
          <h5 className="font-display font-semibold text-slate-200 tracking-wider text-[11px] uppercase">Resources</h5>
          <div className="flex flex-col gap-2">
            {footerLinks.resources.map((l, i) => (
              <a key={i} href={l.href} className="hover:text-white transition-colors">{l.name}</a>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 col-span-6 flex flex-col gap-3">
          <h5 className="font-display font-semibold text-slate-200 tracking-wider text-[11px] uppercase">Legal</h5>
          <div className="flex flex-col gap-2">
            {footerLinks.legal.map((l, i) => (
              <a key={i} href={l.href} className="hover:text-white transition-colors">{l.name}</a>
            ))}
          </div>
        </div>

        {/* Newsletter promo (2 cols) */}
        <div className="md:col-span-2 col-span-6 flex flex-col gap-3">
          <h5 className="font-display font-semibold text-slate-200 tracking-wider text-[11px] uppercase">Updates</h5>
          <p className="text-[11px] text-slate-400 leading-normal">Subscribe to get monthly financial engineering logs.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-1.5 mt-1">
            <input 
              type="email" 
              required
              className="bg-brand-night border border-white/10 rounded px-2.5 py-1.5 text-[10px] text-white focus:outline-none" 
              placeholder="name@company.com" 
            />
            <button 
              type="submit" 
              className="py-1.5 bg-brand-violet hover:bg-brand-lavender text-white rounded font-semibold text-[10px] cursor-pointer transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <hr className="border-white/5 max-w-7xl mx-auto px-6 my-6" />

      {/* Corporate terms alignment */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-teal" />
          <span>Spliq is a modern personal financial software service. All banking transactions are secured in interest vaults.</span>
        </div>
        <p>© {currentYear} Spliq Inc. All rights reserved protected by AES Encryption standards.</p>
      </div>
    </footer>
  );
}
