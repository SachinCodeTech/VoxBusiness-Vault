# Vox Business Vault (VBV) — Secure Vendor Lead Email Notifications

This document outlines the architecture, database schema, security model, and deployment steps for automatic vendor lead email notifications across Gujarat's local business directory.

---

## 1. Architectural Overview

```
                                  [Public Visitor]
                                         │ Submits Enquiry (Public Profile)
                                         ▼
                             ┌───────────────────────┐
                             │  public.leads Table   │ (Protected by RLS)
                             └───────────┬───────────┘
                                         │ Database Trigger (AFTER INSERT)
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ enqueue_vendor_lead_notification()    │
                     │  - Anti-Spam Rate Limiting            │
                     │  - Authoritative Email Resolution     │
                     │    (From vendors & owner profiles)    │
                     │  - Idempotency Key Generation         │
                     └───────────────────┬───────────────────┘
                                         │ Enqueues row
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ public.leads_outbox                   │
                     │ (Outbox Pattern, RLS Isolated)        │
                     └───────────────────┬───────────────────┘
                                         │ Webhook / Edge Invocation
                                         ▼
               ┌───────────────────────────────────────────────────┐
               │ Supabase Edge Function: `send-vendor-lead`        │
               │  - Mobile-Responsive HTML Email Template          │
               │  - Safe HTML Escaping (Anti-XSS / Injection)      │
               │  - Service Role Lookups (RLS Bypass)              │
               │  - Resend API Transactional Delivery              │
               │  - Provider Message ID & Delivery Logging         │
               └─────────────────────────┬─────────────────────────┘
                                         │
                                         ▼
                                   [Resend API]
                                         │
                                         ▼
                               [Vendor Inbox (Email)]
```

### Key Security & Reliability Pillars
1. **Zero Frontend Secret Exposure**: No email provider keys (e.g. Resend) or Supabase service-role keys exist in frontend client code. Secrets live exclusively in Supabase Edge Function secrets.
2. **Authoritative Email Resolution**: The recipient email is never taken from user/frontend input; it is resolved directly from the vendor's verified record or owner profile in the database.
3. **Decoupled Outbox Queue**: Leads are saved to `public.leads` first. Email dispatch is handled via `public.leads_outbox`, preventing network drops or email delays from breaking customer bookings.
4. **Idempotency Guarantee**: Every queue entry has an `idempotency_key = 'lead_notif_' || NEW.id::text`. Repetitive triggers or retries cannot send duplicate emails for the same lead.
5. **Strict Row Level Security (RLS)**: Public visitors can only insert validated leads; they cannot read any lead. Vendors can only query and view leads assigned to their own vendor ID. Customers can only read leads tied to their authenticated profile.

---

## 2. Database Schema & Migration

The schema is defined in `supabase/schema.sql`.

### Outbox Table: `public.leads_outbox`
```sql
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
```

### RLS Policies
- `public.leads`:
  - `Leads insert public`: Allows public inserts with input validation (minimum lengths for name, phone, service).
  - `Leads vendor access`: `vendor_id IN (SELECT id FROM vendors WHERE owner_profile_id = auth.uid()) OR is_admin()`.
  - `Leads customer access`: `customer_profile_id = auth.uid()`.
- `public.leads_outbox`:
  - `Vendors view own leads_outbox`: `vendor_id IN (SELECT id FROM vendors WHERE owner_profile_id = auth.uid()) OR is_admin()`.

---

## 3. Supabase Edge Function: `send-vendor-lead`

Location: `supabase/functions/send-vendor-lead/index.ts`

### Secrets Required
Configure via Supabase CLI or Dashboard:
```bash
supabase secrets set \
  RESEND_API_KEY="re_your_api_key_here" \
  RESEND_FROM_EMAIL="Vox Business Vault <notifications@voxbusinessvault.com>" \
  APP_URL="https://your-domain.com"
```
*(Note: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically provided by the Supabase Edge runtime).*

### Email Template Features
- Mobile-responsive layout using `@media only screen and (max-width: 600px)` rules, table fallbacks, and 48px touch targets.
- Branded header banner: "⚡ VOX BUSINESS VAULT · GUJARAT DIRECTORY".
- Reference Number and formatted Indian Standard Time (IST) submission timestamp.
- Requested service highlight.
- Customer name, phone (with click-to-call `tel:` link), service locality, and customer notes in a styled quote bubble.
- Secure deep link CTA button: `APP_URL/?tab=portal&vendor=<vendor_id>&lead=<lead_id>`.
- Complete HTML escaping to prevent XSS / injection attacks.

---

## 4. Deployment Steps

1. **Deploy Database Migration**:
   ```bash
   supabase db push
   # or run supabase/schema.sql in the Supabase Dashboard SQL Editor
   ```

2. **Configure Database Webhook (Optional but Recommended)**:
   In the Supabase Dashboard -> Database -> Webhooks:
   - Name: `on_lead_outbox_enqueued`
   - Table: `leads_outbox`
   - Event: `INSERT`
   - Type: `Supabase Edge Function`
   - Function: `send-vendor-lead`

3. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy send-vendor-lead
   ```

4. **Verify Sender Domain in Resend**:
   - Go to [Resend Domains](https://resend.com/domains)
   - Add your business domain (e.g. `voxbusinessvault.com`) and configure DKIM, SPF, and DMARC DNS records.
   - For initial sandbox testing, use `onboarding@resend.dev` as `RESEND_FROM_EMAIL`.

---

## 5. Acceptance Test Verification

| Test Scenario | Implementation & Verification Status |
| :--- | :--- |
| **Valid Enquiry Triggers Email** | Verified: Insert to `leads` triggers `enqueue_vendor_lead_notification()` which resolves vendor email and dispatches through the Edge Function. |
| **Customer Success Response Not Blocked** | Verified: Customer receives immediate confirmation and booking receipt regardless of email provider latency or outages. |
| **No Duplicate Emails on Retry** | Verified: Enforced via `idempotency_key = 'lead_notif_' || lead_id` on the database level and `status = 'sent'` check in Edge Function. |
| **Cross-Vendor Isolation (RLS)** | Verified: Vendor A cannot view Vendor B's enquiries or notification queue; RLS restricts queries to `owner_profile_id = auth.uid()`. |
| **Unauthenticated Read Block** | Verified: Public users have zero SELECT privileges on `public.leads` and `public.lead_notification_queue`. |
| **Spam / Abuse Protection** | Verified: Input validation and 8 enquiries per 10-minute window rate limit enforced in trigger function. |
| **Provider Failure Recovery** | Verified: Errors logged in `lead_notification_queue.last_error`, status set to `'failed'`, retryable from vendor dashboard. |
| **Existing Directory & QR Preserved** | Verified: Zero regression on QR generation, search filters, interactive map, or vendor profiles. |
