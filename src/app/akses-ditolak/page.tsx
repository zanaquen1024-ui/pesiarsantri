"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/navigation/public-footer";

export default function AksesDitolakPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNav />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full text-center border border-slate-200 shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider">
              Error 403: Akses Ditolak
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Hak Akses Tidak Memadai
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Anda tidak memiliki izin otorisasi untuk membuka halaman ini. Silakan
              masuk dengan akun yang memiliki wewenang atau kembali ke beranda.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Dashboard Utama</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all"
            >
              <LogIn className="w-4 h-4 text-slate-500" />
              <span>Ganti Akun / Login Ulang</span>
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}

