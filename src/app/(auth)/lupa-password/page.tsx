"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";

export default function LupaPasswordPage() {
  const { settings } = usePesiar();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
          Lupa Kata Sandi
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Masukkan email akun Anda untuk menerima tautan pemulihan kata sandi.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200/80">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Instruksi Terkirim</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Jika email <strong>{email}</strong> terdaftar di sistem kami, instruksi pemulihan kata sandi telah dikirimkan.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="block w-full py-2.5 rounded-xl bg-pesantren-800 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Kembali ke Halaman Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Akun Terdaftar
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pesantren-700 outline-none pl-10"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
              >
                Kirim Tautan Reset Password
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  &larr; Batal & Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

