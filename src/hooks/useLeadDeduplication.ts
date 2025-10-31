import { supabase } from "@/integrations/supabase/client";

export const useLeadDeduplication = () => {
  const findDuplicateLead = async (email: string, phone?: string) => {
    try {
      // Check in lead_statuses first
      const { data: existingStatus } = await supabase
        .from("lead_statuses")
        .select("*")
        .eq("lead_email", email)
        .maybeSingle();

      if (existingStatus) {
        return { exists: true, leadId: existingStatus.id, source: "lead_statuses" };
      }

      // Check in open_house_leads
      const { data: openHouseLead } = await supabase
        .from("open_house_leads")
        .select("id, email")
        .eq("email", email)
        .maybeSingle();

      if (openHouseLead) {
        return { exists: true, leadId: openHouseLead.id, source: "open_house_leads" };
      }

      // Check in tour_requests
      const { data: tourRequest } = await supabase
        .from("tour_requests")
        .select("id, visitor_email")
        .eq("visitor_email", email)
        .maybeSingle();

      if (tourRequest) {
        return { exists: true, leadId: tourRequest.id, source: "tour_requests" };
      }

      // If phone is provided, check by phone too
      if (phone) {
        const { data: phoneMatch } = await supabase
          .from("open_house_leads")
          .select("id, email, phone")
          .eq("phone", phone)
          .maybeSingle();

        if (phoneMatch) {
          return { exists: true, leadId: phoneMatch.id, source: "open_house_leads", matchedBy: "phone" };
        }
      }

      return { exists: false };
    } catch (error) {
      console.error("Error checking for duplicate lead:", error);
      return { exists: false };
    }
  };

  const createOrUpdateLeadStatus = async (
    email: string,
    name: string,
    phone?: string,
    source?: string,
    propertyMls?: string
  ) => {
    try {
      const duplicate = await findDuplicateLead(email, phone);

      if (duplicate.exists) {
        // Update existing lead status
        const { error: updateError } = await supabase
          .from("lead_statuses")
          .upsert({
            lead_email: email,
            lead_name: name,
            lead_phone: phone || null,
            source: source || null,
            source_property_mls: propertyMls || null,
            last_contact_date: new Date().toISOString(),
          }, {
            onConflict: "lead_email"
          });

        if (updateError) throw updateError;

        // Add activity for returning lead
        await supabase.from("lead_activities").insert({
          lead_email: email,
          lead_name: name,
          activity_type: "returning_lead",
          activity_content: `Returning lead from ${source || "unknown source"}. Property: ${propertyMls || "N/A"}`,
        });

        return { isNew: false, leadId: duplicate.leadId };
      } else {
        // Create new lead status
        const { error: insertError } = await supabase
          .from("lead_statuses")
          .insert({
            lead_email: email,
            lead_name: name,
            lead_phone: phone || null,
            source: source || null,
            source_property_mls: propertyMls || null,
            first_contact_date: new Date().toISOString(),
            status: "new",
          });

        if (insertError) throw insertError;

        // Add activity for new lead
        await supabase.from("lead_activities").insert({
          lead_email: email,
          lead_name: name,
          activity_type: "new_lead",
          activity_content: `New lead from ${source || "unknown source"}. Property: ${propertyMls || "N/A"}`,
        });

        return { isNew: true };
      }
    } catch (error) {
      console.error("Error creating/updating lead status:", error);
      throw error;
    }
  };

  return {
    findDuplicateLead,
    createOrUpdateLeadStatus,
  };
};
