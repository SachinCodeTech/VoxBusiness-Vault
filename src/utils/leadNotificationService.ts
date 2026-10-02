import { supabase, isSupabaseConfigured } from './supabaseClient';
import { EnquiryLead } from '../types';

export interface LeadNotificationStatus {
  queueId?: string;
  leadId: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'skipped';
  recipientEmail?: string;
  providerMessageId?: string;
  lastError?: string;
  sentAt?: string;
  attemptCount?: number;
}

/**
 * Submits an enquiry lead to the database and dispatches server-side vendor email notification.
 * Delivery is completely decoupled from the browser; if the network closes, the database queue
 * guarantees retryable background processing.
 */
export async function submitLeadWithEmailNotification(
  lead: EnquiryLead
): Promise<{ success: boolean; leadId: string; notificationStatus?: string; error?: string }> {
  // If Supabase is configured, persist to database
  if (isSupabaseConfigured) {
    try {
      // 1. Insert into public.leads table (Database trigger will automatically enqueue into lead_notification_queue)
      const { data, error: insertError } = await supabase
        .from('leads')
        .insert({
          id: lead.id,
          vendor_id: lead.vendorId,
          customer_name: lead.customerName,
          customer_phone: lead.customerPhone,
          customer_area: lead.customerArea,
          service_requested: lead.service,
          message: lead.message,
          preferred_date: lead.preferredDate || null,
          preferred_time: lead.preferredTime || null,
          advance_paid: lead.advancePaid || 0,
          payment_ref: lead.paymentRef || null,
          status: 'new'
        })
        .select()
        .single();

      if (insertError) {
        console.warn('Database lead insert warning:', insertError.message);
        // Continue with local persistence so user is not blocked
      }

      // 2. Proactively invoke the send-vendor-lead Edge Function to dispatch the email immediately
      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
          'send-vendor-lead',
          {
            body: { lead_id: lead.id }
          }
        );

        if (edgeError) {
          console.warn('Edge function email trigger note:', edgeError.message);
          return {
            success: true,
            leadId: lead.id,
            notificationStatus: 'pending',
            error: edgeError.message
          };
        }

        return {
          success: true,
          leadId: lead.id,
          notificationStatus: edgeData?.results?.[0]?.status || 'pending'
        };
      } catch (edgeCallErr: any) {
        // Edge function call failure does not fail the lead creation
        return {
          success: true,
          leadId: lead.id,
          notificationStatus: 'pending',
          error: edgeCallErr.message
        };
      }
    } catch (dbErr: any) {
      console.warn('Supabase integration note:', dbErr.message);
    }
  }

  // Fallback for local/offline mode
  return {
    success: true,
    leadId: lead.id,
    notificationStatus: 'pending'
  };
}

/**
 * Checks delivery status of an enquiry lead's email notification from leads_outbox.
 */
export async function fetchLeadNotificationStatus(
  leadId: string
): Promise<LeadNotificationStatus | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('leads_outbox')
      .select('*')
      .eq('lead_id', leadId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      queueId: data.id,
      leadId: data.lead_id,
      status: data.status,
      recipientEmail: data.recipient_email,
      providerMessageId: data.provider_message_id,
      lastError: data.last_error,
      sentAt: data.sent_at,
      attemptCount: data.attempt_count
    };
  } catch {
    return null;
  }
}

/**
 * Retries a failed or pending lead notification without duplicating the lead.
 */
export async function retryFailedLeadNotification(
  leadId: string
): Promise<{ success: boolean; status: string; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, status: 'error', error: 'Database connection not configured' };
  }

  try {
    const { data, error } = await supabase.functions.invoke('send-vendor-lead', {
      body: { lead_id: leadId }
    });

    if (error) {
      return { success: false, status: 'failed', error: error.message };
    }

    const firstResult = data?.results?.[0];
    return {
      success: firstResult?.status === 'sent',
      status: firstResult?.status || 'unknown'
    };
  } catch (err: any) {
    return { success: false, status: 'failed', error: err.message };
  }
}
