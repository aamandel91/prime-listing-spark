import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComprehensiveFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Status
  listingStatus: string;
  onStatusChange: (status: string) => void;
  
  // Property Types
  propertyTypes: string[];
  onPropertyTypesChange: (types: string[]) => void;
  
  // Price
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  
  // Beds & Baths
  minBeds: string;
  onMinBedsChange: (value: string) => void;
  minBaths: string;
  onMinBathsChange: (value: string) => void;
  
  // Square Footage
  minSqft: string;
  maxSqft: string;
  onMinSqftChange: (value: string) => void;
  onMaxSqftChange: (value: string) => void;
  
  // Lot Size
  minLotSize: string;
  maxLotSize: string;
  onMinLotSizeChange: (value: string) => void;
  onMaxLotSizeChange: (value: string) => void;
  
  // Year Built
  minYear: string;
  maxYear: string;
  onMinYearChange: (value: string) => void;
  onMaxYearChange: (value: string) => void;
  
  // Garage & Parking
  minGarage: string;
  onMinGarageChange: (value: string) => void;
  minParking: string;
  onMinParkingChange: (value: string) => void;
  
  // Features
  pool: boolean;
  onPoolChange: (value: boolean) => void;
  waterfront: boolean;
  onWaterfrontChange: (value: boolean) => void;
  
  // Actions
  onApply: () => void;
  onClear: () => void;
}

const PROPERTY_TYPES = [
  { value: "Single Family", label: "Single Family" },
  { value: "Condominium", label: "Condo" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Multi Family", label: "Multi-Family" },
  { value: "Land", label: "Land" },
  { value: "Mobile", label: "Mobile/Manufactured" },
];

const PRICE_PRESETS = [
  { label: "$0-$250K", min: "0", max: "250000" },
  { label: "$250K-$500K", min: "250000", max: "500000" },
  { label: "$500K-$1M", min: "500000", max: "1000000" },
  { label: "$1M-$2M", min: "1000000", max: "2000000" },
  { label: "$2M+", min: "2000000", max: "" },
];

export function ComprehensiveFiltersDialog({
  open,
  onOpenChange,
  listingStatus,
  onStatusChange,
  propertyTypes,
  onPropertyTypesChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minBeds,
  onMinBedsChange,
  minBaths,
  onMinBathsChange,
  minSqft,
  maxSqft,
  onMinSqftChange,
  onMaxSqftChange,
  minLotSize,
  maxLotSize,
  onMinLotSizeChange,
  onMaxLotSizeChange,
  minYear,
  maxYear,
  onMinYearChange,
  onMaxYearChange,
  minGarage,
  onMinGarageChange,
  minParking,
  onMinParkingChange,
  pool,
  onPoolChange,
  waterfront,
  onWaterfrontChange,
  onApply,
  onClear,
}: ComprehensiveFiltersDialogProps) {
  
  const statusOptions = [
    { label: "Active", value: "A" },
    { label: "Pending", value: "P" },
    { label: "Sold", value: "Closed" },
  ];
  
  const bedOptions = ["any", "1", "2", "3", "4", "5"];
  const bathOptions = ["any", "1", "1.5", "2", "2.5", "3", "4"];
  const garageOptions = ["any", "1", "2", "3"];
  const parkingOptions = ["any", "1", "2", "3", "4"];

  const handlePropertyTypeToggle = (value: string) => {
    if (propertyTypes.includes(value)) {
      onPropertyTypesChange(propertyTypes.filter(t => t !== value));
    } else {
      onPropertyTypesChange([...propertyTypes, value]);
    }
  };

  const handlePricePreset = (min: string, max: string) => {
    onMinPriceChange(min);
    onMaxPriceChange(max);
  };

  // Count active filters
  const activeFilterCount = [
    listingStatus !== "A",
    propertyTypes.length > 0,
    minPrice !== "" && minPrice !== "0",
    maxPrice !== "",
    minBeds !== "any",
    minBaths !== "any",
    minSqft !== "",
    maxSqft !== "",
    minLotSize !== "",
    maxLotSize !== "",
    minYear !== "",
    maxYear !== "",
    minGarage !== "any",
    minParking !== "any",
    pool,
    waterfront,
  ].filter(Boolean).length;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 px-6 whitespace-nowrap relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl">More Filters</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-160px)] px-6">
          <div className="space-y-6 pb-6">
            
            {/* Listing Status */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Listing Status</Label>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={listingStatus === option.value ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[100px]",
                      listingStatus === option.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onStatusChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Property Type */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Property Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={propertyTypes.includes(type.value)}
                      onCheckedChange={() => handlePropertyTypeToggle(type.value)}
                    />
                    <label
                      htmlFor={type.value}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Price */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Price Range</Label>
              <div className="flex gap-2 mb-3 flex-wrap">
                {PRICE_PRESETS.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePricePreset(preset.min, preset.max)}
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Min Price</Label>
                  <Input
                    type="number"
                    placeholder="No min"
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Max Price</Label>
                  <Input
                    type="number"
                    placeholder="No max"
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Beds & Baths */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Bedrooms</Label>
                <div className="flex gap-2 flex-wrap">
                  {bedOptions.map((option) => (
                    <Button
                      key={option}
                      variant={minBeds === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => onMinBedsChange(option)}
                      className={cn(
                        "min-w-[60px]",
                        minBeds === option && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option === "any" ? "Any" : `${option}+`}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-semibold mb-3 block">Bathrooms</Label>
                <div className="flex gap-2 flex-wrap">
                  {bathOptions.map((option) => (
                    <Button
                      key={option}
                      variant={minBaths === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => onMinBathsChange(option)}
                      className={cn(
                        "min-w-[60px]",
                        minBaths === option && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option === "any" ? "Any" : `${option}+`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Square Footage */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Square Footage</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Min Sqft</Label>
                  <Input
                    type="number"
                    placeholder="No min"
                    value={minSqft}
                    onChange={(e) => onMinSqftChange(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Max Sqft</Label>
                  <Input
                    type="number"
                    placeholder="No max"
                    value={maxSqft}
                    onChange={(e) => onMaxSqftChange(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Lot Size */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Lot Size (Acres)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Min Acres</Label>
                  <Input
                    type="number"
                    placeholder="No min"
                    value={minLotSize}
                    onChange={(e) => onMinLotSizeChange(e.target.value)}
                    className="h-10"
                    step="0.25"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Max Acres</Label>
                  <Input
                    type="number"
                    placeholder="No max"
                    value={maxLotSize}
                    onChange={(e) => onMaxLotSizeChange(e.target.value)}
                    className="h-10"
                    step="0.25"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Year Built */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Year Built</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">Min Year</Label>
                  <Input
                    type="number"
                    placeholder="No min"
                    value={minYear}
                    onChange={(e) => onMinYearChange(e.target.value)}
                    className="h-10"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">Max Year</Label>
                  <Input
                    type="number"
                    placeholder="No max"
                    value={maxYear}
                    onChange={(e) => onMaxYearChange(e.target.value)}
                    className="h-10"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Parking & Garage */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Garage Spaces</Label>
                <div className="flex gap-2 flex-wrap">
                  {garageOptions.map((option) => (
                    <Button
                      key={option}
                      variant={minGarage === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => onMinGarageChange(option)}
                      className={cn(
                        "min-w-[60px]",
                        minGarage === option && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option === "any" ? "Any" : `${option}+`}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-base font-semibold mb-3 block">Parking Spaces</Label>
                <div className="flex gap-2 flex-wrap">
                  {parkingOptions.map((option) => (
                    <Button
                      key={option}
                      variant={minParking === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => onMinParkingChange(option)}
                      className={cn(
                        "min-w-[60px]",
                        minParking === option && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option === "any" ? "Any" : `${option}+`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Property Features */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Property Features</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={pool}
                    onCheckedChange={onPoolChange}
                  />
                  <label
                    htmlFor="pool"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Pool
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="waterfront"
                    checked={waterfront}
                    onCheckedChange={onWaterfrontChange}
                  />
                  <label
                    htmlFor="waterfront"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Waterfront
                  </label>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 border-t bg-muted/20">
          <div className="flex items-center justify-between w-full gap-3">
            <Button
              variant="outline"
              onClick={onClear}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                onApply();
                onOpenChange(false);
              }}
              className="flex-1"
            >
              Show Results
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
