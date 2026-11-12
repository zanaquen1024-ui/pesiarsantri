"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { PesiarSchedule } from "@/lib/types";
import { formatDateID, formatTimeWIB } from "@/lib/utils";

export default function JadwalPesiarAdminPage() {
  const { schedulesList, addSchedule, updateSchedule, deleteSchedule } = usePesiar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PesiarSchedule | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    event_date: "2026-11-20", // Friday
    start_time: "08:00:00",
    end_time: "17:00:00",
    registration_open: "2026-11-10T00:00:00Z",
    registration_close: "2026-11-19T18:00:00Z",
    allow_pesiar_keluar: true,
    allow_kunjungan: true,
    max_quota: 400,
    notes: "Santri wajib kembali sebelum pukul 17.00 WIB berseragam rapi.",
    is_active: true,
  });

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setFormData({
      title: "Pesiar Bulanan Santri — Periode Baru",
      event_date: "2026-11-27",
      start_time: "08:00:00",
      end_time: "17:00:00",
      registration_open: new Date().toISOString(),
      registration_close: new Date(Date.now() + 7 * 86400000).toISOString(),
      allow_pesiar_keluar: true,
      allow_kunjungan: true,
      max_quota: 400,
      notes: "Wajib kembali tepat waktu sebelum pukul 17.00 WIB.",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch: PesiarSchedule) => {
    setEditingSchedule(sch);
    setFormData({
      title: sch.title,
      event_date: sch.event_date,
      start_time: sch.start_time,
      end_time: sch.end_time,
      registration_open: sch.registration_open,
      registration_close: sch.registration_close,
      allow_pesiar_keluar: sch.allow_pesiar_keluar,
      allow_kunjungan: sch.allow_kunjungan,
      max_quota: sch.max_quota || 400,
      notes: sch.notes || "",
      is_active: sch.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, formData);
    } else {
      addSchedule(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Jadwal Pesiar Bulanan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dikelola secara dinamis. Waktu standar kegiatan: Hari Jumat, 08.00 – 17.00 WIB.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Tambah Jadwal Baru</span>
        </button>
      </div>

      {/* Grid of Schedules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedulesList.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow relative"
          >
            <div className="flex items-center justify-between">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  sch.is_active
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {sch.is_active ? "Jadwal Aktif" : "Non-Aktif / Selesai"}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(sch)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                  title="Edit Jadwal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus jadwal ${sch.title}?`)) {
                      deleteSchedule(sch.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Hapus Jadwal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 leading-snug">{sch.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{sch.notes}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tanggal Pelaksanaan:</span>
                <span className="font-bold text-pesantren-900">
                  {formatDateID(sch.event_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Jam Kegiatan:</span>
                <span className="font-bold text-slate-900">
                  {formatTimeWIB(sch.start_time)} – {formatTimeWIB(sch.end_time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Kapasitas Kuota:</span>
                <span className="font-semibold text-slate-800">
                  Maksimal {sch.max_quota} Santri
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2 py-0.5 rounded bg-pesantren-50 text-pesantren-800 font-medium">
                Pesiar Keluar: {sch.allow_pesiar_keluar ? "Diizinkan" : "Tutup"}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-medium">
                Kunjungan: {sch.allow_kunjungan ? "Diizinkan" : "Tutup"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-pesantren-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingSchedule ? "Edit Jadwal Pesiar" : "Tambah Jadwal Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-pesantren-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Agenda / Periode
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Pesiar Bulanan — Pekan IV November 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tanggal (Hari Jumat)
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Maksimal Kuota Santri
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.max_quota}
                    onChange={(e) => setFormData({ ...formData, max_quota: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jam Mulai (WIB)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jam Selesai (WIB)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Catatan & Arahan Khusus
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-pesantren-700 focus:ring-pesantren-700"
                />
                <label htmlFor="isActiveCheck" className="font-semibold text-slate-700">
                  Aktifkan jadwal ini sebagai agenda pesiar yang dapat dipilih
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

