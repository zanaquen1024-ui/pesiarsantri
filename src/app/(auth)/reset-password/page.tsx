"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { settings } = usePesiar();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pesantren-800 text-white flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 text-gold-400" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl text-pesantren-950 tracking-tight block">
              PESIAR<span className="text-gold-600">SANTRI</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">{settings.pesantren_name}</span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
          Buat Kata Sandi Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80">
          {success ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Kata Sandi Berhasil Diperbarui</h3>
              <p className="text-xs text-slate-500">
                Mengarahkan Anda ke halaman login dalam beberapa detik...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pesantren-700 outline-none pl-10"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ulangi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pesantren-700 outline-none pl-10"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                Simpan Kata Sandi Baru
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

