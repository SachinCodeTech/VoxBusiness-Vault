# Vox Business Vault (VBV)
## Production Build Specification & Architecture Blueprint
**Gujarat's Local Business & Services Directory**  
*Core Promise: Find. Connect. Get Service.*

---

## 1. Executive Summary & Brand Positioning

**Vox Business Vault (VBV)** is an institutional-grade, hyperlocal business discovery and direct-connection platform engineered for Gujarat's commercial ecosystem. It bridges physical, neighborhood storefronts with high-intent digital customers through permanent QR tokens, direct telephone/WhatsApp connectivity, zero brokerage, and Aadhaar/GST verification.

### 1.1 Core Value Proposition
- **For Consumers:** Instant, unmediated access to local service providers, daily hangouts (tea kitlis, pan parlours), bridal parlours, technicians, clinics, and educational hubs within their exact city and area.
- **For Local Merchants:** Zero-commission digital identity, permanent store QR codes (`businessvault.in/v/{vendor-token}`), customer enquiry dashboard, and Aadhaar/GST verified trust badges.
- **The Physical-to-Digital Bridge:**
  $$\text{Storefront Banner / Counter QR} \longrightarrow \text{Permanent URL (/v/\{token\})} \longrightarrow \text{Verified Profile} \longrightarrow \text{Call / WhatsApp / GPS Directions}$$

---

## 2. Four-Phase Engineering Roadmap

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 VOX BUSINESS VAULT ROADMAP                             │
├─────────────────────────┬─────────────────────────┬───────────────────┬────────────────┤
│   PHASE 1: CORE MVP     │   PHASE 2: DISCOVERY    │ PHASE 3: LEADS    │ PHASE 4: SAAS  │
├─────────────────────────┼─────────────────────────┼───────────────────┼────────────────┤
│ • Normalized Geo DDL    │ • GPS Nearby Search     │ • Request Service │ • Featured Tier│
│ • State → City → Area   │ • Leaflet / Google Map  │ • Lead Ingestion  │ • Subscriptions│
│ • Category Hierarchy    │ • Customer Reviews      │ • Vendor Pipeline │ • Adv. Metrics │
│ • Vendor Registration   │ • Dynamic Filter Bar    │ • Realtime Alerts │ • Multi-State  │
│ • Permanent QR (/v/:id) │ • Favorites / Bookmarks │ • Direct Chat     │ • UPI Payments │
│ • Direct Call / WA      │ • City/Cat SEO Slugs    │ • Duplicate Claim │ • Ads Manager  │
│ • Admin RBAC & RLS      │ • Vendor Analytics      │ • Status Tracking │ • Expansion    │
└─────────────────────────┴─────────────────────────┴───────────────────┴────────────────┘
```

### Phase 1: Core Directory (Current Focus)
- Normalized database hierarchy: `State → City → Area → Pincode` (extensible beyond Gujarat without schema changes).
- Category taxonomy: `Category → Subcategory → Service Tag`.
- Merchant onboarding, verification pipeline (`pending`, `verified`, `rejected`, `suspended`).
- Public merchant profile with click-to-call (`tel:`), direct WhatsApp deep link, and Google Maps directions.
- Permanent vendor token generator & QR scanner bridge (`/v/:token`).
- Server-enforced Row Level Security (RLS) and Role-Based Access Control (`customer`, `vendor`, `admin`).

### Phase 2: Hyperlocal Discovery & Search
- GPS-grounded distance calculation (Haversine formula in PostgreSQL/PostGIS).
- Dual view toggle (Interactive Leaflet/Google Map vs. High-density Card Grid).
- User favorites persisted to local store / authenticated profile.
- Moderated customer reviews with star ratings (1–5) and verification flags.
- Real-time search suggestions with multilingual keyword matching (English, Gujarati, Hindi).
- Vendor basic analytics: views, calls, WhatsApp clicks, directions queried, QR scans.

### Phase 3: Lead Marketplace & Communication
- "Request a Service" structured enquiry form for customers.
- Real-time lead ingestion into merchant dashboard with notification badges.
- Merchant lead management states: `new` → `contacted` → `in_progress` → `completed` → `declined`.
- Direct customer-to-merchant messaging drawer.
- Duplicate business claiming workflow with document/phone verification.

### Phase 4: Business Monetization & National Expansion
- Featured & Sponsored vendor ribbons with boosted search rankings.
- Tiered vendor memberships (Free, Silver Verified, Gold Partner).
- In-app digital booking advance and payments integration via UPI / Razorpay.
- Multi-state expansion rollout (Maharashtra, Rajasthan, Madhya Pradesh) via existing dynamic Geo schema.

---

## 3. Normalized Database Architecture (PostgreSQL / Supabase)

### 3.1 Entity Relationship Diagram (ERD) Overview

```
 [ states ] 1──< [ cities ] 1──< [ areas ] 1──< [ pincodes ]
                        │               │
                        │               │
 [ auth.users ] 1──1 [ profiles ]       │
      │                  │              │
      │ (owner)          │              │
      ▼                  ▼              │
 [ vendors ] >──────────────────────────┘
      │
      ├──< [ vendor_services ] >─── [ services ] >─── [ subcategories ] >─── [ categories ]
      ├──< [ vendor_media ]
      ├──< [ reviews ]
      ├──< [ leads ]
      ├──< [ favorites ]
      └──< [ analytics_events ]
```

---

## 4. Complete PostgreSQL DDL Schema (`supabase/schema.sql`)

```sql
-- ============================================================================
-- VOX BUSINESS VAULT: PRODUCTION DDL SCHEMA
-- Target Engine: PostgreSQL 15+ / Supabase
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. GEOGRAPHIC HIERARCHY TABLES (State -> City -> Area -> Pincode)
-- ----------------------------------------------------------------------------

CREATE TABLE public.states (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'gujarat'
    name VARCHAR(100) NOT NULL, -- e.g., 'Gujarat'
    code VARCHAR(5) NOT NULL UNIQUE, -- e.g., 'GJ'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.cities (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'ahmedabad'
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

CREATE TABLE public.areas (
    id VARCHAR(80) PRIMARY KEY, -- e.g., 'ahm_satellite'
    city_id VARCHAR(50) NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., 'Satellite'
    gujarati_name VARCHAR(150),
    pincode VARCHAR(10) NOT NULL, -- e.g., '380015'
    lat NUMERIC(9, 6),
    lng NUMERIC(9, 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cities_state ON public.cities(state_id);
CREATE INDEX idx_areas_city ON public.areas(city_id);
CREATE INDEX idx_areas_pincode ON public.areas(pincode);

-- ----------------------------------------------------------------------------
-- 2. TAXONOMY TABLES (Category -> Subcategory -> Service)
-- ----------------------------------------------------------------------------

CREATE TABLE public.categories (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'tea_stall', 'beauty_parlour'
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150) NOT NULL,
    hindi_name VARCHAR(150) NOT NULL,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Wrench',
    is_popular BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.subcategories (
    id VARCHAR(80) PRIMARY KEY, -- e.g., 'tea_snacks', 'bridal_beauty'
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    gujarati_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.services (
    id VARCHAR(100) PRIMARY KEY, -- e.g., 'masala_kadak_chai'
    subcategory_id VARCHAR(80) NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    gujarati_name VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subcat_category ON public.subcategories(category_id);
CREATE INDEX idx_service_subcat ON public.services(subcategory_id);

-- ----------------------------------------------------------------------------
-- 3. USERS & PROFILES (RBAC: customer, vendor, admin)
-- ----------------------------------------------------------------------------

CREATE TYPE user_role_enum AS ENUM ('customer', 'vendor', 'admin');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255),
    role user_role_enum NOT NULL DEFAULT 'customer',
    preferred_language VARCHAR(5) NOT NULL DEFAULT 'en', -- 'en', 'gu', 'hi'
    city_id VARCHAR(50) REFERENCES public.cities(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);

-- ----------------------------------------------------------------------------
-- 4. VENDOR MASTER TABLE
-- ----------------------------------------------------------------------------

CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected', 'suspended');

CREATE TABLE public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    
    -- Category references
    category_id VARCHAR(50) NOT NULL REFERENCES public.categories(id),
    subcategory_id VARCHAR(80) NOT NULL REFERENCES public.subcategories(id),
    
    -- Geographic references
    state_id VARCHAR(50) NOT NULL REFERENCES public.states(id),
    city_id VARCHAR(50) NOT NULL REFERENCES public.cities(id),
    area_id VARCHAR(80) REFERENCES public.areas(id),
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    lat NUMERIC(9, 6) NOT NULL,
    lng NUMERIC(9, 6) NOT NULL,

    -- Business Profile
    description TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    starting_price NUMERIC(10, 2) DEFAULT 0,
    service_at_customer_location BOOLEAN NOT NULL DEFAULT true,

    -- Operating Hours (JSONB for flexibility)
    business_hours JSONB NOT NULL DEFAULT '{"days": "Mon - Sun", "openTime": "09:00", "closeTime": "21:00", "isOpenToday": true}'::jsonb,

    -- Trust & Verification Flags
    verification_status verification_status_enum NOT NULL DEFAULT 'pending',
    is_phone_verified BOOLEAN NOT NULL DEFAULT false,
    is_location_verified BOOLEAN NOT NULL DEFAULT false,
    is_docs_verified BOOLEAN NOT NULL DEFAULT false,
    is_featured BOOLEAN NOT NULL DEFAULT false,

    -- Ratings Cache
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,

    -- Branding & Media Assets
    logo_url TEXT,
    banner_url TEXT,
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    current_snaps TEXT[] DEFAULT ARRAY[]::TEXT[],
    live_video_url TEXT,

    -- Permanent QR Token (Indexed & Unique)
    qr_token VARCHAR(60) NOT NULL UNIQUE,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendors_geo ON public.vendors(city_id, area_id);
CREATE INDEX idx_vendors_category ON public.vendors(category_id);
CREATE INDEX idx_vendors_qr_token ON public.vendors(qr_token);
CREATE INDEX idx_vendors_status ON public.vendors(verification_status, is_featured);

-- ----------------------------------------------------------------------------
-- 5. VENDOR SERVICES JUNCTION
-- ----------------------------------------------------------------------------

CREATE TABLE public.vendor_services (
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    service_id VARCHAR(100) NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    price_estimate NUMERIC(10, 2),
    PRIMARY KEY (vendor_id, service_id)
);

-- ----------------------------------------------------------------------------
-- 6. REVIEWS & RATINGS
-- ----------------------------------------------------------------------------

CREATE TYPE review_status_enum AS ENUM ('pending', 'approved', 'flagged');

CREATE TABLE public.reviews (
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

CREATE INDEX idx_reviews_vendor ON public.reviews(vendor_id, status);

-- ----------------------------------------------------------------------------
-- 7. LEADS & SERVICE ENQUIRIES
-- ----------------------------------------------------------------------------

CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'in_progress', 'completed', 'declined');

CREATE TABLE public.leads (
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

CREATE INDEX idx_leads_vendor ON public.leads(vendor_id, status);

-- ----------------------------------------------------------------------------
-- 8. CUSTOMER FAVORITES
-- ----------------------------------------------------------------------------

CREATE TABLE public.favorites (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_id, vendor_id)
);

-- ----------------------------------------------------------------------------
-- 9. ANALYTICS & TELEMETRY EVENTS
-- ----------------------------------------------------------------------------

CREATE TYPE event_type_enum AS ENUM ('view', 'call', 'whatsapp', 'directions', 'qr_scan', 'enquiry');

CREATE TABLE public.analytics_events (
    id BIGSERIAL PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    event_type event_type_enum NOT NULL,
    ip_hash VARCHAR(64),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_vendor_type ON public.analytics_events(vendor_id, event_type);
```

---

## 5. Server-Enforced Row Level Security (RLS) Policies

Admin authorization is strictly enforced server-side via Supabase / PostgreSQL RLS, preventing unauthorized API mutations regardless of frontend bypass.

```sql
-- ============================================================================
-- ROW LEVEL SECURITY (RLS) CONFIGURATION
-- ============================================================================

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on all tables
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ POLICIES (Anonymous & Authenticated)
CREATE POLICY "Public states are readable" ON public.states FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public cities are readable" ON public.cities FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Public areas are readable" ON public.areas FOR SELECT USING (true);
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Subcategories are publicly readable" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Services are publicly readable" ON public.services FOR SELECT USING (true);

-- Vendors: Public can ONLY view verified vendors; Admins and Owners can view all
CREATE POLICY "Verified vendors are publicly viewable"
ON public.vendors FOR SELECT
USING (
    verification_status = 'verified' 
    OR auth.uid() = owner_profile_id 
    OR is_admin()
);

-- Reviews: Approved reviews are publicly readable
CREATE POLICY "Approved reviews are readable"
ON public.reviews FOR SELECT
USING (status = 'approved' OR is_admin());

-- 3. PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. VENDOR REGISTRATION & MANAGEMENT
CREATE POLICY "Vendors can register"
ON public.vendors FOR INSERT
WITH CHECK (auth.uid() = owner_profile_id OR is_admin());

CREATE POLICY "Vendors can update own listing"
ON public.vendors FOR UPDATE
USING (auth.uid() = owner_profile_id OR is_admin())
WITH CHECK (
    -- Vendors cannot self-approve their listing
    (verification_status = (SELECT verification_status FROM public.vendors WHERE id = vendors.id))
    OR is_admin()
);

-- 5. LEADS MANAGEMENT POLICIES
CREATE POLICY "Customers can create leads"
ON public.leads FOR INSERT
WITH CHECK (true);

CREATE POLICY "Vendors can read and update their own leads"
ON public.leads FOR ALL
USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE owner_profile_id = auth.uid())
    OR is_admin()
);

-- 6. FAVORITES POLICIES
CREATE POLICY "Users manage own favorites"
ON public.favorites FOR ALL
USING (profile_id = auth.uid());

-- 7. ANALYTICS INGESTION
CREATE POLICY "Anyone can log telemetry events"
ON public.analytics_events FOR INSERT
WITH CHECK (true);

-- 8. STRICT ADMIN-ONLY OVERRIDES
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (is_admin());
CREATE POLICY "Admins full access to cities" ON public.cities FOR ALL USING (is_admin());
CREATE POLICY "Admins full access to vendors" ON public.vendors FOR DELETE USING (is_admin());
CREATE POLICY "Admins approve reviews" ON public.reviews FOR UPDATE USING (is_admin());
```

---

## 6. Route & Screen Architecture

```
/                             -> Homepage: Hero Search, Popular Spots Carousel, Filter Bar, Vendor Grid
/v/:token                     -> Permanent QR Resolution Bridge -> Opens Merchant Public Modal
/explore/:city/:category      -> Dynamic SEO Listing Page
/categories                   -> Full Category Taxonomy Directory
/saved                        -> Saved Vendors / Favorites
/vendor/register              -> Multi-step Merchant Registration Wizard
/vendor/dashboard             -> Vendor Portal: Leads Pipeline, Profile Editor, QR Download, Analytics
/admin                        -> Executive Control Room: Vendor Approvals, Taxonomy Studio, City Manager
```

### 6.1 The Offline-to-Digital Permanent QR Bridge (`/v/:token`)
1. Merchant receives physical printed acrylic standee / counter card bearing `businessvault.in/v/{qr-token}`.
2. Walk-in customer scans QR with native phone camera.
3. System triggers single-page redirect:
   - Resolves `qr_token` against `public.vendors`.
   - Records `qr_scan` analytics event.
   - Immediately displays full merchant profile drawer with direct buttons:
     - 📞 **Direct Call** (`tel:+91...`)
     - 💬 **WhatsApp Connect** with auto-filled merchant greeting
     - 🗺️ **Turn-by-turn Navigation** via Google Maps API
     - 📋 **Services & Price Menu**

---

## 7. API Actions & Contracts (REST / RPC)

### 7.1 Search & Discovery API
- **Endpoint:** `GET /api/v1/vendors`
- **Query Parameters:**
  - `state` (default: `'gujarat'`)
  - `city` (e.g. `'ahmedabad'`)
  - `area` (e.g. `'satellite'`)
  - `category` (e.g. `'tea_stall'`)
  - `verified_only` (`true`/`false`)
  - `sort_by` (`'rating'`, `'popular'`, `'distance'`)
- **Response Format:**
```json
{
  "success": true,
  "total": 42,
  "data": [
    {
      "id": "c1f7a240-...",
      "businessName": "Shambhu's Coffee Bar & Kadak Chai",
      "ownerName": "Parthiv Patel",
      "phone": "+91 98251 44320",
      "whatsapp": "919825144320",
      "category": "tea_stall",
      "city": "Ahmedabad",
      "area": "Bodakdev",
      "rating": 4.9,
      "reviewCount": 210,
      "qrToken": "VBV-GUJ-TEA-025",
      "startingPrice": 20,
      "isVerified": true
    }
  ]
}
```

### 7.2 Permanent QR Resolution API
- **Endpoint:** `GET /api/v1/qr/:token`
- **Action:** Increments `qr_scans` counter asynchronously, returns public merchant profile.

### 7.3 Direct Lead Submission API
- **Endpoint:** `POST /api/v1/leads`
- **Payload:**
```json
{
  "vendorId": "c1f7a240-...",
  "customerName": "Nirav Parikh",
  "customerPhone": "+91 98795 23411",
  "customerArea": "Satellite",
  "serviceRequested": "Masala Kadak Cutting Chai",
  "message": "Need 5 corporate hot flasks for office morning standup",
  "preferredDate": "2025-03-05",
  "preferredTime": "09:30 AM"
}
```

---

## 8. Role-Based Access Control (RBAC) Permissions Matrix

| Capability / Action | Customer (Anon/Auth) | Registered Vendor | Platform Admin |
| :--- | :---: | :---: | :---: |
| Search Directory by City/Area/Category | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| Direct Phone Call / WhatsApp Launch | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| Scan QR Token / Access `/v/:token` | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| Submit Service Enquiry / Lead | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| Post Customer Review & Rating | ✅ Auth Only | ❌ Forbidden | ✅ Full Moderate |
| Register Business Profile | ❌ Forbidden | ✅ Self-Registration | ✅ Direct Create |
| Edit Business Profile & Price Menu | ❌ Forbidden | ✅ Own Business Only | ✅ Any Vendor |
| View Received Customer Leads | ❌ Forbidden | ✅ Own Leads Only | ✅ Global Leads |
| Download & Print Business QR Standee | ❌ Forbidden | ✅ Own QR Only | ✅ Any QR |
| Approve / Reject / Suspend Merchant | ❌ Forbidden | ❌ Forbidden | ✅ Admin Only |
| Add / Delete Cities, Areas & Pincodes | ❌ Forbidden | ❌ Forbidden | ✅ Admin Only |
| Modify Category Taxonomy & Services | ❌ Forbidden | ❌ Forbidden | ✅ Admin Only |

---

## 9. Phased Acceptance Criteria & Test Scenarios

### Phase 1: Core MVP Acceptance Criteria
1. **Geo Hierarchy Integrity:** System rejects any vendor submission where `area` does not belong to the selected `city`.
2. **Permanent QR Resolution:** Scanning `businessvault.in/v/VBV-GUJ-TEA-025` opens *Shambhu's Coffee Bar* public modal with 100% fidelity on first turn.
3. **Zero Brokerage Direct Connect:** Tapping "Call Direct" launches `tel:` with sanitized phone number; tapping "WhatsApp" opens deep link with pre-filled enquiry.
4. **Admin Approval Gate:** Newly submitted vendors default to `status = 'pending'` and are completely invisible on public customer search until an Admin sets `status = 'verified'`.
5. **RLS Authorization:** Direct API calls from non-admin JWTs attempting to update `verification_status` fail with `403 Forbidden` / 0 rows updated.

### Phase 2: Hyperlocal Discovery Acceptance Criteria
1. **City Ticker & Switcher:** Changing city from Ahmedabad to Surat refreshes vendors, areas, and popular hotspots without full reload.
2. **Review Integrity:** Users can only rate a vendor between 1 and 5 stars with non-empty review text.
3. **Dynamic Filtering:** Combining "Verified Only" + "Tea Stall" + "Bodakdev" accurately isolates matching merchants.

### Phase 3: Leads Marketplace Acceptance Criteria
1. **Enquiry Ingestion:** Customer lead submission instantly increments merchant's `new` leads counter in Vendor Dashboard.
2. **Status Transition:** Vendor can advance lead from `new` to `contacted` and `completed` with audit timestamps.

### Phase 4: Platform Scale Acceptance Criteria
1. **Multi-State Ready:** Adding `maharashtra` to `states` table enables Mumbai / Pune discovery without modifying frontend rendering components.
