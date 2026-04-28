import { useState } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Brands", href: "#for-brands" },
    { name: "For Creators", href: "#for-creators" },
    { name: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #08c2cc, #7d2ae8)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              Nexly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground" asChild>
              <Link href="/auth">Sign Up</Link>
            </Button>
            <Button className="btn-gradient rounded-md px-5 font-medium" asChild>
              <Link href="/auth?mode=login">Log In</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                <Button variant="ghost" className="w-full justify-center font-medium text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/auth">Sign Up</Link>
                </Button>
                <Button className="btn-gradient w-full rounded-md font-medium" asChild>
                  <Link href="/auth?mode=login">Log In</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
