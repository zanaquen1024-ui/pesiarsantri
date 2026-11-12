"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-md w-full border border-slate-200 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tautan yang
            Anda masukkan keliru.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Ke Halaman Utama</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buka Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

