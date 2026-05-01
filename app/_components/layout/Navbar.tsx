"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sparkles, ArrowRight, Building2, Users } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { name: "How It Works", href: "/how-it-works" },
  { name: "For Brands", href: "/for-brands" },
  { name: "For Creators", href: "/for-creators" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(9,9,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Nexly
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 transition-all duration-200 hover:text-white hover:bg-white/[0.05]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
            >
              Join the Wishlist
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl transition-colors"
            style={{ color: "#94a3b8" }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="md:hidden py-4 rounded-2xl mb-3 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="flex flex-col px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-400 transition-all hover:text-white hover:bg-white/[0.05]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div
                className="mx-2 my-3"
                style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
              />

              <div className="flex flex-col gap-2 px-2">
                <Link
                  href="/for-brands"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.05]"
                  style={{ color: "#a78bfa" }}
                  onClick={() => setIsOpen(false)}
                >
                  <Building2 size={15} />
                  For Brands
                </Link>
                <Link
                  href="/for-creators"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.05]"
                  style={{ color: "#f472b6" }}
                  onClick={() => setIsOpen(false)}
                >
                  <Users size={15} />
                  For Creators
                </Link>
                <Link
                  href="/auth"
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-white mt-1 transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #0891b2)" }}
                  onClick={() => setIsOpen(false)}
                >
                  Join the Wishlist
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
