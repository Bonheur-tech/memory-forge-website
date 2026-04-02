import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/tracks", label: "Tracks" },
  { to: "/timeline", label: "Timeline" },
  { to: "/contact", label: "Contact" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#0B1A2E] border-b border-white/10 shadow-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Never Again AI" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-bold hidden sm:inline text-white">
              Never Again AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === link.to
                    ? "text-white bg-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/submit" className="ml-2">
              <Button
                size="sm"
                className="bg-amber-400 text-[#0B1A2E] hover:bg-amber-300 font-semibold transition-all"
              >
                Register Now
              </Button>
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0B1A2E]">
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === link.to
                      ? "text-white bg-white/15"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/submit" onClick={() => setMobileOpen(false)}>
                <Button className="mt-2 w-full bg-amber-400 text-[#0B1A2E] hover:bg-amber-300 font-semibold">
                  Register Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display text-lg font-bold mb-3">Never Again AI Hackathon</h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed">
                Using AI and Innovation to Preserve Memory and Prevent Hate. A national student hackathon in remembrance.
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Quick Links</h4>
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold mb-3">Contact</h4>
              <p className="text-sm text-primary-foreground/70">info@neveragain-ai.rw</p>
              <p className="text-sm text-primary-foreground/70 mt-1">Kigali, Rwanda</p>
              <div className="flex gap-3 mt-4">
                <span className="text-primary-foreground/50 text-xs">Twitter • LinkedIn • Instagram</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
            <span>© 2026 Never Again AI Hackathon. Remember. Innovate. Never Again.</span>
            <Link
              to="/login"
              className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors underline underline-offset-2"
            >
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
