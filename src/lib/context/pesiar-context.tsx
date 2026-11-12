"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  Santri,
  PesiarSchedule,
  PesiarPermit,
  SystemSettings,
  GateLog,
  AuditLog,
  UserRole,
} from "@/lib/types";
import {
  DEMO_PROFILES,
  INITIAL_SANTRI,
  INITIAL_SCHEDULES,
  INITIAL_PERMITS,
  INITIAL_SETTINGS,
  INITIAL_GATE_LOGS,
  INITIAL_AUDIT_LOGS,
} from "@/lib/mock/data";
import {
  getStoredCurrentUser,
  setStoredCurrentUser,
  getStoredSantri,
  saveSantriList,
  getStoredSchedules,
  saveSchedulesList,
  getStoredPermits,
  savePermitsList,
  getStoredSettings,
  saveSettings,
  getStoredGateLogs,
  addGateLog,
  getStoredAuditLogs,
  addAuditLog,
  resetMockData as clearStorage,
} from "@/lib/mock/store";

interface PesiarContextType {
  currentUser: Profile;
  switchUser: (role: UserRole) => void;
  setUser: (profile: Profile) => void;
  logout: () => void;
  
  santriList: Santri[];
  addSantri: (santri: Omit<Santri, "id" | "created_at" | "updated_at">) => Santri;
  updateSantri: (id: string, updates: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  
  schedulesList: PesiarSchedule[];
  addSchedule: (sch: Omit<PesiarSchedule, "id" | "created_at" | "updated_at">) => PesiarSchedule;
  updateSchedule: (id: string, updates: Partial<PesiarSchedule>) => void;
  deleteSchedule: (id: string) => void;
  
  permitsList: PesiarPermit[];
  addPermit: (p: Omit<PesiarPermit, "id" | "permit_code" | "qr_code_token" | "created_at" | "updated_at" | "is_late" | "late_duration_minutes">) => PesiarPermit;
  approvePermit: (id: string, reviewerNotes?: string) => void;
  rejectPermit: (id: string, reason: string) => void;
  gateCheckOut: (permitId: string, notes?: string) => { success: boolean; message: string };
  gateCheckIn: (permitId: string, notes?: string, isLateOverride?: boolean) => { success: boolean; message: string; isLate: boolean };
  
  gateLogs: GateLog[];
  auditLogs: AuditLog[];
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetAllData: () => void;
  
  // Real-time KPI Stats
  stats: {
    totalSantri: number;
    totalActiveOut: number;
    totalReturned: number;
    totalOverdue: number;
    totalPending: number;
    totalApproved: number;
  };
}

const PesiarContext = createContext<PesiarContextType | null>(null);

export function PesiarProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<Profile>(DEMO_PROFILES[0]);
  const [santriList, setSantriList] = useState<Santri[]>(INITIAL_SANTRI);
  const [schedulesList, setSchedulesList] = useState<PesiarSchedule[]>(INITIAL_SCHEDULES);
  const [permitsList, setPermitsList] = useState<PesiarPermit[]>(INITIAL_PERMITS);
  const [settings, setSettingsState] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [gateLogs, setGateLogsState] = useState<GateLog[]>(INITIAL_GATE_LOGS);
  const [auditLogs, setAuditLogsState] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [mounted, setMounted] = useState(false);

  const loadFromStorage = () => {
    setCurrentUserState(getStoredCurrentUser());
    setSantriList(getStoredSantri());
    setSchedulesList(getStoredSchedules());
    setPermitsList(getStoredPermits());
    setSettingsState(getStoredSettings());
    setGateLogsState(getStoredGateLogs());
    setAuditLogsState(getStoredAuditLogs());
  };

  useEffect(() => {
    loadFromStorage();
    setMounted(true);

    const handleDataChange = () => {
      loadFromStorage();
    };

    window.addEventListener("pesiar-data-change", handleDataChange);
    window.addEventListener("pesiar-auth-change", handleDataChange);

    return () => {
      window.removeEventListener("pesiar-data-change", handleDataChange);
      window.removeEventListener("pesiar-auth-change", handleDataChange);
    };
  }, []);

  const switchUser = (role: UserRole) => {
    const target = DEMO_PROFILES.find((p) => p.role === role) || DEMO_PROFILES[0];
    setStoredCurrentUser(target);
    setCurrentUserState(target);
    addAuditLog("USER_SWITCH_ROLE", "profiles", target.id, { new_role: role });
  };

  const setUser = (profile: Profile) => {
    setStoredCurrentUser(profile);
    setCurrentUserState(profile);
  };

  const logout = () => {
    const guardian = DEMO_PROFILES.find((p) => p.role === "guardian") || DEMO_PROFILES[3];
    setStoredCurrentUser(guardian);
    setCurrentUserState(guardian);
  };

  const addSantri = (data: Omit<Santri, "id" | "created_at" | "updated_at">) => {
    const newSantri: Santri = {
      ...data,
      id: "s-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newSantri, ...santriList];
    setSantriList(updated);
    saveSantriList(updated);
    addAuditLog("CREATE_SANTRI", "santri", newSantri.id, { nis: newSantri.nis, name: newSantri.full_name });
    return newSantri;
  };

  const updateSantri = (id: string, updates: Partial<Santri>) => {
    const updated = santriList.map((s) => (s.id === id ? { ...s, ...updates, updated_at: new Date().toISOString() } : s));
    setSantriList(updated);
    saveSantriList(updated);
    addAuditLog("UPDATE_SANTRI", "santri", id, updates as Record<string, unknown>);
  };

  const deleteSantri = (id: string) => {
    const updated = santriList.filter((s) => s.id !== id);
    setSantriList(updated);
    saveSantriList(updated);
    addAuditLog("DELETE_SANTRI", "santri", id);
  };

  const addSchedule = (data: Omit<PesiarSchedule, "id" | "created_at" | "updated_at">) => {
    const newSch: PesiarSchedule = {
      ...data,
      id: "sch-" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newSch, ...schedulesList];
    setSchedulesList(updated);
    saveSchedulesList(updated);
    addAuditLog("CREATE_SCHEDULE", "pesiar_schedules", newSch.id, { title: newSch.title, date: newSch.event_date });
    return newSch;
  };

  const updateSchedule = (id: string, updates: Partial<PesiarSchedule>) => {
    const updated = schedulesList.map((sch) => (sch.id === id ? { ...sch, ...updates, updated_at: new Date().toISOString() } : sch));
    setSchedulesList(updated);
    saveSchedulesList(updated);
    addAuditLog("UPDATE_SCHEDULE", "pesiar_schedules", id, updates as Record<string, unknown>);
  };

  const deleteSchedule = (id: string) => {
    const updated = schedulesList.filter((sch) => sch.id !== id);
    setSchedulesList(updated);
    saveSchedulesList(updated);
    addAuditLog("DELETE_SCHEDULE", "pesiar_schedules", id);
  };

  const addPermit = (p: Omit<PesiarPermit, "id" | "permit_code" | "qr_code_token" | "created_at" | "updated_at" | "is_late" | "late_duration_minutes">) => {
    const codeNum = String(permitsList.length + 1).padStart(4, "0");
    const today = new Date();
    const ym = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}`;
    const permit_code = `PSR-${ym}-${codeNum}`;
    const qr_code_token = `TOKEN-${permit_code}-${Date.now().toString(36).toUpperCase()}`;

    const newPermit: PesiarPermit = {
      ...p,
      id: "p-" + Date.now(),
      permit_code,
      qr_code_token,
      is_late: false,
      late_duration_minutes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newPermit, ...permitsList];
    setPermitsList(updated);
    savePermitsList(updated);
    addAuditLog("CREATE_PERMIT", "pesiar_permits", newPermit.id, {
      code: permit_code,
      santri_id: p.santri_id,
      activity: p.activity_type,
    });
    return newPermit;
  };

  const approvePermit = (id: string, reviewerNotes?: string) => {
    const updated = permitsList.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: "approved" as const,
          reviewed_by: currentUser.full_name,
          reviewed_at: new Date().toISOString(),
          notes: reviewerNotes ? `${p.notes ? p.notes + " | " : ""}Catatan Pengurus: ${reviewerNotes}` : p.notes,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    setPermitsList(updated);
    savePermitsList(updated);
    addAuditLog("APPROVE_PERMIT", "pesiar_permits", id, { reviewer: currentUser.full_name });
  };

  const rejectPermit = (id: string, reason: string) => {
    const updated = permitsList.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          status: "rejected" as const,
          reviewed_by: currentUser.full_name,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason,
          updated_at: new Date().toISOString(),
        };
      }
      return p;
    });
    setPermitsList(updated);
    savePermitsList(updated);
    addAuditLog("REJECT_PERMIT", "pesiar_permits", id, { reason, reviewer: currentUser.full_name });
  };

  const gateCheckOut = (permitId: string, notes?: string) => {
    const permit = permitsList.find((p) => p.id === permitId || p.permit_code === permitId || p.qr_code_token === permitId);
    if (!permit) {
      return { success: false, message: "Surat Izin tidak ditemukan." };
    }
    if (permit.status !== "approved") {
      return {
        success: false,
        message: `Status izin saat ini: ${permit.status}. Hanya izin berstatus 'Disetujui' yang dapat keluar gerbang.`,
      };
    }

    const now = new Date().toISOString();
    const updated = permitsList.map((p) => {
      if (p.id === permit.id) {
        return {
          ...p,
          status: "active_out" as const,
          check_out_time: now,
          check_out_by: currentUser.full_name,
          updated_at: now,
        };
      }
      return p;
    });

    setPermitsList(updated);
    savePermitsList(updated);

    addGateLog({
      permit_id: permit.id,
      santri_id: permit.santri_id,
      action_type: "CHECK_OUT",
      officer_id: currentUser.id,
      notes: notes || `Check-out santri oleh ${currentUser.full_name}`,
    });

    addAuditLog("GATE_CHECK_OUT", "pesiar_permits", permit.id, {
      permit_code: permit.permit_code,
      officer: currentUser.full_name,
    });

    return {
      success: true,
      message: `Santri berhasil CHECK-OUT keluar gerbang pada ${new Date().toLocaleTimeString("id-ID")}`,
    };
  };

  const gateCheckIn = (permitId: string, notes?: string, isLateOverride?: boolean) => {
    const permit = permitsList.find((p) => p.id === permitId || p.permit_code === permitId || p.qr_code_token === permitId);
    if (!permit) {
      return { success: false, message: "Surat Izin tidak ditemukan.", isLate: false };
    }
    if (permit.status !== "active_out" && permit.status !== "overdue") {
      return {
        success: false,
        message: `Santri belum tercatat Check-Out keluar gerbang (Status: ${permit.status}).`,
        isLate: false,
      };
    }

    const now = new Date();
    // Default limit is 17:00 WIB
    const isLateCalculated = isLateOverride ?? (now.getHours() >= 17 && now.getMinutes() > settings.max_late_tolerance_minutes);
    const lateMinutes = isLateCalculated ? (now.getHours() - 17) * 60 + now.getMinutes() : 0;

    const updated = permitsList.map((p) => {
      if (p.id === permit.id) {
        return {
          ...p,
          status: (isLateCalculated ? "overdue" : "completed") as any,
          check_in_time: now.toISOString(),
          check_in_by: currentUser.full_name,
          is_late: isLateCalculated,
          late_duration_minutes: lateMinutes,
          late_reason: notes || (isLateCalculated ? "Keterlambatan saat check-in di gerbang" : undefined),
          updated_at: now.toISOString(),
        };
      }
      return p;
    });

    setPermitsList(updated);
    savePermitsList(updated);

    addGateLog({
      permit_id: permit.id,
      santri_id: permit.santri_id,
      action_type: "CHECK_IN",
      officer_id: currentUser.id,
      notes: notes || `Check-in gerbang oleh ${currentUser.full_name} (${isLateCalculated ? "TERLAMBAT" : "TEPAT WAKTU"})`,
    });

    addAuditLog("GATE_CHECK_IN", "pesiar_permits", permit.id, {
      permit_code: permit.permit_code,
      is_late: isLateCalculated,
      late_minutes: lateMinutes,
    });

    return {
      success: true,
      message: isLateCalculated
        ? `Santri telah CHECK-IN kembali ke pesantren, tercatat TERLAMBAT (+${lateMinutes} menit).`
        : `Santri berhasil CHECK-IN kembali ke pesantren tepat waktu!`,
      isLate: isLateCalculated,
    };
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettingsState(updated);
    saveSettings(updated);
    addAuditLog("UPDATE_SETTINGS", "system_settings", "main", newSettings as Record<string, unknown>);
  };

  const resetAllData = () => {
    clearStorage();
    setCurrentUserState(DEMO_PROFILES[0]);
    setSantriList(INITIAL_SANTRI);
    setSchedulesList(INITIAL_SCHEDULES);
    setPermitsList(INITIAL_PERMITS);
    setSettingsState(INITIAL_SETTINGS);
    setGateLogsState(INITIAL_GATE_LOGS);
    setAuditLogsState(INITIAL_AUDIT_LOGS);
  };

  // Stats calculation
  const totalSantri = santriList.length;
  const totalActiveOut = permitsList.filter((p) => p.status === "active_out").length;
  const totalReturned = permitsList.filter((p) => p.status === "completed").length;
  const totalOverdue = permitsList.filter((p) => p.status === "overdue" || (p.is_late && p.status === "active_out")).length;
  const totalPending = permitsList.filter((p) => p.status === "pending").length;
  const totalApproved = permitsList.filter((p) => p.status === "approved").length;

  const value: PesiarContextType = {
    currentUser,
    switchUser,
    setUser,
    logout,
    santriList,
    addSantri,
    updateSantri,
    deleteSantri,
    schedulesList,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    permitsList,
    addPermit,
    approvePermit,
    rejectPermit,
    gateCheckOut,
    gateCheckIn,
    gateLogs,
    auditLogs,
    settings,
    updateSettings,
    resetAllData,
    stats: {
      totalSantri,
      totalActiveOut,
      totalReturned,
      totalOverdue,
      totalPending,
      totalApproved,
    },
  };

  return <PesiarContext.Provider value={value}>{children}</PesiarContext.Provider>;
}

export function usePesiar() {
  const context = useContext(PesiarContext);
  if (!context) {
    throw new Error("usePesiar must be used within a PesiarProvider");
  }
  return context;
}

