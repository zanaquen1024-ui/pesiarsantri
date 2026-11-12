"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Phone,
  Building,
  Search,
  Filter,
  MessageSquare,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatDateTimeWIB, formatTimeWIB, getActivityTypeMeta } from "@/lib/utils";

export default function PengurusDashboardPage() {
  const { permitsList, santriList, approvePermit, rejectPermit, stats } = usePesiar();

  const [activeTab, setActiveTab] = useState<"pending" | "active_out" | "overdue">("pending");
  const [searchTerm, setSearchTerm] = useState("");

  const pendingPermits = permitsList.filter((p) => p.status === "pending");
  const activeOutPermits = permitsList.filter((p) => p.status === "active_out");
  const overduePermits = permitsList.filter((p) => p.status === "overdue" || (p.is_late && p.status === "active_out"));

  const handleApprove = (id: string, santriName: string) => {
    const note = prompt(`Catatan Musyrif untuk perizinan ${santriName} (opsional):`);
    approvePermit(id, note || undefined);
    alert(`Perizinan santri ${santriName} berhasil disetujui!`);
  };

  const handleReject = (id: string, santriName: string) => {
    const reason = prompt(`Masukkan alasan penolakan perizinan untuk ${santriName}:`);
    if (reason) {
      rejectPermit(id, reason);
      alert(`Perizinan santri ${santriName} telah ditolak dengan alasan: ${reason}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-pesantren-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-pesantren-800 shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            Pengurus Asrama (Musyrif)
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Verifikasi & Pengawasan Santri Asrama
          </h2>
          <p className="text-xs text-pesantren-200 max-w-xl">
            Verifikasi permohonan izin pesiar santri binaan asrama Anda dan pantau kepulangan santri secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {stats.totalPending} Pengajuan Menunggu
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab("pending")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === "pending"
              ? "bg-amber-50 border-amber-300 shadow-sm"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Menunggu Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{pendingPermits.length}</p>
          <span className="text-[11px] text-slate-400">Persetujuan Musyrif</span>
        </button>

        <button
          onClick={() => setActiveTab("active_out")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === "active_out"
              ? "bg-blue-50 border-blue-300 shadow-sm"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sedang di Luar</span>
            <ExternalLink className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-600 mt-2">{activeOutPermits.length}</p>
          <span className="text-[11px] text-slate-400">Monitoring Pesiar</span>
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`p-5 rounded-2xl border text-left transition-all ${
            activeTab === "overdue"
              ? "bg-red-50 border-red-300 shadow-sm"
              : "bg-white border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Terlambat Kembali</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-600 mt-2">{overduePermits.length}</p>
          <span className="text-[11px] text-red-600 font-semibold">&gt; 17.00 WIB</span>
        </button>
      </div>

      {/* TAB 1: PENDING PERMITS REVIEW */}
      {activeTab === "pending" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Daftar Permohonan Izin Menunggu Persetujuan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pastikan santri telah menyelesaikan hafalan dan piket asrama sebelum disetujui.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {pendingPermits.length} Santri
            </span>
          </div>

          {pendingPermits.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs">Tidak ada permohonan izin yang menunggu persetujuan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPermits.map((permit) => {
                const santri = santriList.find((s) => s.id === permit.santri_id);
                const actMeta = getActivityTypeMeta(permit.activity_type);

                return (
                  <div
                    key={permit.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 block font-bold">
                          {permit.permit_code}
                        </span>
                        <h4 className="font-bold text-base text-slate-900">
                          {santri?.full_name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {santri?.asrama} • {santri?.kamar} ({santri?.kelas})
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${actMeta.bg}`}
                      >
                        {actMeta.label}
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                      <p className="text-slate-700">
                        <span className="font-semibold">Penjemput:</span> {permit.pickup_person_name} ({permit.pickup_person_relation})
                      </p>
                      <p className="text-slate-600">
                        <span className="font-semibold">No HP/WA:</span> {permit.pickup_person_phone}
                      </p>
                      {permit.destination_address && (
                        <p className="text-slate-600">
                          <span className="font-semibold">Tujuan:</span> {permit.destination_address}
                        </p>
                      )}
                      {permit.notes && (
                        <p className="text-slate-500 italic mt-1">&quot;{permit.notes}&quot;</p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/80">
                      <button
                        onClick={() => handleReject(permit.id, santri?.full_name || "Santri")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                      <button
                        onClick={() => handleApprove(permit.id, santri?.full_name || "Santri")}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
                        <span>Setujui Izin</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SANTRI SEDANG DI LUAR */}
      {activeTab === "active_out" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Santri yang Sedang di Luar Kampus</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Batas waktu kepulangan wajib sebelum pukul 17.00 WIB.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {activeOutPermits.map((permit) => {
              const santri = santriList.find((s) => s.id === permit.santri_id);
              return (
                <div key={permit.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{santri?.full_name}</h4>
                    <p className="text-slate-500 text-[11px]">
                      {santri?.asrama} • Keluar pukul {formatTimeWIB(permit.check_out_time)}
                    </p>
                    <p className="text-slate-600 mt-1">
                      Didampingi: {permit.pickup_person_name} ({permit.pickup_person_relation})
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${permit.pickup_person_phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold border border-emerald-200 text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp Wali</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MONITORING KETERLAMBATAN */}
      {activeTab === "overdue" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-red-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>Monitoring Santri Terlambat Kembali</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Santri yang belum kembali atau kembali melewati batas waktu pukul 17.00 WIB.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {overduePermits.map((permit) => {
              const santri = santriList.find((s) => s.id === permit.santri_id);
              return (
                <div
                  key={permit.id}
                  className="p-4 rounded-xl border border-red-200 bg-red-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">{santri?.full_name}</span>
                    <p className="text-slate-600">{santri?.asrama} (NIS: {santri?.nis})</p>
                    <p className="text-red-700 font-bold">
                      Keterlambatan: +{permit.late_duration_minutes} Menit
                    </p>
                    {permit.late_reason && (
                      <p className="text-slate-600 italic">Alasan: {permit.late_reason}</p>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/${permit.pickup_person_phone.replace(/[^0-9]/g, "")}?text=Assalamualaikum%20Bapak/Ibu,%20kami%20dari%20Pengurus%20Asrama%20mengingatkan%20santri%20${encodeURIComponent(santri?.full_name || "")}%20tercatat%20terlambat%20kembali%20ke%20pesantren.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hubungi Wali via WA</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
