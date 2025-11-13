import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PropertySubtype {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  api_filters: any;
  meta_title: string | null;
  meta_description: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePropertySubtypes = () => {
  return useQuery({
    queryKey: ["property-subtypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_subtypes" as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as unknown as PropertySubtype[];
    },
  });
};

export const useCreatePropertySubtype = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subtype: any) => {
      const { data, error } = await supabase
        .from("property_subtypes" as any)
        .insert([subtype])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-subtypes"] });
      toast({
        title: "Success",
        description: "Property subtype created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePropertySubtype = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PropertySubtype> & { id: string }) => {
      const { data, error } = await supabase
        .from("property_subtypes" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-subtypes"] });
      toast({
        title: "Success",
        description: "Property subtype updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeletePropertySubtype = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("property_subtypes" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["property-subtypes"] });
      toast({
        title: "Success",
        description: "Property subtype deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
