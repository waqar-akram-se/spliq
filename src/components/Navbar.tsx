import React, { useState, useEffect } from "react";
import { ArrowUpRight, Menu, X, Activity } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Family Budgeting", href: "#family" },
    { name: "Group Expenses", href: "#group" },
    { name: "AI Advisor", href: "#advisor" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-brand-night/85 backdrop-blur-md border-b border-white/5 shadow-lg shadow-brand-night/50"
          : "py-5 bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group" id="logo-link">
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent uppercase font-display select-none">
            Spliq
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#pricing"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors px-1 py-1"
          >
            Log In
          </a>
          <a
            href="#final-cta"
            id="nav-cta-btn"
            className="bg-[#6C5CE7] hover:bg-[#5A4ED1] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-lg shadow-[#6C5CE7]/20 flex items-center gap-1 cursor-pointer"
          >
            Get Started Free
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-1 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
          id="mobile-menu-trigger"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 bg-[#0B0C1A] border-b border-white/5 py-6 px-6 shadow-xl"
          id="mobile-nav-panel"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <hr className="border-white/5 my-2" />
            <div className="flex items-center justify-between pt-2">
              <a
                href="#pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-300 hover:text-white"
              >
                Sign In
              </a>
              <a
                href="#final-cta"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-violet hover:bg-brand-violet/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started Free
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
