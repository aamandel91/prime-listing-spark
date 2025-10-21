import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  X,
  Heart,
  Share2,
  Phone,
  Home,
  Bed,
  Bath,
  Square,
  Calendar,
  Clock,
  DollarSign,
  Building,
  Ruler,
  Send,
  Video,
} from "lucide-react";

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
}

export const PropertyDetailModal = ({ isOpen, onClose, propertyId }: PropertyDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");

  // Mock data - will be replaced with actual API call
  const property = {
    id: propertyId,
    title: "505 Edwalton Way LOT 82",
    address: "505 Edwalton Way LOT 82",
    city: "Fayetteville",
    state: "North Carolina",
    zip: "28311",
    county: "Cumberland",
    subdivision: "The Hills At Stonegate",
    mlsId: "LP752128",
    price: 379999,
    beds: 5,
    baths: 3,
    sqft: 2469,
    acres: 0.35,
    yearBuilt: 2025,
    daysOnSite: 1,
    propertyType: "Residential",
    subType: "Single Family",
    pricePerSqFt: 154,
    dateListed: "Oct 20, 2025",
    status: "Active",
    description:
      "This beautiful new construction home in The Hills at Stone Gate is under construction! Featuring 5 bedrooms, 2.5 bathrooms, and a 2-car garage, this home offers modern living at its finest.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.address}`,
        url: window.location.href,
      });
    }
  };

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
        fullDate: date.toISOString(),
      });
    }
    return days;
  };

  const tourDates = getNextSevenDays();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">{property.address}</h2>
                <p className="text-sm text-muted-foreground">
                  {property.city}, {property.state} {property.zip}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Left column - Images and details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image gallery */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3 relative rounded-lg overflow-hidden aspect-video">
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-destructive"></div>
                      <span className="font-semibold text-sm">For sale</span>
                    </div>
                  </div>
                  {property.images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                      onClick={() => setCurrentImageIndex(idx + 1)}
                    >
                      <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                {/* Price and stats */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold">{formatPrice(property.price)}</div>
                    <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">
                      {property.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2.5">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Beds</span>
                      <span className="font-bold">{property.beds}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2.5">
                      <Bath className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Baths</span>
                      <span className="font-bold">{property.baths}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2.5">
                      <Square className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">Sqft</span>
                      <span className="font-bold">{property.sqft.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Acres</div>
                      <div className="font-semibold">{property.acres}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Year</div>
                      <div className="font-semibold">{property.yearBuilt}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Days on Site</div>
                      <div className="font-semibold">{property.daysOnSite}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="text-sm text-muted-foreground">Per Square Foot</div>
                      <div className="font-semibold">${property.pricePerSqFt}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>
              </div>

              {/* Right column - CTA */}
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-2xl font-bold mb-4">Request a Tour</h3>
                  
                  {/* Date Selection */}
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {tourDates.slice(0, 3).map((date, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedDate(date.fullDate)}
                          className={`flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-lg border-2 min-w-[80px] transition-colors ${
                            selectedDate === date.fullDate
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-xs font-medium text-muted-foreground">{date.dayOfWeek}</div>
                          <div className={`text-2xl font-bold ${
                            selectedDate === date.fullDate ? 'text-primary' : 'text-foreground'
                          }`}>{date.day}</div>
                          <div className="text-xs font-medium text-muted-foreground">{date.month}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tour Type */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setTourType("in-person")}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        tourType === "in-person"
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Home className={`w-5 h-5 ${tourType === "in-person" ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-sm">In person</span>
                    </button>
                    <button
                      onClick={() => setTourType("video")}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        tourType === "video"
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Video className={`w-5 h-5 ${tourType === "video" ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold text-sm">Video</span>
                    </button>
                  </div>

                  <Button className="w-full mb-2">Request Tour</Button>
                  <p className="text-xs text-muted-foreground text-center mb-4">
                    Tour for free, no strings attached
                  </p>

                  <Separator className="my-4" />

                  <Button variant="outline" className="w-full border-2">
                    Start an Offer
                  </Button>
                </Card>

                {/* Contact */}
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Call Us</div>
                      <a href="tel:919-249-8536" className="text-sm text-primary hover:underline">
                        919-249-8536
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
