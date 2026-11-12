// ==============================================================================
// PESIAR SANTRI - CORE TYPES & DOMAIN INTERFACES
// ==============================================================================

export type UserRole =
  | "super_admin"
  | "admin"
  | "pengurus"
  | "guardian"
  | "gate_officer"
  | "leader";

export type ActivityType = "pesiar_keluar" | "kunjungan_pesantren";

export type PermitStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active_out"
  | "completed"
  | "cancelled"
  | "overdue";

export type GenderType = "L" | "P";

export type GuardianRelation =
  | "ayah"
  | "ibu"
  | "wali"
  | "kakak"
  | "paman"
  | "lainnya";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Guardian {
  id: string;
  profile_id: string;
  nik?: string;
  address?: string;
  occupation?: string;
  emergency_phone?: string;
  id_card_url?: string;
  profile?: Profile;
  created_at: string;
  updated_at: string;
}

export interface Santri {
  id: string;
  nis: string;
  full_name: string;
  nickname?: string;
  gender: GenderType;
  asrama: string;
  kamar: string;
  kelas: string;
  halaqah?: string;
  photo_url?: string;
  is_active: boolean;
  health_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SantriGuardian {
  id: string;
  santri_id: string;
  guardian_id: string;
  relationship: GuardianRelation;
  is_primary: boolean;
  verification_status: VerificationStatus;
  verified_by?: string;
  verified_at?: string;
  notes?: string;
  santri?: Santri;
  guardian?: Guardian;
  created_at: string;
}

export interface PesiarSchedule {
  id: string;
  title: string;
  event_date: string; // YYYY-MM-DD (Always Friday)
  start_time: string; // "08:00:00"
  end_time: string; // "17:00:00"
  registration_open: string;
  registration_close: string;
  allow_pesiar_keluar: boolean;
  allow_kunjungan: boolean;
  max_quota?: number;
  notes?: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PesiarPermit {
  id: string;
  permit_code: string;
  schedule_id: string;
  santri_id: string;
  guardian_id: string;
  activity_type: ActivityType;
  
  // Penjemput / Pendamping
  pickup_person_name: string;
  pickup_person_phone: string;
  pickup_person_relation: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  destination_address?: string;
  notes?: string;
  
  // Status
  status: PermitStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  
  // QR & Gate
  qr_code_token: string;
  check_out_time?: string;
  check_out_by?: string;
  check_in_time?: string;
  check_in_by?: string;
  
  // Late tracking
  is_late: boolean;
  late_duration_minutes: number;
  late_reason?: string;
  
  created_by?: string;
  created_at: string;
  updated_at: string;

  // Joined relations
  santri?: Santri;
  schedule?: PesiarSchedule;
  guardian?: Guardian & { profile?: Profile };
}

export interface GateLog {
  id: string;
  permit_id: string;
  santri_id: string;
  action_type: "CHECK_OUT" | "CHECK_IN";
  officer_id: string;
  scanned_at: string;
  notes?: string;
  evidence_photo_url?: string;
  santri?: Santri;
  permit?: PesiarPermit;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
  user_name?: string;
}

export interface SystemSettings {
  pesantren_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  operating_hours: string;
  standard_start_time: string;
  standard_end_time: string;
  standard_day: string;
  max_late_tolerance_minutes: number;
  require_verified_guardian: boolean;
}

