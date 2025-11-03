import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLeadDeduplication } from './useLeadDeduplication';
import { useAuthCheck } from './useAuthCheck';

export interface TourRequest {
  property_mls: string;
  property_address: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone?: string;
  tour_date: string;
  tour_type: 'in-person' | 'video';
  comments?: string;
}

export const useTourRequest = () => {
  const { toast } = useToast();
  const { createOrUpdateLeadStatus } = useLeadDeduplication();
  const { isAuthenticated } = useAuthCheck();

  const submitTourRequest = async (request: TourRequest) => {
    // Check authentication first
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to schedule a tour.",
        variant: "destructive",
      });
      return { data: null, error: new Error('Authentication required') };
    }

    try {
      const { data, error } = await supabase
        .from('tour_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;

      // Create or update lead status for deduplication tracking
      await createOrUpdateLeadStatus(
        request.visitor_email,
        request.visitor_name,
        request.visitor_phone,
        "tour_request",
        request.property_mls
      );

      toast({
        title: "Tour Request Submitted!",
        description: "We'll contact you shortly to confirm your tour schedule.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error submitting tour request:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit tour request. Please try again.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  return { submitTourRequest, isAuthenticated };
};
