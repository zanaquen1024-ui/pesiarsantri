"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  Sparkles,
  Award,
  BookOpen,
  Building2,
  Heart,
} from "lucide-react";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/navigation/public-footer";
import { usePesiar } from "@/lib/context/pesiar-context";

export default function TentangPage() {
  const { settings } = usePesiar();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNav />

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-pesantren-950 to-pesantren-900 text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-pesantren-800/80 px-3.5 py-1.5 rounded-full border border-pesantren-700">
            Mengenal Aplikasi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Tentang PESIAR SANTRI
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Transformasi digital sistem pengelolaan refreshing, perizinan, dan
            kunjungan keluarga santri di lingkungan {settings.pesantren_name}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        {/* Latar Belakang */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-pesantren-700" />
            <span>Latar Belakang & Urgensi Digitalisasi</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pesantren merupakan lembaga pendidikan yang mengemban amanah besar dalam menjaga
            keselamatan, kesehatan, dan kedisiplinan para santri. Kegiatan pesiar (outing) dan
            kunjungan keluarga adalah agenda penting yang memberikan penyegaran mental bagi
            santri selama menempuh masa belajar di pondok.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Sebelum adanya sistem ini, proses perizinan dilakukan secara manual menggunakan
            kertas formulir fisik, sering terjadi antrean panjang di pos gerbang, pencatatan
            manual santri yang kembali rentan terlewat, dan pimpinan kesulitan memantau santri
            yang terlambat secara real-time. <strong>PESIAR SANTRI</strong> hadir untuk
            menghilangkan seluruh hambatan tersebut melalui sistem otomasi terintegrasi.
          </p>
        </section>

        {/* 4 Pilar Utama */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900">
              4 Pilar Utama Aplikasi
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Prinsip yang mendasari perancangan dan operasional PESIAR SANTRI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "1. Keamanan & Akuntabilitas Santri",
                desc: "Hanya orang tua/wali yang terverifikasi dan tercatat dalam sistem yang berhak menjemput santri, mencegah hal-hal yang tidak diinginkan.",
                icon: ShieldCheck,
                color: "text-emerald-700 bg-emerald-50 border-emerald-200",
              },
              {
                title: "2. Efisiensi Antrean Gerbang",
                desc: "Pemindaian QR Code membutuhkan waktu kurang dari 2 detik per santri, mengurai kepadatan di pos keamanan gerbang utama.",
                icon: Award,
                color: "text-blue-700 bg-blue-50 border-blue-200",
              },
              {
                title: "3. Transparansi & Keterbukaan",
                desc: "Wali santri dapat melihat status persetujuan secara live langsung dari ponsel masing-masing tanpa harus menghubungi musyrif.",
                icon: Users,
                color: "text-purple-700 bg-purple-50 border-purple-200",
              },
              {
                title: "4. Monitoring Keterlambatan Otomatis",
                desc: "Sistem secara otomatis mengidentifikasi santri yang belum kembali melewati pukul 17.00 WIB dan menghitung durasi keterlambatan.",
                icon: Target,
                color: "text-amber-700 bg-amber-50 border-amber-200",
              },
            ].map((pilar, i) => {
              const Icon = pilar.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${pilar.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{pilar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pilar.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-pesantren-900 text-white rounded-3xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold">Siap Menggunakan PESIAR SANTRI?</h3>
          <p className="text-xs text-pesantren-200 max-w-lg mx-auto">
            Masuk ke portal pengguna menggunakan akun yang telah diberikan oleh pihak pesantren.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Halaman Login
            </Link>
            <Link
              href="/cara-kerja"
              className="px-6 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-700 text-white font-medium text-xs border border-pesantren-600 transition-all"
            >
              Pelajari Cara Kerja
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

