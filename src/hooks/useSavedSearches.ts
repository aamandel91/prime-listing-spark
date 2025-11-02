import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SavedSearch {
  id: string;
  name: string;
  search_criteria: any;
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'instant' | 'daily' | 'weekly';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useSavedSearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSearches((data || []) as SavedSearch[]);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSearch = async (
    name: string,
    criteria: any,
    emailNotifications: boolean = true,
    smsNotifications: boolean = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to save searches',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: user.id,
          name,
          search_criteria: criteria,
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Search saved!',
        description: `You'll be notified when new properties match "${name}"`,
      });

      await fetchSavedSearches();
      return data;
    } catch (error) {
      console.error('Error saving search:', error);
      toast({
        title: 'Error',
        description: 'Failed to save search',
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Search deleted',
        description: 'Your saved search has been removed',
      });

      await fetchSavedSearches();
    } catch (error) {
      console.error('Error deleting search:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        variant: 'destructive',
      });
    }
  };

  const toggleSearch = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_searches')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;

      await fetchSavedSearches();
    } catch (error) {
      console.error('Error toggling search:', error);
    }
  };

  return {
    searches,
    loading,
    saveSearch,
    deleteSearch,
    toggleSearch,
    refreshSearches: fetchSavedSearches,
  };
};
