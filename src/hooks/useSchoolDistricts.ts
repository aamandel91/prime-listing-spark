import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SchoolDistrict {
  id: string;
  name: string;
  slug: string;
  county: string | null;
  city: string | null;
  state: string;
  description: string | null;
  rating: number | null;
  total_schools: number;
  boundaries: any;
  meta_title: string | null;
  meta_description: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useSchoolDistricts = () => {
  return useQuery({
    queryKey: ["school-districts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_districts" as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as unknown as SchoolDistrict[];
    },
  });
};

export const useCreateSchoolDistrict = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (district: any) => {
      const { data, error } = await supabase
        .from("school_districts" as any)
        .insert([district])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-districts"] });
      toast({
        title: "Success",
        description: "School district created successfully",
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

export const useUpdateSchoolDistrict = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SchoolDistrict> & { id: string }) => {
      const { data, error } = await supabase
        .from("school_districts" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-districts"] });
      toast({
        title: "Success",
        description: "School district updated successfully",
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

export const useDeleteSchoolDistrict = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("school_districts" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-districts"] });
      toast({
        title: "Success",
        description: "School district deleted successfully",
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
