"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";

// ─── Web3Forms config ─────────────────────────────────────────────────────────
// 1. Go to https://web3forms.com and sign up for free.
// 2. Create a new form and copy the Access Key.
// 3. Replace the value below with your key.
const WEB3FORMS_ACCESS_KEY = "adc8b1f5-316f-4d3f-a12e-83332d1fd55c";
// ─────────────────────────────────────────────────────────────────────────────

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

const INFO_CARDS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email us",
    value: "hello@duolync.com",
    href: "mailto:hello@duolync.com",
    accent: "#a78bfa",
    accentBg: "rgba(167,139,250,0.08)",
    accentBorder: "rgba(167,139,250,0.2)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    label: "Response time",
    value: "Within 24 hours",
    href: null,
    accent: "#34d399",
    accentBg: "rgba(52,211,153,0.08)",
    accentBorder: "rgba(52,211,153,0.2)",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    label: "Based in",
    value: "Tbilisi, Georgia",
    href: null,
    accent: "#67e8f9",
    accentBg: "rgba(103,232,249,0.08)",
    accentBorder: "rgba(103,232,249,0.2)",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          message: form.message,
          subject: `New message from ${form.firstName} — Duolync`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setForm(INITIAL_FORM);
      } else {
        setError("Something went wrong. Please try again or email us directly.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "var(--bg-navbar)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid var(--border-card)",
        }}
      >
        <Navbar />
      </div>

      <main className="pt-32 pb-24">
        {/* Ambient glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px]" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
        </div>

        <div className="relative container mx-auto px-4 max-w-5xl">
          {/* Page header */}
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-3">
              Get in touch
            </p>
            <h1
              className="font-display font-bold text-white mb-4"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.1 }}
            >
              We&apos;d love to{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hear from you
              </span>
            </h1>
            <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
              Have a question, partnership idea, or just want to say hello? Fill out the form and we&apos;ll get back to you promptly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* ── Left: info cards ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl p-5 flex items-start gap-4"
                  style={{
                    background: card.accentBg,
                    border: `1px solid ${card.accentBorder}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${card.accent}15`, color: card.accent }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                      {card.label}
                    </p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: card.accent }}
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-zinc-300">{card.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social hint */}
              <p className="text-xs text-zinc-600 px-1 mt-2 leading-relaxed">
                You can also reach us on{" "}
                <a
                  href="https://www.linkedin.com/company/duolync/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>{" "}
                or{" "}
                <a
                  href="https://www.instagram.com/duolync/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-white transition-colors"
                >
                  Instagram
                </a>
                .
              </p>
            </div>

            {/* ── Right: form ── */}
            <div
              className="lg:col-span-3 rounded-3xl p-8 md:p-10"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-card)",
              }}
            >
              {isSuccess ? (
                /* ── Success state ── */
                <div className="flex flex-col items-center justify-center text-center py-10 gap-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#34d399" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-xl mb-2">Message sent!</h3>
                    <p className="text-zinc-500 text-sm max-w-xs">
                      Thanks for reaching out. We&apos;ll get back to you at <span className="text-zinc-300">{form.email || "your email"}</span> within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 text-xs text-zinc-600 hover:text-white transition-colors duration-200"
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <h2 className="font-display font-semibold text-white text-lg mb-1">Send us a message</h2>
                    <p className="text-zinc-500 text-sm">All fields are required.</p>
                  </div>

                  {/* First + Last name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="firstName" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                        First name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="Alex"
                        value={form.firstName}
                        onChange={handleChange}
                        className="rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 focus:ring-2"
                        style={{
                          background: "var(--bg-card-hover)",
                          border: "1px solid var(--border-card-strong)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-card-strong)")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="lastName" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder="Johnson"
                        value={form.lastName}
                        onChange={handleChange}
                        className="rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200"
                        style={{
                          background: "var(--bg-card-hover)",
                          border: "1px solid var(--border-card-strong)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-card-strong)")}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className="rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200"
                      style={{
                        background: "var(--bg-card-hover)",
                        border: "1px solid var(--border-card-strong)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-card-strong)")}
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message" className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us how we can help…"
                      value={form.message}
                      onChange={handleChange}
                      className="rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-200 resize-none"
                      style={{
                        background: "var(--bg-card-hover)",
                        border: "1px solid var(--border-card-strong)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-card-strong)")}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-rose-400 rounded-xl px-4 py-3" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                      boxShadow: "0 0 28px rgba(124,58,237,0.2)",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-600">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
