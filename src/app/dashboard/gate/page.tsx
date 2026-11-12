"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Volume2,
  VolumeX,
  Camera,
  History,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { PesiarPermit } from "@/lib/types";
import { formatTimeWIB, getPermitStatusMeta } from "@/lib/utils";
import { playSuccessChime, playWarningBuzzer } from "@/components/gate/audio-beep";

export default function GateTerminalPage() {
  const { permitsList, santriList, gateCheckOut, gateCheckIn, gateLogs } = usePesiar();

  const [inputCode, setInputCode] = useState("");
  const [activePermit, setActivePermit] = useState<PesiarPermit | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState("");

  const html5QrCodeRef = useRef<any>(null);

  // Handle Scan / Search
  const handleFindPermit = (query: string) => {
    const q = query.trim().toUpperCase();
    if (!q) return;

    const found = permitsList.find(
      (p) =>
        p.permit_code.toUpperCase() === q ||
        p.qr_code_token.toUpperCase() === q ||
        p.id === query ||
        p.permit_code.includes(q)
    );

    if (found) {
      setActivePermit(found);
      setFeedbackMessage(null);
      if (audioEnabled) playSuccessChime();
    } else {
      setActivePermit(null);
      setFeedbackMessage({
        text: `Surat Izin dengan kode "${query}" tidak ditemukan.`,
        type: "error",
      });
      if (audioEnabled) playWarningBuzzer();
    }
  };

  // 1-Tap Check-Out
  const handleCheckOut = () => {
    if (!activePermit) return;
    const res = gateCheckOut(activePermit.id);
    if (res.success) {
      if (audioEnabled) playSuccessChime();
      setFeedbackMessage({ text: res.message, type: "success" });
      // Refresh active permit
      const updated = permitsList.find((p) => p.id === activePermit.id);
      if (updated) setActivePermit({ ...updated, status: "active_out" });
    } else {
      if (audioEnabled) playWarningBuzzer();
      setFeedbackMessage({ text: res.message, type: "error" });
    }
  };

  // 1-Tap Check-In
  const handleCheckIn = (isLateOverride?: boolean) => {
    if (!activePermit) return;
    const res = gateCheckIn(activePermit.id, undefined, isLateOverride);
    if (res.success) {
      if (res.isLate) {
        if (audioEnabled) playWarningBuzzer();
        setFeedbackMessage({ text: res.message, type: "warning" });
      } else {
        if (audioEnabled) playSuccessChime();
        setFeedbackMessage({ text: res.message, type: "success" });
      }
      const updated = permitsList.find((p) => p.id === activePermit.id);
      if (updated) setActivePermit(updated);
    } else {
      if (audioEnabled) playWarningBuzzer();
      setFeedbackMessage({ text: res.message, type: "error" });
    }
  };

  // Start Camera QR Scanner
  const startCameraScanner = async () => {
    setIsScanning(true);
    setScannerError("");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const html5QrCode = new Html5Qrcode("gate-qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleFindPermit(decodedText);
          stopCameraScanner();
        },
        () => {
          // scanning frame (ignore)
        }
      );
    } catch {
      setScannerError("Gagal membuka kamera: pastikan izin kamera aktif pada peramban Anda.");
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop();
        } catch {}
      }
    };
  }, []);

  const activeSantri = activePermit ? santriList.find((s) => s.id === activePermit.santri_id) : null;
  const statusMeta = activePermit ? getPermitStatusMeta(activePermit.status) : null;

  return (
    <div className="space-y-6">
      {/* Gate Officer Terminal Header */}
      <div className="bg-pesantren-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-pesantren-900 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30">
              Terminal Pos Gerbang Utama
            </span>
            <span className="text-xs text-pesantren-300">| Mode Scanner Cepat</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Pemindaian QR Izin Pesiar Santri
          </h2>
          <p className="text-xs text-pesantren-200">
            Arahkan kamera ke QR kartu izin santri atau masukkan kode izin secara manual.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              audioEnabled
                ? "bg-pesantren-900 text-gold-300 border-pesantren-800"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{audioEnabled ? "Audio Aktif" : "Audio Bisu"}</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera / Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-pesantren-700" />
              <span>Input QR Scanner</span>
            </h3>

            {/* Camera View Box */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-square flex flex-col items-center justify-center p-4 border border-slate-800">
              <div id="gate-qr-reader" className="w-full h-full" />

              {!isScanning && (
                <div className="text-center space-y-3 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-pesantren-900 text-gold-400 flex items-center justify-center mx-auto border border-pesantren-700">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-slate-300 max-w-xs">
                    Kamera belum aktif. Klik tombol di bawah untuk menyalakan scanner kamera perangkat.
                  </p>
                  <button
                    onClick={startCameraScanner}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-pesantren-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Aktifkan Kamera</span>
                  </button>
                </div>
              )}

              {isScanning && (
                <button
                  onClick={stopCameraScanner}
                  className="absolute bottom-4 z-20 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md"
                >
                  Matikan Kamera
                </button>
              )}
            </div>

            {scannerError && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {scannerError}
              </p>
            )}

            {/* Manual Code Input Bar */}
            <div className="pt-2 space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                Atau Masukkan Kode / Token Manual:
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFindPermit(inputCode);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Contoh: PSR-202611-0001"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs uppercase font-mono font-bold outline-none focus:ring-2 focus:ring-pesantren-700 pl-9"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Cek
                </button>
              </form>
            </div>

            {/* Quick Demo Pre-filled buttons */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Coba Kode Sample Demo:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                {permitsList.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setInputCode(p.permit_code);
                      handleFindPermit(p.permit_code);
                    }}
                    className="px-2 py-1 rounded bg-slate-100 hover:bg-pesantren-50 hover:text-pesantren-800 border border-slate-200"
                  >
                    {p.permit_code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Active Scanned Permit Verification Details */}
        <div className="lg:col-span-7 space-y-4">
          {feedbackMessage && (
            <div
              className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 border ${
                feedbackMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : feedbackMessage.type === "warning"
                  ? "bg-amber-50 text-amber-900 border-amber-300"
                  : "bg-rose-50 text-rose-900 border-rose-300"
              }`}
            >
              {feedbackMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : feedbackMessage.type === "warning" ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {activePermit && activeSantri ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
              {/* Top Details Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {activePermit.permit_code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusMeta?.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusMeta?.dot}`} />
                      {statusMeta?.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {activeSantri.full_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    NIS: {activeSantri.nis} • {activeSantri.asrama} ({activeSantri.kamar})
                  </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-pesantren-100 text-pesantren-800 font-black text-xl flex items-center justify-center shrink-0 border border-pesantren-200">
                  {activeSantri.full_name.charAt(0)}
                </div>
              </div>

              {/* Data Penjemput & Kendaraan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Penjemput Resmi</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {activePermit.pickup_person_name}
                  </p>
                  <p className="text-slate-500">
                    Hubungan: {activePermit.pickup_person_relation}
                  </p>
                  <a
                    href={`https://wa.me/${activePermit.pickup_person_phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pesantren-700 font-mono flex items-center gap-1 mt-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {activePermit.pickup_person_phone}
                  </a>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Informasi Kendaraan</span>
                  <p className="font-semibold text-slate-800">
                    {activePermit.vehicle_type || "Tidak Tercatat"}
                  </p>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    Plat: {activePermit.vehicle_plate || "-"}
                  </p>
                  <p className="text-slate-500 text-[11px] mt-1">
                    Batas Kembali: <span className="font-bold text-rose-700">17.00 WIB</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons: Check-Out vs Check-In */}
              <div className="pt-2 space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                  Tindakan Petugas Gerbang:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Check Out (Santri Keluar Gerbang) */}
                  <button
                    onClick={handleCheckOut}
                    disabled={activePermit.status !== "approved"}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>CHECK-OUT (KELUAR GERBANG)</span>
                  </button>

                  {/* Button 2: Check In (Santri Kembali Masuk) */}
                  <button
                    onClick={() => handleCheckIn(false)}
                    disabled={activePermit.status !== "active_out" && activePermit.status !== "overdue"}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CHECK-IN (KEMBALI KE PONDOK)</span>
                  </button>
                </div>

                {/* Simulated late check-in button for testing */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => handleCheckIn(true)}
                    disabled={activePermit.status !== "active_out"}
                    className="text-[11px] text-red-600 hover:text-red-800 underline font-medium"
                  >
                    [Simulasi Uji Coba: Check-In dengan Status Terlambat]
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center text-slate-400 space-y-3">
              <QrCode className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Belum Ada Izin Dipindai</h4>
              <p className="text-xs max-w-sm mx-auto">
                Silakan scan QR kartu santri melalui kamera atau masukkan kode di sebelah kiri untuk melihat rincian perizinan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Today's Gate Log Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <History className="w-4 h-4 text-pesantren-700" />
          <span>Riwayat Aktivitas Pemindaian Gerbang Hari Ini</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {gateLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    log.action_type === "CHECK_OUT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {log.action_type}
                </span>
                <div>
                  <p className="text-slate-800 font-semibold">{log.notes}</p>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
                {formatTimeWIB(log.scanned_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

