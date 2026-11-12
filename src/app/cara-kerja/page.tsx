"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  ShieldCheck,
  QrCode,
  Smartphone,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/navigation/public-footer";

export default function CaraKerjaPage() {
  const [activeTab, setActiveTab] = useState<"wali" | "pengurus" | "gerbang">("wali");

  const tabOptions: Array<{ id: "wali" | "pengurus" | "gerbang"; label: string }> = [
    { id: "wali", label: "Untuk Wali Santri" },
    { id: "pengurus", label: "Untuk Pengurus Asrama" },
    { id: "gerbang", label: "Untuk Petugas Gerbang" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNav />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-pesantren-950 to-pesantren-900 text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-pesantren-800/80 px-3.5 py-1.5 rounded-full border border-pesantren-700">
            Panduan Sistem
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Cara Kerja Sistem PESIAR SANTRI
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Panduan lengkap alur digital dari pengajuan izin oleh wali, verifikasi
            pengurus asrama, hingga pemindaian gerbang aman.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl max-w-md mx-auto">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white text-pesantren-950 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: WALI SANTRI */}
        {activeTab === "wali" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900">
                Alur Mudah untuk Wali Santri
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Lakukan pengajuan kapan saja dari ponsel cerdas Anda tanpa perlu antre formulir fisik.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Login & Pilih Santri",
                  desc: "Masuk menggunakan nomor WhatsApp atau email Anda yang terdaftar, lalu pilih putra/putri yang akan diajukan pesiar.",
                  icon: Smartphone,
                },
                {
                  num: "2",
                  title: "Isi Formulir Izin",
                  desc: "Pilih jenis kegiatan (Pesiar Keluar atau Kunjungan), lengkapi nama pendamping dan plat nomor kendaraan jika ada.",
                  icon: FileCheck2,
                },
                {
                  num: "3",
                  title: "Dapatkan Tiket QR",
                  desc: "Setelah disetujui pengurus asrama, Anda akan mendapatkan Kartu Izin Digital QR untuk dipindai saat tiba di gerbang.",
                  icon: QrCode,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pesantren-50 text-pesantren-800 flex items-center justify-center font-bold font-mono">
                        {step.num}
                      </div>
                      <Icon className="w-5 h-5 text-pesantren-700" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: PENGURUS */}
        {activeTab === "pengurus" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900">
                Alur Kerja Pengurus Asrama (Musyrif)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verifikasi kedisiplinan dan rekam jejak santri sebelum memberikan izin keluar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Review Daftar Pengajuan",
                  desc: "Lihat pengajuan santri di asrama Anda secara real-time melalui dashboard pengurus.",
                  icon: FileCheck2,
                },
                {
                  num: "2",
                  title: "Cek Kedisiplinan",
                  desc: "Pastikan santri tidak memiliki tanggungan hafalan, piket, atau sanksi disiplin pondok.",
                  icon: UserCheck,
                },
                {
                  num: "3",
                  title: "1-Klik Setujui / Tolak",
                  desc: "Beri persetujuan atau tolak disertai catatan resmi yang otomatis terlihat oleh wali santri.",
                  icon: ShieldCheck,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pesantren-50 text-pesantren-800 flex items-center justify-center font-bold font-mono">
                        {step.num}
                      </div>
                      <Icon className="w-5 h-5 text-pesantren-700" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: GERBANG */}
        {activeTab === "gerbang" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900">
                Alur Operasional Petugas Gerbang
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kecepatan dan akurasi tinggi menggunakan kamera smartphone atau tablet di pos keamanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: "1",
                  title: "Arahkan Kamera ke QR",
                  desc: "Petugas membuka scanner gerbang dan memindai QR Code dari layar HP wali santri.",
                  icon: QrCode,
                },
                {
                  num: "2",
                  title: "Verifikasi Data Penjemput",
                  desc: "Layar menampilkan foto santri, nama penjemput, dan status verifikasi dalam 1 detik disertai bunyi chime.",
                  icon: UserCheck,
                },
                {
                  num: "3",
                  title: "Check-Out / Check-In",
                  desc: "Klik tombol Check-Out saat keluar atau Check-In saat santri kembali. Keterlambatan terdeteksi otomatis.",
                  icon: ShieldCheck,
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-pesantren-50 text-pesantren-800 flex items-center justify-center font-bold font-mono">
                        {step.num}
                      </div>
                      <Icon className="w-5 h-5 text-pesantren-700" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900">{step.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-pesantren-700" />
            <span>Pertanyaan yang Sering Diajukan (FAQ)</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                Bagaimana jika wali santri tidak memiliki smartphone untuk mengajukan izin?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Pihak Admin Pesantren atau Pengurus dapat membuatkan pengajuan izin secara
                manual atas nama wali santri melalui dashboard Administrasi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">
                Apa yang terjadi jika santri kembali melewati pukul 17.00 WIB?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Sistem akan secara otomatis mencatat santri dengan status &quot;Terlambat&quot; beserta
                jumlah menit keterlambatan. Laporan keterlambatan ini langsung diteruskan ke
                dashboard Pengurus Asrama dan Pimpinan Pesantren untuk pembinaan lebih lanjut.
              </p>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
