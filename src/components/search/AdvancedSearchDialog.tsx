import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
  // Status
  listingStatus: string;
  onStatusChange: (status: string) => void;
  
  // Beds & Baths
  minBeds: string;
  onMinBedsChange: (value: string) => void;
  minBaths: string;
  onMinBathsChange: (value: string) => void;
  
  // Garage & Parking
  minGarage: string;
  onMinGarageChange: (value: string) => void;
  minParking: string;
  onMinParkingChange: (value: string) => void;
  
  // Price
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  
  // Actions
  onApply: () => void;
  onClear: () => void;
}

export function AdvancedSearchDialog({
  open,
  onOpenChange,
  listingStatus,
  onStatusChange,
  minBeds,
  onMinBedsChange,
  minBaths,
  onMinBathsChange,
  minGarage,
  onMinGarageChange,
  minParking,
  onMinParkingChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
  onClear,
}: AdvancedSearchDialogProps) {
  
  const statusOptions = [
    { label: "Active", value: "A" },
    { label: "Sold", value: "Closed" },
    { label: "Both", value: "both" },
    { label: "For Rent", value: "rent" }
  ];
  
  const bedOptions = ["any", "0", "1", "2", "3", "4"];
  const bathOptions = ["any", "1", "2", "3", "4", "5"];
  const garageOptions = ["any", "1", "2", "3", "4", "5"];
  const parkingOptions = ["any", "1", "2", "3", "4", "5"];
  
  const priceValue = [
    minPrice ? parseInt(minPrice) : 0,
    maxPrice ? parseInt(maxPrice) : 5000000
  ];
  
  const handlePriceChange = (values: number[]) => {
    onMinPriceChange(values[0].toString());
    onMaxPriceChange(values[1].toString());
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 px-6 whitespace-nowrap">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-2xl">Advanced property search</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6 space-y-6">
            
            {/* Status Tabs */}
            <div>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={listingStatus === option.value ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[120px]",
                      listingStatus === option.value && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onStatusChange(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border" />
            
            {/* Beds */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Beds</Label>
              <div className="flex gap-2 flex-wrap">
                {bedOptions.map((option) => (
                  <Button
                    key={option}
                    variant={minBeds === option ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[80px]",
                      minBeds === option && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onMinBedsChange(option)}
                  >
                    {option === "any" ? "Any" : option === "0" ? "Studio" : `${option}+`}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border" />
            
            {/* Baths */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Baths</Label>
              <div className="flex gap-2 flex-wrap">
                {bathOptions.map((option) => (
                  <Button
                    key={option}
                    variant={minBaths === option ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[80px]",
                      minBaths === option && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onMinBathsChange(option)}
                  >
                    {option === "any" ? "Any" : `${option}+`}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border" />
            
            {/* Garage */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Garage</Label>
              <div className="flex gap-2 flex-wrap">
                {garageOptions.map((option) => (
                  <Button
                    key={option}
                    variant={minGarage === option ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[80px]",
                      minGarage === option && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onMinGarageChange(option)}
                  >
                    {option === "any" ? "Any" : `${option}+`}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border" />
            
            {/* Parking */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Parking</Label>
              <div className="flex gap-2 flex-wrap">
                {parkingOptions.map((option) => (
                  <Button
                    key={option}
                    variant={minParking === option ? "default" : "outline"}
                    className={cn(
                      "flex-1 min-w-[80px]",
                      minParking === option && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onMinParkingChange(option)}
                  >
                    {option === "any" ? "Any" : `${option}+`}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-border" />
            
            {/* Price */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Price</Label>
              <div className="px-2">
                <Slider
                  value={priceValue}
                  onValueChange={handlePriceChange}
                  min={0}
                  max={5000000}
                  step={10000}
                  className="mb-6"
                />
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>min</span>
                    <span className="font-semibold">${(priceValue[0]).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                    <span>max</span>
                    <span className="font-semibold">${priceValue[1] >= 5000000 ? "5M+" : priceValue[1].toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => onMinPriceChange(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => onMaxPriceChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="border-t px-6 py-4 space-y-2 bg-background">
          <Button 
            className="w-full" 
            size="lg" 
            onClick={() => {
              onApply();
              onOpenChange(false);
            }}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClear}
          >
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}