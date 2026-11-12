"use client";

import React, { useState } from "react";
import {
  Printer,
  Download,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatDateID, formatTimeWIB, getPermitStatusMeta } from "@/lib/utils";

export default function LaporanPesiarPage() {
  const { permitsList, santriList, schedulesList, settings } = usePesiar();

  const [selectedScheduleId, setSelectedScheduleId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filtered = permitsList.filter((p) => {
    const matchSch = selectedScheduleId === "all" || p.schedule_id === selectedScheduleId;
    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
    return matchSch && matchStatus;
  });

  const totalPermits = filtered.length;
  const totalApproved = filtered.filter((p) => p.status === "approved" || p.status === "active_out" || p.status === "completed" || p.status === "overdue").length;
  const totalCompleted = filtered.filter((p) => p.status === "completed").length;
  const totalLate = filtered.filter((p) => p.is_late || p.status === "overdue").length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      "Kode Izin",
      "Nama Santri",
      "NIS",
      "Asrama",
      "Jenis Kegiatan",
      "Penjemput",
      "No HP",
      "Status",
      "Jam Keluar",
      "Jam Masuk",
      "Terlambat",
      "Durasi Terlambat (Menit)",
    ];

    const rows = filtered.map((p) => {
      const s = santriList.find((santri) => santri.id === p.santri_id);
      return [
        p.permit_code,
        `"${s?.full_name || "-"}"`,
        s?.nis || "-",
        `"${s?.asrama || "-"}"`,
        p.activity_type,
        `"${p.pickup_person_name}"`,
        p.pickup_person_phone,
        p.status,
        p.check_out_time ? formatTimeWIB(p.check_out_time) : "-",
        p.check_in_time ? formatTimeWIB(p.check_in_time) : "-",
        p.is_late ? "Ya" : "Tidak",
        p.late_duration_minutes || 0,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Pesiar_Santri_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Printable Header Section (Shown only when printed) */}
      <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-xl font-bold uppercase tracking-wide">{settings.pesantren_name}</h1>
        <p className="text-xs text-slate-600">{settings.address} • Telp: {settings.phone}</p>
        <h2 className="text-base font-extrabold mt-3 uppercase border-t pt-2">
          REKAPITULASI LAPORAN KEGIATAN PESIAR & KUNJUNGAN SANTRI
        </h2>
        <p className="text-xs text-slate-500">
          Dicetak pada: {formatDateID(new Date().toISOString())}
        </p>
      </div>

      {/* Screen Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Laporan & Rekapitulasi Pesiar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unduh rekap data, cetak lembar pertanggungjawaban kegiatan, dan analisa kedisiplinan santri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-gold-400" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Total Izin</span>
          <p className="text-2xl font-black text-slate-900">{totalPermits}</p>
          <span className="text-[10px] text-slate-400 block">Seluruh pengajuan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Telah Disetujui</span>
          <p className="text-2xl font-black text-emerald-600">{totalApproved}</p>
          <span className="text-[10px] text-emerald-600 font-medium block">Izin valid</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Kembali Tepat Waktu</span>
          <p className="text-2xl font-black text-blue-600">{totalCompleted}</p>
          <span className="text-[10px] text-blue-500 font-medium block">&lt;= 17.00 WIB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Terlambat Kembali</span>
          <p className="text-2xl font-black text-red-600">{totalLate}</p>
          <span className="text-[10px] text-red-500 font-medium block">&gt; Batas waktu</span>
        </div>
      </div>

      {/* Filter Bar (No Print) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3 no-print">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-600 font-semibold whitespace-nowrap">
            Pilih Periode:
          </label>
          <select
            value={selectedScheduleId}
            onChange={(e) => setSelectedScheduleId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
          >
            <option value="all">Semua Jadwal Pesiar</option>
            {schedulesList.map((sch) => (
              <option key={sch.id} value={sch.id}>
                {sch.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-600 font-semibold whitespace-nowrap">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium"
          >
            <option value="all">Semua Status</option>
            <option value="approved">Disetujui</option>
            <option value="active_out">Sedang Keluar</option>
            <option value="completed">Kembali</option>
            <option value="overdue">Terlambat</option>
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-3 py-3">No</th>
                <th className="px-3 py-3">Kode Izin</th>
                <th className="px-3 py-3">Nama Santri (NIS)</th>
                <th className="px-3 py-3">Asrama & Kelas</th>
                <th className="px-3 py-3">Penjemput</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Jam Keluar</th>
                <th className="px-3 py-3">Jam Masuk</th>
                <th className="px-3 py-3">Keterlambatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((permit, idx) => {
                const santri = santriList.find((s) => s.id === permit.santri_id);
                const statusMeta = getPermitStatusMeta(permit.status);

                return (
                  <tr key={permit.id} className="hover:bg-slate-50/80">
                    <td className="px-3 py-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="px-3 py-3 font-mono font-bold text-slate-800">
                      {permit.permit_code}
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-bold text-slate-900 block">{santri?.full_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">NIS: {santri?.nis}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      <span>{santri?.asrama}</span>
                      <span className="text-slate-400 block text-[10px]">{santri?.kelas}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      <span>{permit.pickup_person_name}</span>
                      <span className="text-slate-400 block text-[10px]">
                        ({permit.pickup_person_relation})
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${statusMeta.bg}`}
                      >
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600 font-mono">
                      {permit.check_out_time ? formatTimeWIB(permit.check_out_time) : "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-600 font-mono">
                      {permit.check_in_time ? formatTimeWIB(permit.check_in_time) : "-"}
                    </td>
                    <td className="px-3 py-3">
                      {permit.is_late ? (
                        <span className="text-red-600 font-bold font-mono">
                          +{permit.late_duration_minutes} Menit
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Tepat Waktu</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signature Section for Print */}
      <div className="hidden print:grid grid-cols-2 pt-12 text-center text-xs text-slate-800">
        <div className="space-y-16">
          <p>Petugas Administrasi & Keamanan,</p>
          <div>
            <p className="font-bold underline">Ustadzah Siti Rahma, S.Pd</p>
            <p className="text-[11px] text-slate-500">Bagian Kesantrian</p>
          </div>
        </div>

        <div className="space-y-16">
          <p>Mengetahui, Mudir Pondok Pesantren,</p>
          <div>
            <p className="font-bold underline">K.H. Abdullah Syukri, Lc., M.A.</p>
            <p className="text-[11px] text-slate-500">Pimpinan Pesantren</p>
          </div>
        </div>
      </div>
    </div>
  );
}

