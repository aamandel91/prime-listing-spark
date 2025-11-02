import { Badge } from "@/components/ui/badge";
import { Mountain, Waves, Building2, Eye } from "lucide-react";

interface PropertyBadgesProps {
  zoning?: string;
  isWaterfront?: boolean;
  view?: string | string[];
  className?: string;
}

export const PropertyBadges = ({ 
  zoning, 
  isWaterfront, 
  view, 
  className = "" 
}: PropertyBadgesProps) => {
  const viewTypes = Array.isArray(view) ? view : view ? [view] : [];
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {zoning && (
        <Badge variant="secondary" className="text-sm px-3 py-1 gap-2">
          <Building2 className="w-4 h-4" />
          Zoning: {zoning}
        </Badge>
      )}
      
      {isWaterfront && (
        <Badge variant="secondary" className="text-sm px-3 py-1 gap-2 bg-blue-500/10 text-blue-600 border-blue-200">
          <Waves className="w-4 h-4" />
          Waterfront
        </Badge>
      )}
      
      {viewTypes.length > 0 && (
        <Badge variant="secondary" className="text-sm px-3 py-1 gap-2 bg-green-500/10 text-green-600 border-green-200">
          <Eye className="w-4 h-4" />
          {viewTypes.includes('Mountain') && <Mountain className="w-4 h-4" />}
          View: {viewTypes.join(', ')}
        </Badge>
      )}
    </div>
  );
};
