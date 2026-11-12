"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  FileCheck2,
  QrCode,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatDateID, formatTimeWIB, getPermitStatusMeta } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { santriList, schedulesList, permitsList, stats } = usePesiar();

  const activeSchedule = schedulesList.find((s) => s.is_active) || schedulesList[0];
  const recentPermits = permitsList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-pesantren-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md border border-pesantren-800">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            Administrasi Pesantren
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Pusat Data & Operasional Pesiar
          </h2>
          <p className="text-xs text-pesantren-200 max-w-xl">
            Kelola master data santri, perizinan, jadwal bulanan, dan pemantauan
            kegiatan refreshing santri secara terpusat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/dashboard/admin/perizinan"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-pesantren-950" />
            <span>Buat Izin Manual</span>
          </Link>
          <Link
            href="/dashboard/admin/santri"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-700 text-white font-medium text-xs border border-pesantren-700 transition-all"
          >
            <Users className="w-4 h-4 text-gold-400" />
            <span>Data Santri</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Santri</span>
            <Users className="w-4 h-4 text-pesantren-700" />
          </div>
          <p className="text-2xl font-black text-slate-900">{stats.totalSantri}</p>
          <span className="text-[11px] text-slate-400 block">Terdaftar aktif</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Menunggu Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600">{stats.totalPending}</p>
          <span className="text-[11px] text-slate-400 block">Perlu persetujuan pengurus</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Sedang di Luar</span>
            <QrCode className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600">{stats.totalActiveOut}</p>
          <span className="text-[11px] text-slate-400 block">Pesiar aktif</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Terlambat Kembali</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600">{stats.totalOverdue}</p>
          <span className="text-[11px] text-red-500 font-semibold block">&gt; Batas 17.00 WIB</span>
        </div>
      </div>

      {/* 2 Column Section: Active Schedule + Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Schedule Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-pesantren-700" />
              <span>Jadwal Aktif Pesantren</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              Aktif
            </span>
          </div>

          {activeSchedule ? (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {activeSchedule.title}
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="font-bold text-slate-900">
                    {formatDateID(activeSchedule.event_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jam Pesiar:</span>
                  <span className="font-bold text-pesantren-800">
                    {formatTimeWIB(activeSchedule.start_time)} – {formatTimeWIB(activeSchedule.end_time)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kuota Terisi:</span>
                  <span className="font-semibold text-slate-700">
                    {permitsList.length} / {activeSchedule.max_quota} Santri
                  </span>
                </div>
              </div>

              <Link
                href="/dashboard/admin/jadwal"
                className="text-xs text-pesantren-800 hover:text-pesantren-950 font-bold flex items-center gap-1"
              >
                <span>Kelola Seluruh Jadwal &rarr;</span>
              </Link>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Belum ada jadwal yang diaktifkan.</p>
          )}
        </div>

        {/* Recent Permits List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-pesantren-700" />
              <span>Pengajuan Perizinan Terbaru</span>
            </h3>
            <Link
              href="/dashboard/admin/perizinan"
              className="text-xs text-pesantren-800 hover:text-pesantren-950 font-bold"
            >
              Lihat Semua &rarr;
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPermits.map((permit) => {
              const santri = santriList.find((s) => s.id === permit.santri_id);
              const statusMeta = getPermitStatusMeta(permit.status);
              return (
                <div
                  key={permit.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {santri?.full_name || "Santri"}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {permit.permit_code}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Penjemput: {permit.pickup_person_name} ({permit.pickup_person_relation}) • Asrama: {santri?.asrama}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                    {statusMeta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

