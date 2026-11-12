"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogIn,
  KeyRound,
  Mail,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { DEMO_PROFILES } from "@/lib/mock/data";
import { UserRole } from "@/lib/types";
import { getRoleMeta } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, settings } = usePesiar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Look for matching demo account or default to guardian
    const found = DEMO_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());

    setTimeout(() => {
      setIsLoading(false);
      if (found) {
        switchUser(found.role);
        redirectToRole(found.role);
      } else {
        // Auto sign-in as guardian if email contains anything
        if (email.length > 3) {
          switchUser("guardian");
          redirectToRole("guardian");
        } else {
          setError("Silakan masukkan email atau nomor telepon yang valid.");
        }
      }
    }, 600);
  };

  const handleQuickDemo = (role: UserRole) => {
    switchUser(role);
    redirectToRole(role);
  };

  const redirectToRole = (role: UserRole) => {
    switch (role) {
      case "super_admin":
        router.push("/dashboard/super-admin");
        break;
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "pengurus":
        router.push("/dashboard/pengurus");
        break;
      case "guardian":
        router.push("/dashboard/guardian");
        break;
      case "gate_officer":
        router.push("/dashboard/gate");
        break;
      case "leader":
        router.push("/dashboard/leader");
        break;
      default:
        router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-pesantren-800 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7 text-gold-400" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl text-pesantren-950 tracking-tight block">
              PESIAR<span className="text-gold-600">SANTRI</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {settings.pesantren_name}
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
          Masuk ke Portal Sistem
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Gunakan akun terdaftar atau coba langsung menggunakan tombol demo peran di bawah.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email atau No. WhatsApp
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: wali@pesiarsantri.id"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pesantren-700 focus:border-transparent outline-none transition-all pl-10"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="/lupa-password"
                  className="text-[11px] text-pesantren-700 hover:text-pesantren-900 font-medium"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pesantren-700 focus:border-transparent outline-none transition-all pl-10 pr-10"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-pesantren-900/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-gold-400" />
              <span>{isLoading ? "Memproses..." : "Masuk ke Sistem"}</span>
            </button>
          </form>

          {/* Quick Demo Switcher Grid */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Login Cepat Mode Demo
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                1-Klik
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pilih peran di bawah ini untuk langsung mencoba fitur dashboard terkait:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {DEMO_PROFILES.map((profile) => {
                const meta = getRoleMeta(profile.role);
                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleQuickDemo(profile.role)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-pesantren-600 hover:bg-pesantren-50 text-left transition-all group"
                  >
                    <span className="font-bold text-slate-900 block group-hover:text-pesantren-900 text-xs">
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {profile.full_name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              &larr; Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

