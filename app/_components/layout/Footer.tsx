const footerLinks = {
  Product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "For Brands", href: "#" },
    { name: "For Creators", href: "#" },
    { name: "API", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Resources: [
    { name: "Help Center", href: "#" },
    { name: "Creator Guide", href: "#" },
    { name: "Brand Guide", href: "#" },
    { name: "Community", href: "#" },
    { name: "Webinars", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: "🐦", href: "#" },
  { name: "LinkedIn", icon: "💼", href: "#" },
  { name: "Instagram", icon: "📷", href: "#" },
  { name: "YouTube", icon: "▶️", href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Nexly
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-xs">
              The leading marketplace connecting brands with authentic content 
              creators for impactful collaborations.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg hover:bg-primary/10 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-bold text-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nexly. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
