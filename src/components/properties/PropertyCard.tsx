import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BedDouble, Bath, Square, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  mlsNumber?: string;
  isShowcase?: boolean;
  status?: "open-house" | "under-contract" | null;
  description?: string;
}

const PropertyCard = ({
  id,
  title,
  price,
  image,
  beds,
  baths,
  sqft,
  address,
  city,
  state,
  zipCode,
  mlsNumber,
  isShowcase,
  status,
  description,
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate SEO-optimized alt text
  const altText = `${beds} bedroom, ${baths} bathroom ${title.toLowerCase()} for sale in ${city}, ${state} - ${formatPrice(price)}`;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col bg-card">
      <Link to={`/property/${id}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={image}
            alt={altText}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Showcase Badge */}
          {isShowcase && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-primary-foreground font-semibold shadow-md">
                Showcase
              </Badge>
            </div>
          )}

          {/* Status Badges */}
          {status === "open-house" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-success text-success-foreground font-semibold shadow-md">
                Open House
              </Badge>
            </div>
          )}
          {status === "under-contract" && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-destructive text-destructive-foreground font-semibold shadow-md">
                Under Contract
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 bg-background/90 hover:bg-background hover:text-primary transition-colors shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // Will require login in the future
            }}
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="text-2xl font-bold text-primary mb-3">
            {formatPrice(price)}
          </div>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <BedDouble className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{beds}</span>
              <span className="text-sm text-muted-foreground">bd</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{baths}</span>
              <span className="text-sm text-muted-foreground">ba</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{sqft.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">sqft</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            <div className="flex items-start gap-1">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{address}, {city}, {state} {zipCode}</span>
            </div>
          </div>

          {mlsNumber && (
            <div className="text-xs text-muted-foreground mt-auto pt-2 border-t border-border">
              MLS# {mlsNumber}
            </div>
          )}

          {/* Hidden description for SEO - accessible to screen readers and search engines */}
          {description && (
            <p className="sr-only">{description}</p>
          )}
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
