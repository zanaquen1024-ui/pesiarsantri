"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Users,
  Car,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { PublicNav } from "@/components/navigation/public-nav";
import { PublicFooter } from "@/components/navigation/public-footer";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatDateID, formatShortDateID, formatTimeWIB } from "@/lib/utils";

export default function KegiatanPage() {
  const { schedulesList, settings } = usePesiar();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNav />

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-pesantren-950 to-pesantren-900 text-white py-16 sm:py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400 bg-pesantren-800/80 px-3.5 py-1.5 rounded-full border border-pesantren-700">
            Jadwal & Peraturan Resmi
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Informasi Kegiatan Pesiar
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Panduan jadwal dinamis, aturan berpakaian, ketentuan waktu, dan tata tertib
            kunjungan santri {settings.pesantren_name}.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-12">
        {/* Aturan Waktu Resmi Callout */}
        <div className="bg-pesantren-900 text-white rounded-3xl p-6 sm:p-8 border border-pesantren-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
              Aturan Waktu Standar
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold">
              Pukul 08.00 – 17.00 WIB (Hari Jumat)
            </h2>
            <p className="text-xs text-pesantren-200 max-w-xl">
              Sesuai SK Pimpinan Pesantren, gerbang penjemputan dibuka mulai pukul
              08.00 WIB dan ditutup tepat pukul 17.00 WIB. Sistem gate scanner akan
              otomatis mencatat status keterlambatan apabila melewati batas waktu.
            </p>
          </div>
          <div className="shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-gold-500 text-pesantren-950 font-bold text-center">
              <span className="text-xs block uppercase">Toleransi Maksimal</span>
              <span className="text-xl font-black">{settings.max_late_tolerance_minutes} Menit</span>
            </div>
          </div>
        </div>

        {/* Dynamic Schedules List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Daftar Jadwal Pesiar Mendatang
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Jadwal dikelola secara dinamis oleh Administrasi Pesantren.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {schedulesList.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pesantren-100 text-pesantren-800">
                      {schedule.is_active ? "Jadwal Aktif" : "Selesai"}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Maks. {schedule.max_quota} Santri
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{schedule.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium text-pesantren-900">
                      <Calendar className="w-4 h-4 text-pesantren-700" />
                      {formatDateID(schedule.event_date)}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-gold-600" />
                      {formatTimeWIB(schedule.start_time)} – {formatTimeWIB(schedule.end_time)}
                    </span>
                  </div>

                  {schedule.notes && (
                    <p className="text-xs text-slate-500 italic max-w-2xl">{schedule.notes}</p>
                  )}
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Link
                    href="/dashboard/guardian/ajukan"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <FileCheck2 className="w-4 h-4 text-gold-300" />
                    <span>Ajukan Izin Santri</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tata Tertib & Peraturan Khusus */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-pesantren-700" />
            <span>Tata Tertib & Ketentuan Wajib</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Aturan Berpakaian (Dresscode)</span>
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600">
                <li>Santri Putra: Baju koko/batik resmi pondok, celana panjang sopan, dan peci hitam.</li>
                <li>Santri Putri: Gamis syar&apos;i sopan longgar, jilbab menutup dada rapi.</li>
                <li>Dilarang memakai celana jeans ketat, kaos bergambar tidak senonoh, atau pakaian terbuka.</li>
              </ul>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Ketentuan Kendaraan & Penjemput</span>
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-600">
                <li>Hanya penjemput yang tertera di surat izin yang diperkenankan membawa santri.</li>
                <li>Kendaraan diparkir dengan tertib di area parkir utama yang telah ditentukan.</li>
                <li>Pengemudi wajib mematikan mesin kendaraan saat menunggu santri di area lobi.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

