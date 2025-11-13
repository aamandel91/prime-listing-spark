import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, SlidersHorizontal, MapPin, Building2, Home, X, ChevronDown } from "lucide-react";
import { useRepliersLocationsAutocomplete } from "@/hooks/useRepliersLocations";
import { cn } from "@/lib/utils";

interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  beds: string;
  baths: string;
  propertyType: string[];
  minSqft?: number;
  maxSqft?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  minLotSize?: number;
  maxLotSize?: number;
  pool?: boolean;
  waterfront?: boolean;
  garage?: number;
  stories?: number;
  features?: string[];
}

const PROPERTY_TYPES = [
  { value: "Single Family", label: "Single Family" },
  { value: "Condo", label: "Condo" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Multi-Family", label: "Multi-Family" },
  { value: "Land", label: "Land" },
  { value: "Mobile", label: "Mobile/Manufactured" },
];

const PRICE_PRESETS = [
  { label: "$0 - $250k", min: 0, max: 250000 },
  { label: "$250k - $500k", min: 250000, max: 500000 },
  { label: "$500k - $1M", min: 500000, max: 1000000 },
  { label: "$1M - $2M", min: 1000000, max: 2000000 },
  { label: "$2M+", min: 2000000, max: 10000000 },
];

export default function EnhancedSearchBarV2() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const locationRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    minPrice: 0,
    maxPrice: 10000000,
    beds: "any",
    baths: "any",
    propertyType: [],
    features: [],
  });

  const { suggestions: locationSuggestions, loading: isLoadingLocations } = useRepliersLocationsAutocomplete(searchTerm);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (location: any) => {
    setFilters({ ...filters, location: location.name });
    setSearchTerm(location.name);
    setShowLocationDropdown(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (filters.location) params.append("location", filters.location);
    if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 10000000) params.append("maxPrice", filters.maxPrice.toString());
    if (filters.beds !== "any") params.append("beds", filters.beds);
    if (filters.baths !== "any") params.append("baths", filters.baths);
    if (filters.propertyType.length > 0) params.append("propertyType", filters.propertyType.join(","));
    if (filters.minSqft) params.append("minSqft", filters.minSqft.toString());
    if (filters.maxSqft) params.append("maxSqft", filters.maxSqft.toString());
    if (filters.minYearBuilt) params.append("minYearBuilt", filters.minYearBuilt.toString());
    if (filters.maxYearBuilt) params.append("maxYearBuilt", filters.maxYearBuilt.toString());
    if (filters.pool) params.append("pool", "true");
    if (filters.waterfront) params.append("waterfront", "true");

    navigate(`/listings?${params.toString()}`);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.minPrice > 0 || filters.maxPrice < 10000000) count++;
    if (filters.beds !== "any") count++;
    if (filters.baths !== "any") count++;
    if (filters.propertyType.length > 0) count++;
    if (filters.minSqft || filters.maxSqft) count++;
    if (filters.minYearBuilt || filters.maxYearBuilt) count++;
    if (filters.pool || filters.waterfront) count++;
    return count;
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      minPrice: 0,
      maxPrice: 10000000,
      beds: "any",
      baths: "any",
      propertyType: [],
      features: [],
    });
    setSearchTerm("");
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `$${(price / 1000).toFixed(0)}k`;
    return `$${price}`;
  };

  const togglePropertyType = (type: string) => {
    setFilters({
      ...filters,
      propertyType: filters.propertyType.includes(type)
        ? filters.propertyType.filter(t => t !== type)
        : [...filters.propertyType, type],
    });
  };

  return (
    <div className="w-full bg-background border rounded-lg shadow-lg p-6 space-y-6">
      {/* Primary Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Location Input with Autocomplete */}
        <div className="md:col-span-2 relative" ref={locationRef}>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="City, Neighborhood, or ZIP"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowLocationDropdown(true);
              }}
              onFocus={() => setShowLocationDropdown(true)}
              className="pl-10"
            />
          </div>

          {/* Location Dropdown */}
          {showLocationDropdown && locationSuggestions && locationSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-64 overflow-auto">
              {locationSuggestions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {location.type === "city" && <Building2 className="h-4 w-4 text-primary" />}
                    {location.type === "neighborhood" && <Home className="h-4 w-4 text-primary" />}
                    {location.type === "area" && <MapPin className="h-4 w-4 text-primary" />}
                    <div>
                      <div className="font-medium">{location.name}</div>
                      {location.metadata?.city && (
                        <div className="text-xs text-muted-foreground">
                          {location.metadata.city}, {location.state}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Price Range</Label>
          <Select
            value={`${filters.minPrice}-${filters.maxPrice}`}
            onValueChange={(value) => {
              const [min, max] = value.split("-").map(Number);
              setFilters({ ...filters, minPrice: min, maxPrice: max });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-10000000">Any Price</SelectItem>
              {PRICE_PRESETS.map((preset) => (
                <SelectItem key={preset.label} value={`${preset.min}-${preset.max}`}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Beds</Label>
          <Select value={filters.beds} onValueChange={(value) => setFilters({ ...filters, beds: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Baths */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Baths</Label>
          <Select value={filters.baths} onValueChange={(value) => setFilters({ ...filters, baths: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Type Pills */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Property Type</Label>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Badge
              key={type.value}
              variant={filters.propertyType.includes(type.value) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => togglePropertyType(type.value)}
            >
              {type.label}
              {filters.propertyType.includes(type.value) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {getActiveFiltersCount()}
                </Badge>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>

          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Square Footage */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Square Footage</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minSqft || ""}
                  onChange={(e) => setFilters({ ...filters, minSqft: Number(e.target.value) || undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxSqft || ""}
                  onChange={(e) => setFilters({ ...filters, maxSqft: Number(e.target.value) || undefined })}
                />
              </div>
            </div>

            {/* Year Built */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Year Built</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minYearBuilt || ""}
                  onChange={(e) => setFilters({ ...filters, minYearBuilt: Number(e.target.value) || undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYearBuilt || ""}
                  onChange={(e) => setFilters({ ...filters, maxYearBuilt: Number(e.target.value) || undefined })}
                />
              </div>
            </div>

            {/* Lot Size */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lot Size (sqft)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minLotSize || ""}
                  onChange={(e) => setFilters({ ...filters, minLotSize: Number(e.target.value) || undefined })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxLotSize || ""}
                  onChange={(e) => setFilters({ ...filters, maxLotSize: Number(e.target.value) || undefined })}
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Features</Label>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filters.pool ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters({ ...filters, pool: !filters.pool })}
              >
                Pool
              </Badge>
              <Badge
                variant={filters.waterfront ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilters({ ...filters, waterfront: !filters.waterfront })}
              >
                Waterfront
              </Badge>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Search Button */}
      <Button onClick={handleSearch} className="w-full" size="lg">
        <Search className="mr-2 h-4 w-4" />
        Search Properties
      </Button>
    </div>
  );
}
