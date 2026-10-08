import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RaincoLogo, useWorkspace } from "./workspace";

export function Login() {
  const { supplier, login, lastRegistrationNotice, setLastRegistrationNotice } = useWorkspace();
  const router = useRouter();

  const [username, setUsername] = useState(supplier.username || "leabon_ops");
  const [password, setPassword] = useState(supplier.password || "password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your registered username or email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      login(username, password);
      setLastRegistrationNotice(null);
      // Redirect to supplier portal dashboard
      router.navigate({ to: "/" });
    }, 350);
  };

  const handlePrefill = () => {
    setUsername(supplier.username || "leabon_ops");
    setPassword(supplier.password || "password123");
    setError("");
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Brand header */}
      <div className="text-center mb-6">
        <div className="mx-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white border border-border shadow-sm mb-3">
          <RaincoLogo className="h-10 w-auto" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Supplier Portal Sign-In
        </h1>
      </div>

      {/* Registration notice banner if redirected from registration */}
      {lastRegistrationNotice && (
        <div className="mb-5 p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-50/80 text-emerald-900 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Registration Completed!</strong>
            <p className="mt-0.5 text-emerald-800">{lastRegistrationNotice}</p>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <User size={15} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. northwind_ops"
                className="w-full pl-9 pr-3 py-2 bg-background border border-input rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground">Password</label>
              <button
                type="button"
                onClick={handlePrefill}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Pre-fill registered details
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-9 py-2 bg-background border border-input rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs font-medium h-9 gap-1.5"
          >
            <span>{loading ? "Signing in..." : "Sign In to Supplier Portal"}</span>
            <ArrowRight size={14} />
          </Button>
        </form>

        <div className="mt-5 pt-4 border-t border-border flex flex-col gap-2.5 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Need to complete registration?</span>
            <Link
              to="/register"
              className="text-primary font-medium hover:underline inline-flex items-center gap-1"
            >
              <Mail size={12} />
              <span>Email Invitation Link</span>
            </Link>
          </div>
          <div className="p-2.5 rounded bg-muted/40 text-[11px] text-muted-foreground">
            <strong>Sample Credentials:</strong> Username:{" "}
            <code className="text-foreground font-mono">
              {supplier.username || "northwind_ops"}
            </code>{" "}
            · Password:{" "}
            <code className="text-foreground font-mono">{supplier.password || "password123"}</code>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <ShieldCheck size={13} className="text-primary" />
        <span>Rainco Procurement Suite · Session Wireframe</span>
      </div>
    </div>
  );
}
