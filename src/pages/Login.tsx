import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft, Cpu, AlertTriangle } from "lucide-react";

const Login = () => {
  const { signIn, user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState("");
  const [submitting, setSubmitting]     = useState(false);

  // Redirect once auth + role are fully resolved
  useEffect(() => {
    if (loading || !user) return;
    // role is still resolving (fetchRole with retry can take up to ~10s) — wait
    if (role === null) return;
    if (role === "judge")            navigate("/judge",       { replace: true });
    else if (role === "coordinator") navigate("/coordinator", { replace: true });
    else                             navigate("/admin",        { replace: true });
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err) {
      if (err.message.toLowerCase().includes("email not confirmed")) {
        setError("Email not confirmed. Contact your administrator.");
      } else if (err.message.toLowerCase().includes("invalid login")) {
        setError("Invalid email or password.");
      } else {
        setError(err.message);
      }
    }
    // On success: auth state updates via onAuthStateChange and useEffect above redirects
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "var(--hero-gradient, linear-gradient(135deg,#0B1A2E 0%,#1a2744 100%))" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 bg-white -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5 bg-white translate-y-1/3 -translate-x-1/3" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-amber-400" />
            </div>
            <span className="font-display text-xl font-bold text-white">Never Again AI</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
            <Shield className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-medium text-white/90 tracking-wide uppercase">Staff Portal</span>
          </div>
          <h1 className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight">
            Manage the
            <span className="block text-amber-400 mt-1">Hackathon</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-xs">
            Login to access your role dashboard — admin, judge, or coordinator.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: "Admin",       value: "Full control" },
              { label: "Judge",       value: "Score projects" },
              { label: "Coordinator", value: "Monitor teams" },
              { label: "Rankings",    value: "Live leaderboard" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-white/40 text-xs mb-1">{item.label}</div>
                <div className="text-white/90 text-sm font-semibold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-amber-400/60" />
          <span className="text-white/40 text-xs">Never Again AI Hackathon 2026</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-background px-6 sm:px-12 py-12">
        <div className="w-full max-w-md mb-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 flex items-center justify-center mb-5">
              <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Staff Login</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in with your staff credentials to access your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg p-3.5">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-11 h-11"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold mt-2"
              disabled={submitting || loading}
            >
              {submitting || (loading && user) ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <span className="font-semibold text-foreground">Are you a student?</span>{" "}
              This page is for staff only.{" "}
              <Link to="/submit" className="text-purple-600 hover:underline font-medium">
                Submit your project here →
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center hidden lg:block">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to the main site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
