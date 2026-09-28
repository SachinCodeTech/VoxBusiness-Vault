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
    CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id),
    subcategory_id VARCHAR(80) NOT NULL REFERENCES public.subcategories(id),
    
    state_id VARCHAR(50) NOT NULL REFERENCES public.states(id),
    city_id VARCHAR(50) NOT NULL REFERENCES public.cities(id),
    area_id VARCHAR(80) REFERENCES public.areas(id),
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,

    description TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    starting_price NUMERIC(10, 2) DEFAULT 0,
    service_at_customer_location BOOLEAN NOT NULL DEFAULT true,

    business_hours JSONB NOT NULL DEFAULT '{"days": "Mon - Sun", "openTime": "09:00", "closeTime": "21:00", "isOpenToday": true}'::jsonb,

    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    is_location_verified BOOLEAN NOT NULL DEFAULT false,
    is_docs_verified BOOLEAN NOT NULL DEFAULT false,
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
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
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
CREATE POLICY "Leads insert public" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Leads vendor access" ON public.leads FOR ALL USING (vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid()) OR is_admin());
CREATE POLICY "Analytics log public" ON public.analytics_events FOR INSERT WITH CHECK (true);
