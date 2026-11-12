"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  FileCheck2,
  QrCode,
  Clock,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Printer,
  ShieldCheck,
  Building,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { formatTimeWIB, formatDateID, getPermitStatusMeta, getActivityTypeMeta } from "@/lib/utils";
import { QrPassModal } from "@/components/permits/qr-pass-modal";

export default function GuardianDashboardPage() {
  const { santriList, permitsList, schedulesList, currentUser } = usePesiar();

  // For demo, linked santri are the first 2 santri (or all)
  const mySantri = santriList.slice(0, 2);
  const myPermits = permitsList; // Permits for my santri

  const [selectedPermitForQr, setSelectedPermitForQr] = useState<any | null>(null);

  // Active permit (approved or active_out)
  const activePermit = myPermits.find(
    (p) => p.status === "approved" || p.status === "active_out" || p.status === "pending"
  );

  return (
    <div className="space-y-6">
      {/* Guardian Welcome Banner */}
      <div className="bg-pesantren-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-pesantren-800 shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">
            Portal Wali Santri
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Assalamu&apos;alaikum, {currentUser.full_name}
          </h2>
          <p className="text-xs text-pesantren-200 max-w-xl">
            Kelola perizinan refreshing dan kunjungan putra-putri tercinta di Pondok Pesantren
            secara mudah dan transparan.
          </p>
        </div>

        <Link
          href="/dashboard/guardian/ajukan"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-gold-500/20 hover:scale-[1.02] active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-pesantren-950" />
          <span>Ajukan Izin Pesiar Baru</span>
        </Link>
      </div>

      {/* Active Permit Card Spotlight (If available) */}
      {activePermit && (
        <div className="bg-gradient-to-r from-pesantren-950 to-pesantren-900 text-white rounded-3xl p-6 sm:p-8 border border-pesantren-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-400 text-pesantren-950">
                  Tiket Pesiar Aktif
                </span>
                <span className="font-mono text-xs text-pesantren-300">
                  {activePermit.permit_code}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  {santriList.find((s) => s.id === activePermit.santri_id)?.full_name || "Putra/Putri Anda"}
                </h3>
                <p className="text-xs text-pesantren-200 mt-1">
                  Kegiatan: {getActivityTypeMeta(activePermit.activity_type).label} • Batas Kembali: Pukul 17.00 WIB
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-pesantren-300">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-400" />
                  Waktu: 08.00 – 17.00 WIB (Hari Jumat)
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  Status: {getPermitStatusMeta(activePermit.status).label}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setSelectedPermitForQr(activePermit)}
                className="w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-pesantren-950 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-slate-100 transition-all active:scale-95"
              >
                <QrCode className="w-5 h-5 text-pesantren-800" />
                <span>Buka Tiket QR Gerbang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Santri Binaan Saya */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-pesantren-700" />
          <span>Putra & Putri Saya di Pesantren</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mySantri.map((santri) => (
            <div
              key={santri.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-pesantren-100 text-pesantren-800 font-extrabold flex items-center justify-center text-xl shrink-0">
                {santri.full_name.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-base">{santri.full_name}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">NIS: {santri.nis}</p>
                <p className="text-xs text-slate-600">
                  {santri.asrama} • {santri.kamar} ({santri.kelas})
                </p>
                {santri.health_notes && (
                  <p className="text-[11px] text-amber-700 italic pt-1">
                    * Catatan Medis: {santri.health_notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permit History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-pesantren-700" />
            <span>Riwayat Perizinan Pesiar</span>
          </h3>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {myPermits.map((permit) => {
            const santri = santriList.find((s) => s.id === permit.santri_id);
            const statusMeta = getPermitStatusMeta(permit.status);

            return (
              <div
                key={permit.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {santri?.full_name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {permit.permit_code}
                    </span>
                  </div>
                  <p className="text-slate-500">
                    Kegiatan: {getActivityTypeMeta(permit.activity_type).label} • Penjemput: {permit.pickup_person_name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                    {statusMeta.label}
                  </span>

                  <button
                    onClick={() => setSelectedPermitForQr(permit)}
                    className="p-2 rounded-xl text-pesantren-800 hover:bg-pesantren-50 border border-slate-200"
                    title="Buka QR Pass"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Pass Modal */}
      {selectedPermitForQr && (
        <QrPassModal
          permit={selectedPermitForQr}
          onClose={() => setSelectedPermitForQr(null)}
        />
      )}
    </div>
  );
}
