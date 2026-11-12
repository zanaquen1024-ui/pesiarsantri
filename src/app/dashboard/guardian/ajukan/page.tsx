"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  Calendar,
  Clock,
  Users,
  Car,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { ActivityType } from "@/lib/types";
import { formatDateID, formatTimeWIB } from "@/lib/utils";

export default function AjukanIzinGuardianPage() {
  const router = useRouter();
  const { santriList, schedulesList, addPermit, currentUser } = usePesiar();

  const activeSchedules = schedulesList.filter((s) => s.is_active);
  const currentSchedule = activeSchedules[0] || schedulesList[0];

  const [formData, setFormData] = useState({
    santri_id: santriList[0]?.id || "",
    schedule_id: currentSchedule?.id || "",
    activity_type: "pesiar_keluar" as ActivityType,
    pickup_person_name: currentUser.full_name,
    pickup_person_phone: currentUser.phone_number || "081234567894",
    pickup_person_relation: "Ayah Kandung",
    vehicle_type: "Mobil Pribadi",
    vehicle_plate: "D 1234 XYZ",
    destination_address: "Kediaman Keluarga di Bandung",
    notes: "Silaturahmi keluarga dan refreshing santri",
    agreement_checked: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreement_checked) {
      alert("Anda wajib menyetujui ketentuan tata tertib jam kepulangan pesiar.");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const newPermit = addPermit({
        schedule_id: formData.schedule_id,
        santri_id: formData.santri_id,
        guardian_id: currentUser.id,
        activity_type: formData.activity_type,
        pickup_person_name: formData.pickup_person_name,
        pickup_person_phone: formData.pickup_person_phone,
        pickup_person_relation: formData.pickup_person_relation,
        vehicle_type: formData.vehicle_type,
        vehicle_plate: formData.vehicle_plate,
        destination_address: formData.destination_address,
        notes: formData.notes,
        status: "pending",
        created_by: currentUser.id,
      });

      setIsSubmitting(false);
      setSuccessCode(newPermit.permit_code);
    }, 700);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/guardian"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Dashboard Saya</span>
      </Link>

      {/* Success View */}
      {successCode ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Pengajuan Izin Berhasil Terkirim!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Kode Registrasi: <span className="font-mono font-bold text-slate-800">{successCode}</span>.
            Pengajuan Anda saat ini telah diteruskan ke Pengurus Asrama untuk proses verifikasi.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/guardian"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Lihat di Dashboard Saya
            </Link>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-pesantren-900 text-white p-6 sm:p-8 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-pesantren-800 px-2.5 py-1 rounded">
              Formulir Permohonan Izin
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Pengajuan Izin Pesiar & Kunjungan Santri
            </h2>
            <p className="text-xs text-pesantren-200">
              Isi data penjemput dan kegiatan dengan lengkap dan benar sesuai ketentuan pesantren.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs">
            {/* Step 1: Pilih Santri & Jadwal */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Users className="w-4 h-4 text-pesantren-700" />
                <span>1. Pilih Santri & Jadwal Pesiar</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Putra / Putri Santri
                  </label>
                  <select
                    value={formData.santri_id}
                    onChange={(e) => setFormData({ ...formData, santri_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700 font-medium"
                  >
                    {santriList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.full_name} ({s.nis}) — {s.asrama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Pilihan Jadwal Pesiar
                  </label>
                  <select
                    value={formData.schedule_id}
                    onChange={(e) => setFormData({ ...formData, schedule_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700 font-medium"
                  >
                    {schedulesList.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.title} ({formatDateID(sch.event_date)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Jenis Kegiatan */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calendar className="w-4 h-4 text-pesantren-700" />
                <span>2. Pilih Jenis Kegiatan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setFormData({ ...formData, activity_type: "pesiar_keluar" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.activity_type === "pesiar_keluar"
                      ? "bg-pesantren-50 border-pesantren-700 ring-2 ring-pesantren-700"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">Pesiar Keluar</span>
                    <input
                      type="radio"
                      name="activity_type"
                      checked={formData.activity_type === "pesiar_keluar"}
                      onChange={() => {}}
                      className="text-pesantren-700"
                    />
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Santri keluar bersama keluarga untuk refreshing. Batas kembali wajib sebelum 17.00 WIB.
                  </p>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, activity_type: "kunjungan_pesantren" })}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.activity_type === "kunjungan_pesantren"
                      ? "bg-indigo-50 border-indigo-700 ring-2 ring-indigo-700"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">Kunjungan di Pesantren</span>
                    <input
                      type="radio"
                      name="activity_type"
                      checked={formData.activity_type === "kunjungan_pesantren"}
                      onChange={() => {}}
                      className="text-indigo-700"
                    />
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Menjenguk dan bertamu di area gazebo / taman pesantren tanpa santri keluar area kampus.
                  </p>
                </label>
              </div>
            </div>

            {/* Step 3: Informasi Penjemput & Kendaraan */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Car className="w-4 h-4 text-pesantren-700" />
                <span>3. Data Penjemput & Kendaraan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Penjemput / Pendamping
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pickup_person_name}
                    onChange={(e) => setFormData({ ...formData, pickup_person_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Hubungan dengan Santri
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pickup_person_relation}
                    onChange={(e) => setFormData({ ...formData, pickup_person_relation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    No. Handphone / WhatsApp Penjemput
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pickup_person_phone}
                    onChange={(e) => setFormData({ ...formData, pickup_person_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Plat Nomor Kendaraan (Jika membawa)
                  </label>
                  <input
                    type="text"
                    value={formData.vehicle_plate}
                    onChange={(e) => setFormData({ ...formData, vehicle_plate: e.target.value })}
                    placeholder="Contoh: D 1234 AB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tujuan Pesiar / Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.destination_address}
                    onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
                    placeholder="Contoh: Kediaman Keluarga di Bandung / Wisata Lembang"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Pernyataan Disiplin & Waktu */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeCheck"
                  checked={formData.agreement_checked}
                  onChange={(e) => setFormData({ ...formData, agreement_checked: e.target.checked })}
                  className="mt-1 rounded text-pesantren-700 focus:ring-pesantren-700 cursor-pointer"
                />
                <label htmlFor="agreeCheck" className="text-slate-700 font-medium leading-relaxed cursor-pointer">
                  Saya menyatakan bahwa data yang saya berikan adalah benar. Saya memahami dan menyetujui
                  bahwa santri wajib diantar kembali ke gerbang pesantren <strong>sebelum pukul 17.00 WIB</strong>{" "}
                  dengan mengenakan seragam rapi dan mematuhi tata tertib pesantren.
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/dashboard/guardian"
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Mengirim Pengajuan..." : "Kirim Pengajuan Izin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
