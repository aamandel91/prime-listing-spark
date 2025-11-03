import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContentPages = (includeInNav = false) => {
  return useQuery({
    queryKey: ["content-pages", includeInNav],
    queryFn: async () => {
      let query = supabase
        .from("content_pages")
        .select("*")
        .eq("published", true);

      if (includeInNav) {
        query = query.eq("include_in_nav", true);
      }

      query = query.order("sort_order");

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
