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
  isHotProperty?: boolean;
  status?: "open-house" | "under-contract" | null;
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
  isHotProperty,
  status,
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
    <Card className="group overflow-hidden hover:shadow-large transition-all duration-300">
      <Link to={`/property/${id}`}>
        <div className="relative overflow-hidden h-64">
          <img
            src={image}
            alt={altText}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isHotProperty && (
              <Badge className="bg-accent text-accent-foreground font-bold shadow-medium">
                🔥 Hot Property
              </Badge>
            )}
            {status === "open-house" && (
              <Badge className="bg-success text-success-foreground font-bold shadow-medium">
                Open House
              </Badge>
            )}
            {status === "under-contract" && (
              <Badge className="bg-primary text-primary-foreground font-bold shadow-medium">
                Under Contract
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white hover:text-destructive transition-colors"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite logic
            }}
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-5">
          <div className="text-2xl font-bold text-accent mb-2">
            {formatPrice(price)}
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{address}, {city}, {state}</span>
          </div>

          <div className="flex items-center justify-between text-sm border-t border-border pt-4">
            <div className="flex items-center">
              <BedDouble className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="font-medium">{beds} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="font-medium">{baths} Baths</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1 text-muted-foreground" />
              <span className="font-medium">{sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
