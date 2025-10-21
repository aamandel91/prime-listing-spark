import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const { toast } = useToast();

  // Check if property is saved when modal opens
  useEffect(() => {
    const checkIfSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .maybeSingle();

      setIsSaved(!!data);
    };

    if (isOpen) {
      checkIfSaved();
    }
  }, [isOpen, propertyId]);

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

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive",
      });
      return;
    }

    if (isSaved) {
      // Unsave
      const { error } = await supabase
        .from('saved_properties')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (!error) {
        setIsSaved(false);
        toast({
          title: "Property removed",
          description: "Property removed from your saved list",
        });
      }
    } else {
      // Save
      const { error } = await supabase
        .from('saved_properties')
        .insert({ user_id: user.id, property_id: propertyId });

      if (!error) {
        setIsSaved(true);
        toast({
          title: "Property saved",
          description: "Property added to your saved list",
        });
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.address}`,
        url: window.location.href,
      });
    } else {
      toast({
        title: "Link copied",
        description: "Property link copied to clipboard",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleHide = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to hide properties",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('hidden_properties')
      .insert({ user_id: user.id, property_id: propertyId });

    if (!error) {
      toast({
        title: "Property hidden",
        description: "This property will no longer appear in your searches",
      });
      onClose();
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
      <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="flex flex-col flex-1 min-h-0">
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
              <Button variant="ghost" onClick={handleSave} className="gap-2">
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                {isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="ghost" onClick={handleHide} className="gap-2">
                <X className="w-4 h-4" />
                Hide
              </Button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">
              {/* Image gallery */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
                <div className="md:col-span-2 relative rounded-lg overflow-hidden aspect-video md:aspect-[16/10]">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span className="font-semibold text-sm">For sale</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4"
                  >
                    View all 14 Photos
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {property.images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative rounded-lg overflow-hidden aspect-video md:aspect-square cursor-pointer"
                      onClick={() => setCurrentImageIndex(idx + 1)}
                    >
                      <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Property header */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Title and price */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.address}</h1>
                    <p className="text-lg text-muted-foreground mb-4">
                      {property.city}, {property.state} {property.zip}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <div className="text-3xl font-bold">{formatPrice(property.price)}</div>
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0 text-sm px-3 py-1">
                        {property.status.toUpperCase()}
                      </Badge>
                      <div className="flex items-center gap-4 text-base">
                        <div className="flex items-center gap-1">
                          <Bed className="w-5 h-5" />
                          <span>Beds {property.beds}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-5 h-5" />
                          <span>Baths {property.baths}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Square className="w-5 h-5" />
                          <span>Sqft {property.sqft.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA buttons - mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:hidden">
                      <Button className="flex-1" size="lg">Request a Tour</Button>
                      <Button variant="outline" className="flex-1" size="lg">Ask a Question</Button>
                    </div>
                    <div className="flex items-center gap-2 text-primary mb-6 lg:hidden">
                      <Phone className="w-5 h-5" />
                      <a href="tel:919-249-8536" className="text-lg font-semibold hover:underline">
                        919-249-8536
                      </a>
                    </div>
                  </div>

                  {/* Property details grid */}
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Acres</div>
                        <div className="font-semibold">{property.acres}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Year</div>
                        <div className="font-semibold">{property.yearBuilt}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Days on Site</div>
                        <div className="font-semibold">{property.daysOnSite}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Property Type</div>
                        <div className="font-semibold">{property.propertyType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Sub Type</div>
                        <div className="font-semibold">{property.subType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Per Square Foot</div>
                        <div className="font-semibold">${property.pricePerSqFt}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Date Listed</div>
                        <div className="font-semibold">{property.dateListed}</div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Description of {property.address}</h2>
                    <div className="space-y-3">
                      <p className="text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Listing details for {property.address}:</span> {property.description}
                      </p>
                      <Button variant="link" className="px-0 text-primary">
                        View More
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Listing Updated: {property.dateListed}
                    </p>
                  </div>
                </div>

                {/* Right sidebar - desktop only */}
                <div className="hidden lg:block space-y-6">
                  {/* CTA buttons */}
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">Request a Tour</Button>
                    <Button variant="outline" className="w-full" size="lg">Ask a Question</Button>
                    <div className="flex items-center gap-2 text-primary justify-center">
                      <Phone className="w-5 h-5" />
                      <a href="tel:919-249-8536" className="text-lg font-semibold hover:underline">
                        919-249-8536
                      </a>
                    </div>
                  </div>

                  {/* Home Details card */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Home Details</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </p>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-semibold">{property.status}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">MLS #ID</span>
                        <span className="font-semibold">{property.mlsId}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-semibold">{formatPrice(property.price)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-semibold">{property.beds}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-semibold">{property.baths}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Square Footage</span>
                        <span className="font-semibold">{property.sqft.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Acres</span>
                        <span className="font-semibold">{property.acres}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Year</span>
                        <span className="font-semibold">{property.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Days on Site</span>
                        <span className="font-semibold">{property.daysOnSite}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
