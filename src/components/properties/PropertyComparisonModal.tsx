import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePropertyComparison } from "@/hooks/usePropertyComparison";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/OptimizedImage";
import { X, ExternalLink, DollarSign, Bed, Bath, Square, Calendar, Home, MapPin } from "lucide-react";
import { generatePropertyUrl } from "@/lib/propertyUrl";
import { Link } from "react-router-dom";

interface PropertyComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PropertyComparisonModal = ({ isOpen, onClose }: PropertyComparisonModalProps) => {
  const { selectedProperties, removeProperty } = usePropertyComparison();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return 'N/A';
    return num.toLocaleString();
  };

  const comparisonRows = [
    { 
      label: 'Address', 
      icon: MapPin,
      getValue: (p: any) => p.address,
      highlight: false 
    },
    { 
      label: 'Price', 
      icon: DollarSign,
      getValue: (p: any) => formatPrice(p.price),
      highlight: true,
      highlightBest: (properties: any[]) => {
        const minPrice = Math.min(...properties.map(p => p.price));
        return properties.map(p => p.price === minPrice);
      }
    },
    { 
      label: 'Price per Sqft', 
      icon: DollarSign,
      getValue: (p: any) => p.sqft > 0 ? formatPrice(p.price / p.sqft) : 'N/A',
      highlight: true,
      highlightBest: (properties: any[]) => {
        const pricesPerSqft = properties.map(p => p.sqft > 0 ? p.price / p.sqft : Infinity);
        const minPricePerSqft = Math.min(...pricesPerSqft);
        return pricesPerSqft.map(p => p === minPricePerSqft && p !== Infinity);
      }
    },
    { 
      label: 'Bedrooms', 
      icon: Bed,
      getValue: (p: any) => p.beds || 'N/A',
      highlight: true,
      highlightBest: (properties: any[]) => {
        const maxBeds = Math.max(...properties.map(p => p.beds || 0));
        return properties.map(p => p.beds === maxBeds);
      }
    },
    { 
      label: 'Bathrooms', 
      icon: Bath,
      getValue: (p: any) => p.baths || 'N/A',
      highlight: true,
      highlightBest: (properties: any[]) => {
        const maxBaths = Math.max(...properties.map(p => p.baths || 0));
        return properties.map(p => p.baths === maxBaths);
      }
    },
    { 
      label: 'Square Feet', 
      icon: Square,
      getValue: (p: any) => formatNumber(p.sqft),
      highlight: true,
      highlightBest: (properties: any[]) => {
        const maxSqft = Math.max(...properties.map(p => p.sqft || 0));
        return properties.map(p => p.sqft === maxSqft);
      }
    },
    { 
      label: 'Year Built', 
      icon: Calendar,
      getValue: (p: any) => p.yearBuilt || 'N/A',
      highlight: true,
      highlightBest: (properties: any[]) => {
        const maxYear = Math.max(...properties.map(p => p.yearBuilt || 0));
        return properties.map(p => p.yearBuilt === maxYear);
      }
    },
    { 
      label: 'Lot Size (sqft)', 
      icon: Home,
      getValue: (p: any) => formatNumber(p.lotSize),
      highlight: false 
    },
    { 
      label: 'Property Type', 
      icon: Home,
      getValue: (p: any) => p.propertyType,
      highlight: false 
    },
    { 
      label: 'Status', 
      icon: null,
      getValue: (p: any) => p.status,
      highlight: false 
    },
    { 
      label: 'Days on Market', 
      icon: Calendar,
      getValue: (p: any) => p.daysOnMarket || 'N/A',
      highlight: false 
    },
    { 
      label: 'HOA Fee', 
      icon: DollarSign,
      getValue: (p: any) => p.hoaFee ? formatPrice(p.hoaFee) : 'N/A',
      highlight: false 
    },
    { 
      label: 'Garage Spaces', 
      icon: null,
      getValue: (p: any) => p.garageSpaces || 'N/A',
      highlight: false 
    },
    { 
      label: 'Pool', 
      icon: null,
      getValue: (p: any) => p.pool ? 'Yes' : 'No',
      highlight: false 
    },
    { 
      label: 'Waterfront', 
      icon: null,
      getValue: (p: any) => p.waterfront ? 'Yes' : 'No',
      highlight: false 
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl">Compare Properties</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-full px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="sticky left-0 z-10 bg-background p-4 text-left font-semibold min-w-[180px]">
                    Feature
                  </th>
                  {selectedProperties.map((property) => (
                    <th key={property.mls} className="p-4 min-w-[280px] text-left relative">
                      <div className="space-y-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeProperty(property.mls)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <div className="relative h-40 rounded-lg overflow-hidden">
                          <OptimizedImage
                            src={property.images[0] || '/placeholder.svg'}
                            alt={property.address}
                            width={280}
                            height={160}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <p className="font-semibold text-sm line-clamp-2">{property.address}</p>
                          <p className="text-xs text-muted-foreground">
                            {property.city}, {property.state} {property.zipcode}
                          </p>
                          <Link
                            to={generatePropertyUrl({
                              address: property.address,
                              city: property.city,
                              state: property.state,
                              zip: property.zipcode,
                              mlsNumber: property.mls,
                            })}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            View Details <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {comparisonRows.map((row, idx) => {
                  const highlightBest = row.highlightBest ? row.highlightBest(selectedProperties) : [];
                  
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="sticky left-0 z-10 bg-background p-4 font-medium min-w-[180px]">
                        <div className="flex items-center gap-2">
                          {row.icon && <row.icon className="h-4 w-4 text-muted-foreground" />}
                          {row.label}
                        </div>
                      </td>
                      {selectedProperties.map((property, propIdx) => {
                        const value = row.getValue(property);
                        const isBest = row.highlight && highlightBest[propIdx];
                        
                        return (
                          <td key={property.mls} className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={isBest ? 'font-semibold text-primary' : ''}>
                                {value}
                              </span>
                              {isBest && (
                                <Badge variant="default" className="text-xs">Best</Badge>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
