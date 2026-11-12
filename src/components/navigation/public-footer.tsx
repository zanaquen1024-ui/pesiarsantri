"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";

export function PublicFooter() {
  const { settings } = usePesiar();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Identity & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pesantren-800 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">
                  PESIAR<span className="text-gold-500">SANTRI</span>
                </span>
                <p className="text-xs text-slate-400">{settings.pesantren_name}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Sistem informasi perizinan dan kunjungan santri terintegrasi untuk
              memastikan keamanan, ketertiban, dan kenyamanan seluruh santri,
              wali santri, pengurus asrama, serta pimpinan pesantren.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-gold-400">
              <Clock className="w-4 h-4" />
              <span>Jadwal Standar: Jumat, 08.00 – 17.00 WIB (Waktu Indonesia Barat)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Tautan Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-gold-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-gold-400 transition-colors">
                  Tentang Aplikasi
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="hover:text-gold-400 transition-colors">
                  Jadwal & Aturan Pesiar
                </Link>
              </li>
              <li>
                <Link href="/cara-kerja" className="hover:text-gold-400 transition-colors">
                  Panduan Perizinan
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold-400 transition-colors">
                  Login Pengguna
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Kontak Pesantren
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pesantren-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pesantren-400 shrink-0" />
                <a
                  href={`tel:${settings.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pesantren-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} PESIAR SANTRI — {settings.pesantren_name}. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-6">
            <span>Sistem Informasi Pesantren Berbasis Cloud</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sistem Aktif (Asia/Jakarta)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

