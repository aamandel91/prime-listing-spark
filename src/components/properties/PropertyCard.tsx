import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BedDouble, Bath, Square, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePropertyUrl } from "@/lib/propertyUrl";

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
  avm?: number;
  onOpenModal?: (id: string) => void;
  officeId?: string;
  isHotProperty?: boolean;
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
  avm,
  onOpenModal,
  officeId,
  isHotProperty,
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Determine if it's a good deal based on AVM
  const getAvmStatus = () => {
    if (!avm || avm === 0) return null;
    
    const priceDiff = avm - price;
    const percentDiff = (priceDiff / price) * 100;
    
    if (percentDiff > 1.5) {
      return { isGoodDeal: true, label: "Good Deal", color: "text-green-600" };
    } else if (percentDiff < -1.5) {
      return { isGoodDeal: false, label: "Above Est.", color: "text-red-600" };
    }
    return null;
  };

  const avmStatus = getAvmStatus();

  // Generate SEO-optimized alt text
  const altText = `${beds} bedroom, ${baths} bathroom ${title.toLowerCase()} for sale in ${city}, ${state} - ${formatPrice(price)}`;

  const handleClick = (e: React.MouseEvent) => {
    if (onOpenModal) {
      e.preventDefault();
      onOpenModal(id);
    }
  };

  // Generate SEO-friendly URL
  const propertyUrl = generatePropertyUrl({
    address,
    city,
    state,
    zip: zipCode || '',
    mlsNumber: mlsNumber || id,
  });

  const CardContent = (
    <>
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={altText}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width="800"
          height="800"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
          }}
        />
        
        {/* Hot Property Badge */}
        {isHotProperty && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-md animate-pulse">
              🔥 Hot Property
            </Badge>
          </div>
        )}
        
        {/* Showcase Badge */}
        {!isHotProperty && isShowcase && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground font-semibold shadow-md">
              Showcase
            </Badge>
          </div>
        )}

        {/* Status Badges */}
        {!isHotProperty && !isShowcase && status === "open-house" && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-success text-success-foreground font-semibold shadow-md">
              Open House
            </Badge>
          </div>
        )}
        {!isHotProperty && !isShowcase && status === "under-contract" && (
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
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(price)}
          </div>
          {avmStatus && (
            <Badge 
              variant="outline" 
              className={`${avmStatus.color} border-current font-semibold text-xs`}
            >
              {avmStatus.label}
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground mb-3">
          Estimate ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}) {avm && avm > 0 ? (
            <span className={avmStatus?.color || ""}>{formatPrice(avm)}</span>
          ) : (
            <span>Not available</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="text-foreground">
            <span className="font-bold">{beds}</span> bds
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">
            <span className="font-bold">{baths}</span> ba
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">
            <span className="font-bold">{sqft.toLocaleString()}</span> sqft
          </span>
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
    </>
  );

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col bg-card contain-layout">
      {onOpenModal ? (
        <div onClick={handleClick} className="flex flex-col h-full cursor-pointer">
          {CardContent}
        </div>
      ) : (
        <Link to={propertyUrl} className="flex flex-col h-full">
          {CardContent}
        </Link>
      )}
    </Card>
  );
};

export default PropertyCard;
