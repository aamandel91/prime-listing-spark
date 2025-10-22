import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoGalleryModal } from "./PhotoGalleryModal";
import { useFollowUpBoss } from "@/hooks/useFollowUpBoss";
import PropertyMap from "@/components/map/PropertyMap";
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
  Camera,
  MapPin,
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
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const { toast } = useToast();
  const { trackPropertyView, trackPropertySave } = useFollowUpBoss();

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
      // Track property view in Follow Up Boss
      trackPropertyView({
        id: property.id,
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        mlsNumber: property.mlsId,
        price: property.price,
        beds: property.beds,
        baths: property.baths,
        sqft: property.sqft,
        propertyType: property.subType,
      });
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
    fullBaths: 2,
    halfBaths: 1,
    sqft: 2469,
    acres: 0.35,
    lotSize: "15,246 sqft",
    yearBuilt: 2025,
    daysOnSite: 1,
    propertyType: "Residential",
    subType: "Single Family",
    pricePerSqFt: 154,
    dateListed: "Oct 20, 2025",
    status: "Active",
    garage: "2 Car Garage",
    parking: "Driveway, Garage",
    flooring: "Carpet, Hardwood, Tile",
    heating: "Central, Forced Air",
    cooling: "Central Air",
    appliances: "Dishwasher, Disposal, Microwave, Range, Refrigerator",
    interiorFeatures: "High Ceilings, Walk-In Closets, Open Floor Plan, Kitchen Island",
    exteriorFeatures: "Covered Patio, Fenced Yard, Sprinkler System",
    roofType: "Composition Shingle",
    foundation: "Slab",
    construction: "Frame, Vinyl Siding",
    stories: "2",
    hoa: "Yes",
    hoaFee: 250,
    hoaFeePeriod: "Monthly",
    hoaAmenities: "Clubhouse, Fitness Center, Pool, Playground",
    taxYear: 2024,
    taxAmount: 4200,
    schoolDistrict: "Cumberland County Schools",
    elementarySchool: "Cumberland Road Elementary",
    middleSchool: "Mac Williams Middle School", 
    highSchool: "Jack Britt High School",
    utilities: "Public Water, Public Sewer, Electric, Gas",
    zoning: "Residential",
    description:
      "This beautiful new construction home in The Hills at Stone Gate is under construction! Featuring 5 bedrooms, 2.5 bathrooms, and a 2-car garage, this home offers modern living at its finest. The open floor plan includes a gourmet kitchen with island, spacious living areas, and a master suite with walk-in closet. High ceilings throughout create an airy feel. Located in a family-friendly community with excellent schools and amenities including pool, fitness center, and playground.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79a9c14?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600563438938-a9a27216b4f5?auto=format&fit=crop&w=1200&q=80",
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
        
        // Track property save in Follow Up Boss
        trackPropertySave({
          id: property.id,
          address: property.address,
          city: property.city,
          state: property.state,
          zip: property.zip,
          mlsNumber: property.mlsId,
          price: property.price,
          beds: property.beds,
          baths: property.baths,
          sqft: property.sqft,
          propertyType: property.subType,
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
    <>
      <PhotoGalleryModal 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={property.images}
        initialIndex={galleryStartIndex}
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
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
                <div 
                  className="md:col-span-2 relative rounded-lg overflow-hidden aspect-video md:aspect-[16/10] group cursor-pointer"
                  onClick={() => {
                    setGalleryStartIndex(0);
                    setIsGalleryOpen(true);
                  }}
                >
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span className="font-semibold text-sm">For sale</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4 gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setGalleryStartIndex(0);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <Camera className="w-4 h-4" />
                    View all {property.images.length} Photos
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {property.images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative rounded-lg overflow-hidden aspect-video md:aspect-square cursor-pointer group"
                      onClick={() => {
                        setGalleryStartIndex(idx + 1);
                        setIsGalleryOpen(true);
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`View ${idx + 2}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Listing Updated: {property.dateListed}
                    </p>
                  </div>

                  {/* Interior Features */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Interior Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Rooms & Spaces</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bedrooms</span>
                            <span>{property.beds}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Full Bathrooms</span>
                            <span>{property.fullBaths}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Half Bathrooms</span>
                            <span>{property.halfBaths}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Stories</span>
                            <span>{property.stories}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Amenities</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Flooring</span>
                            <span className="text-right">{property.flooring}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Features</span>
                            <span className="text-right text-xs">{property.interiorFeatures}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Heating & Cooling</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Heating</span>
                            <span className="text-right">{property.heating}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cooling</span>
                            <span className="text-right">{property.cooling}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Appliances</h3>
                        <p className="text-sm text-muted-foreground">{property.appliances}</p>
                      </div>
                    </div>
                  </div>

                  {/* Exterior Features */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Exterior Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Property Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lot Size</span>
                            <span>{property.lotSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Acres</span>
                            <span>{property.acres}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Construction</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Construction</span>
                            <span className="text-right">{property.construction}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Roof</span>
                            <span>{property.roofType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Foundation</span>
                            <span>{property.foundation}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Parking</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Garage</span>
                            <span>{property.garage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Parking</span>
                            <span className="text-right">{property.parking}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Features</h3>
                        <p className="text-sm text-muted-foreground">{property.exteriorFeatures}</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Financial Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">HOA Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HOA</span>
                            <span>{property.hoa}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HOA Fee</span>
                            <span>${property.hoaFee}/{property.hoaFeePeriod}</span>
                          </div>
                          <div className="pt-2">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">Amenities:</span> {property.hoaAmenities}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Tax Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax Year</span>
                            <span>{property.taxYear}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Taxes</span>
                            <span>${property.taxAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Schools */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Location & Schools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Location Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">County</span>
                            <span>{property.county}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subdivision</span>
                            <span>{property.subdivision}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Zoning</span>
                            <span>{property.zoning}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">School District</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">District</span>
                            <span className="text-right">{property.schoolDistrict}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Elementary</span>
                            <span className="text-right">{property.elementarySchool}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Middle</span>
                            <span className="text-right">{property.middleSchool}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">High School</span>
                            <span className="text-right">{property.highSchool}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Utilities */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Utilities</h2>
                    <p className="text-sm text-muted-foreground">{property.utilities}</p>
                  </div>

                  {/* Request Tour Section - Mobile */}
                  <div className="lg:hidden">
                    <Card className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Schedule a Tour</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose your preferred date and tour type
                      </p>
                      
                      {/* Tour Type Selection */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          variant={tourType === "in-person" ? "default" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => setTourType("in-person")}
                        >
                          <Home className="w-4 h-4" />
                          In Person
                        </Button>
                        <Button
                          variant={tourType === "video" ? "default" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => setTourType("video")}
                        >
                          <Video className="w-4 h-4" />
                          Video Chat
                        </Button>
                      </div>

                      {/* Date Selection */}
                      <ScrollArea className="w-full">
                        <div className="flex gap-2 pb-2">
                          {tourDates.map((date) => (
                            <Button
                              key={date.fullDate}
                              variant={selectedDate === date.fullDate ? "default" : "outline"}
                              className="flex-col h-auto py-3 px-4 min-w-[80px]"
                              onClick={() => setSelectedDate(date.fullDate)}
                            >
                              <span className="text-xs font-normal">{date.dayOfWeek}</span>
                              <span className="text-2xl font-bold my-1">{date.day}</span>
                              <span className="text-xs font-normal">{date.month}</span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Time Selection */}
                      {selectedDate && (
                        <div className="mt-4">
                          <Label className="text-sm mb-2 block">Select Time</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"].map((time) => (
                              <Button key={time} variant="outline" size="sm">
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <Separator className="my-4" />

                      {/* Contact Form */}
                      <div className="space-y-3">
                        <Input placeholder="Your Name" />
                        <Input placeholder="Your Email" type="email" />
                        <Input placeholder="Your Phone" type="tel" />
                        <Input
                          placeholder="Add a comment (optional)"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button className="w-full" size="lg">
                          <Send className="w-4 h-4 mr-2" />
                          Request Tour
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Property Map */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Location</h2>
                    <div className="rounded-lg overflow-hidden h-[400px] bg-muted">
                      <PropertyMap
                        properties={[{
                          id: property.id,
                          title: property.title,
                          price: property.price,
                          address: property.address,
                          city: property.city,
                          state: property.state,
                        }]}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {property.address}, {property.city}, {property.state} {property.zip}
                    </p>
                  </div>

                  {/* Nearby Amenities */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">What's Nearby</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Schools
                        </h3>
                        <div className="text-sm space-y-1 ml-6">
                          <p className="text-muted-foreground">{property.elementarySchool} - 1.2 mi</p>
                          <p className="text-muted-foreground">{property.middleSchool} - 2.5 mi</p>
                          <p className="text-muted-foreground">{property.highSchool} - 3.1 mi</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Shopping & Dining
                        </h3>
                        <div className="text-sm space-y-1 ml-6">
                          <p className="text-muted-foreground">Cross Creek Mall - 4.2 mi</p>
                          <p className="text-muted-foreground">Walmart Supercenter - 2.8 mi</p>
                          <p className="text-muted-foreground">Various Restaurants - 1.5 mi</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mortgage Calculator */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Mortgage Calculator</h2>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Home Price</Label>
                          <Input type="text" value={formatPrice(property.price)} disabled />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Down Payment (20%)</Label>
                          <Input type="text" value={formatPrice(property.price * 0.2)} disabled />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Loan Amount</Label>
                          <Input type="text" value={formatPrice(property.price * 0.8)} disabled />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Interest Rate</Label>
                          <Input type="text" value="6.5%" disabled />
                        </div>
                        <Separator />
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
                          <div className="text-3xl font-bold text-primary">
                            {formatPrice(Math.round((property.price * 0.8 * 0.065) / 12 + property.taxAmount / 12 + property.hoaFee))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Includes principal, interest, taxes, and HOA
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* MLS & Listing Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">MLS & Listing Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MLS Number</span>
                          <span className="font-semibold">{property.mlsId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-semibold">{property.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date Listed</span>
                          <span className="font-semibold">{property.dateListed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days on Market</span>
                          <span className="font-semibold">{property.daysOnSite}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Property Type</span>
                          <span className="font-semibold">{property.propertyType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sub Type</span>
                          <span className="font-semibold">{property.subType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">County</span>
                          <span className="font-semibold">{property.county}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subdivision</span>
                          <span className="font-semibold">{property.subdivision}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Listing Agent */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Listing Agent</h2>
                    <Card className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                          JD
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">John Doe</h3>
                          <p className="text-sm text-muted-foreground">Premier Realty Group</p>
                          <p className="text-xs text-muted-foreground">License #12345678</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <a href="tel:919-249-8536" className="hover:underline">919-249-8536</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4 text-muted-foreground" />
                          <a href="mailto:john.doe@example.com" className="hover:underline">john.doe@example.com</a>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Listing courtesy of Premier Realty Group. Information is deemed reliable but not guaranteed.
                        </p>
                      </div>
                    </Card>
                  </div>

                  {/* Property History */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Property History</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <div className="font-semibold">{property.dateListed}</div>
                          <div className="text-sm text-muted-foreground">Listed for sale</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatPrice(property.price)}</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <div className="font-semibold">Sep 15, 2024</div>
                          <div className="text-sm text-muted-foreground">Construction completed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">New construction</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Similar Properties */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Similar Properties</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="aspect-video relative">
                            <img 
                              src={`https://images.unsplash.com/photo-160058${5 + i}154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80`}
                              alt="Similar property"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <div className="text-xl font-bold mb-2">{formatPrice(property.price + (i * 10000))}</div>
                            <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                              <span>{property.beds} bd</span>
                              <span>{property.baths} ba</span>
                              <span>{property.sqft.toLocaleString()} sqft</span>
                            </div>
                            <p className="text-sm">{property.city}, {property.state}</p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground">
                    <h3 className="font-semibold text-foreground mb-2">Disclaimer</h3>
                    <p className="mb-2">
                      The data relating to real estate for sale on this website comes in part from the Internet Data Exchange program. 
                      Information is deemed reliable but not guaranteed. All measurements and all calculations of area are approximate.
                    </p>
                    <p>
                      This property is listed by Premier Realty Group. Last updated: {property.dateListed}. 
                      Source: MLS #{property.mlsId}
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

                  {/* Request Tour Card - Desktop */}
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Schedule a Tour</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose your preferred date and tour type
                    </p>
                    
                    {/* Tour Type Selection */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={tourType === "in-person" ? "default" : "outline"}
                        className="flex-1 gap-2"
                        size="sm"
                        onClick={() => setTourType("in-person")}
                      >
                        <Home className="w-4 h-4" />
                        In Person
                      </Button>
                      <Button
                        variant={tourType === "video" ? "default" : "outline"}
                        className="flex-1 gap-2"
                        size="sm"
                        onClick={() => setTourType("video")}
                      >
                        <Video className="w-4 h-4" />
                        Video
                      </Button>
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-2 mb-4">
                      {tourDates.slice(0, 5).map((date) => (
                        <Button
                          key={date.fullDate}
                          variant={selectedDate === date.fullDate ? "default" : "outline"}
                          className="w-full justify-start"
                          size="sm"
                          onClick={() => setSelectedDate(date.fullDate)}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {date.dayOfWeek}, {date.month} {date.day}
                        </Button>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Contact Form */}
                    <div className="space-y-3">
                      <Input placeholder="Your Name" size={30} />
                      <Input placeholder="Your Email" type="email" />
                      <Input placeholder="Your Phone" type="tel" />
                      <Input
                        placeholder="Add a comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button className="w-full" size="sm">
                        <Send className="w-4 h-4 mr-2" />
                        Request Tour
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
