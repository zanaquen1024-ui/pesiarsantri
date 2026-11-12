-- ==============================================================================
-- PESIAR SANTRI - SEED DATA SCRIPT (DEMO & TESTING DATA)
-- Includes realistic pesantren data, santri master, dynamic schedules, and permits
-- ==============================================================================

-- 1. SEED PROFILES (Assuming these IDs can be linked or created in Auth)
-- We insert UUIDs that can be used directly or synchronized with Supabase Auth
DO $$
DECLARE
    v_superadmin_id UUID := '11111111-1111-1111-1111-111111111111';
    v_admin_id UUID      := '22222222-2222-2222-2222-222222222222';
    v_pengurus_id UUID   := '33333333-3333-3333-3333-333333333333';
    v_guardian_id UUID   := '44444444-4444-4444-4444-444444444444';
    v_gate_id UUID       := '55555555-5555-5555-5555-555555555555';
    v_leader_id UUID     := '66666666-6666-6666-6666-666666666666';
    
    v_santri_1 UUID := 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_santri_2 UUID := 'a2222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_santri_3 UUID := 'a3333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_santri_4 UUID := 'a4444444-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_santri_5 UUID := 'a5555555-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
    v_santri_6 UUID := 'a6666666-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

    v_guardian_record_id UUID := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    v_schedule_id UUID := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
BEGIN

    -- PROFILES
    INSERT INTO public.profiles (id, email, full_name, phone_number, role, is_active)
    VALUES
        (v_superadmin_id, 'superadmin@pesiarsantri.id', 'Ust. Ahmad Fauzan, S.Kom.I (Super Admin)', '081234567891', 'super_admin', true),
        (v_admin_id, 'admin@pesiarsantri.id', 'Ustadzah Siti Rahma, S.Pd (Bagian Administrasi)', '081234567892', 'admin', true),
        (v_pengurus_id, 'pengurus@pesiarsantri.id', 'Ust. Muhammad Wildan (Musyrif Asrama)', '081234567893', 'pengurus', true),
        (v_guardian_id, 'wali@pesiarsantri.id', 'H. Bambang Hermanto (Wali Santri)', '081234567894', 'guardian', true),
        (v_gate_id, 'gerbang@pesiarsantri.id', 'Pak Joko Susilo (Petugas Keamanan Gerbang)', '081234567895', 'gate_officer', true),
        (v_leader_id, 'pimpinan@pesiarsantri.id', 'K.H. Abdullah Syukri, Lc., M.A. (Mudir Pesantren)', '081234567896', 'leader', true)
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

    -- GUARDIAN DETAIL
    INSERT INTO public.guardians (id, profile_id, nik, address, occupation, emergency_phone)
    VALUES
        (v_guardian_record_id, v_guardian_id, '3201234567890001', 'Jl. Anggrek No. 14, Bandung', 'Wiraswasta', '081299887766')
    ON CONFLICT (profile_id) DO UPDATE SET
        address = EXCLUDED.address,
        nik = EXCLUDED.nik;

    -- SANTRI MASTER DATA
    INSERT INTO public.santri (id, nis, full_name, nickname, gender, asrama, kamar, kelas, halaqah)
    VALUES
        (v_santri_1, '20240101', 'Muhammad Raihan Hermanto', 'Raihan', 'L', 'Asrama Abu Bakar', 'Kamar 102', '10 IPA 1', 'Halaqah Al-Fatih'),
        (v_santri_2, '20240102', 'Aisyah Naura Hermanto', 'Naura', 'P', 'Asrama Khadijah', 'Kamar 204', '8 B', 'Halaqah Maryam'),
        (v_santri_3, '20240103', 'Faris Ihsan Al-Ghifari', 'Faris', 'L', 'Asrama Umar Bin Khattab', 'Kamar 105', '9 A', 'Halaqah Bilal'),
        (v_santri_4, '20240104', 'Zahra Amelia Putri', 'Zahra', 'P', 'Asrama Aisyah', 'Kamar 301', '11 IPS 2', 'Halaqah Khansa'),
        (v_santri_5, '20240105', 'Daffa Arya Pratama', 'Daffa', 'L', 'Asrama Ali Bin Abi Thalib', 'Kamar 208', '7 C', 'Halaqah Zubair'),
        (v_santri_6, '20240106', 'Khalid Saifullah', 'Khalid', 'L', 'Asrama Utsman Bin Affan', 'Kamar 101', '12 IPA 1', 'Halaqah Tariq')
    ON CONFLICT (nis) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        asrama = EXCLUDED.asrama;

    -- SANTRI-GUARDIAN RELATIONSHIPS (Verified)
    INSERT INTO public.santri_guardians (santri_id, guardian_id, relationship, is_primary, verification_status, verified_by, verified_at)
    VALUES
        (v_santri_1, v_guardian_record_id, 'ayah', true, 'verified', v_admin_id, now()),
        (v_santri_2, v_guardian_record_id, 'ayah', true, 'verified', v_admin_id, now())
    ON CONFLICT (santri_id, guardian_id) DO NOTHING;

    -- SCHEDULE: UPCOMING FRIDAY PESIAR
    INSERT INTO public.pesiar_schedules (
        id, title, event_date, start_time, end_time, registration_open, registration_close,
        allow_pesiar_keluar, allow_kunjungan, max_quota, notes, is_active, created_by
    )
    VALUES (
        v_schedule_id,
        'Pesiar Santri Bulanan - Periode November 2026',
        CURRENT_DATE + ((5 - EXTRACT(DOW FROM CURRENT_DATE)::integer) % 7 + 7) % 7, -- Hari Jumat terdekat
        '08:00:00',
        '17:00:00',
        now() - INTERVAL '3 days',
        now() + INTERVAL '2 days',
        true,
        true,
        350,
        'Santri wajib kembali sebelum pukul 17.00 WIB berseragam rapi dan membawa kartu pesiar digital.',
        true,
        v_admin_id
    )
    ON CONFLICT (id) DO NOTHING;

    -- SAMPLE PERMITS
    -- 1. Approved Permit (Ready for check-out)
    INSERT INTO public.pesiar_permits (
        permit_code, schedule_id, santri_id, guardian_id, activity_type,
        pickup_person_name, pickup_person_phone, pickup_person_relation,
        vehicle_type, vehicle_plate, destination_address, notes,
        status, reviewed_by, reviewed_at, qr_code_token, created_by
    )
    VALUES (
        'PSR-202611-0001',
        v_schedule_id,
        v_santri_1,
        v_guardian_record_id,
        'pesiar_keluar',
        'H. Bambang Hermanto',
        '081234567894',
        'Ayah Kandung',
        'Mobil',
        'D 1234 AB',
        'Kediaman Keluarga di Bandung',
        'Menghadiri syukuran keluarga inti',
        'approved',
        v_pengurus_id,
        now(),
        'QR-PSR-202611-0001-RAIHAN',
        v_guardian_id
    )
    ON CONFLICT (permit_code) DO NOTHING;

    -- 2. Active Out Permit (Currently Outside Pesantren)
    INSERT INTO public.pesiar_permits (
        permit_code, schedule_id, santri_id, guardian_id, activity_type,
        pickup_person_name, pickup_person_phone, pickup_person_relation,
        vehicle_type, vehicle_plate, destination_address,
        status, reviewed_by, reviewed_at, check_out_time, check_out_by,
        qr_code_token, created_by
    )
    VALUES (
        'PSR-202611-0002',
        v_schedule_id,
        v_santri_2,
        v_guardian_record_id,
        'pesiar_keluar',
        'Hj. Nuraini Hermanto',
        '081234567898',
        'Ibu Kandung',
        'Mobil',
        'D 5678 XYZ',
        'Pusat Kota & Makan Siang Keluarga',
        'active_out',
        v_pengurus_id,
        now(),
        now() - INTERVAL '3 hours',
        v_gate_id,
        'QR-PSR-202611-0002-NAURA',
        v_guardian_id
    )
    ON CONFLICT (permit_code) DO NOTHING;

    -- 3. Completed Permit (Returned on time)
    INSERT INTO public.pesiar_permits (
        permit_code, schedule_id, santri_id, guardian_id, activity_type,
        pickup_person_name, pickup_person_phone, pickup_person_relation,
        status, reviewed_by, reviewed_at, check_out_time, check_out_by,
        check_in_time, check_in_by, is_late, qr_code_token, created_by
    )
    VALUES (
        'PSR-202611-0003',
        v_schedule_id,
        v_santri_3,
        v_guardian_record_id,
        'kunjungan_pesantren',
        'H. Bambang Hermanto',
        '081234567894',
        'Wali',
        'completed',
        v_pengurus_id,
        now() - INTERVAL '5 hours',
        now() - INTERVAL '4 hours',
        v_gate_id,
        now() - INTERVAL '1 hour',
        v_gate_id,
        false,
        'QR-PSR-202611-0003-FARIS',
        v_guardian_id
    )
    ON CONFLICT (permit_code) DO NOTHING;

    -- 4. Overdue / Late Permit (Santri Telat Kembali)
    INSERT INTO public.pesiar_permits (
        permit_code, schedule_id, santri_id, guardian_id, activity_type,
        pickup_person_name, pickup_person_phone, pickup_person_relation,
        status, reviewed_by, reviewed_at, check_out_time, check_out_by,
        is_late, late_duration_minutes, late_reason, qr_code_token, created_by
    )
    VALUES (
        'PSR-202611-0004',
        v_schedule_id,
        v_santri_5,
        v_guardian_record_id,
        'pesiar_keluar',
        'Arya Pratama',
        '081344556677',
        'Kakak',
        'overdue',
        v_pengurus_id,
        now() - INTERVAL '8 hours',
        now() - INTERVAL '7 hours',
        v_gate_id,
        true,
        45,
        'Terjebak macet jalan arteri arah pesantren',
        'QR-PSR-202611-0004-DAFFA',
        v_admin_id
    )
    ON CONFLICT (permit_code) DO NOTHING;

    -- 5. Pending Permit (Menunggu Verifikasi Pengurus)
    INSERT INTO public.pesiar_permits (
        permit_code, schedule_id, santri_id, guardian_id, activity_type,
        pickup_person_name, pickup_person_phone, pickup_person_relation,
        destination_address, notes, status, qr_code_token, created_by
    )
    VALUES (
        'PSR-202611-0005',
        v_schedule_id,
        v_santri_4,
        v_guardian_record_id,
        'pesiar_keluar',
        'Hj. Sulastri',
        '081987654321',
        'Ibu',
        'Silaturahmi ke rumah nenek',
        'Santri izin refreshing bersama keluarga',
        'pending',
        'QR-PSR-202611-0005-ZAHRA',
        v_guardian_id
    )
    ON CONFLICT (permit_code) DO NOTHING;

END $$;

