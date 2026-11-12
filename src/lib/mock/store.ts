"use client";

import {
  Profile,
  Santri,
  PesiarSchedule,
  PesiarPermit,
  SystemSettings,
  GateLog,
  AuditLog,
} from "@/lib/types";
import {
  DEMO_PROFILES,
  INITIAL_SANTRI,
  INITIAL_SCHEDULES,
  INITIAL_PERMITS,
  INITIAL_SETTINGS,
  INITIAL_GATE_LOGS,
  INITIAL_AUDIT_LOGS,
} from "./data";

const STORAGE_KEYS = {
  CURRENT_USER: "pesiar_current_user",
  SANTRI: "pesiar_santri_list",
  SCHEDULES: "pesiar_schedules_list",
  PERMITS: "pesiar_permits_list",
  SETTINGS: "pesiar_system_settings",
  GATE_LOGS: "pesiar_gate_logs_list",
  AUDIT_LOGS: "pesiar_audit_logs_list",
};

export function getStoredCurrentUser(): Profile {
  if (typeof window === "undefined") return DEMO_PROFILES[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEMO_PROFILES[0]; // Super admin default
}

export function setStoredCurrentUser(profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(profile));
  // Also set a cookie so Next.js middleware and server can detect it
  document.cookie = `pesiar_user_role=${profile.role}; path=/; max-age=86400`;
  document.cookie = `pesiar_user_id=${profile.id}; path=/; max-age=86400`;
  window.dispatchEvent(new Event("pesiar-auth-change"));
}

export function getStoredSantri(): Santri[] {
  if (typeof window === "undefined") return INITIAL_SANTRI;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SANTRI);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SANTRI;
}

export function saveSantriList(list: Santri[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SANTRI, JSON.stringify(list));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function getStoredSchedules(): PesiarSchedule[] {
  if (typeof window === "undefined") return INITIAL_SCHEDULES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SCHEDULES;
}

export function saveSchedulesList(list: PesiarSchedule[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(list));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function getStoredPermits(): PesiarPermit[] {
  if (typeof window === "undefined") return INITIAL_PERMITS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PERMITS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_PERMITS;
}

export function savePermitsList(list: PesiarPermit[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PERMITS, JSON.stringify(list));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function getStoredSettings(): SystemSettings {
  if (typeof window === "undefined") return INITIAL_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: SystemSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function getStoredGateLogs(): GateLog[] {
  if (typeof window === "undefined") return INITIAL_GATE_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GATE_LOGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_GATE_LOGS;
}

export function addGateLog(log: Omit<GateLog, "id" | "scanned_at">) {
  if (typeof window === "undefined") return;
  const current = getStoredGateLogs();
  const newLog: GateLog = {
    ...log,
    id: "gl-" + Date.now(),
    scanned_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.GATE_LOGS, JSON.stringify([newLog, ...current]));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function addAuditLog(action: string, entity_type: string, entity_id?: string, details?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const current = getStoredAuditLogs();
  const user = getStoredCurrentUser();
  const newAudit: AuditLog = {
    id: "aud-" + Date.now(),
    user_id: user.id,
    user_name: user.full_name,
    action,
    entity_type,
    entity_id,
    details,
    ip_address: "127.0.0.1",
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([newAudit, ...current]));
  window.dispatchEvent(new Event("pesiar-data-change"));
}

export function getStoredAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return INITIAL_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_AUDIT_LOGS;
}

export function resetMockData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.SANTRI);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  localStorage.removeItem(STORAGE_KEYS.PERMITS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.GATE_LOGS);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  window.dispatchEvent(new Event("pesiar-data-change"));
}

