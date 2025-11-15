import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BedDouble, Bath, Square, MapPin } from "lucide-react";
import { generateDirectPropertyUrl } from "@/lib/propertyUrl";
import { FavoriteButton } from "./FavoriteButton";
import { CompareButton } from "./CompareButton";
import OptimizedImage from "@/components/OptimizedImage";
import { RepliersProperty } from "@/types/repliers";

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
  daysOnMarket?: number;
  originalPrice?: number;
  listDate?: string;
  fullProperty?: RepliersProperty;
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
  daysOnMarket,
  originalPrice,
  listDate,
  fullProperty,
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Determine badge to show (priority order)
  const getBadgeInfo = () => {
    // Check for New Listing (within 7 days)
    if (listDate) {
      const listingDate = new Date(listDate);
      const daysSinceListing = Math.floor((Date.now() - listingDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceListing <= 7) {
        return { type: 'new', label: '✨ New Listing', color: 'bg-blue-600 text-white' };
      }
    }

    // Check for Price Reduced
    if (originalPrice && originalPrice > price) {
      const reduction = ((originalPrice - price) / originalPrice) * 100;
      if (reduction >= 1) {
        return { 
          type: 'reduced', 
          label: `💰 Price Reduced ${reduction.toFixed(0)}%`, 
          color: 'bg-green-600 text-white' 
        };
      }
    }

    // Check for Hot Property (low days on market and high activity)
    if (daysOnMarket !== undefined && daysOnMarket > 0 && daysOnMarket <= 5) {
      return { type: 'hot', label: '🔥 Hot Property', color: 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse' };
    }

    return null;
  };

  const badgeInfo = getBadgeInfo();

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

  // Generate direct property URL using MLS number
  const propertyUrl = mlsNumber ? generateDirectPropertyUrl(mlsNumber) : generateDirectPropertyUrl(id);

  const CardContent = (
    <>
      <div className="relative overflow-hidden aspect-square">
        <OptimizedImage
          src={image}
          alt={altText}
          className="group-hover:scale-105 transition-transform duration-500"
          width={800}
          height={800}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Dynamic Property Badges - Priority Order */}
        {badgeInfo && (
          <div className="absolute top-3 left-3">
            <Badge className={`${badgeInfo.color} font-semibold shadow-md`}>
              {badgeInfo.label}
            </Badge>
          </div>
        )}
        
        {/* Showcase Badge - Only if no other badge */}
        {!badgeInfo && isShowcase && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground font-semibold shadow-md">
              Showcase
            </Badge>
          </div>
        )}

        {/* Status Badges - Only if no other badge */}
        {!badgeInfo && !isShowcase && status === "open-house" && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-success text-success-foreground font-semibold shadow-md">
              Open House
            </Badge>
          </div>
        )}
        {!badgeInfo && !isShowcase && status === "under-contract" && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-destructive text-destructive-foreground font-semibold shadow-md">
              Under Contract
            </Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2">
          {fullProperty && (
            <CompareButton
              property={fullProperty}
              variant="outline"
              size="sm"
              className="bg-background/90 hover:bg-background shadow-md"
            />
          )}
          <FavoriteButton
            propertyMls={mlsNumber || id}
            propertyData={{
              address,
              city,
              state,
              zipCode,
              beds,
              baths,
              sqft,
              title
            }}
            price={price}
            className="bg-background/90 hover:bg-background shadow-md"
          />
        </div>
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
          {sqft && (
            <>
              <span className="text-muted-foreground">|</span>
              <span className="text-foreground">
                <span className="font-bold">{sqft.toLocaleString()}</span> sqft
              </span>
            </>
          )}
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
