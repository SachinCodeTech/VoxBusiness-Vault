// ============================================================================
// Supabase Edge Function: send-vendor-lead-email
// Stack: Deno, TypeScript, Supabase JS, Resend API
// ============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

interface QueueItem {
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

function escapeHtml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatISTDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' IST';
  } catch {
    return isoString;
  }
}

function buildEmailHtml(item: QueueItem, dashboardUrl: string): string {
  const safeBusinessName = escapeHtml(item.business_name);
  const safeRecipientName = escapeHtml(item.recipient_name);
  const safeService = escapeHtml(item.service_requested);
  const safeCustomerName = escapeHtml(item.customer_name);
  const safePhone = escapeHtml(item.customer_phone || 'Not provided');
  const safeArea = escapeHtml(item.customer_area || 'Gujarat');
  const safeMessage = escapeHtml(item.message || 'No additional notes provided.');
  const safeDate = item.preferred_date ? escapeHtml(item.preferred_date) : 'Flexible';
  const safeTime = item.preferred_time ? escapeHtml(item.preferred_time) : 'Standard Hours';
  const submissionTime = formatISTDate(item.created_at);
  const leadRef = escapeHtml(item.lead_id);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Service Enquiry - Vox Business Vault</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9; color: #0f172a; line-height: 1.5; }
    .wrapper { max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%); padding: 32px 24px; text-align: left; }
    .logo-badge { display: inline-block; background-color: rgba(255, 255, 255, 0.2); padding: 4px 12px; border-radius: 9999px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; }
    .title { color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 6px 0; }
    .subtitle { color: #e0f2fe; font-size: 13px; margin: 0; }
    .content { padding: 28px 24px; }
    .alert-banner { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; }
    .alert-title { color: #15803d; font-weight: 700; font-size: 13px; margin: 0 0 2px 0; }
    .alert-sub { color: #166534; font-size: 12px; margin: 0; }
    .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px; }
    .card-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .grid { width: 100%; border-collapse: collapse; }
    .grid td { padding: 6px 0; font-size: 13px; vertical-align: top; }
    .grid td.label { color: #64748b; width: 38%; font-weight: 500; }
    .grid td.value { color: #0f172a; font-weight: 600; }
    .message-box { background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-top: 8px; font-size: 13px; color: #334155; font-style: italic; }
    .cta-container { text-align: center; margin: 32px 0 16px 0; }
    .cta-btn { display: inline-block; background-color: #0284c7; color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 14px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25); }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 24px; text-align: center; font-size: 11px; color: #94a3b8; }
    .footer a { color: #0284c7; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">Vox Business Vault · Verified Enquiry</div>
      <h1 class="title">New Customer Lead Received</h1>
      <p class="subtitle">Hello ${safeRecipientName}, a customer has requested your services on Vox Business Vault.</p>
    </div>

    <div class="content">
      <div class="alert-banner">
        <p class="alert-title">⚡ Immediate Action Recommended</p>
        <p class="alert-sub">Customers in Gujarat typically expect a call back within 15–30 minutes for emergency & repair bookings.</p>
      </div>

      <div class="card">
        <div class="card-title">Enquiry Summary</div>
        <table class="grid">
          <tr>
            <td class="label">Reference ID:</td>
            <td class="value"><code>${leadRef}</code></td>
          </tr>
          <tr>
            <td class="label">Business Name:</td>
            <td class="value">${safeBusinessName}</td>
          </tr>
          <tr>
            <td class="label">Requested Service:</td>
            <td class="value"><strong style="color: #0284c7;">${safeService}</strong></td>
          </tr>
          <tr>
            <td class="label">Preferred Date:</td>
            <td class="value">${safeDate}</td>
          </tr>
          <tr>
            <td class="label">Preferred Time:</td>
            <td class="value">${safeTime}</td>
          </tr>
          <tr>
            <td class="label">Submitted At:</td>
            <td class="value">${submissionTime}</td>
          </tr>
        </table>
      </div>

      <div class="card">
        <div class="card-title">Customer Information</div>
        <table class="grid">
          <tr>
            <td class="label">Customer Name:</td>
            <td class="value">${safeCustomerName}</td>
          </tr>
          <tr>
            <td class="label">Contact Phone:</td>
            <td class="value"><a href="tel:${safePhone}" style="color: #0284c7; text-decoration: none;">${safePhone}</a></td>
          </tr>
          <tr>
            <td class="label">Service Location:</td>
            <td class="value">${safeArea}</td>
          </tr>
        </table>

        <div style="margin-top: 12px;">
          <span style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Customer Notes:</span>
          <div class="message-box">"${safeMessage}"</div>
        </div>
      </div>

      <div class="cta-container">
        <a href="${dashboardUrl}" target="_blank" class="cta-btn">View Lead in Vendor Dashboard →</a>
      </div>
      <p style="text-align: center; font-size: 11.5px; color: #64748b; margin: 0;">
        Direct access · Zero commission · Gujarat Local Commerce Registry
      </p>
    </div>

    <div class="footer">
      <p style="margin: 0 0 6px 0;">This notification was automatically sent to the verified business address for <strong>${safeBusinessName}</strong>.</p>
      <p style="margin: 0;">Vox Business Vault · Hyperlocal Commerce & Directory Platform · Gujarat, India<br>
      Need assistance? Contact our local merchant support via your dashboard.</p>
    </div>
  </div>
</body>
</html>
  `;
}

function buildEmailText(item: QueueItem, dashboardUrl: string): string {
  return `
[VOX BUSINESS VAULT] NEW SERVICE ENQUIRY

Hello ${item.recipient_name},

You have received a new service enquiry for ${item.business_name} on Vox Business Vault.

ENQUIRY DETAILS:
---------------------------------------------
- Reference ID: ${item.lead_id}
- Requested Service: ${item.service_requested}
- Preferred Date: ${item.preferred_date || 'Flexible'}
- Preferred Time: ${item.preferred_time || 'Standard Hours'}
- Submitted: ${formatISTDate(item.created_at)}

CUSTOMER INFORMATION:
---------------------------------------------
- Customer Name: ${item.customer_name}
- Contact Phone: ${item.customer_phone || 'Not provided'}
- Service Location: ${item.customer_area || 'Gujarat'}
- Customer Message: "${item.message || 'No additional notes provided.'}"

SECURE VENDOR DASHBOARD:
Open lead: ${dashboardUrl}

Zero brokerage direct connect. Please contact the customer promptly.
--
Vox Business Vault - Gujarat Local Business & Services Directory
  `.trim();
}

serve(async (req: Request) => {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
    const senderEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Vox Business Vault <notifications@voxbusinessvault.com>';
    const appUrl = Deno.env.get('APP_URL') || 'https://voxbusinessvault.com';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase service configuration missing in Edge Function secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Parse Request Payload
    let payload: {
      queue_id?: string;
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

    // Check if called directly from a database webhook: payload might have { record: { id: ... } }
    const rawRecord = (payload as any).record;
    const targetQueueId = payload.queue_id || (rawRecord && rawRecord.id);
    const targetLeadId = payload.lead_id;

    // 3. Fetch Items to Dispatch
    let itemsToProcess: QueueItem[] = [];

    if (targetQueueId) {
      const { data, error } = await supabase
        .from('lead_notification_queue')
        .select('*')
        .eq('id', targetQueueId)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: `Queue item not found for id: ${targetQueueId}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      itemsToProcess = [data as QueueItem];
    } else if (targetLeadId) {
      const { data, error } = await supabase
        .from('lead_notification_queue')
        .select('*')
        .eq('lead_id', targetLeadId)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: `Queue item not found for lead_id: ${targetLeadId}` }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      itemsToProcess = [data as QueueItem];
    } else {
      // Process pending queue items in batch mode (up to 10)
      const { data, error } = await supabase
        .from('lead_notification_queue')
        .select('*')
        .in('status', ['pending', 'failed'])
        .lt('attempt_count', 3)
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        return new Response(
          JSON.stringify({ error: `Failed to query queue: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      itemsToProcess = (data || []) as QueueItem[];
    }

    if (itemsToProcess.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending lead notifications to process.', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // 4. Process each item reliably
    for (const item of itemsToProcess) {
      // Prevent duplicate notification if already sent
      if (item.status === 'sent') {
        results.push({
          queue_id: item.id,
          lead_id: item.lead_id,
          status: 'already_sent',
          provider_message_id: (item as any).provider_message_id
        });
        continue;
      }

      // Mark status as 'processing'
      await supabase
        .from('lead_notification_queue')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id);

      // Verify recipient email
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!item.recipient_email || !emailRegex.test(item.recipient_email) || item.recipient_email.endsWith('@voxbusinessvault.internal')) {
        await supabase
          .from('lead_notification_queue')
          .update({
            status: 'skipped',
            last_error: 'Vendor does not have a verified email address configured on profile.',
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        results.push({
          queue_id: item.id,
          lead_id: item.lead_id,
          status: 'skipped',
          reason: 'invalid_or_missing_email'
        });
        continue;
      }

      // Check if Resend API Key is configured
      if (!resendApiKey) {
        await supabase
          .from('lead_notification_queue')
          .update({
            status: 'failed',
            attempt_count: item.attempt_count + 1,
            last_error: 'RESEND_API_KEY secret is not configured in Supabase Edge Function secrets.',
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        results.push({
          queue_id: item.id,
          lead_id: item.lead_id,
          status: 'failed',
          error: 'RESEND_API_KEY secret missing.'
        });
        continue;
      }

      // Build safe email content and secure dashboard link
      const dashboardUrl = `${appUrl}/?tab=portal&vendor=${encodeURIComponent(item.vendor_id)}&lead=${encodeURIComponent(item.lead_id)}`;
      const htmlBody = buildEmailHtml(item, dashboardUrl);
      const textBody = buildEmailText(item, dashboardUrl);
      const subject = `New Lead: ${item.service_requested} – ${item.business_name} [${item.lead_id}]`;

      try {
        // Dispatch to Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: senderEmail,
            to: [item.recipient_email],
            subject: subject,
            html: htmlBody,
            text: textBody,
            headers: {
              'X-Entity-Ref-ID': item.lead_id,
              'X-Idempotency-Key': item.idempotency_key
            }
          })
        });

        const resData = await resendResponse.json();

        if (resendResponse.ok && resData.id) {
          // Success: update status to 'sent'
          await supabase
            .from('lead_notification_queue')
            .update({
              status: 'sent',
              provider_message_id: resData.id,
              sent_at: new Date().toISOString(),
              attempt_count: item.attempt_count + 1,
              last_error: null,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id);

          results.push({
            queue_id: item.id,
            lead_id: item.lead_id,
            status: 'sent',
            provider_message_id: resData.id
          });
        } else {
          // Provider rejected: update status to 'failed'
          const errDetail = resData.message || resData.error || `HTTP ${resendResponse.status}`;
          await supabase
            .from('lead_notification_queue')
            .update({
              status: 'failed',
              attempt_count: item.attempt_count + 1,
              last_error: `Resend API Error: ${errDetail}`,
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id);

          results.push({
            queue_id: item.id,
            lead_id: item.lead_id,
            status: 'failed',
            error: errDetail
          });
        }
      } catch (networkErr: any) {
        // Network or fetch failure: record retry attempt
        await supabase
          .from('lead_notification_queue')
          .update({
            status: 'failed',
            attempt_count: item.attempt_count + 1,
            last_error: `Network Exception: ${networkErr.message}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        results.push({
          queue_id: item.id,
          lead_id: item.lead_id,
          status: 'failed',
          error: networkErr.message
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (globalErr: any) {
    return new Response(
      JSON.stringify({ error: globalErr.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
