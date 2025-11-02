import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, type, email, sms, data } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user profile for contact info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('email, phone')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
    }

    const notifications: Promise<any>[] = [];

    // Send email notification
    if (email && profile.email) {
      const emailContent = generateEmailContent(type, data);
      notifications.push(sendEmail(supabaseClient, userId, emailContent));
    }

    // Send SMS notification (placeholder for future implementation)
    if (sms && profile.phone) {
      const smsContent = generateSMSContent(type, data);
      notifications.push(logNotification(supabaseClient, userId, 'sms', smsContent));
    }

    await Promise.all(notifications);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Notification error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateEmailContent(type: string, data: any): { subject: string; content: string } {
  if (type === 'saved_search_match') {
    const listing = data.listing;
    return {
      subject: `New Property Match: ${data.searchName}`,
      content: `
        <h2>New Property Matches Your Saved Search!</h2>
        <p>A new property has been listed that matches your saved search "${data.searchName}":</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>${listing.address}</h3>
          <p><strong>Price:</strong> $${listing.listPrice?.toLocaleString()}</p>
          <p><strong>Beds:</strong> ${listing.bedroomsTotal} | <strong>Baths:</strong> ${listing.bathroomsTotal}</p>
          <p><strong>Sqft:</strong> ${listing.livingArea?.toLocaleString()}</p>
        </div>
        
        <p>View this property and more at your dashboard.</p>
      `
    };
  } else if (type === 'price_drop') {
    const { property, oldPrice, newPrice, priceDrop, percentDrop } = data;
    return {
      subject: `Price Drop Alert: $${priceDrop.toLocaleString()} (${percentDrop}%)`,
      content: `
        <h2>Price Drop on Your Favorite Property!</h2>
        <p>Great news! A property you're watching has dropped in price:</p>
        
        <div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>${property.address}</h3>
          <p><strong>Previous Price:</strong> <span style="text-decoration: line-through;">$${oldPrice.toLocaleString()}</span></p>
          <p><strong>New Price:</strong> <span style="color: #22c55e; font-size: 1.2em;">$${newPrice.toLocaleString()}</span></p>
          <p><strong>You Save:</strong> $${priceDrop.toLocaleString()} (${percentDrop}%)</p>
        </div>
        
        <p>This could be a great opportunity! View the property now.</p>
      `
    };
  }
  
  return { subject: 'Notification', content: 'You have a new notification.' };
}

function generateSMSContent(type: string, data: any): string {
  if (type === 'saved_search_match') {
    const listing = data.listing;
    return `New property match: ${listing.address} - $${listing.listPrice?.toLocaleString()} | ${listing.bedroomsTotal}bd ${listing.bathroomsTotal}ba`;
  } else if (type === 'price_drop') {
    const { property, newPrice, percentDrop } = data;
    return `Price drop! ${property.address} now $${newPrice.toLocaleString()} (${percentDrop}% off)`;
  }
  return 'New notification';
}

async function sendEmail(supabaseClient: any, userId: string, { subject, content }: { subject: string; content: string }) {
  // Log the notification
  await logNotification(supabaseClient, userId, 'email', content, subject);
  
  // In production, integrate with email service (Resend, SendGrid, etc.)
  console.log(`Email sent to user ${userId}: ${subject}`);
}

async function logNotification(
  supabaseClient: any,
  userId: string,
  channel: string,
  content: string,
  subject?: string
) {
  await supabaseClient
    .from('notification_log')
    .insert({
      user_id: userId,
      notification_type: 'property_alert',
      channel,
      subject,
      content,
      status: 'sent'
    });
}
