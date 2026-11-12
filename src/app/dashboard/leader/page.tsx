"use client";

import React from "react";
import {
  BarChart3,
  Users,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Printer,
  Building,
  TrendingUp,
  FileText,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatTimeWIB, formatDateID, getPermitStatusMeta } from "@/lib/utils";

export default function LeaderDashboardPage() {
  const { santriList, permitsList, schedulesList, settings, stats } = usePesiar();

  const activeSchedule = schedulesList.find((s) => s.is_active) || schedulesList[0];

  const totalRegistered = santriList.length;
  const totalApprovedPermits = permitsList.filter(
    (p) => p.status === "approved" || p.status === "active_out" || p.status === "completed" || p.status === "overdue"
  ).length;

  const totalCompleted = permitsList.filter((p) => p.status === "completed").length;
  const totalActiveOut = permitsList.filter((p) => p.status === "active_out").length;
  const totalOverdue = permitsList.filter((p) => p.status === "overdue" || (p.is_late && p.status === "active_out")).length;

  // On-time percentage calculation
  const returnedTotal = totalCompleted + totalOverdue;
  const onTimePercentage = returnedTotal > 0 ? Math.round((totalCompleted / returnedTotal) * 100) : 100;

  // Asrama breakdown
  const asramaStats = [
    { name: "Asrama Abu Bakar Ash-Shiddiq", count: 2, out: 1, overdue: 0 },
    { name: "Asrama Khadijah Al-Kubra", count: 1, out: 1, overdue: 0 },
    { name: "Asrama Umar Bin Khattab", count: 1, out: 0, overdue: 0 },
    { name: "Asrama Ali Bin Abi Thalib", count: 1, out: 0, overdue: 1 },
    { name: "Asrama Aisyah Humaira", count: 1, out: 0, overdue: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-pesantren-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-pesantren-900 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
              Executive Briefing Room
            </span>
            <span className="text-xs text-pesantren-300">| Pimpinan Pesantren</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Laporan Real-Time Kegiatan Pesiar
          </h2>
          <p className="text-xs text-pesantren-200">
            Monitoring tingkat kepatuhan santri, rasio kepulangan tepat waktu, dan pergerakan santri keluar pondok.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all shrink-0 no-print"
        >
          <Printer className="w-4 h-4 text-pesantren-950" />
          <span>Cetak Executive Brief</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Santri di Luar Kampus
          </span>
          <p className="text-3xl font-black text-blue-600">{totalActiveOut}</p>
          <span className="text-[11px] text-blue-500 font-medium">Batas kembali 17.00 WIB</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Kembali Tepat Waktu
          </span>
          <p className="text-3xl font-black text-emerald-600">{totalCompleted}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Sudah di asrama</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Santri Terlambat
          </span>
          <p className="text-3xl font-black text-red-600">{totalOverdue}</p>
          <span className="text-[11px] text-red-600 font-bold">&gt; Batas toleransi</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            Tingkat Kepatuhan Waktu
          </span>
          <p className="text-3xl font-black text-pesantren-800">{onTimePercentage}%</p>
          <span className="text-[11px] text-slate-400">Rasio disiplin kepulangan</span>
        </div>
      </div>

      {/* Breakdown per Asrama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-pesantren-700" />
              <span>Distribusi Pesiar per Asrama</span>
            </h3>
            <span className="text-xs text-slate-400">Update Real-time</span>
          </div>

          <div className="space-y-3">
            {asramaStats.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{item.name}</span>
                  <span className="text-pesantren-800">{item.count} Santri</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-blue-500 h-2" style={{ width: `${item.out * 50}%` }} title="Di luar" />
                  <div className="bg-red-500 h-2" style={{ width: `${item.overdue * 50}%` }} title="Terlambat" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Sedang di luar: {item.out}</span>
                  {item.overdue > 0 && (
                    <span className="text-red-600 font-bold">Terlambat: {item.overdue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kebijakan & Kesimpulan Eksekutif */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pesantren-700" />
              <span>Laporan Kedisiplinan & Tindak Lanjut</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
              <span className="font-bold block mb-1">Status Keamanan Umum: Terkendali</span>
              <p className="text-[11px] leading-relaxed">
                Seluruh santri yang keluar telah diverifikasi dengan wali sah beridentitas jelas.
                Proses check-out dan check-in terpantau lancar tanpa antrean menumpuk di gerbang utama.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="font-bold block mb-1">Tindak Lanjut Keterlambatan:</span>
              <p className="text-[11px] leading-relaxed">
                Santri yang kembali melewati batas waktu 17.00 WIB diberikan pembinaan oleh musyrif asrama
                dan wali santri dihubungi secara langsung oleh tim pengasuhan santri.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

