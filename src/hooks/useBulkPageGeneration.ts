import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerateContentParams {
  entityType: "city" | "zip" | "neighborhood" | "property_subtype" | "school_district";
  entityName: string;
  entityData?: any;
}

interface BulkPageData {
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  api_filters: any;
  category: string;
  page_type: string;
}

export const useBulkPageGeneration = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async ({ entityType, entityName, entityData }: GenerateContentParams) => {
    try {
      setIsGenerating(true);

      const { data, error } = await supabase.functions.invoke("generate-seo-content", {
        body: {
          contentType: `${entityType}_page`,
          keyword: entityName,
          targetData: entityData,
        },
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const createBulkPages = async (pages: BulkPageData[]) => {
    try {
      setIsGenerating(true);

      const { data, error } = await supabase
        .from("content_pages")
        .insert(
          pages.map(page => ({
            ...page,
            published: false,
            display_sidebar: true,
            full_width: false,
          }))
        )
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `${pages.length} page(s) created successfully`,
      });

      return data;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create pages",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    createBulkPages,
    isGenerating,
  };
};
