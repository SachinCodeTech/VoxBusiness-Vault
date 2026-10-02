// ============================================================================
// Supabase Edge Function: send-vendor-lead
// Product: Vox Business Vault (VBV) - Gujarat's Local Services Directory
// Stack: Deno, TypeScript, Supabase JS (Service Role), Resend API
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface OutboxRecord {
  id: string;
  lead_id: string;
  vendor_id: string;
  recipient_email: string;
  recipient_name: string;
  business_name: string;
  service_requested: string;
  customer_name: string;
  customer_phone?: string;
  customer_area?: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  advance_paid?: number;
  payment_ref?: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'skipped';
  attempt_count: number;
  max_attempts: number;
  idempotency_key: string;
  created_at: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

/**
 * Escapes unsafe characters for clean HTML injection prevention.
 */
function escapeHtml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formats timestamps in Indian Standard Time (IST).
 */
function formatIST(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return (
      d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST'
    );
  } catch {
    return isoDate;
  }
}

/**
 * Mobile-responsive, production-grade HTML email template for vendor notifications.
 */
function renderVendorLeadEmailHtml(outbox: OutboxRecord, dashboardDeepLink: string): string {
  const businessName = escapeHtml(outbox.business_name);
  const recipientName = escapeHtml(outbox.recipient_name);
  const service = escapeHtml(outbox.service_requested);
  const customerName = escapeHtml(outbox.customer_name);
  const customerPhone = escapeHtml(outbox.customer_phone || 'Not provided');
  const cleanPhone = (outbox.customer_phone || '').replace(/[^0-9+]/g, '');
  const area = escapeHtml(outbox.customer_area || 'Gujarat');
  const notes = escapeHtml(outbox.message || 'No additional notes provided by customer.');
  const preferredDate = outbox.preferred_date ? escapeHtml(outbox.preferred_date) : 'Flexible';
  const preferredTime = outbox.preferred_time ? escapeHtml(outbox.preferred_time) : 'Standard Hours';
  const timestamp = formatIST(outbox.created_at);
  const leadId = escapeHtml(outbox.lead_id);
  const advancePaid = outbox.advance_paid ? Number(outbox.advance_paid) : 0;
  const paymentRef = outbox.payment_ref ? escapeHtml(outbox.payment_ref) : null;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>New Customer Lead - ${businessName}</title>
  <style type="text/css">
    /* Base resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
      .header-pad { padding: 24px 20px !important; }
      .content-pad { padding: 20px 16px !important; }
      .card-pad { padding: 16px 14px !important; }
      .btn-full { display: block !important; width: 100% !important; text-align: center !important; }
      .grid-stack { display: block !important; width: 100% !important; }
      .grid-label { width: 100% !important; display: block !important; padding-bottom: 2px !important; }
      .grid-value { width: 100% !important; display: block !important; padding-bottom: 10px !important; }
    }
  </style>
</head>
<body style="background-color: #f1f5f9; margin: 0; padding: 16px 0;">

  <!-- Main Container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td class="header-pad" style="background: linear-gradient(135deg, #0f172a 0%, #0369a1 100%); padding: 32px 28px; text-align: left;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <!-- Monogram Badge -->
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); border: 1px solid rgba(255, 255, 255, 0.25); padding: 5px 14px; border-radius: 9999px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase;">
                      ⚡ VOX BUSINESS VAULT · GUJARAT DIRECTORY
                    </span>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 14px 0 6px 0; line-height: 1.25;">
                      New Customer Service Enquiry
                    </h1>
                    <p style="color: #e0f2fe; font-size: 13.5px; margin: 0; line-height: 1.4;">
                      Lead received for <strong>${businessName}</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="content-pad" style="padding: 28px;">

              <!-- Urgent Action Callout -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="28" valign="top" style="font-size: 18px; line-height: 1;">⚡</td>
                        <td>
                          <div style="font-size: 13px; font-weight: 700; color: #166534; margin-bottom: 2px;">
                            Quick Response Recommended
                          </div>
                          <div style="font-size: 12px; color: #15803d; line-height: 1.4;">
                            Local customers in Gujarat convert 4x faster when contacted via phone or WhatsApp within 15–30 minutes.
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Customer Enquiry Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="card-pad" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                      📋 ENQUIRY & SERVICE DETAILS
                    </div>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Reference ID:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 700;">
                          <span style="background-color: #e2e8f0; padding: 2px 8px; border-radius: 6px; font-family: monospace; font-size: 12px;">${leadId}</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Service Requested:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 14px; color: #0284c7; font-weight: 800;">
                          ${service}
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Preferred Date:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">
                          ${preferredDate}
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Preferred Time:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">
                          ${preferredTime}
                        </td>
                      </tr>
                      ${
                        advancePaid > 0
                          ? `
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Advance Token Paid:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 13px; color: #16a34a; font-weight: 800;">
                          ₹${advancePaid} · Verified ${paymentRef ? `(Ref: ${paymentRef})` : ''}
                        </td>
                      </tr>`
                          : ''
                      }
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Submitted At:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 12px; color: #64748b;">
                          ${timestamp}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Customer Contact Details Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="card-pad" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
                      👤 CUSTOMER INFORMATION
                    </div>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Customer Name:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 700;">
                          ${customerName}
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Phone Number:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 14px; color: #0284c7; font-weight: 800;">
                          <a href="tel:${cleanPhone}" style="color: #0284c7; text-decoration: none;">📞 ${customerPhone}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="grid-stack grid-label" width="38%" style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">
                          Locality / City:
                        </td>
                        <td class="grid-stack grid-value" style="padding: 6px 0; font-size: 13px; color: #0f172a; font-weight: 600;">
                          📍 ${area}
                        </td>
                      </tr>
                    </table>

                    <!-- Customer Notes Box -->
                    <div style="margin-top: 14px;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">
                        Customer Message / Job Requirement:
                      </div>
                      <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #1e293b; font-style: italic; line-height: 1.45;">
                        "${notes}"
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Secure Deep Link CTA Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 28px; margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${dashboardDeepLink}" style="height:50px;v-text-anchor:middle;width:280px;" arcsize="20%" stroke="f" fillcolor="#0284c7">
                    <w:anchorlock/>
                    <center style="color:#ffffff;font-family:sans-serif;font-size:15px;font-weight:bold;">Open Vendor Dashboard →</center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a href="${dashboardDeepLink}" target="_blank" class="btn-full" style="display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; padding: 16px 36px; border-radius: 12px; font-weight: 800; font-size: 15px; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35); letter-spacing: 0.3px;">
                      Open Vendor Dashboard →
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <p style="text-align: center; font-size: 12px; color: #64748b; margin: 10px 0 0 0;">
                Zero Brokerage Direct Connect · Instant Status Updates
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 28px; text-align: center;">
              <p style="font-size: 12px; color: #64748b; margin: 0 0 6px 0; line-height: 1.5;">
                This notification was sent to <strong>${recipientName}</strong>, registered owner of <strong>${businessName}</strong> on Vox Business Vault.
              </p>
              <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.5;">
                Vox Business Vault · Hyperlocal Commerce & Directory Platform · Gujarat, India<br />
                Do not reply directly to this automated email. Manage all customer leads through your secure portal.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Plain text fallback email version.
 */
function renderVendorLeadEmailText(outbox: OutboxRecord, dashboardDeepLink: string): string {
  return `
[VOX BUSINESS VAULT] NEW SERVICE ENQUIRY

Hello ${outbox.recipient_name},

You have received a new service enquiry for ${outbox.business_name} on Vox Business Vault.

ENQUIRY DETAILS:
---------------------------------------------
- Reference ID: ${outbox.lead_id}
- Service Requested: ${outbox.service_requested}
- Preferred Date: ${outbox.preferred_date || 'Flexible'}
- Preferred Time: ${outbox.preferred_time || 'Standard Hours'}
${outbox.advance_paid ? `- Advance Paid: ₹${outbox.advance_paid} (Ref: ${outbox.payment_ref || 'N/A'})\n` : ''}- Submitted At: ${formatIST(outbox.created_at)}

CUSTOMER INFORMATION:
---------------------------------------------
- Customer Name: ${outbox.customer_name}
- Contact Phone: ${outbox.customer_phone || 'Not provided'}
- Locality / City: ${outbox.customer_area || 'Gujarat'}
- Customer Message: "${outbox.message || 'No additional notes provided.'}"

SECURE VENDOR DASHBOARD DEEP LINK:
Open lead directly: ${dashboardDeepLink}

Direct connect with zero brokerage. Please contact the customer promptly.
--
Vox Business Vault - Gujarat Local Services Directory
  `.trim();
}

serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Environment Variable Management
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
    const senderEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Vox Business Vault <notifications@voxbusinessvault.com>';
    const appUrl = Deno.env.get('APP_URL') || 'https://voxbusinessvault.com';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Initialize Supabase Client with Service Role (Bypassing RLS for secure outbox & recipient lookups)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 3. Parse Request Payload
    let payload: {
      outbox_id?: string;
      lead_id?: string;
      mode?: 'single' | 'process_pending';
    } = {};

    if (req.headers.get('content-type')?.includes('application/json')) {
      try {
        payload = await req.json();
      } catch {
        payload = {};
      }
    }

    const rawRecord = (payload as any).record;
    const targetOutboxId = payload.outbox_id || (rawRecord && rawRecord.id);
    const targetLeadId = payload.lead_id;

    // 4. Retrieve Record(s) from leads_outbox (and fallback to lead_notification_queue if needed)
    let recordsToProcess: OutboxRecord[] = [];

    if (targetOutboxId) {
      // Direct outbox record lookup
      const { data, error } = await supabaseAdmin
        .from('leads_outbox')
        .select('*')
        .eq('id', targetOutboxId)
        .maybeSingle();

      if (data) {
        recordsToProcess = [data as OutboxRecord];
      }
    } else if (targetLeadId) {
      // Lookup by lead_id
      const { data, error } = await supabaseAdmin
        .from('leads_outbox')
        .select('*')
        .eq('lead_id', targetLeadId)
        .maybeSingle();

      if (data) {
        recordsToProcess = [data as OutboxRecord];
      } else {
        // Fallback: check if row exists in leads table and synthesize/enqueue directly
        const { data: leadData } = await supabaseAdmin
          .from('leads')
          .select('*, vendors(*)')
          .eq('id', targetLeadId)
          .maybeSingle();

        if (leadData && leadData.vendors) {
          const v = leadData.vendors;
          recordsToProcess = [
            {
              id: leadData.id,
              lead_id: leadData.id,
              vendor_id: v.id,
              recipient_email: v.email || 'unconfigured@voxbusinessvault.internal',
              recipient_name: v.owner_name || 'Business Partner',
              business_name: v.business_name || 'Gujarat Local Business',
              service_requested: leadData.service_requested,
              customer_name: leadData.customer_name,
              customer_phone: leadData.customer_phone,
              customer_area: leadData.customer_area,
              message: leadData.message,
              preferred_date: leadData.preferred_date,
              preferred_time: leadData.preferred_time,
              advance_paid: leadData.advance_paid,
              payment_ref: leadData.payment_ref,
              status: 'pending',
              attempt_count: 0,
              max_attempts: 3,
              idempotency_key: `lead_notif_${leadData.id}`,
              created_at: leadData.created_at
            }
          ];
        }
      }
    } else {
      // Batch mode: fetch up to 10 pending or failed (with attempts < max_attempts)
      const { data, error } = await supabaseAdmin
        .from('leads_outbox')
        .select('*')
        .in('status', ['pending', 'failed'])
        .lt('attempt_count', 3)
        .order('created_at', { ascending: true })
        .limit(10);

      if (!error && data) {
        recordsToProcess = data as OutboxRecord[];
      }
    }

    if (recordsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending lead notifications found to process.', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // 5. Process each record
    for (const record of recordsToProcess) {
      // Prevent duplicate notification
      if (record.status === 'sent') {
        results.push({
          outbox_id: record.id,
          lead_id: record.lead_id,
          status: 'already_sent'
        });
        continue;
      }

      // Mark outbox status as 'processing'
      await supabaseAdmin
        .from('leads_outbox')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', record.id);

      // Perform secure recipient email lookup / verification using Service Role
      let resolvedEmail = record.recipient_email;
      let resolvedOwnerName = record.recipient_name;
      let resolvedBusinessName = record.business_name;

      if (!resolvedEmail || resolvedEmail.endsWith('@voxbusinessvault.internal')) {
        const { data: vendorProfile } = await supabaseAdmin
          .from('vendors')
          .select('email, owner_name, business_name, owner_profile_id')
          .eq('id', record.vendor_id)
          .maybeSingle();

        if (vendorProfile?.email) {
          resolvedEmail = vendorProfile.email;
        } else if (vendorProfile?.owner_profile_id) {
          const { data: userProfile } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name')
            .eq('id', vendorProfile.owner_profile_id)
            .maybeSingle();

          if (userProfile?.email) {
            resolvedEmail = userProfile.email;
          }
        }
      }

      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!resolvedEmail || !emailRegex.test(resolvedEmail) || resolvedEmail.endsWith('@voxbusinessvault.internal')) {
        await supabaseAdmin
          .from('leads_outbox')
          .update({
            status: 'skipped',
            last_error: 'Vendor does not have a verified recipient email configured on profile.',
            updated_at: new Date().toISOString()
          })
          .eq('id', record.id);

        results.push({
          outbox_id: record.id,
          lead_id: record.lead_id,
          status: 'skipped',
          reason: 'unconfigured_vendor_email'
        });
        continue;
      }

      // Check if Resend API Key is available
      if (!resendApiKey) {
        await supabaseAdmin
          .from('leads_outbox')
          .update({
            status: 'failed',
            attempt_count: record.attempt_count + 1,
            last_error: 'RESEND_API_KEY environment variable is not configured in Supabase Edge secrets.',
            updated_at: new Date().toISOString()
          })
          .eq('id', record.id);

        results.push({
          outbox_id: record.id,
          lead_id: record.lead_id,
          status: 'failed',
          error: 'RESEND_API_KEY missing'
        });
        continue;
      }

      // Generate secure deep link to vendor dashboard
      const dashboardDeepLink = `${appUrl}/?tab=portal&vendor=${encodeURIComponent(record.vendor_id)}&lead=${encodeURIComponent(record.lead_id)}`;

      // Render mobile-responsive HTML and text emails
      const htmlBody = renderVendorLeadEmailHtml(
        { ...record, recipient_email: resolvedEmail },
        dashboardDeepLink
      );
      const textBody = renderVendorLeadEmailText(
        { ...record, recipient_email: resolvedEmail },
        dashboardDeepLink
      );

      const emailSubject = `⚡ New Lead: ${record.service_requested} – ${record.business_name} [${record.lead_id}]`;

      try {
        // Send email via Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [resolvedEmail],
            subject: emailSubject,
            html: htmlBody,
            text: textBody,
            headers: {
              'X-Entity-Ref-ID': record.lead_id,
              'X-Idempotency-Key': record.idempotency_key
            }
          })
        });

        const resData = await resendResponse.json();

        if (resendResponse.ok && resData.id) {
          // Success: update leads_outbox with provider confirmation
          await supabaseAdmin
            .from('leads_outbox')
            .update({
              status: 'sent',
              provider_message_id: resData.id,
              sent_at: new Date().toISOString(),
              attempt_count: record.attempt_count + 1,
              last_error: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', record.id);

          // Synchronize mirror table if present
          await supabaseAdmin
            .from('lead_notification_queue')
            .update({
              status: 'sent',
              provider_message_id: resData.id,
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('lead_id', record.lead_id);

          results.push({
            outbox_id: record.id,
            lead_id: record.lead_id,
            status: 'sent',
            provider_message_id: resData.id
          });
        } else {
          // Provider rejected: update status to failed and increment attempt_count
          const errDetail = resData.message || resData.error || `HTTP ${resendResponse.status}`;
          await supabaseAdmin
            .from('leads_outbox')
            .update({
              status: 'failed',
              attempt_count: record.attempt_count + 1,
              last_error: `Resend Error: ${errDetail}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', record.id);

          results.push({
            outbox_id: record.id,
            lead_id: record.lead_id,
            status: 'failed',
            error: errDetail
          });
        }
      } catch (networkErr: any) {
        // Network exception: mark failed for retry
        await supabaseAdmin
          .from('leads_outbox')
          .update({
            status: 'failed',
            attempt_count: record.attempt_count + 1,
            last_error: `Network Exception: ${networkErr.message}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', record.id);

        results.push({
          outbox_id: record.id,
          lead_id: record.lead_id,
          status: 'failed',
          error: networkErr.message
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
