"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme();

  // Placeholder prevents SSR/client icon mismatch before hydration
  if (!mounted) {
    return (
      <div
        className="w-9 h-9 rounded-xl shrink-0"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
        }}
        aria-hidden
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-[1.08] active:scale-95 shrink-0"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        boxShadow: "var(--shadow-card)",
        color: theme === "dark" ? "#a78bfa" : "#f59e0b",
      }}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
