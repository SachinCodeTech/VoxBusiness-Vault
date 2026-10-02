-- ============================================================================
-- VBV: Online Business Registration & Flexible Service Coverage Migration
-- Target Engine: PostgreSQL 15+ / Supabase
-- ============================================================================

-- 1. Ensure business_type enum or column exists with proper constraints
DO $$ BEGIN
    CREATE TYPE business_type_enum AS ENUM ('physical', 'online', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_region_mode_enum AS ENUM ('local', 'gujarat', 'india', 'international');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add columns to public.vendors if not existing
ALTER TABLE public.vendors
  ADD COLUMN IF NOT EXISTS business_type VARCHAR(30) NOT NULL DEFAULT 'physical',
  ADD COLUMN IF NOT EXISTS website_url TEXT,
  ADD COLUMN IF NOT EXISTS business_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS service_region_mode VARCHAR(30) NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS service_regions TEXT[] DEFAULT ARRAY['Gujarat']::TEXT[],
  ADD COLUMN IF NOT EXISTS primary_online_channel VARCHAR(50) DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS show_public_address BOOLEAN NOT NULL DEFAULT true;

-- 3. Make physical location fields nullable for online businesses
ALTER TABLE public.vendors
  ALTER COLUMN address DROP NOT NULL,
  ALTER COLUMN area_id DROP NOT NULL,
  ALTER COLUMN pincode DROP NOT NULL,
  ALTER COLUMN lat DROP NOT NULL,
  ALTER COLUMN lng DROP NOT NULL;

-- 4. Add data integrity check constraints
DO $$ BEGIN
  ALTER TABLE public.vendors
    DROP CONSTRAINT IF EXISTS vendors_business_type_check;
  ALTER TABLE public.vendors
    ADD CONSTRAINT vendors_business_type_check
    CHECK (business_type IN ('physical', 'online', 'hybrid'));
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.vendors
    DROP CONSTRAINT IF EXISTS vendors_service_region_mode_check;
  ALTER TABLE public.vendors
    ADD CONSTRAINT vendors_service_region_mode_check
    CHECK (
      service_region_mode IN (
        'local', 'gujarat', 'india', 'international'
      )
    );
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE public.vendors
    DROP CONSTRAINT IF EXISTS vendors_online_website_check;
  ALTER TABLE public.vendors
    ADD CONSTRAINT vendors_online_website_check
    CHECK (
      business_type <> 'online'
      OR (website_url IS NOT NULL AND length(trim(website_url)) >= 8)
    );
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- 5. Physical business location constraint
DO $$ BEGIN
  ALTER TABLE public.vendors
    DROP CONSTRAINT IF EXISTS vendors_physical_location_check;
  ALTER TABLE public.vendors
    ADD CONSTRAINT vendors_physical_location_check
    CHECK (
      business_type <> 'physical'
      OR (address IS NOT NULL OR city_id IS NOT NULL)
    );
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- 6. Index for fast querying by operating type and service coverage
CREATE INDEX IF NOT EXISTS idx_vendors_business_type ON public.vendors(business_type);
CREATE INDEX IF NOT EXISTS idx_vendors_service_region_mode ON public.vendors(service_region_mode);
