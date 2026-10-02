-- ============================================================================
-- VOX BUSINESS VAULT: PRODUCTION POSTGRESQL / SUPABASE DDL SCHEMA
-- State -> City -> Area -> Pincode Dynamic Architecture
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. GEOGRAPHIC TABLES (Multi-state expandable)
CREATE TABLE IF NOT EXISTS public.states (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(5) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cities (
    id VARCHAR(50) PRIMARY KEY,
    state_id VARCHAR(50) NOT NULL REFERENCES public.states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.areas (
    id VARCHAR(80) PRIMARY KEY,
    city_id VARCHAR(50) NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150),
    pincode VARCHAR(10) NOT NULL,
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TAXONOMY TABLES
CREATE TABLE IF NOT EXISTS public.categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150) NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Wrench',
    popular BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id VARCHAR(80) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.services (
    id VARCHAR(100) PRIMARY KEY,
    subcategory_id VARCHAR(80) NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    gujarati_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROFILES & ROLES
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('customer', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    role user_role_enum NOT NULL DEFAULT 'customer',
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en',
    city_id VARCHAR(50) REFERENCES public.cities(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. VENDORS MASTER
DO $$ BEGIN
    CREATE TYPE business_type_enum AS ENUM ('physical', 'online', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    business_type business_type_enum NOT NULL DEFAULT 'physical',
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    business_email VARCHAR(255),
    website_url TEXT,
    app_store_url TEXT,
    primary_online_channel VARCHAR(50) DEFAULT 'website',
    service_region_mode VARCHAR(30) NOT NULL DEFAULT 'local' CHECK (service_region_mode IN ('local', 'gujarat', 'india', 'international')),
    service_regions TEXT[] DEFAULT ARRAY['Gujarat']::TEXT[],
    show_public_address BOOLEAN NOT NULL DEFAULT true,
    
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id),
    subcategory_id VARCHAR(80) NOT NULL REFERENCES public.subcategories(id),
    
    state_id VARCHAR(50) DEFAULT 'gujarat' REFERENCES public.states(id),
    city_id VARCHAR(50) REFERENCES public.cities(id),
    area_id VARCHAR(80) REFERENCES public.areas(id),
    address TEXT,
    pincode VARCHAR(10),
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),

    description TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    starting_price NUMERIC(10, 2) DEFAULT 0,
    service_at_customer_location BOOLEAN NOT NULL DEFAULT true,

    business_hours JSONB NOT NULL DEFAULT '{"days": "Mon - Sun", "openTime": "09:00", "closeTime": "21:00", "isOpenToday": true}'::jsonb,

    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    is_email_verified BOOLEAN NOT NULL DEFAULT false,
    is_location_verified BOOLEAN NOT NULL DEFAULT false,
    is_docs_verified BOOLEAN NOT NULL DEFAULT false,
    is_identity_verified BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,

    logo_url TEXT,
    banner_url TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    current_snaps TEXT[] DEFAULT ARRAY[]::TEXT[],
    live_video_url TEXT,

    qr_token VARCHAR(60) NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT check_vendor_operating_model CHECK (
        (business_type = 'physical' AND (address IS NOT NULL OR city_id IS NOT NULL)) OR
        (business_type = 'online' AND (website_url IS NOT NULL OR whatsapp IS NOT NULL OR email IS NOT NULL)) OR
        (business_type = 'hybrid' AND (website_url IS NOT NULL OR address IS NOT NULL OR phone IS NOT NULL))
    )
);

-- 5. REVIEWS
DO $$ BEGIN
    CREATE TYPE review_status_enum AS ENUM ('pending', 'approved', 'flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    user_city VARCHAR(100),
    is_verified_booking BOOLEAN NOT NULL DEFAULT false,
    status review_status_enum NOT NULL DEFAULT 'approved',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LEADS
DO $$ BEGIN
    CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'in_progress', 'completed', 'declined');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    customer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_area VARCHAR(100) NOT NULL,
    service_requested VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    advance_paid NUMERIC(10, 2) DEFAULT 0,
    payment_ref VARCHAR(100),
    status lead_status_enum NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_id, vendor_id)
);

-- 8. ANALYTICS EVENTS
DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('view', 'call', 'whatsapp', 'directions', 'qr_scan', 'enquiry');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.analytics_events (
    id BIGSERIAL PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    event_type event_type_enum NOT NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. INDEXES
CREATE INDEX IF NOT EXISTS idx_cities_state ON public.cities(state_id);
CREATE INDEX IF NOT EXISTS idx_areas_city ON public.areas(city_id);
CREATE INDEX IF NOT EXISTS idx_vendors_geo ON public.vendors(city_id, area_id);
CREATE INDEX IF NOT EXISTS idx_vendors_category ON public.vendors(category_id);
CREATE INDEX IF NOT EXISTS idx_vendors_qr_token ON public.vendors(qr_token);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON public.vendors(verification_status, is_featured);
CREATE INDEX IF NOT EXISTS idx_leads_vendor ON public.leads(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_analytics_vendor_type ON public.analytics_events(vendor_id, event_type);

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public Read
CREATE POLICY "Public read states" ON public.states FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public read areas" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read verified vendors" ON public.vendors FOR SELECT USING (verification_status = 'verified' OR auth.uid() = owner_profile_id OR is_admin());
CREATE POLICY "Public read approved reviews" ON public.reviews FOR SELECT USING (status = 'approved' OR is_admin());

-- Mutations
CREATE POLICY "Vendors register" ON public.vendors FOR INSERT WITH CHECK (auth.uid() = owner_profile_id OR is_admin());
CREATE POLICY "Vendors update own" ON public.vendors FOR UPDATE USING (auth.uid() = owner_profile_id OR is_admin());

-- Leads RLS: Public can submit enquiries with validation; private reads only for vendor owner, customer, or admin
DROP POLICY IF EXISTS "Leads insert public" ON public.leads;
DROP POLICY IF EXISTS "Leads vendor access" ON public.leads;
DROP POLICY IF EXISTS "Leads customer access" ON public.leads;

CREATE POLICY "Leads insert public" ON public.leads 
FOR INSERT 
WITH CHECK (
    length(trim(customer_name)) >= 2 AND 
    length(trim(customer_phone)) >= 8 AND 
    length(trim(service_requested)) >= 2
);

CREATE POLICY "Leads vendor access" ON public.leads 
FOR SELECT 
USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid()) 
    OR is_admin()
);

CREATE POLICY "Leads vendor update status" ON public.leads 
FOR UPDATE 
USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid()) 
    OR is_admin()
);

CREATE POLICY "Leads customer access" ON public.leads 
FOR SELECT 
USING (
    customer_profile_id IS NOT NULL AND auth.uid() = customer_profile_id
);

CREATE POLICY "Analytics log public" ON public.analytics_events FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 11. VENDOR LEAD NOTIFICATION OUTBOX / QUEUE (Server-Side Delivery)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.leads_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    service_requested VARCHAR(150) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20),
    customer_area VARCHAR(100),
    message TEXT,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    advance_paid NUMERIC(10, 2) DEFAULT 0,
    payment_ref VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'skipped')),
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    last_error TEXT,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    provider_message_id VARCHAR(100),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_outbox_status ON public.leads_outbox(status, attempt_count);
CREATE INDEX IF NOT EXISTS idx_leads_outbox_lead ON public.leads_outbox(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_outbox_vendor ON public.leads_outbox(vendor_id);

ALTER TABLE public.leads_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors view own leads_outbox" ON public.leads_outbox
FOR SELECT
USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid()) 
    OR is_admin()
);

-- Legacy alias table/view for lead_notification_queue
CREATE TABLE IF NOT EXISTS public.lead_notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(150) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    service_requested VARCHAR(150) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20),
    customer_area VARCHAR(100),
    message TEXT,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    advance_paid NUMERIC(10, 2) DEFAULT 0,
    payment_ref VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'skipped')),
    attempt_count INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    last_error TEXT,
    idempotency_key VARCHAR(100) NOT NULL UNIQUE,
    provider_message_id VARCHAR(100),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lead_notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors view own notification queue" ON public.lead_notification_queue
FOR SELECT
USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid()) 
    OR is_admin()
);

-- Server-side Trigger: Automatically resolve authorized vendor email and enqueue notification upon lead insert
CREATE OR REPLACE FUNCTION public.enqueue_leads_outbox()
RETURNS TRIGGER AS $$
DECLARE
    v_vendor RECORD;
    v_recipient_email VARCHAR(255);
    v_recipient_name VARCHAR(150);
    v_business_name VARCHAR(200);
    v_recent_lead_count INT;
BEGIN
    -- Anti-Spam Rate Limiting: Max 8 enquiries per phone number within a rolling 10-minute window
    SELECT COUNT(*) INTO v_recent_lead_count
    FROM public.leads
    WHERE customer_phone = NEW.customer_phone
      AND created_at > NOW() - INTERVAL '10 minutes';

    IF v_recent_lead_count > 8 THEN
        RAISE EXCEPTION 'Enquiry rate limit exceeded. Please wait a few minutes before submitting another request.';
    END IF;

    -- Query authoritative vendor data & owner profile (Never trust frontend or customer email input)
    SELECT 
        v.id,
        v.business_name,
        v.owner_name,
        v.email AS vendor_email,
        p.email AS profile_email
    INTO v_vendor
    FROM public.vendors v
    LEFT JOIN public.profiles p ON p.id = v.owner_profile_id
    WHERE v.id = NEW.vendor_id;

    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    -- Prioritize authoritative email registered to the vendor listing or owner's authenticated profile
    v_recipient_email := COALESCE(
        NULLIF(TRIM(v_vendor.vendor_email), ''),
        NULLIF(TRIM(v_vendor.profile_email), '')
    );
    v_recipient_name := COALESCE(NULLIF(TRIM(v_vendor.owner_name), ''), 'Business Partner');
    v_business_name := COALESCE(NULLIF(TRIM(v_vendor.business_name), ''), 'Gujarat Service Partner');

    -- Gracefully handle missing or invalid vendor email without blocking the customer's lead
    IF v_recipient_email IS NULL OR v_recipient_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        INSERT INTO public.leads_outbox (
            lead_id,
            vendor_id,
            recipient_email,
            recipient_name,
            business_name,
            service_requested,
            customer_name,
            customer_phone,
            customer_area,
            message,
            preferred_date,
            preferred_time,
            advance_paid,
            payment_ref,
            status,
            last_error,
            idempotency_key
        ) VALUES (
            NEW.id,
            NEW.vendor_id,
            COALESCE(v_recipient_email, 'unconfigured@voxbusinessvault.internal'),
            v_recipient_name,
            v_business_name,
            NEW.service_requested,
            NEW.customer_name,
            NEW.customer_phone,
            NEW.customer_area,
            NEW.message,
            NEW.preferred_date,
            NEW.preferred_time,
            NEW.advance_paid,
            NEW.payment_ref,
            'skipped',
            'Vendor does not have a verified email address configured on profile.',
            'lead_notif_' || NEW.id::text
        ) ON CONFLICT (idempotency_key) DO NOTHING;

        -- Keep queue mirrored
        INSERT INTO public.lead_notification_queue (
            lead_id, vendor_id, recipient_email, recipient_name, business_name,
            service_requested, customer_name, customer_phone, customer_area, message,
            preferred_date, preferred_time, advance_paid, payment_ref, status, last_error, idempotency_key
        ) VALUES (
            NEW.id, NEW.vendor_id, COALESCE(v_recipient_email, 'unconfigured@voxbusinessvault.internal'),
            v_recipient_name, v_business_name, NEW.service_requested, NEW.customer_name,
            NEW.customer_phone, NEW.customer_area, NEW.message, NEW.preferred_date,
            NEW.preferred_time, NEW.advance_paid, NEW.payment_ref, 'skipped',
            'Vendor does not have a verified email address configured on profile.',
            'lead_notif_' || NEW.id::text
        ) ON CONFLICT (idempotency_key) DO NOTHING;

        RETURN NEW;
    END IF;

    -- Enqueue into leads_outbox with guaranteed idempotency key to prevent duplicate emails
    INSERT INTO public.leads_outbox (
        lead_id,
        vendor_id,
        recipient_email,
        recipient_name,
        business_name,
        service_requested,
        customer_name,
        customer_phone,
        customer_area,
        message,
        preferred_date,
        preferred_time,
        advance_paid,
        payment_ref,
        status,
        idempotency_key
    ) VALUES (
        NEW.id,
        NEW.vendor_id,
        v_recipient_email,
        v_recipient_name,
        v_business_name,
        NEW.service_requested,
        NEW.customer_name,
        NEW.customer_phone,
        NEW.customer_area,
        NEW.message,
        NEW.preferred_date,
        NEW.preferred_time,
        NEW.advance_paid,
        NEW.payment_ref,
        'pending',
        'lead_notif_' || NEW.id::text
    ) ON CONFLICT (idempotency_key) DO NOTHING;

    -- Keep queue mirrored
    INSERT INTO public.lead_notification_queue (
        lead_id, vendor_id, recipient_email, recipient_name, business_name,
        service_requested, customer_name, customer_phone, customer_area, message,
        preferred_date, preferred_time, advance_paid, payment_ref, status, idempotency_key
    ) VALUES (
        NEW.id, NEW.vendor_id, v_recipient_email, v_recipient_name, v_business_name,
        NEW.service_requested, NEW.customer_name, NEW.customer_phone, NEW.customer_area,
        NEW.message, NEW.preferred_date, NEW.preferred_time, NEW.advance_paid,
        NEW.payment_ref, 'pending', 'lead_notif_' || NEW.id::text
    ) ON CONFLICT (idempotency_key) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enqueue_leads_outbox ON public.leads;
DROP TRIGGER IF EXISTS trg_enqueue_vendor_lead_notification ON public.leads;

CREATE TRIGGER trg_enqueue_leads_outbox
AFTER INSERT ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.enqueue_leads_outbox();


