"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";

// Simple in-memory admin auth for demo (when Supabase is not configured)
const DEMO_ADMIN = { email: "admin@pasal.ug.edu.gh", password: "pasal2024" };

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          setError("Invalid credentials. Please try again.");
          return;
        }

        // Check if user is actually an admin
        const { data: adminData } = await supabase
          .from("admins")
          .select("id")
          .eq("id", data.user?.id)
          .single();

        if (!adminData) {
          await supabase.auth.signOut();
          setError("Access denied. You are not an authorized administrator.");
          return;
        }

        router.push("/admin/dashboard");
      } else {
        // Demo mode (no Supabase configured)
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          if (typeof window !== "undefined") {
            localStorage.setItem("pasal_admin_authed", "true");
          }
          router.push("/admin/dashboard");
        } else {
          setError(`Invalid credentials. Demo: use ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-container-padding-mobile">
      {/* Background Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-container/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 slide-up">
        {/* Logo Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="relative w-16 h-16 bg-white/80 dark:bg-surface-container/80 backdrop-blur rounded-2xl p-2 shadow-md flex items-center justify-center border border-primary/10 transition-transform hover:scale-105 duration-200">
              <div className="relative w-full h-full">
                <Image
                  src="/pasal_logo.png"
                  alt="PASAL Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="h-10 w-px bg-primary/20" />
            <div className="relative w-14 h-14 bg-white/80 dark:bg-surface-container/80 backdrop-blur rounded-2xl p-2 shadow-md flex items-center justify-center border border-primary/10 transition-transform hover:scale-105 duration-200">
              <div className="relative w-full h-full">
                <Image
                  src="/UG_logo.png"
                  alt="UG Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-primary mb-1">
            PASAL Admin
          </h1>
          <p className="text-on-surface-variant text-sm">
            Administration Portal — University of Ghana
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-2xl shadow-xl">
          <h2 className="font-display text-xl font-bold text-primary mb-2">
            Sign in to your account
          </h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Restricted access. Authorized administrators only.
          </p>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pasal.ug.edu.gh"
                className="w-full bg-surface-container-low border-none rounded-lg p-3 font-body-md text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block font-label-sm text-xs font-bold text-on-surface-variant tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-surface-container-low border-none rounded-lg p-3 pr-10 font-body-md text-sm focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-lg font-display font-bold text-sm hover:bg-primary-container hover:text-on-primary-container active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              <Shield className="w-4 h-4" />
              {loading ? "Signing in..." : "Sign In as Administrator"}
            </button>
          </form>

          {/* Demo Notice */}
          {!isSupabaseConfigured && (
            <div className="mt-6 p-4 bg-secondary-container/10 border border-secondary/20 rounded-lg text-xs text-on-surface-variant">
              <span className="font-bold text-secondary">Demo Mode Active.</span>{" "}
              Supabase is not configured. Use:{" "}
              <code className="bg-surface-container px-1 rounded">
                admin@pasal.ug.edu.gh
              </code>{" "}
              /{" "}
              <code className="bg-surface-container px-1 rounded">pasal2024</code>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-on-surface-variant mt-6">
          © {new Date().getFullYear()} University of Ghana — PASAL Portal
        </p>
      </div>
    </div>
  );
}
