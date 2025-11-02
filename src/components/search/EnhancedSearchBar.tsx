import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, X, Save, Map as MapIcon, List } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import { useAddressParser } from "@/hooks/useAddressParser";
import { PropertyTypeSelector } from "./PropertyTypeSelector";
import PriceFilter from "./PriceFilter";
import BedsAndBathsFilter from "./BedsAndBathsFilter";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface EnhancedSearchBarProps {
  variant?: "hero" | "inline" | "full";
  className?: string;
  onViewChange?: (view: "list" | "map") => void;
  currentView?: "list" | "map";
}

export const EnhancedSearchBar = ({ 
  variant = "inline", 
  className = "",
  onViewChange,
  currentView = "list"
}: EnhancedSearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { parseAddress } = useAddressParser();
  
  const [location, setLocation] = useState(searchParams.get("city") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "FL");
  const [status, setStatus] = useState(searchParams.get("status") || "A");
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    searchParams.get("propertyType")?.split(",") || []
  );
  const [beds, setBeds] = useState(searchParams.get("beds") || "0");
  const [baths, setBaths] = useState(searchParams.get("baths") || "0");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "5000000");

  const statusOptions = [
    { value: "A", label: "For Sale" },
    { value: "P", label: "Pending" },
    { value: "S", label: "Sold" },
    { value: "all", label: "All Status" },
  ];

  const getActiveFilters = () => {
    const filters: { key: string; label: string; onRemove: () => void }[] = [];
    
    if (location) {
      filters.push({
        key: "location",
        label: `${location}, ${selectedState}`,
        onRemove: () => setLocation("")
      });
    }
    
    if (status !== "A" && status !== "all") {
      const statusLabel = statusOptions.find(s => s.value === status)?.label || status;
      filters.push({
        key: "status",
        label: statusLabel,
        onRemove: () => setStatus("A")
      });
    }
    
    if (propertyTypes.length > 0) {
      propertyTypes.forEach(type => {
        filters.push({
          key: `type-${type}`,
          label: type,
          onRemove: () => setPropertyTypes(prev => prev.filter(t => t !== type))
        });
      });
    }
    
    if (beds !== "0" && beds !== "any") {
      filters.push({
        key: "beds",
        label: `${beds}+ Beds`,
        onRemove: () => setBeds("0")
      });
    }
    
    if (baths !== "0" && baths !== "any") {
      filters.push({
        key: "baths",
        label: `${baths}+ Baths`,
        onRemove: () => setBaths("0")
      });
    }
    
    if (minPrice !== "0" || maxPrice !== "5000000") {
      const min = minPrice === "0" ? "0" : `$${(parseInt(minPrice) / 1000).toFixed(0)}K`;
      const max = maxPrice === "5000000" ? "Any" : `$${(parseInt(maxPrice) / 1000).toFixed(0)}K`;
      filters.push({
        key: "price",
        label: `${min} - ${max}`,
        onRemove: () => {
          setMinPrice("0");
          setMaxPrice("5000000");
        }
      });
    }
    
    return filters;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) {
      // Parse address for better structure
      const parsed = parseAddress(location);
      
      if (parsed) {
        if (parsed.placeName) {
          params.set("city", parsed.placeName);
        }
        if (parsed.stateAbbreviation) {
          params.set("state", parsed.stateAbbreviation);
        } else {
          params.set("state", selectedState);
        }
        if (parsed.zipCode) {
          params.set("zipCode", parsed.zipCode);
        }
        if (parsed.addressLine1) {
          params.set("address", parsed.addressLine1);
        }
      } else {
        params.set("city", location);
        params.set("state", selectedState);
      }
    }
    
    if (status !== "all") {
      params.set("status", status);
    }
    
    if (propertyTypes.length > 0) {
      params.set("propertyType", propertyTypes.join(","));
    }
    
    if (beds !== "0" && beds !== "any") {
      params.set("beds", beds);
    }
    
    if (baths !== "0" && baths !== "any") {
      params.set("baths", baths);
    }
    
    if (minPrice !== "0") {
      params.set("minPrice", minPrice);
    }
    
    if (maxPrice !== "5000000") {
      params.set("maxPrice", maxPrice);
    }
    
    navigate(`/listings?${params.toString()}`);
  };

  const handleSaveSearch = () => {
    // TODO: Implement save search to backend
    toast({
      title: "Search Saved",
      description: "You'll receive notifications when new properties match your criteria.",
    });
  };

  const clearAllFilters = () => {
    setLocation("");
    setStatus("A");
    setPropertyTypes([]);
    setBeds("0");
    setBaths("0");
    setMinPrice("0");
    setMaxPrice("5000000");
  };

  const activeFilters = getActiveFilters();
  const isHero = variant === "hero";
  const isFull = variant === "full";

  return (
    <div className={`${className}`}>
      {/* Main Search Bar */}
      <div className={`${
        isHero 
          ? 'bg-background/95 backdrop-blur-sm rounded-xl shadow-large p-6' 
          : 'bg-background border border-border rounded-lg p-4'
      }`}>
        {/* Primary Search Controls */}
        <div className="space-y-4">
          {/* Location & Status Row */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <CityAutocomplete
                value={location}
                onChange={setLocation}
                onSelect={(city) => setSelectedState(city.state)}
                placeholder="Search by City, Zip, or Address"
                className={`${isHero ? 'h-12' : 'h-11'} border-input`}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className={`${isHero ? 'h-12' : 'h-11'} w-full lg:w-40 bg-background`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-[100]">
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Selector */}
          {isFull && (
            <PropertyTypeSelector
              selectedTypes={propertyTypes}
              onSelectionChange={setPropertyTypes}
            />
          )}

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <BedsAndBathsFilter
              bedsValue={beds}
              bathsValue={baths}
              onBedsChange={setBeds}
              onBathsChange={setBaths}
            />
            
            <PriceFilter
              minValue={minPrice}
              maxValue={maxPrice}
              onMinChange={setMinPrice}
              onMaxChange={setMaxPrice}
            />
            
            <div className="flex gap-2">
              <Button 
                className={`${isHero ? 'h-12 px-8' : 'h-11 px-6'} flex-1 md:flex-none bg-accent hover:bg-accent/90 text-accent-foreground font-semibold`}
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              
              <Button
                variant="outline"
                className={`${isHero ? 'h-12' : 'h-11'} px-4`}
                onClick={handleSaveSearch}
                title="Save this search"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters & View Toggle */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1 cursor-pointer hover:bg-secondary/80"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                className="ml-1 rounded-full hover:bg-background/50 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
          
          {onViewChange && (
            <div className="ml-auto flex gap-1 border rounded-md p-1">
              <Button
                variant={currentView === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("list")}
                className="h-7 px-3"
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={currentView === "map" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onViewChange("map")}
                className="h-7 px-3"
              >
                <MapIcon className="w-4 h-4 mr-1" />
                Map
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
