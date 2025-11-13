import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ActiveFilterChipsProps {
  baseFilters?: Record<string, any>;
}

export function ActiveFilterChips({ baseFilters = {} }: ActiveFilterChipsProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const formatFilterValue = (key: string, value: string): string => {
    switch (key) {
      case 'minPrice':
        return `Min $${Number(value).toLocaleString()}`;
      case 'maxPrice':
        return `Max $${Number(value).toLocaleString()}`;
      case 'beds':
        return `${value}+ Beds`;
      case 'baths':
        return `${value}+ Baths`;
      case 'propertyType':
        return value.split(',').join(', ');
      case 'minSqft':
        return `Min ${Number(value).toLocaleString()} sqft`;
      case 'maxSqft':
        return `Max ${Number(value).toLocaleString()} sqft`;
      case 'minYearBuilt':
        return `Built after ${value}`;
      case 'maxYearBuilt':
        return `Built before ${value}`;
      case 'minLotSize':
        return `Min ${value} acres`;
      case 'maxLotSize':
        return `Max ${value} acres`;
      case 'garage':
        return `${value}+ Garage`;
      case 'parking':
        return `${value}+ Parking`;
      case 'pool':
        return 'Pool';
      case 'waterfront':
        return 'Waterfront';
      case 'status':
        if (value === 'A') return 'Active';
        if (value === 'P') return 'Pending';
        if (value === 'Closed') return 'Sold';
        return value;
      case 'city':
      case 'location':
        return `Location: ${value}`;
      case 'state':
        return `State: ${value}`;
      default:
        return value;
    }
  };

  const getActiveFilters = () => {
    const filters: Array<{ key: string; value: string; label: string }> = [];
    
    searchParams.forEach((value, key) => {
      if (value && key !== 'page' && key !== 'sort') {
        filters.push({
          key,
          value,
          label: formatFilterValue(key, value),
        });
      }
    });

    return filters;
  };

  const clearFilter = (filterKey: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(filterKey);
    
    const newUrl = newParams.toString() 
      ? `?${newParams.toString()}`
      : window.location.pathname;
    
    navigate(newUrl, { replace: true });
  };

  const clearAllFilters = () => {
    navigate(window.location.pathname, { replace: true });
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground font-medium">Active Filters:</span>
      
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="pl-3 pr-2 py-1.5 gap-1.5 hover:bg-secondary/80 transition-colors"
        >
          <span className="text-sm">{filter.label}</span>
          <button
            onClick={() => clearFilter(filter.key)}
            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-7 text-xs"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
