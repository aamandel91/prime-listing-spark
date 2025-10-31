import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  siteOwner: string;
  siteName: string;
  agentFirstName: string;
  agentLastName: string;
  officeName: string;
  agentBoardId: string;
  licenseNumber: string;
  officeIds: string[];
  emailGeneral: string;
  emailLegal: string;
  mobileNumber: string;
  localNumber: string;
  tollFree: string;
  faxNumber: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  logoUrl: string;
  faviconUrl: string;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("global_site_settings")
        .select("*");

      if (error) throw error;

      const settings: Partial<SiteSettings> = {};

      data?.forEach((setting) => {
        switch (setting.setting_key) {
          case "site_owner":
            settings.siteOwner = setting.setting_value || "";
            break;
          case "site_name":
            settings.siteName = setting.setting_value || "";
            break;
          case "agent_first_name":
            settings.agentFirstName = setting.setting_value || "";
            break;
          case "agent_last_name":
            settings.agentLastName = setting.setting_value || "";
            break;
          case "office_name":
            settings.officeName = setting.setting_value || "";
            break;
          case "agent_board_id":
            settings.agentBoardId = setting.setting_value || "";
            break;
          case "license_number":
            settings.licenseNumber = setting.setting_value || "";
            break;
          case "office_ids":
            settings.officeIds = setting.setting_value
              ? setting.setting_value.split(",").map((id: string) => id.trim())
              : [];
            break;
          case "email_general":
            settings.emailGeneral = setting.setting_value || "";
            break;
          case "email_legal":
            settings.emailLegal = setting.setting_value || "";
            break;
          case "mobile_number":
            settings.mobileNumber = setting.setting_value || "";
            break;
          case "local_number":
            settings.localNumber = setting.setting_value || "";
            break;
          case "toll_free":
            settings.tollFree = setting.setting_value || "";
            break;
          case "fax_number":
            settings.faxNumber = setting.setting_value || "";
            break;
          case "street_1":
            settings.street1 = setting.setting_value || "";
            break;
          case "street_2":
            settings.street2 = setting.setting_value || "";
            break;
          case "city":
            settings.city = setting.setting_value || "";
            break;
          case "state":
            settings.state = setting.setting_value || "";
            break;
          case "zip_code":
            settings.zipCode = setting.setting_value || "";
            break;
          case "logo_url":
            settings.logoUrl = setting.setting_value || "";
            break;
          case "favicon_url":
            settings.faviconUrl = setting.setting_value || "";
            break;
        }
      });

      return settings as SiteSettings;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
