"use client";

import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  Phone,
  Clock,
} from "lucide-react";

interface GuardianRelationItem {
  id: string;
  santriName: string;
  santriNis: string;
  asrama: string;
  guardianName: string;
  guardianPhone: string;
  relationship: string;
  nik: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export default function WaliVerifikasiPage() {
  // Dynamic state of guardian verification
  const [relations, setRelations] = useState<GuardianRelationItem[]>([
    {
      id: "rel-1",
      santriName: "Muhammad Raihan Hermanto",
      santriNis: "20240101",
      asrama: "Asrama Abu Bakar Ash-Shiddiq",
      guardianName: "H. Bambang Hermanto",
      guardianPhone: "081234567894",
      relationship: "Ayah Kandung",
      nik: "3201234567890001",
      isVerified: true,
      verifiedAt: "2026-01-10",
    },
    {
      id: "rel-2",
      santriName: "Aisyah Naura Hermanto",
      santriNis: "20240102",
      asrama: "Asrama Khadijah Al-Kubra",
      guardianName: "H. Bambang Hermanto",
      guardianPhone: "081234567894",
      relationship: "Ayah Kandung",
      nik: "3201234567890001",
      isVerified: true,
      verifiedAt: "2026-01-10",
    },
    {
      id: "rel-3",
      santriName: "Faris Ihsan Al-Ghifari",
      santriNis: "20240103",
      asrama: "Asrama Umar Bin Khattab",
      guardianName: "Ust. Gunawan Ihsan",
      guardianPhone: "081399887766",
      relationship: "Paman",
      nik: "3201987654320002",
      isVerified: false,
    },
    {
      id: "rel-4",
      santriName: "Zahra Amelia Putri",
      santriNis: "20240104",
      asrama: "Asrama Aisyah Humaira",
      guardianName: "Hj. Sulastri",
      guardianPhone: "081987654321",
      relationship: "Ibu Kandung",
      nik: "3201445566770003",
      isVerified: true,
      verifiedAt: "2026-02-15",
    },
    {
      id: "rel-5",
      santriName: "Daffa Arya Pratama",
      santriNis: "20240105",
      asrama: "Asrama Ali Bin Abi Thalib",
      guardianName: "Arya Pratama",
      guardianPhone: "081344556677",
      relationship: "Kakak Kandung",
      nik: "3201556677880004",
      isVerified: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const toggleVerification = (id: string) => {
    setRelations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              isVerified: !r.isVerified,
              verifiedAt: !r.isVerified ? new Date().toISOString() : undefined,
            }
          : r
      )
    );
  };

  const filtered = relations.filter(
    (r) =>
      r.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.santriName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.santriNis.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Wali Santri & Verifikasi Hubungan
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pastikan setiap santri terhubung dengan wali sah sebelum izin pesiar diterbitkan.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Cari nama wali, santri, atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs pl-10 outline-none focus:ring-2 focus:ring-pesantren-700"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Nama Wali</th>
                <th className="px-4 py-3">Hubungan</th>
                <th className="px-4 py-3">No. Kontak / WA</th>
                <th className="px-4 py-3">Santri Binaan</th>
                <th className="px-4 py-3">Status Verifikasi</th>
                <th className="px-4 py-3 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{item.guardianName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">NIK: {item.nik}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {item.relationship}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <a
                      href={`https://wa.me/${item.guardianPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pesantren-700 hover:underline flex items-center gap-1 font-mono"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {item.guardianPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{item.santriName}</span>
                    <span className="text-[11px] text-slate-500">{item.asrama} (NIS: {item.santriNis})</span>
                  </td>
                  <td className="px-4 py-3">
                    {item.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Menunggu Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleVerification(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.isVerified
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      }`}
                    >
                      {item.isVerified ? "Batalkan Verifikasi" : "Verifikasi Sekarang"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

