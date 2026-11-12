"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Calendar,
  FileCheck2,
  QrCode,
  BarChart3,
  Settings,
  History,
  LogOut,
  Menu,
  X,
  Bell,
  Clock,
  ChevronDown,
  Building2,
  FileText,
  UserCheck,
  AlertCircle,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { usePesiar } from "@/lib/context/pesiar-context";
import { UserRole } from "@/lib/types";
import { getRoleMeta } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUser, settings, stats, logout } = usePesiar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Live WIB Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      setCurrentTimeStr(`${timeStr.replace(/:/g, ".")} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleMeta = getRoleMeta(currentUser.role);

  // Navigation Items mapped to roles
  const getNavItems = () => {
    switch (currentUser.role) {
      case "super_admin":
        return [
          { href: "/dashboard/super-admin", label: "Dashboard Sistem", icon: LayoutDashboard },
          { href: "/dashboard/super-admin/users", label: "Kelola Admin & Pengguna", icon: Users },
          { href: "/dashboard/super-admin/settings", label: "Konfigurasi Pesantren", icon: Settings },
          { href: "/dashboard/super-admin/audit", label: "Audit Log & Keamanan", icon: History },
          { href: "/dashboard/admin/santri", label: "Data Santri Master", icon: Building2 },
          { href: "/dashboard/admin/perizinan", label: "Monitoring Perizinan", icon: FileCheck2 },
        ];
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Dashboard Admin", icon: LayoutDashboard },
          { href: "/dashboard/admin/santri", label: "Master Data Santri", icon: Users },
          { href: "/dashboard/admin/wali", label: "Wali & Verifikasi", icon: UserCheck },
          { href: "/dashboard/admin/jadwal", label: "Jadwal Pesiar Bulanan", icon: Calendar },
          { href: "/dashboard/admin/perizinan", label: "Pengajuan & Buat Izin", icon: FileCheck2 },
          { href: "/dashboard/gate", label: "Monitor Gerbang", icon: QrCode },
          { href: "/dashboard/admin/laporan", label: "Laporan & Rekapitulasi", icon: FileText },
        ];
      case "pengurus":
        return [
          { href: "/dashboard/pengurus", label: "Dashboard Pengurus", icon: LayoutDashboard },
          { href: "/dashboard/pengurus/persetujuan", label: "Persetujuan Izin Asrama", icon: FileCheck2, badge: stats.totalPending },
          { href: "/dashboard/pengurus/monitoring", label: "Santri di Luar Kampus", icon: ExternalLink, badge: stats.totalActiveOut },
          { href: "/dashboard/pengurus/keterlambatan", label: "Monitoring Terlambat", icon: AlertCircle, badge: stats.totalOverdue },
        ];
      case "guardian":
        return [
          { href: "/dashboard/guardian", label: "Dashboard Santri Saya", icon: LayoutDashboard },
          { href: "/dashboard/guardian/ajukan", label: "Ajukan Izin Baru", icon: FileCheck2 },
          { href: "/dashboard/guardian/riwayat", label: "Riwayat & Tiket QR", icon: History },
        ];
      case "gate_officer":
        return [
          { href: "/dashboard/gate", label: "Scanner Terminal Gerbang", icon: QrCode },
          { href: "/dashboard/gate/riwayat", label: "Log Keluar-Masuk", icon: History },
        ];
      case "leader":
        return [
          { href: "/dashboard/leader", label: "Executive Summary", icon: LayoutDashboard },
          { href: "/dashboard/leader/analitik", label: "Statistik & Tren", icon: BarChart3 },
          { href: "/dashboard/leader/laporan", label: "Laporan Pimpinan", icon: FileText },
        ];
      default:
        return [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  const handleRoleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value as UserRole;
    switchUser(role);
    // Redirect to the role's primary dashboard
    switch (role) {
      case "super_admin":
        router.push("/dashboard/super-admin");
        break;
      case "admin":
        router.push("/dashboard/admin");
        break;
      case "pengurus":
        router.push("/dashboard/pengurus");
        break;
      case "guardian":
        router.push("/dashboard/guardian");
        break;
      case "gate_officer":
        router.push("/dashboard/gate");
        break;
      case "leader":
        router.push("/dashboard/leader");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-pesantren-950 text-slate-300 border-r border-pesantren-900 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-pesantren-900/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pesantren-800 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight block">
              PESIAR<span className="text-gold-400">SANTRI</span>
            </span>
            <span className="text-[11px] text-pesantren-300 block truncate max-w-[160px]">
              {settings.pesantren_name}
            </span>
          </div>
        </div>

        {/* User Card & Role Info */}
        <div className="p-4 mx-3 my-4 bg-pesantren-900/60 rounded-xl border border-pesantren-800/80 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pesantren-800 text-white font-bold flex items-center justify-center text-sm border border-pesantren-700">
              {currentUser.full_name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.full_name}
              </p>
              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider mt-0.5 ${roleMeta.color}`}>
                {roleMeta.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-pesantren-400/80 mb-2">
            Menu Navigasi
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-pesantren-800 text-white font-semibold shadow-sm shadow-pesantren-900/40 translate-x-1"
                    : "text-slate-300 hover:text-white hover:bg-pesantren-900/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Role Switcher & Public Link */}
        <div className="p-4 border-t border-pesantren-900/80 space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] text-pesantren-300 block font-medium">
              Mode Demo Role Switcher:
            </label>
            <select
              value={currentUser.role}
              onChange={handleRoleSwitch}
              className="w-full bg-pesantren-900 border border-pesantren-700 text-white text-xs rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-gold-400 outline-none cursor-pointer"
            >
              <option value="super_admin">1. Super Admin</option>
              <option value="admin">2. Admin Pesantren</option>
              <option value="pengurus">3. Pengurus Asrama</option>
              <option value="guardian">4. Wali Santri</option>
              <option value="gate_officer">5. Petugas Gerbang</option>
              <option value="leader">6. Pimpinan / Mudir</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <Link
              href="/"
              className="text-pesantren-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Halaman Depan</span>
            </Link>
            <Link
              href="/login"
              onClick={logout}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Portal {roleMeta.label}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Operasional Pesiar & Kunjungan Santri
              </p>
            </div>
          </div>

          {/* Right Header Controls: WIB Clock, Live Indicator, Role Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-mono font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-pesantren-700" />
              <span>{currentTimeStr || "08.00.00 WIB"}</span>
            </div>

            {/* Quick Role Switcher (Visible on mobile/tablet topbar) */}
            <div className="lg:hidden">
              <select
                value={currentUser.role}
                onChange={handleRoleSwitch}
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-1.5 font-medium"
              >
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="pengurus">Pengurus</option>
                <option value="guardian">Wali Santri</option>
                <option value="gate_officer">Petugas Gerbang</option>
                <option value="leader">Pimpinan</option>
              </select>
            </div>

            {/* System Status Pill */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Online
            </span>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-pesantren-950 text-slate-200 px-4 py-4 space-y-2 border-b border-pesantren-900">
            <div className="p-3 bg-pesantren-900 rounded-lg mb-3">
              <p className="text-xs text-slate-400">Pengguna Aktif:</p>
              <p className="text-sm font-bold text-white">{currentUser.full_name}</p>
              <p className="text-xs text-gold-400 font-semibold uppercase">{roleMeta.label}</p>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium ${
                    isActive ? "bg-pesantren-800 text-white font-bold" : "text-slate-300 hover:bg-pesantren-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gold-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-pesantren-900 flex items-center justify-between text-xs">
              <Link href="/" className="text-pesantren-300">
                Halaman Depan
              </Link>
              <Link href="/login" onClick={logout} className="text-rose-400">
                Keluar
              </Link>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

