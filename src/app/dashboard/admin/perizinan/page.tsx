"use client";

import React, { useState } from "react";
import {
  FileCheck2,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  QrCode,
  UserCheck,
  AlertTriangle,
  X,
  Phone,
  Eye,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { ActivityType, PermitStatus } from "@/lib/types";
import {
  formatDateID,
  formatTimeWIB,
  formatDateTimeWIB,
  getPermitStatusMeta,
  getActivityTypeMeta,
} from "@/lib/utils";
import { QrPassModal } from "@/components/permits/qr-pass-modal";

export default function AdminPerizinanPage() {
  const {
    permitsList,
    santriList,
    schedulesList,
    addPermit,
    approvePermit,
    rejectPermit,
    currentUser,
  } = usePesiar();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedActivity, setSelectedActivity] = useState<string>("all");

  // Modal State for Digital Pass QR
  const [selectedPermitForQr, setSelectedPermitForQr] = useState<any | null>(null);

  // Modal State for Create Manual Permit on behalf of Guardian
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    santri_id: santriList[0]?.id || "",
    schedule_id: schedulesList.find((s) => s.is_active)?.id || schedulesList[0]?.id || "",
    activity_type: "pesiar_keluar" as ActivityType,
    pickup_person_name: "",
    pickup_person_phone: "",
    pickup_person_relation: "Orang Tua Kandung",
    vehicle_type: "Mobil",
    vehicle_plate: "",
    destination_address: "",
    notes: "Pengajuan dibantu oleh bagian Administrasi atas permohonan wali via telepon/WA",
  });

  const handleCreateManualPermit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.pickup_person_name || !manualForm.pickup_person_phone) {
      alert("Nama dan No. HP penjemput wajib diisi.");
      return;
    }

    addPermit({
      schedule_id: manualForm.schedule_id,
      santri_id: manualForm.santri_id,
      guardian_id: currentUser.id,
      activity_type: manualForm.activity_type,
      pickup_person_name: manualForm.pickup_person_name,
      pickup_person_phone: manualForm.pickup_person_phone,
      pickup_person_relation: manualForm.pickup_person_relation,
      vehicle_type: manualForm.vehicle_type,
      vehicle_plate: manualForm.vehicle_plate,
      destination_address: manualForm.destination_address,
      notes: manualForm.notes,
      status: "approved", // Langsung disetujui jika dibuat oleh admin
      reviewed_by: currentUser.full_name,
      reviewed_at: new Date().toISOString(),
      created_by: currentUser.id,
    });

    setIsManualModalOpen(false);
    alert("Surat izin berhasil dibuat dan otomatis disetujui!");
  };

  const filteredPermits = permitsList.filter((p) => {
    const santri = santriList.find((s) => s.id === p.santri_id);
    const matchSearch =
      p.permit_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickup_person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (santri && santri.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (santri && santri.nis.includes(searchTerm));

    const matchStatus = selectedStatus === "all" || p.status === selectedStatus;
    const matchActivity = selectedActivity === "all" || p.activity_type === selectedActivity;

    return matchSearch && matchStatus && matchActivity;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pengelolaan Perizinan Pesiar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pengajuan izin, review persetujuan, dan pembuatan izin manual atas nama wali santri.
          </p>
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Buat Izin Atas Nama Wali</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Cari kode izin, nama santri, NIS, atau penjemput..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs pl-10 outline-none focus:ring-2 focus:ring-pesantren-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Persetujuan</option>
            <option value="approved">Disetujui</option>
            <option value="active_out">Sedang di Luar</option>
            <option value="completed">Sudah Kembali</option>
            <option value="overdue">Terlambat</option>
            <option value="rejected">Ditolak</option>
          </select>

          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Semua Jenis Kegiatan</option>
            <option value="pesiar_keluar">Pesiar Keluar</option>
            <option value="kunjungan_pesantren">Kunjungan Pesantren</option>
          </select>
        </div>
      </div>

      {/* Permits Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Kode Izin</th>
                <th className="px-4 py-3">Nama Santri</th>
                <th className="px-4 py-3">Jenis Kegiatan</th>
                <th className="px-4 py-3">Penjemput & Kontak</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Waktu Gerbang</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPermits.map((permit) => {
                const santri = santriList.find((s) => s.id === permit.santri_id);
                const statusMeta = getPermitStatusMeta(permit.status);
                const activityMeta = getActivityTypeMeta(permit.activity_type);

                return (
                  <tr key={permit.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">
                      {permit.permit_code}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 block">
                        {santri?.full_name || "-"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {santri?.asrama} • {santri?.kelas}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${activityMeta.bg}`}
                      >
                        {activityMeta.label}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800 block">
                        {permit.pickup_person_name} ({permit.pickup_person_relation})
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        {permit.pickup_person_phone}
                        {permit.vehicle_plate && ` • ${permit.vehicle_plate}`}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusMeta.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusMeta.dot}`} />
                        {statusMeta.label}
                      </span>
                      {permit.is_late && (
                        <span className="text-[10px] text-red-600 font-bold block mt-0.5">
                          (+{permit.late_duration_minutes} mnt)
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600 text-[11px] space-y-0.5">
                      {permit.check_out_time ? (
                        <p>Keluar: {formatTimeWIB(permit.check_out_time)}</p>
                      ) : (
                        <p className="text-slate-400">Belum keluar</p>
                      )}
                      {permit.check_in_time && (
                        <p className="text-emerald-700 font-medium">
                          Kembali: {formatTimeWIB(permit.check_in_time)}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol Lihat Tiket QR Digital */}
                        <button
                          onClick={() => setSelectedPermitForQr(permit)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pesantren-50 hover:bg-pesantren-100 text-pesantren-800 font-bold text-[11px] border border-pesantren-200 transition-colors"
                          title="Lihat Kartu Izin Digital QR"
                        >
                          <QrCode className="w-3.5 h-3.5 text-pesantren-700" />
                          <span>QR Pass</span>
                        </button>

                        {/* Jika pending, bisa approve/reject */}
                        {permit.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                const note = prompt("Catatan persetujuan (opsional):");
                                approvePermit(permit.id, note || undefined);
                              }}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              title="Setujui Izin"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                const reason = prompt("Masukkan alasan penolakan izin:");
                                if (reason) rejectPermit(permit.id, reason);
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                              title="Tolak Izin"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Digital Pass QR */}
      {selectedPermitForQr && (
        <QrPassModal
          permit={selectedPermitForQr}
          onClose={() => setSelectedPermitForQr(null)}
        />
      )}

      {/* Modal: Buat Pengajuan Manual atas nama Wali */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="bg-pesantren-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Buat Izin Manual (Bantuan Wali)</h3>
                <p className="text-xs text-pesantren-200">
                  Untuk wali yang mengonfirmasi lewat telepon/WhatsApp
                </p>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-pesantren-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualPermit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pilih Santri
                </label>
                <select
                  value={manualForm.santri_id}
                  onChange={(e) => setManualForm({ ...manualForm, santri_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700 font-medium"
                >
                  {santriList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.nis}) — {s.asrama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jadwal Pesiar
                  </label>
                  <select
                    value={manualForm.schedule_id}
                    onChange={(e) => setManualForm({ ...manualForm, schedule_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  >
                    {schedulesList.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jenis Kegiatan
                  </label>
                  <select
                    value={manualForm.activity_type}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        activity_type: e.target.value as ActivityType,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  >
                    <option value="pesiar_keluar">Pesiar Keluar (08-17 WIB)</option>
                    <option value="kunjungan_pesantren">Kunjungan di Pesantren</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Penjemput / Wali
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.pickup_person_name}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, pickup_person_name: e.target.value })
                    }
                    placeholder="Contoh: H. Bambang"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Hubungan dengan Santri
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.pickup_person_relation}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, pickup_person_relation: e.target.value })
                    }
                    placeholder="Ayah / Ibu / Wali"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    No. Handphone / WA Penjemput
                  </label>
                  <input
                    type="text"
                    required
                    value={manualForm.pickup_person_phone}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, pickup_person_phone: e.target.value })
                    }
                    placeholder="081234567890"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Plat Nomor Kendaraan
                  </label>
                  <input
                    type="text"
                    value={manualForm.vehicle_plate}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, vehicle_plate: e.target.value })
                    }
                    placeholder="D 1234 XYZ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Catatan Admin
                </label>
                <textarea
                  rows={2}
                  value={manualForm.notes}
                  onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold"
                >
                  Terbitkan & Setujui Izin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
