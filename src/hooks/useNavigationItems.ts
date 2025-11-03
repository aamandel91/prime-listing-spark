import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NavigationItem {
  id: string;
  label: string;
  type: 'link' | 'dropdown' | 'button' | 'divider';
  position: 'left' | 'right' | 'mobile';
  url?: string;
  icon?: string;
  target?: '_self' | '_blank';
  parent_id?: string;
  dropdown_items?: any[];
  order_index: number;
  is_visible: boolean;
  css_classes?: string;
}

export const useNavigationItems = () => {
  return useQuery({
    queryKey: ["navigation-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as NavigationItem[];
    },
  });
};

export const useUpdateNavigationItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NavigationItem> }) => {
      const { data, error } = await supabase
        .from("navigation_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Navigation item updated" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error updating navigation item",
        description: error.message,
      });
    },
  });
};

export const useCreateNavigationItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: Omit<NavigationItem, "id">) => {
      const { data, error } = await supabase
        .from("navigation_items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Navigation item created" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating navigation item",
        description: error.message,
      });
    },
  });
};

export const useDeleteNavigationItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("navigation_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
      toast({ title: "Navigation item deleted" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error deleting navigation item",
        description: error.message,
      });
    },
  });
};

export const useReorderNavigationItems = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (items: { id: string; order_index: number }[]) => {
      const updates = items.map(item =>
        supabase
          .from("navigation_items")
          .update({ order_index: item.order_index })
          .eq("id", item.id)
      );

      const results = await Promise.all(updates);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation-items"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error reordering items",
        description: error.message,
      });
    },
  });
};
