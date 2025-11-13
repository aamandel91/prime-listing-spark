import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  search_criteria: any;
  email_notifications: boolean;
  notification_frequency: string;
  last_notified_at: string | null;
  created_at: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const repliersApiKey = Deno.env.get('REPLIERS_API_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get all active saved searches with email notifications enabled
    const { data: savedSearches, error: searchError } = await supabase
      .from('saved_searches')
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq('is_active', true)
      .eq('email_notifications', true);

    if (searchError) throw searchError;

    console.log(`Processing ${savedSearches?.length || 0} saved searches`);

    for (const search of savedSearches || []) {
      try {
        // Determine if we should send notification based on frequency
        const shouldNotify = checkNotificationFrequency(
          search.last_notified_at,
          search.notification_frequency
        );

        if (!shouldNotify) {
          console.log(`Skipping search ${search.id} - not yet time to notify`);
          continue;
        }

        // Get user email
        const { data: userData } = await supabase.auth.admin.getUserById(search.user_id);
        if (!userData?.user?.email) {
          console.log(`No email found for user ${search.user_id}`);
          continue;
        }

        // Query Repliers API for new listings
        const params = new URLSearchParams({
          ...search.search_criteria,
          status: 'A', // Active listings only
          sortBy: 'date',
          limit: '10',
        });

        // If last notified, only get listings newer than that
        if (search.last_notified_at) {
          const lastNotifiedDate = new Date(search.last_notified_at).toISOString().split('T')[0];
          params.set('listDate', `${lastNotifiedDate}..`);
        }

        const repliersResponse = await fetch(
          `https://api.repliers.io/listings?${params.toString()}`,
          {
            headers: {
              'REPLIERS-API-KEY': repliersApiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        const repliersData = await repliersResponse.json();
        const newListings = repliersData?.listings || repliersData?.data || [];

        if (newListings.length === 0) {
          console.log(`No new listings for search ${search.id}`);
          continue;
        }

        // Format listings for email
        const listingsHtml = newListings.slice(0, 5).map((listing: any) => `
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">
              ${listing.address.streetNumber} ${listing.address.streetName}
            </h3>
            <p style="margin: 0 0 8px 0; color: #059669; font-size: 20px; font-weight: bold;">
              $${listing.listPrice.toLocaleString()}
            </p>
            <p style="margin: 0 0 8px 0; color: #6b7280;">
              ${listing.details.numBedrooms} beds | ${listing.details.numBathrooms} baths | ${listing.details.sqft} sqft
            </p>
            <p style="margin: 0 0 8px 0; color: #6b7280;">
              ${listing.address.city}, ${listing.address.state} ${listing.address.zip}
            </p>
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/property/${listing.mlsNumber}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin-top: 8px;">
              View Details
            </a>
          </div>
        `).join('');

        // Send email
        const emailResult = await resend.emails.send({
          from: 'Property Alerts <alerts@updates.yourdomain.com>',
          to: [userData.user.email],
          subject: `${newListings.length} New ${newListings.length === 1 ? 'Property' : 'Properties'} Matching "${search.name}"`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1f2937; margin-bottom: 16px;">New Properties Available!</h1>
              <p style="color: #6b7280; margin-bottom: 24px;">
                We found ${newListings.length} new ${newListings.length === 1 ? 'property' : 'properties'} matching your saved search "<strong>${search.name}</strong>".
              </p>
              
              ${listingsHtml}
              
              ${newListings.length > 5 ? `
                <p style="text-align: center; margin-top: 24px;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/listings" 
                     style="color: #2563eb; text-decoration: none;">
                    View all ${newListings.length} new listings →
                  </a>
                </p>
              ` : ''}
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              
              <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
                You're receiving this because you saved a search with email notifications enabled.
                <br />
                <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app')}/saved-searches" style="color: #2563eb;">
                  Manage your saved searches
                </a>
              </p>
            </div>
          `,
        });

        console.log(`Sent email for search ${search.id}:`, emailResult);

        // Update last_notified_at
        await supabase
          .from('saved_searches')
          .update({ last_notified_at: new Date().toISOString() })
          .eq('id', search.id);

      } catch (error) {
        console.error(`Error processing search ${search.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: savedSearches?.length || 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function checkNotificationFrequency(
  lastNotifiedAt: string | null,
  frequency: string
): boolean {
  if (!lastNotifiedAt) return true;

  const lastNotified = new Date(lastNotifiedAt);
  const now = new Date();
  const hoursSince = (now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60);

  switch (frequency) {
    case 'instant':
      return hoursSince >= 1; // At least 1 hour between notifications
    case 'daily':
      return hoursSince >= 24;
    case 'weekly':
      return hoursSince >= 168; // 7 days
    default:
      return hoursSince >= 24;
  }
}
