import { SavedSearchListingsModule } from "@/types/contentModules";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRepliers } from "@/hooks/useRepliers";
import PropertyCard from "@/components/properties/PropertyCard";
import { Loader2 } from "lucide-react";

interface SavedSearchListingsRendererProps {
  module: SavedSearchListingsModule;
}

export function SavedSearchListingsRenderer({ module }: SavedSearchListingsRendererProps) {
  const [searchCriteria, setSearchCriteria] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const repliers = useRepliers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let criteria = null;
        
        if (module.searchId) {
          const { data } = await supabase
            .from("saved_searches")
            .select("search_criteria")
            .eq("id", module.searchId)
            .single();
          
          if (data) {
            criteria = data.search_criteria;
          }
        } else if (module.searchCriteria) {
          criteria = module.searchCriteria;
        }

        if (criteria) {
          const response = await repliers.searchListings(criteria);
          setProperties(response.listings?.slice(0, module.limit || 12) || []);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [module.searchId, module.searchCriteria, module.limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="module-saved-search-listings">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className={`grid gap-6 ${
        module.displayType === "list" 
          ? "grid-cols-1" 
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}>
        {properties?.map((property: any) => (
          <PropertyCard
            key={property.listingId}
            id={property.listingId}
            title={property.address?.full || "Property"}
            price={property.listPrice || 0}
            image={property.photos?.[0]?.href || "/placeholder.svg"}
            beds={property.property?.bedrooms || 0}
            baths={property.property?.bathsFull || 0}
            sqft={property.property?.area || 0}
            address={property.address?.full || ""}
            city={property.address?.city || ""}
            state={property.address?.state || ""}
            zipCode={property.address?.postalCode}
            mlsNumber={property.listingId}
            officeId={property.office?.servingName}
          />
        ))}
      </div>
    </div>
  );
}
