import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NeighborhoodFollowProps {
  neighborhood: string;
  city: string;
  state: string;
  className?: string;
}

export const NeighborhoodFollow = ({ neighborhood, city, state, className = "" }: NeighborhoodFollowProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserId(null);
        return;
      }
      
      setUserId(user.id);
      
      const { data } = await supabase
        .from('neighborhood_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('neighborhood_name', neighborhood)
        .eq('city', city)
        .eq('state', state)
        .maybeSingle();
      
      setIsFollowing(!!data);
    };

    checkAuthAndSubscription();
  }, [neighborhood, city, state]);

  const handleToggleFollow = async () => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow neighborhoods",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('neighborhood_subscriptions')
          .delete()
          .eq('user_id', userId)
          .eq('neighborhood_name', neighborhood)
          .eq('city', city)
          .eq('state', state);

        if (error) throw error;

        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You will no longer receive updates about ${neighborhood}`,
        });
      } else {
        // Follow
        const { error } = await supabase
          .from('neighborhood_subscriptions')
          .insert({
            user_id: userId,
            neighborhood_name: neighborhood,
            city,
            state,
          });

        if (error) throw error;

        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You'll receive updates about ${neighborhood}`,
        });
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              Stay Updated on {neighborhood}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isFollowing 
                ? "You're following this neighborhood. You'll receive updates about new listings and market changes."
                : "Get notified about new listings, price changes, and market trends in this area."
              }
            </p>
          </div>
          <Button
            onClick={handleToggleFollow}
            disabled={loading}
            variant={isFollowing ? "outline" : "default"}
            className="ml-4"
          >
            {isFollowing ? (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Unfollow
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Follow
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
