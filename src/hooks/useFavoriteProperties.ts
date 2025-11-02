import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteProperty {
  id: string;
  property_mls: string;
  property_data: any;
  initial_price: number;
  current_price: number;
  price_drop_alert: boolean;
  created_at: string;
}

export const useFavoriteProperties = () => {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorite_properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (
    propertyMls: string,
    propertyData: any,
    price: number,
    priceDropAlert: boolean = true
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to save favorites',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase
        .from('favorite_properties')
        .insert({
          user_id: user.id,
          property_mls: propertyMls,
          property_data: propertyData,
          initial_price: price,
          current_price: price,
          price_drop_alert: priceDropAlert,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already favorited',
            description: 'This property is already in your favorites',
          });
          return null;
        }
        throw error;
      }

      toast({
        title: 'Property saved!',
        description: 'We\'ll notify you of any price drops',
      });

      await fetchFavorites();
      return data;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to save property',
        variant: 'destructive',
      });
      return null;
    }
  };

  const removeFavorite = async (propertyMls: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('favorite_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_mls', propertyMls);

      if (error) throw error;

      toast({
        title: 'Removed from favorites',
        description: 'Property has been removed from your favorites',
      });

      await fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove property',
        variant: 'destructive',
      });
    }
  };

  const isFavorite = (propertyMls: string): boolean => {
    return favorites.some(fav => fav.property_mls === propertyMls);
  };

  const togglePriceAlert = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('favorite_properties')
        .update({ price_drop_alert: enabled })
        .eq('id', id);

      if (error) throw error;
      await fetchFavorites();
    } catch (error) {
      console.error('Error toggling price alert:', error);
    }
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    togglePriceAlert,
    refreshFavorites: fetchFavorites,
  };
};
