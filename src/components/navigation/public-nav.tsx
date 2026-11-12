"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Calendar,
  Clock,
  Menu,
  X,
  LogIn,
  ChevronRight,
  Sparkles,
  Phone,
  BookOpen,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";

export function PublicNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { settings, currentUser } = usePesiar();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang Aplikasi" },
    { href: "/kegiatan", label: "Informasi Kegiatan" },
    { href: "/cara-kerja", label: "Cara Kerja" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner: Jam Kegiatan & Hotline */}
      <div className="bg-pesantren-900 text-pesantren-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Waktu Kegiatan Resmi: {settings.operating_hours} (Hari {settings.standard_day})
            </span>
            <span className="hidden md:inline-block text-pesantren-400">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-pesantren-200">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              Agenda Rutin Bulanan Pesantren
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-gold-400" />
              Hotline: {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pesantren-800 to-pesantren-950 flex items-center justify-center text-white shadow-md shadow-pesantren-900/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-pesantren-950 tracking-tight">
                  PESIAR<span className="text-gold-600">SANTRI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-pesantren-100 text-pesantren-800 rounded">
                  Digital Pass
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {settings.pesantren_name}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-pesantren-900 bg-pesantren-50 font-semibold"
                      : "text-slate-600 hover:text-pesantren-800 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button: Login / Dashboard */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-gold-300" />
              <span>Buka Portal Sistem</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-pesantren-50 text-pesantren-800 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 text-white text-sm font-medium"
            >
              <LogIn className="w-4 h-4 text-gold-300" />
              <span>Buka Portal Sistem</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              <span>Halaman Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

