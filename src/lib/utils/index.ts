import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActivityType, PermitStatus, UserRole } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to Indonesian locale with WIB timezone
 */
export function formatDateID(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/**
 * Format date string to short date e.g. "14 Nov 2026"
 */
export function formatShortDateID(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

/**
 * Format timestamp to WIB time string e.g. "08.15 WIB"
 */
export function formatTimeWIB(timeString?: string | null): string {
  if (!timeString) return "-";
  // If only HH:mm or HH:mm:ss
  if (timeString.includes(":") && !timeString.includes("T") && !timeString.includes("-")) {
    const parts = timeString.split(":");
    return `${parts[0]}.${parts[1]} WIB`;
  }
  const date = new Date(timeString);
  if (isNaN(date.getTime())) return "-";

  const timeFormatted = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);

  return `${timeFormatted.replace(":", ".")} WIB`;
}

/**
 * Format full datetime e.g. "Jumat, 20 Nov 2026, 14.30 WIB"
 */
export function formatDateTimeWIB(dateString?: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const datePart = new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);

  return `${datePart}, ${timePart.replace(":", ".")} WIB`;
}

/**
 * Permit status label and styling
 */
export function getPermitStatusMeta(status: PermitStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Menunggu Persetujuan",
        bg: "bg-amber-100 text-amber-800 border-amber-300",
        badge: "bg-amber-500",
        dot: "bg-amber-500",
        icon: "Clock",
      };
    case "approved":
      return {
        label: "Disetujui (Siap Berangkat)",
        bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
        badge: "bg-emerald-600",
        dot: "bg-emerald-500",
        icon: "CheckCircle2",
      };
    case "active_out":
      return {
        label: "Sedang di Luar Pesantren",
        bg: "bg-blue-100 text-blue-800 border-blue-300",
        badge: "bg-blue-600",
        dot: "bg-blue-500 animate-pulse",
        icon: "ExternalLink",
      };
    case "completed":
      return {
        label: "Selesai (Sudah Kembali)",
        bg: "bg-slate-100 text-slate-800 border-slate-300",
        badge: "bg-slate-600",
        dot: "bg-slate-500",
        icon: "Home",
      };
    case "rejected":
      return {
        label: "Ditolak",
        bg: "bg-rose-100 text-rose-800 border-rose-300",
        badge: "bg-rose-600",
        dot: "bg-rose-500",
        icon: "XCircle",
      };
    case "overdue":
      return {
        label: "Terlambat Kembali",
        bg: "bg-red-100 text-red-900 border-red-400 font-bold",
        badge: "bg-red-600",
        dot: "bg-red-600 animate-ping",
        icon: "AlertTriangle",
      };
    case "cancelled":
      return {
        label: "Dibatalkan",
        bg: "bg-neutral-100 text-neutral-600 border-neutral-300",
        badge: "bg-neutral-500",
        dot: "bg-neutral-400",
        icon: "Ban",
      };
  }
}

/**
 * Activity Type label & badge
 */
export function getActivityTypeMeta(type: ActivityType) {
  switch (type) {
    case "pesiar_keluar":
      return {
        label: "Pesiar Keluar",
        description: "Keluar bersama keluarga (08.00 - 17.00 WIB)",
        bg: "bg-pesantren-100 text-pesantren-800 border-pesantren-300",
      };
    case "kunjungan_pesantren":
      return {
        label: "Kunjungan di Pesantren",
        description: "Bertemu santri di area kunjungan pesantren",
        bg: "bg-indigo-100 text-indigo-800 border-indigo-300",
      };
  }
}

/**
 * Role display info
 */
export function getRoleMeta(role: UserRole) {
  switch (role) {
    case "super_admin":
      return { label: "Super Admin", color: "bg-purple-100 text-purple-800 border-purple-200" };
    case "admin":
      return { label: "Admin Pesantren", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "pengurus":
      return { label: "Pengurus Asrama", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "guardian":
      return { label: "Wali Santri", color: "bg-teal-100 text-teal-800 border-teal-200" };
    case "gate_officer":
      return { label: "Petugas Gerbang", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "leader":
      return { label: "Pimpinan / Mudir", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
  }
}

