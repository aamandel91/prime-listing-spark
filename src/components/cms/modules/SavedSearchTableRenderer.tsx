import { SavedSearchTableModule } from "@/types/contentModules";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRepliers } from "@/hooks/useRepliers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SavedSearchTableRendererProps {
  module: SavedSearchTableModule;
}

export default function SavedSearchTableRenderer({ module }: SavedSearchTableRendererProps) {
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
    <div className="module-saved-search-table">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Beds</TableHead>
              <TableHead>Baths</TableHead>
              <TableHead>Sq Ft</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties?.map((property: any) => (
              <TableRow key={property.listingId}>
                <TableCell>
                  <Link 
                    to={`/properties/${property.listingId}`}
                    className="hover:underline"
                  >
                    {property.address?.full || "N/A"}
                  </Link>
                </TableCell>
                <TableCell>${property.listPrice?.toLocaleString() || "N/A"}</TableCell>
                <TableCell>{property.property?.bedrooms || "N/A"}</TableCell>
                <TableCell>{property.property?.bathsFull || "N/A"}</TableCell>
                <TableCell>{property.property?.area?.toLocaleString() || "N/A"}</TableCell>
                <TableCell>{property.standardStatus || "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
