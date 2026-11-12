-- ==============================================================================
-- PESIAR SANTRI - POSTGRESQL & SUPABASE DATABASE MIGRATION SCRIPT
-- Modern Islamic Boarding School Outing & Family Visitation Management System
-- Timezone: Asia/Jakarta (WIB)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'super_admin',
        'admin',
        'pengurus',
        'guardian',
        'gate_officer',
        'leader'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE activity_type AS ENUM (
        'pesiar_keluar',
        'kunjungan_pesantren'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE permit_status AS ENUM (
        'pending',
        'approved',
        'rejected',
        'active_out',
        'completed',
        'cancelled',
        'overdue'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM (
        'L',
        'P'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE guardian_relation AS ENUM (
        'ayah',
        'ibu',
        'wali',
        'kakak',
        'paman',
        'lainnya'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM (
        'pending',
        'verified',
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    role user_role NOT NULL DEFAULT 'guardian',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 4. GUARDIANS TABLE (Data Tambahan Wali Santri)
CREATE TABLE IF NOT EXISTS public.guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    nik TEXT,
    address TEXT,
    occupation TEXT,
    emergency_phone TEXT,
    id_card_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 5. SANTRI TABLE (Data Master Santri)
CREATE TABLE IF NOT EXISTS public.santri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nis TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    nickname TEXT,
    gender gender_type NOT NULL,
    asrama TEXT NOT NULL,
    kamar TEXT NOT NULL,
    kelas TEXT NOT NULL,
    halaqah TEXT,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    health_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 6. SANTRI_GUARDIANS TABLE (Relasi & Verifikasi Wali-Santri)
CREATE TABLE IF NOT EXISTS public.santri_guardians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    santri_id UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    relationship guardian_relation NOT NULL DEFAULT 'wali',
    is_primary BOOLEAN NOT NULL DEFAULT false,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    CONSTRAINT uq_santri_guardian UNIQUE (santri_id, guardian_id)
);

-- 7. PESIAR_SCHEDULES TABLE (Jadwal Pesiar Dinamis)
CREATE TABLE IF NOT EXISTS public.pesiar_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '08:00:00',
    end_time TIME NOT NULL DEFAULT '17:00:00',
    registration_open TIMESTAMPTZ NOT NULL,
    registration_close TIMESTAMPTZ NOT NULL,
    allow_pesiar_keluar BOOLEAN NOT NULL DEFAULT true,
    allow_kunjungan BOOLEAN NOT NULL DEFAULT true,
    max_quota INTEGER,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 8. PESIAR_PERMITS TABLE (Surat Izin & Rekap Keluar-Masuk)
CREATE TABLE IF NOT EXISTS public.pesiar_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_code TEXT UNIQUE NOT NULL,
    schedule_id UUID NOT NULL REFERENCES public.pesiar_schedules(id) ON DELETE CASCADE,
    santri_id UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL DEFAULT 'pesiar_keluar',
    
    -- Informasi Penjemput / Pendamping
    pickup_person_name TEXT NOT NULL,
    pickup_person_phone TEXT NOT NULL,
    pickup_person_relation TEXT NOT NULL,
    vehicle_type TEXT,
    vehicle_plate TEXT,
    destination_address TEXT,
    notes TEXT,
    
    -- Status & Validasi
    status permit_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- QR Code Identifier (Digunakan scan gerbang)
    qr_code_token TEXT UNIQUE NOT NULL,
    
    -- Gate tracking
    check_out_time TIMESTAMPTZ,
    check_out_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    check_in_time TIMESTAMPTZ,
    check_in_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Monitoring Keterlambatan
    is_late BOOLEAN NOT NULL DEFAULT false,
    late_duration_minutes INTEGER DEFAULT 0,
    late_reason TEXT,
    
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 9. PESIAR_GATE_LOGS TABLE (Audit Log Scanner Gerbang)
CREATE TABLE IF NOT EXISTS public.pesiar_gate_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    permit_id UUID NOT NULL REFERENCES public.pesiar_permits(id) ON DELETE CASCADE,
    santri_id UUID NOT NULL REFERENCES public.santri(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- CHECK_OUT, CHECK_IN
    officer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    notes TEXT,
    evidence_photo_url TEXT
);

-- 10. AUDIT_LOGS TABLE (Catatan Keamanan & Aktivitas Sistem)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 11. SYSTEM_SETTINGS TABLE (Konfigurasi Pesantren & Pesiar)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Asia/Jakarta', now())
);

-- 12. INDEXES UNTUK PERFORMA TINGGI
CREATE INDEX IF NOT EXISTS idx_santri_nis ON public.santri(nis);
CREATE INDEX IF NOT EXISTS idx_santri_asrama ON public.santri(asrama);
CREATE INDEX IF NOT EXISTS idx_santri_gender ON public.santri(gender);
CREATE INDEX IF NOT EXISTS idx_permits_schedule ON public.pesiar_permits(schedule_id);
CREATE INDEX IF NOT EXISTS idx_permits_santri ON public.pesiar_permits(santri_id);
CREATE INDEX IF NOT EXISTS idx_permits_status ON public.pesiar_permits(status);
CREATE INDEX IF NOT EXISTS idx_permits_qr ON public.pesiar_permits(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_permits_late ON public.pesiar_permits(is_late);
CREATE INDEX IF NOT EXISTS idx_gate_logs_permit ON public.pesiar_gate_logs(permit_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at);

-- 13. AUTO UPDATE TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('Asia/Jakarta', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_santri_modtime
    BEFORE UPDATE ON public.santri
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_pesiar_schedules_modtime
    BEFORE UPDATE ON public.pesiar_schedules
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_pesiar_permits_modtime
    BEFORE UPDATE ON public.pesiar_permits
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 14. AUTO CREATE PROFILE ON USER SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'guardian'::user_role)
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
    
    -- Jika role guardian, buat juga baris di tabel guardians
    IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'guardian'::user_role) = 'guardian' THEN
        INSERT INTO public.guardians (profile_id)
        VALUES (NEW.id)
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 15. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.santri ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.santri_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesiar_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesiar_permits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pesiar_gate_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: Get Current User Role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Profiles viewable by self or staff" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id OR 
        public.get_current_role() IN ('super_admin', 'admin', 'pengurus', 'leader', 'gate_officer')
    );

CREATE POLICY "Profiles editable by self or super_admin" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id OR 
        public.get_current_role() = 'super_admin'
    );

-- Santri Policies
CREATE POLICY "Santri viewable by all authenticated users" ON public.santri
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Santri manageable by super_admin and admin" ON public.santri
    FOR ALL USING (
        public.get_current_role() IN ('super_admin', 'admin')
    );

-- Guardians Policies
CREATE POLICY "Guardians viewable by staff or self" ON public.guardians
    FOR SELECT USING (
        profile_id = auth.uid() OR
        public.get_current_role() IN ('super_admin', 'admin', 'pengurus', 'leader', 'gate_officer')
    );

CREATE POLICY "Guardians editable by self or admin" ON public.guardians
    FOR ALL USING (
        profile_id = auth.uid() OR
        public.get_current_role() IN ('super_admin', 'admin')
    );

-- Schedules Policies
CREATE POLICY "Schedules viewable by all authenticated users" ON public.pesiar_schedules
    FOR SELECT USING (auth.role() = 'authenticated' OR is_active = true);

CREATE POLICY "Schedules manageable by super_admin and admin" ON public.pesiar_schedules
    FOR ALL USING (
        public.get_current_role() IN ('super_admin', 'admin')
    );

-- Permits Policies
CREATE POLICY "Permits viewable by guardian owner or staff" ON public.pesiar_permits
    FOR SELECT USING (
        guardian_id IN (SELECT id FROM public.guardians WHERE profile_id = auth.uid()) OR
        public.get_current_role() IN ('super_admin', 'admin', 'pengurus', 'leader', 'gate_officer')
    );

CREATE POLICY "Permits insertable by guardian or admin" ON public.pesiar_permits
    FOR INSERT WITH CHECK (
        guardian_id IN (SELECT id FROM public.guardians WHERE profile_id = auth.uid()) OR
        public.get_current_role() IN ('super_admin', 'admin')
    );

CREATE POLICY "Permits updatable by staff" ON public.pesiar_permits
    FOR UPDATE USING (
        public.get_current_role() IN ('super_admin', 'admin', 'pengurus', 'gate_officer')
    );

-- Gate Logs Policies
CREATE POLICY "Gate logs viewable by staff" ON public.pesiar_gate_logs
    FOR SELECT USING (
        public.get_current_role() IN ('super_admin', 'admin', 'pengurus', 'leader', 'gate_officer')
    );

CREATE POLICY "Gate logs insertable by gate_officer and admin" ON public.pesiar_gate_logs
    FOR INSERT WITH CHECK (
        public.get_current_role() IN ('super_admin', 'admin', 'gate_officer')
    );

-- Audit Logs Policies
CREATE POLICY "Audit logs viewable by super_admin and admin" ON public.audit_logs
    FOR SELECT USING (
        public.get_current_role() IN ('super_admin', 'admin', 'leader')
    );

-- System Settings Policies
CREATE POLICY "System settings viewable by all" ON public.system_settings
    FOR SELECT USING (true);

CREATE POLICY "System settings editable by super_admin" ON public.system_settings
    FOR ALL USING (
        public.get_current_role() = 'super_admin'
    );

-- 16. STORAGE BUCKETS (If running on Supabase Cloud)
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('santri-photos', 'santri-photos', true),
    ('id-cards', 'id-cards', false),
    ('permits', 'permits', true),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 17. INITIAL SYSTEM SETTINGS SEED
INSERT INTO public.system_settings (key, value, description)
VALUES 
(
    'pesantren_info',
    '{
        "name": "Pondok Pesantren Darul Huffazh",
        "tagline": "Mencetak Generasi Qurani, Berakhlak Mulia, dan Mandiri",
        "address": "Jl. Pesantren No. 99, Sukajadi, Jawa Barat",
        "phone": "+62 812-3456-7890",
        "email": "sekretariat@pesiarsantri.id",
        "whatsapp": "+62 812-3456-7890",
        "operating_hours": "08.00 - 17.00 WIB"
    }'::jsonb,
    'Identitas resmi pesantren dan kontak'
),
(
    'pesiar_rules',
    '{
        "standard_start_time": "08:00:00",
        "standard_end_time": "17:00:00",
        "standard_day": "Jumat",
        "max_late_tolerance_minutes": 15,
        "require_verified_guardian": true,
        "max_santri_per_permit": 3
    }'::jsonb,
    'Aturan dasar kegiatan pesiar dan toleransi keterlambatan'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

