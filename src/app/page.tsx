"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  Clock,
  QrCode,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Building,
  HeartHandshake,
  AlertTriangle,
  FileCheck2,
  ChevronRight,
  MapPin,
  LogIn,
} from "lucide-react";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/navigation/public-footer";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatDateID, formatShortDateID, formatTimeWIB } from "@/lib/utils";

export default function HomePage() {
  const { schedulesList, settings, stats } = usePesiar();

  // Find next upcoming active schedule
  const upcomingSchedule = schedulesList.find((s) => s.is_active) || schedulesList[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-pesantren-950 via-pesantren-900 to-pesantren-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Islamic Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pesantren-800/80 border border-pesantren-700/80 text-xs font-semibold text-gold-300">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>Sistem Informasi Resmi Perizinan Pesantren</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Kelola Pesiar & Kunjungan Santri Lebih{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                  Aman, Tertib, dan Transparan
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Platform digital resmi <strong>{settings.pesantren_name}</strong> untuk
                mengintegrasikan pengajuan izin wali, verifikasi pengurus asrama,
                monitoring keterlambatan, hingga pemindaian gerbang cepat dengan QR Code.
              </p>

              {/* Operating Hours Alert Card */}
              <div className="bg-pesantren-900/90 border border-pesantren-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                    Ketentuan Waktu Kegiatan Resmi: 08.00 – 17.00 WIB
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Dilaksanakan rutin bulanan pada hari Jumat. Seluruh santri yang
                    pesiar wajib kembali dan melakukan verifikasi gerbang sebelum
                    pukul 17.00 WIB.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-pesantren-950 font-bold text-sm shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4 text-pesantren-950" />
                  <span>Buka Portal Pengguna</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cara-kerja"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-pesantren-800/80 hover:bg-pesantren-800 text-white font-semibold text-sm border border-pesantren-700/80 transition-all"
                >
                  <span>Lihat Cara Kerja Sistem</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Dynamic Upcoming Schedule Card & Key Highlights */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pesantren-800" />
                    <span className="font-bold text-sm text-pesantren-950 uppercase tracking-wider">
                      Jadwal Pesiar Terdekat
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>

                {upcomingSchedule ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                        {upcomingSchedule.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {upcomingSchedule.notes}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Hari & Tanggal:</span>
                        <span className="font-bold text-pesantren-900">
                          {formatDateID(upcomingSchedule.event_date)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Jam Kegiatan:</span>
                        <span className="font-bold text-slate-900">
                          {formatTimeWIB(upcomingSchedule.start_time)} – {formatTimeWIB(upcomingSchedule.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Kuota Santri:</span>
                        <span className="font-semibold text-slate-700">
                          Maksimal {upcomingSchedule.max_quota} Santri
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-pesantren-50 border border-pesantren-200 text-xs">
                        <span className="font-bold text-pesantren-900 block">Pesiar Keluar</span>
                        <span className="text-slate-500 text-[11px]">Refreshing bersama keluarga</span>
                      </div>
                      <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                        <span className="font-bold text-indigo-900 block">Kunjungan</span>
                        <span className="text-slate-500 text-[11px]">Keluarga bertamu di pesantren</span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/guardian/ajukan"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <FileCheck2 className="w-4 h-4 text-gold-400" />
                      <span>Ajukan Izin Santri Sekarang</span>
                    </Link>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    Belum ada jadwal aktif yang dipublikasikan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 Main Activities Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-pesantren-800 tracking-wider uppercase bg-pesantren-50 px-3 py-1 rounded-full border border-pesantren-200">
              2 Jenis Aktivitas Kegiatan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Fleksibilitas Menemui & Mendampingi Santri
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Pesantren memberikan dua alternatif pilihan refreshing yang dapat
              dipilih oleh wali santri sesuai kebutuhan keluarga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Pesiar Keluar */}
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-pesantren-800 text-white flex items-center justify-center mb-5 shadow-md">
                <Users className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                1. Pesiar Keluar Bersama Keluarga
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Santri dijemput oleh orang tua / wali yang telah terverifikasi untuk
                refreshing ke luar lingkungan pesantren selama jam pesiar resmi
                (08.00 – 17.00 WIB).
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Wajib menunjukkan Kartu Izin Digital QR saat gerbang keluar & masuk.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Penjemput tercatat dalam sistem dan telah diverifikasi pengurus.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Santri kembali sebelum jam 17.00 WIB dengan seragam rapi.</span>
                </li>
              </ul>
            </div>

            {/* Card 2: Kunjungan di Pesantren */}
            <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white flex items-center justify-center mb-5 shadow-md">
                <HeartHandshake className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                2. Kunjungan Keluarga di Pesantren
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Keluarga bersilaturahmi dan menjenguk santri secara langsung di
                area gazebo, taman, dan fasilitas kunjungan resmi di lingkungan
                pesantren tanpa santri meninggalkan area kampus.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Area ramah keluarga dan nyaman untuk santai bersama santri.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Dapat membawakan makanan favorit dan perlengkapan santri.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Waktu bertamu fleksibel dalam rentang jam 08.00 – 17.00 WIB.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps How It Works */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-pesantren-800 tracking-wider uppercase bg-pesantren-100 px-3 py-1 rounded-full">
              Alur Perizinan Modern
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              4 Langkah Mudah Menjalankan Pesiar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Wali Mengajukan",
                desc: "Wali mengajukan izin melalui website dengan mengisi data penjemput dan jenis kegiatan.",
                icon: FileCheck2,
              },
              {
                step: "02",
                title: "Persetujuan Pengurus",
                desc: "Musyrif asrama memverifikasi kedisiplinan dan menyetujui pengajuan izin santri.",
                icon: ShieldCheck,
              },
              {
                step: "03",
                title: "Scan QR di Gerbang",
                desc: "Wali menunjukkan QR Code di gerbang. Petugas memindai dalam 1 detik untuk Check-Out.",
                icon: QrCode,
              },
              {
                step: "04",
                title: "Kembali Tepat Waktu",
                desc: "Santri kembali sebelum 17.00 WIB. Petugas scan Check-In dan sistem mencatat audit log.",
                icon: Clock,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-200 font-mono">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-pesantren-50 text-pesantren-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 User Roles Showcase */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Sistem Terintegrasi untuk 6 Peran
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Setiap pihak memiliki dashboard khusus sesuai tugas dan tanggung jawabnya.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { role: "Super Admin", desc: "Kelola Admin & Konfigurasi Sistem", link: "/dashboard/super-admin" },
              { role: "Admin Pesantren", desc: "Master Data Santri & Jadwal", link: "/dashboard/admin" },
              { role: "Pengurus Asrama", desc: "Verifikasi Izin & Pantau Santri", link: "/dashboard/pengurus" },
              { role: "Wali Santri", desc: "Pengajuan Mandiri & Tiket QR", link: "/dashboard/guardian" },
              { role: "Petugas Gerbang", desc: "Pemindai QR Cepat & Log Gerbang", link: "/dashboard/gate" },
              { role: "Pimpinan / Mudir", desc: "Executive KPI & Laporan Real-time", link: "/dashboard/leader" },
            ].map((r, i) => (
              <Link
                key={i}
                href={r.link}
                className="p-4 rounded-xl border border-slate-200 hover:border-pesantren-600 hover:bg-pesantren-50/50 transition-all text-center flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold text-gold-600 block">Role #{i + 1}</span>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-pesantren-900 mt-1">
                    {r.role}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">{r.desc}</p>
                </div>
                <span className="text-[10px] font-semibold text-pesantren-700 mt-3 block">
                  Buka Portal &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pesantren Contact & Hotline Banner */}
      <section className="bg-pesantren-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Butuh Bantuan Teknis atau Informasi Pesiar?</h3>
            <p className="text-xs text-pesantren-200">
              Sekretariat dan Layanan Wali Santri {settings.pesantren_name} siap melayani Anda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Hotline</span>
            </a>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-700 text-white font-medium text-xs border border-pesantren-600 transition-all"
            >
              <LogIn className="w-4 h-4 text-gold-400" />
              <span>Login Akun</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
