"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Users,
  Settings,
  History,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Server,
  Lock,
  Search,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { DEMO_PROFILES } from "@/lib/mock/data";
import { UserRole } from "@/lib/types";
import { formatDateTimeWIB, getRoleMeta } from "@/lib/utils";

export default function SuperAdminPage() {
  const {
    currentUser,
    settings,
    updateSettings,
    auditLogs,
    resetAllData,
    stats,
  } = usePesiar();

  const [activeTab, setActiveTab] = useState<"overview" | "users" | "settings" | "audit">("overview");

  // Local settings state for editing
  const [formData, setFormData] = useState({
    pesantren_name: settings.pesantren_name,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    operating_hours: settings.operating_hours,
    max_late_tolerance_minutes: settings.max_late_tolerance_minutes,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [auditSearch, setAuditSearch] = useState("");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const filteredAudits = auditLogs.filter(
    (a) =>
      a.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      a.entity_type.toLowerCase().includes(auditSearch.toLowerCase()) ||
      (a.user_name && a.user_name.toLowerCase().includes(auditSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Status Banner */}
      <div className="bg-pesantren-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-pesantren-900 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Super Administrator Control
            </span>
            <span className="text-xs text-pesantren-300">| Root Access</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Pusat Kendali Sistem & Keamanan
          </h2>
          <p className="text-xs text-pesantren-200">
            Kelola konfigurasi sistem, peran pengguna, audit trail, dan integritas database.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (confirm("Reset seluruh data ke kondisi awal demo?")) {
                resetAllData();
                alert("Data berhasil direset ke status demo awal!");
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pesantren-900 hover:bg-pesantren-800 text-xs font-semibold text-rose-300 border border-pesantren-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Ringkasan Sistem", icon: Server },
          { id: "users", label: "Kelola Pengguna & Peran", icon: Users },
          { id: "settings", label: "Konfigurasi Pesantren", icon: Settings },
          { id: "audit", label: "Audit Log & Keamanan", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-pesantren-800 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Status Database
              </span>
              <p className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Terhubung (Sehat)
              </p>
              <span className="text-[11px] text-slate-400 block">PostgreSQL / Supabase Ready</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Santri Terdaftar
              </span>
              <p className="text-2xl font-black text-slate-900">{stats.totalSantri}</p>
              <span className="text-[11px] text-slate-400 block">Aktif di seluruh asrama</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Audit Log
              </span>
              <p className="text-2xl font-black text-slate-900">{auditLogs.length}</p>
              <span className="text-[11px] text-slate-400 block">Rekam aktivitas sistem</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Waktu Server
              </span>
              <p className="text-lg font-bold text-slate-900 font-mono">Asia/Jakarta</p>
              <span className="text-[11px] text-emerald-600 font-semibold block">WIB (UTC+7)</span>
            </div>
          </div>

          {/* Quick System Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Informasi Lingkungan & Integrasi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Koneksi Supabase Cloud:</span>
                <p className="text-slate-500">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "URL Dikonfigurasi" : "Default Mode"}
                </p>
                <span className="text-[10px] text-emerald-600 font-medium">RLS Enforced: Yes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Deployment Provider:</span>
                <p className="text-slate-500">Vercel & Next.js 15 App Router</p>
                <span className="text-[10px] text-emerald-600 font-medium">Edge Optimized: Yes</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-700 block">Version Control:</span>
                <p className="text-slate-500">Git repository (branch: main)</p>
                <span className="text-[10px] text-emerald-600 font-medium">GitHub Ready: Yes</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">
              Daftar Pengguna Sistem & Hak Akses
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pengaturan 6 level hak akses pengguna (RBAC).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">Email Akun</th>
                  <th className="px-4 py-3">No. Telepon</th>
                  <th className="px-4 py-3">Peran (Role)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DEMO_PROFILES.map((p) => {
                  const meta = getRoleMeta(p.role);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {p.full_name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{p.email}</td>
                      <td className="px-4 py-3 text-slate-600">{p.phone_number || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${meta.color}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Aktif
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Konfigurasi Identitas & Aturan Pesantren</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Perubahan pada form ini langsung berdampak pada landing page dan waktu operasional.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan berhasil disimpan dan diperbarui!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Pesantren</label>
              <input
                type="text"
                value={formData.pesantren_name}
                onChange={(e) => setFormData({ ...formData, pesantren_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tagline Pesantren</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nomor Telepon Hotline</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nomor WhatsApp Resmi</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alamat Email Sekretariat</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Toleransi Keterlambatan (Menit)</label>
              <input
                type="number"
                value={formData.max_late_tolerance_minutes}
                onChange={(e) => setFormData({ ...formData, max_late_tolerance_minutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap Pesantren</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-pesantren-700"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pesantren-800 hover:bg-pesantren-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <Save className="w-4 h-4 text-gold-400" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Audit Trail & Catatan Keamanan</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Merekam setiap tindakan kritis dalam sistem untuk akuntabilitas.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari aksi / pengguna..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs pl-8 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Waktu (WIB)</th>
                  <th className="px-4 py-3">Pengguna</th>
                  <th className="px-4 py-3">Aksi</th>
                  <th className="px-4 py-3">Entitas</th>
                  <th className="px-4 py-3">Detail JSON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredAudits.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDateTimeWIB(a.created_at)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 font-sans">
                      {a.user_name || "System"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px]">
                        {a.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{a.entity_type}</td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 max-w-xs truncate">
                      {JSON.stringify(a.details || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

