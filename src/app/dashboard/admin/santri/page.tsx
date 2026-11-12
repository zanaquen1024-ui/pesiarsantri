"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { Santri, GenderType } from "@/lib/types";

export default function SantriMasterPage() {
  const { santriList, addSantri, updateSantri, deleteSantri } = usePesiar();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsrama, setSelectedAsrama] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  const [formData, setFormData] = useState({
    nis: "",
    full_name: "",
    nickname: "",
    gender: "L" as GenderType,
    asrama: "Asrama Abu Bakar Ash-Shiddiq",
    kamar: "Kamar 101",
    kelas: "10 IPA 1",
    halaqah: "Halaqah Al-Fatih",
    health_notes: "",
    is_active: true,
  });

  const asramaOptions = [
    "Asrama Abu Bakar Ash-Shiddiq",
    "Asrama Umar Bin Khattab",
    "Asrama Utsman Bin Affan",
    "Asrama Ali Bin Abi Thalib",
    "Asrama Khadijah Al-Kubra",
    "Asrama Aisyah Humaira",
  ];

  const handleOpenAdd = () => {
    setEditingSantri(null);
    setFormData({
      nis: String(Math.floor(20240000 + Math.random() * 9999)),
      full_name: "",
      nickname: "",
      gender: "L",
      asrama: asramaOptions[0],
      kamar: "Kamar 101",
      kelas: "10 IPA 1",
      halaqah: "Halaqah Al-Fatih",
      health_notes: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Santri) => {
    setEditingSantri(s);
    setFormData({
      nis: s.nis,
      full_name: s.full_name,
      nickname: s.nickname || "",
      gender: s.gender,
      asrama: s.asrama,
      kamar: s.kamar,
      kelas: s.kelas,
      halaqah: s.halaqah || "",
      health_notes: s.health_notes || "",
      is_active: s.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.nis) {
      alert("Nama dan NIS wajib diisi.");
      return;
    }

    if (editingSantri) {
      updateSantri(editingSantri.id, formData);
    } else {
      addSantri(formData);
    }
    setIsModalOpen(false);
  };

  // Filter logic
  const filteredSantri = santriList.filter((s) => {
    const matchSearch =
      s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nis.includes(searchTerm) ||
      (s.nickname && s.nickname.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchAsrama = selectedAsrama === "all" || s.asrama === selectedAsrama;
    const matchGender = selectedGender === "all" || s.gender === selectedGender;
    return matchSearch && matchAsrama && matchGender;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Master Data Santri
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola data santri, identitas asrama, kelas, dan catatan kesehatan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Tambah Santri Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <input
            type="text"
            placeholder="Cari nama santri, panggilan, atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs pl-10 outline-none focus:ring-2 focus:ring-pesantren-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedAsrama}
            onChange={(e) => setSelectedAsrama(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Semua Asrama</option>
            {asramaOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full md:w-auto px-3 py-2.5 rounded-xl border border-slate-300 text-xs outline-none bg-white font-medium text-slate-700"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Putra (Ikhwan)</option>
            <option value="P">Putri (Akhwat)</option>
          </select>
        </div>
      </div>

      {/* Santri Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">NIS</th>
                <th className="px-4 py-3">Nama Santri</th>
                <th className="px-4 py-3">L/P</th>
                <th className="px-4 py-3">Asrama & Kamar</th>
                <th className="px-4 py-3">Kelas & Halaqah</th>
                <th className="px-4 py-3">Catatan Medis</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSantri.map((santri) => (
                <tr key={santri.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {santri.nis}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pesantren-100 text-pesantren-800 font-bold flex items-center justify-center text-[10px]">
                        {santri.full_name.charAt(0)}
                      </div>
                      <div>
                        <span>{santri.full_name}</span>
                        {santri.nickname && (
                          <span className="text-slate-400 text-[10px] block">
                            ({santri.nickname})
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        santri.gender === "L"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-pink-50 text-pink-700"
                      }`}
                    >
                      {santri.gender === "L" ? "Ikhwan (L)" : "Akhwat (P)"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-medium block">{santri.asrama}</span>
                    <span className="text-slate-400 text-[11px]">{santri.kamar}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <span className="font-medium block">{santri.kelas}</span>
                    <span className="text-slate-400 text-[11px]">{santri.halaqah || "-"}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                    {santri.health_notes || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(santri)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-pesantren-800 hover:bg-slate-100"
                        title="Edit data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus data santri ${santri.full_name}?`)) {
                            deleteSantri(santri.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Hapus data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-pesantren-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingSantri ? "Edit Data Santri" : "Tambah Santri Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-pesantren-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    NIS (Nomor Induk)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Lengkap Santri
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Contoh: Muhammad Raihan Hermanto"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Contoh: Raihan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kelas / Jenjang
                  </label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    placeholder="Contoh: 10 IPA 1"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Asrama Santri
                  </label>
                  <select
                    value={formData.asrama}
                    onChange={(e) => setFormData({ ...formData, asrama: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  >
                    {asramaOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Kamar
                  </label>
                  <input
                    type="text"
                    value={formData.kamar}
                    onChange={(e) => setFormData({ ...formData, kamar: e.target.value })}
                    placeholder="Kamar 102"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Catatan Riwayat Kesehatan / Alergi
                </label>
                <textarea
                  rows={2}
                  value={formData.health_notes}
                  onChange={(e) => setFormData({ ...formData, health_notes: e.target.value })}
                  placeholder="Riwayat asma, alergi makanan, obat khusus..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
                />
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

