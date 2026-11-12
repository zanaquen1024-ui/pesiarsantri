"use client";

import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  MapPin,
  Car,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { PesiarPermit, Santri, PesiarSchedule } from "@/lib/types";
import {
  formatDateID,
  formatTimeWIB,
  formatDateTimeWIB,
  getPermitStatusMeta,
  getActivityTypeMeta,
} from "@/lib/utils";
import { usePesiar } from "@/lib/context/pesiar-context";

interface QrPassModalProps {
  permit: PesiarPermit;
  onClose: () => void;
}

export function QrPassModal({ permit, onClose }: QrPassModalProps) {
  const { santriList, schedulesList, settings } = usePesiar();
  const printAreaRef = useRef<HTMLDivElement>(null);

  const santri = santriList.find((s) => s.id === permit.santri_id);
  const schedule = schedulesList.find((sch) => sch.id === permit.schedule_id);
  const statusMeta = getPermitStatusMeta(permit.status);
  const activityMeta = getActivityTypeMeta(permit.activity_type);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Modal Header */}
        <div className="bg-pesantren-900 text-white p-4 sm:p-5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
            <div>
              <h3 className="font-bold text-base">Surat Izin Pesiar Digital</h3>
              <p className="text-xs text-pesantren-200">Kode: {permit.permit_code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-pesantren-300 hover:text-white hover:bg-pesantren-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Body */}
        <div ref={printAreaRef} className="p-6 sm:p-8 space-y-6">
          {/* Pesantren Seal Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <span className="text-[11px] font-bold text-pesantren-800 tracking-wider uppercase bg-pesantren-50 px-2.5 py-1 rounded-full border border-pesantren-200">
              {settings.pesantren_name}
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-2">
              KARTU IZIN DIGITAL PESIAR SANTRI
            </h2>
            <p className="text-xs text-slate-500">
              {schedule?.title || "Jadwal Pesiar Bulanan"}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center py-2 bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
              <QRCodeSVG
                value={permit.qr_code_token}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-xs font-mono font-bold text-slate-700 mt-2">
              {permit.permit_code}
            </p>
            <p className="text-[11px] text-slate-400">
              Tunjukkan QR Code ini kepada Petugas di Gerbang Utama
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block mb-0.5">Nama Santri</span>
              <p className="font-bold text-slate-900 text-sm">
                {santri?.full_name || "-"}
              </p>
              <span className="text-slate-500 font-mono">NIS: {santri?.nis}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Asrama & Kelas</span>
              <p className="font-semibold text-slate-800">{santri?.asrama}</p>
              <span className="text-slate-500">{santri?.kamar} • {santri?.kelas}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Jenis Kegiatan</span>
              <span className="font-semibold text-pesantren-800">
                {activityMeta.label}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Batas Kembali</span>
              <span className="font-bold text-rose-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Pukul 17.00 WIB
              </span>
            </div>

            <div className="col-span-2 pt-2 border-t border-slate-200">
              <span className="text-slate-400 block mb-0.5">Penjemput / Pendamping</span>
              <p className="font-semibold text-slate-800">
                {permit.pickup_person_name} ({permit.pickup_person_relation})
              </p>
              <p className="text-slate-500">
                No. HP: {permit.pickup_person_phone}
                {permit.vehicle_plate && ` • Kendaraan: ${permit.vehicle_type} (${permit.vehicle_plate})`}
              </p>
            </div>
          </div>

          {/* Gate Logs preview if checked out/in */}
          {(permit.check_out_time || permit.check_in_time) && (
            <div className="p-3 bg-blue-50 rounded-lg text-xs space-y-1 border border-blue-200">
              {permit.check_out_time && (
                <p className="text-blue-900">
                  <span className="font-semibold">Keluar Gerbang:</span>{" "}
                  {formatDateTimeWIB(permit.check_out_time)} oleh {permit.check_out_by || "Petugas Gerbang"}
                </p>
              )}
              {permit.check_in_time && (
                <p className="text-blue-900">
                  <span className="font-semibold">Kembali Masuk:</span>{" "}
                  {formatDateTimeWIB(permit.check_in_time)} oleh {permit.check_in_by || "Petugas Gerbang"}
                </p>
              )}
            </div>
          )}

          {/* Late warning alert if overdue */}
          {permit.is_late && (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Santri Tercatat Terlambat (+{permit.late_duration_minutes} menit)</p>
                {permit.late_reason && <p className="text-red-700">Alasan: {permit.late_reason}</p>}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-center italic">
            * Surat izin ini sah secara elektronik dan diverifikasi oleh sistem perizinan pesantren.
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-white transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-pesantren-800 hover:bg-pesantren-900 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-gold-300" />
            <span>Cetak Surat Izin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

