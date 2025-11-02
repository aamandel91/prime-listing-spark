import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoGalleryModal } from "./PhotoGalleryModal";
import { useFollowUpBoss } from "@/hooks/useFollowUpBoss";
import PropertyMap from "@/components/map/PropertyMap";
import PropertyCard from "./PropertyCard";
import { useRepliersListing } from "@/hooks/useRepliers";
import { generatePropertyUrl } from "@/lib/propertyUrl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  Navigation,
  Mail,
  MessageSquare,
  ArrowRight,
  Loader2,
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
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState("379999");
  const [downPayment, setDownPayment] = useState("37999.9");
  const [interestRate, setInterestRate] = useState("5.75");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [showStickyButtons, setShowStickyButtons] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { trackPropertyView, trackPropertySave } = useFollowUpBoss();
  const { listing, loading, error } = useRepliersListing(propertyId);

  // Transform API listing to component format
  const property = listing ? {
    id: listing.mlsNumber || propertyId,
    title: [listing.address?.streetNumber, listing.address?.streetName, listing.address?.streetSuffix]
      .filter(Boolean).join(' ') || "Property",
    address: [listing.address?.streetNumber, listing.address?.streetName, listing.address?.streetSuffix]
      .filter(Boolean).join(' ') || "",
    city: listing.address?.city || "",
    state: listing.address?.state || "",
    zip: listing.address?.zip || "",
    county: listing.address?.area || "",
    subdivision: listing.address?.neighborhood || "",
    mlsId: listing.mlsNumber || "",
    price: listing.listPrice || 0,
    originalPrice: listing.originalPrice || listing.listPrice || 0,
    beds: listing.details?.numBedrooms || 0,
    baths: listing.details?.numBathrooms || 0,
    sqft: typeof listing.details?.sqft === 'number' ? listing.details.sqft : parseInt(listing.details?.sqft || "0"),
    acres: listing.lot?.acres || 0,
    lotSize: listing.lot?.squareFeet || 0,
    lotFeatures: listing.lot?.features || "",
    legalDescription: listing.lot?.legalDescription || "",
    yearBuilt: typeof listing.details?.yearBuilt === 'number' ? listing.details.yearBuilt : parseInt(listing.details?.yearBuilt || "0") || undefined,
    daysOnSite: listing.daysOnMarket || 0,
    listDate: listing.listDate || "",
    propertyType: listing.details?.propertyType || "Residential",
    propertyClass: listing.class || "",
    subType: listing.details?.style || "Single Family",
    pricePerSqFt: listing.details?.sqft ? Math.round((listing.listPrice || 0) / (typeof listing.details.sqft === 'number' ? listing.details.sqft : parseInt(String(listing.details.sqft)))) : 0,
    dateListed: listing.listDate ? new Date(listing.listDate).toLocaleDateString() : "",
    status: listing.standardStatus || listing.lastStatus || "Active",
    description: listing.details?.description || "",
    interiorFeatures: [
      listing.details?.airConditioning && `Air Conditioning: ${listing.details.airConditioning}`,
      listing.details?.heating && `Heating: ${listing.details.heating}`,
      listing.details?.flooringType && `Flooring: ${listing.details.flooringType}`,
      listing.details?.extras && `Appliances: ${listing.details.extras}`,
    ].filter(Boolean) as string[],
    exteriorFeatures: [
      listing.details?.exteriorConstruction1 && `Construction: ${listing.details.exteriorConstruction1}`,
      listing.details?.roofMaterial && `Roof: ${listing.details.roofMaterial}`,
      listing.details?.foundationType && `Foundation: ${listing.details.foundationType}`,
      listing.details?.patio && `Outdoor: ${listing.details.patio}`,
      listing.details?.sewer && `Sewer: ${listing.details.sewer}`,
    ].filter(Boolean) as string[],
    hoaFeatures: [
      listing.condominium?.fees?.maintenance && `HOA Fee: $${listing.condominium.fees.maintenance}/mo`,
      listing.condominium?.condoCorp && `Association: ${listing.condominium.condoCorp}`,
      listing.condominium?.parkingType && `Parking: ${listing.condominium.parkingType}`,
      listing.nearby?.amenities && `Amenities: ${listing.nearby.amenities.join(', ')}`,
    ].filter(Boolean) as string[],
    additionalInfo: [
      listing.details?.numGarageSpaces && `Garage Spaces: ${listing.details.numGarageSpaces}`,
      listing.details?.numParkingSpaces && `Parking Spaces: ${listing.details.numParkingSpaces}`,
      listing.taxes?.annualAmount && `Annual Taxes: $${listing.taxes.annualAmount}`,
      listing.taxes?.assessmentYear && `Tax Year: ${listing.taxes.assessmentYear}`,
    ].filter(Boolean) as string[],
    rooms: listing.rooms || [],
    listingAgent: {
      name: listing.agents?.[0]?.name || "",
      phone: listing.agents?.[0]?.phones?.[0] || "",
      email: listing.agents?.[0]?.email || "",
      company: listing.agents?.[0]?.brokerage?.name || listing.office?.brokerageName || "",
    },
    avm: listing.estimate ? {
      value: Math.round((listing.estimate.high + listing.estimate.low) / 2),
      high: listing.estimate.high,
      low: listing.estimate.low,
    } : (listing.avm ? {
      value: listing.avm.value,
      high: listing.avm.high,
      low: listing.avm.low,
    } : null),
    source: listing.mlsNumber ? `MLS#: ${listing.mlsNumber}` : "",
    images: listing.images && listing.images.length > 0 
      ? listing.images.map((img: string) => `https://api.repliers.io/images/${img}`)
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
  } : null;

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

    if (isOpen && property) {
      checkIfSaved();
      
      // Initialize calculator with property values
      setListingPrice(property.price.toString());
      setDownPayment((property.price * 0.1).toString()); // 10% down
      setInterestRate("5.75");
      
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
  }, [isOpen, propertyId, property]);

  // Handle sticky buttons on scroll
  useEffect(() => {
    if (!isOpen) {
      setShowStickyButtons(false);
      return;
    }

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      // Show sticky buttons after scrolling 600px
      setShowStickyButtons(scrollTop > 600);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Loading and error states
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !property) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl h-[40vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Property Not Found</p>
            <p className="text-muted-foreground">We couldn't load this property right now.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateMortgage = () => {
    const principal = parseFloat(listingPrice) - parseFloat(downPayment);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = 30 * 12; // 30 years
    
    // Monthly principal & interest
    const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Add taxes, insurance, and HOA
    const monthlyTaxes = (listing?.taxes?.annualAmount || 0) / 12;
    const monthlyHOA = listing?.condominium?.fees?.maintenance || 0;
    const monthlyInsurance = (parseFloat(listingPrice) * 0.005) / 12;
    
    const total = monthlyPI + monthlyTaxes + monthlyHOA + monthlyInsurance;
    setMonthlyPayment(Math.round(total));
    
    toast({
      title: "Calculation Complete",
      description: "Your estimated monthly payment has been updated",
      duration: 3000,
    });
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save properties",
        variant: "destructive",
        duration: 4000,
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
          duration: 4000,
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
          duration: 4000,
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
        duration: 4000,
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
        duration: 4000,
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
        duration: 4000,
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

  // SEO structured data
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": property.address,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state,
      "postalCode": property.zip,
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "35.0527",
      "longitude": "-78.8784"
    },
    "numberOfRooms": property.beds + property.baths,
    "numberOfBedrooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "FTK"
    },
    "yearBuilt": property.yearBuilt,
    "image": property.images,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "RealEstateAgent",
        "name": "Naomi Richardson",
        "telephone": "919-398-8357",
        "email": "naomi@markspain.com",
        "organization": {
          "@type": "Organization",
          "name": "Mark Spain Real Estate"
        }
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "MLS Number",
        "value": property.mlsId
      },
      {
        "@type": "PropertyValue",
        "name": "Property Type",
        "value": property.propertyType
      },
      {
        "@type": "PropertyValue",
        "name": "Lot Size",
        "value": property.acres + " acres"
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{property.address} - {property.city}, {property.state} | Homes for Sale</title>
        <meta name="description" content={`${property.beds} bed, ${property.baths} bath home for sale at ${property.address} in ${property.city}, ${property.state}. ${property.sqft} sqft listed at ${formatPrice(property.price)}. MLS #${property.mlsId}.`} />
        <meta name="keywords" content={`${property.city} real estate, ${property.city} homes for sale, ${property.subdivision}, ${property.zip} homes, ${property.county} real estate`} />
        <link rel="canonical" href={`${window.location.origin}${generatePropertyUrl({
          address: property.address,
          city: property.city,
          state: property.state,
          zip: property.zip,
          mlsNumber: property.mlsId
        })}`} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${property.address} - ${property.city}, ${property.state}`} />
        <meta property="og:description" content={`${property.beds} bed, ${property.baths} bath home for sale. ${property.sqft} sqft listed at ${formatPrice(property.price)}`} />
        <meta property="og:image" content={property.images[0]} />
        <meta property="og:url" content={`${window.location.origin}/property/${propertyId}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${property.address} - ${property.city}, ${property.state}`} />
        <meta name="twitter:description" content={`${property.beds} bed, ${property.baths} bath home for sale at ${formatPrice(property.price)}`} />
        <meta name="twitter:image" content={property.images[0]} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(propertySchema)}
        </script>
      </Helmet>
      
      <PhotoGalleryModal 
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={property.images}
        initialIndex={galleryStartIndex}
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">{property.address} - Property Details</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {property.address}, {property.city}, {property.state}. 
          {property.beds} bedrooms, {property.baths} bathrooms, {property.sqft} sqft. Listed at {formatPrice(property.price)}.
        </DialogDescription>
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-background border-b p-2 flex items-center justify-between">
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleSave} className="gap-2">
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleHide} className="gap-2">
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Hide</span>
              </Button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
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
                {/* Hidden on mobile, shown as grid on desktop */}
                <div className="hidden md:grid md:grid-cols-1 gap-2">
                  {property.images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx}
                      className="relative rounded-lg overflow-hidden aspect-square cursor-pointer group"
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

                    {/* Estimated Value */}
                    <div className="mb-4 text-sm">
                      <span className="text-muted-foreground">
                        Estimate ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}){" "}
                      </span>
                      {property.avm && property.avm.value > 0 ? (
                        <span className="font-semibold">{formatPrice(property.avm.value)}</span>
                      ) : (
                        <span className="font-semibold">Not available</span>
                      )}
                    </div>

                    {/* CTA buttons - mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:hidden">
                      <Button className="flex-1" size="lg" onClick={() => setIsContactFormOpen(true)}>Request a Tour</Button>
                      <Button variant="outline" className="flex-1" size="lg" onClick={() => setIsContactFormOpen(true)}>Get Pre-Approved</Button>
                    </div>
                    <div className="flex items-center gap-2 text-primary mb-6 lg:hidden">
                      <Phone className="w-5 h-5" />
                      <a href="tel:919-249-8536" className="text-lg font-semibold hover:underline">
                        919-249-8536
                      </a>
                    </div>
                  </div>

                   {/* Community Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Community Information for {property.address}</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Address</span>
                          <span className="font-semibold text-right">{property.address}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">City</span>
                          <Link to={`/listings?city=${property.city}`} className="font-semibold text-primary hover:underline">{property.city}</Link>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">State</span>
                          <span className="font-semibold">{property.state}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Zip Code</span>
                          <Link to={`/listings?zip=${property.zip}`} className="font-semibold text-primary hover:underline">{property.zip}</Link>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">County</span>
                          <Link to={`/listings?county=${property.county}`} className="font-semibold text-primary hover:underline">{property.county}</Link>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Subdivision</span>
                          <Link to={`/listings?subdivision=${property.subdivision}`} className="font-semibold text-primary hover:underline">{property.subdivision}</Link>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Schools */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Schools</h2>
                    <Card className="p-6">
                      <div className="text-sm text-muted-foreground">School information is not available for this listing.</div>
                    </Card>
                  </div>

                  {/* Utilities */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Utilities</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        {listing?.details?.sewer && (
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Sewer</span>
                            <span className="font-semibold">{listing.details.sewer}</span>
                          </div>
                        )}
                        {listing?.details?.extras && (
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Appliances</span>
                            <span className="font-semibold text-right">{listing.details.extras}</span>
                          </div>
                        )}
                        {!listing?.details?.sewer && !listing?.details?.extras && (
                          <div className="text-muted-foreground">Not available</div>
                        )}
                      </div>
                    </Card>
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

                   {/* Interior */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Interior</h2>
                    <Card className="p-6">
                      {property.interiorFeatures.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {property.interiorFeatures.map((feature, idx) => (
                            <li key={idx} className="text-foreground">{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground">Not available</div>
                      )}
                    </Card>
                  </div>

                   {/* Exterior */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Exterior</h2>
                    <Card className="p-6">
                      {property.exteriorFeatures.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {property.exteriorFeatures.map((feature, idx) => (
                            <li key={idx} className="text-foreground">{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground">Not available</div>
                      )}
                    </Card>
                  </div>

                   {/* HOA */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">HOA</h2>
                    <Card className="p-6">
                      {property.hoaFeatures.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {property.hoaFeatures.map((feature, idx) => (
                            <li key={idx} className="text-foreground">{feature}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground">None</div>
                      )}
                    </Card>
                  </div>

                   {/* Additional Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        {property.additionalInfo.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {property.additionalInfo.map((info, idx) => (
                              <li key={idx} className="text-foreground">{info}</li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Price per Sq Ft</span>
                          <span className="font-semibold">${property.pricePerSqFt}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-1"><strong>Listed By</strong></p>
                    <p>
                      {property.listingAgent.name}
                      {property.listingAgent.phone ? `, ${property.listingAgent.phone}` : ''}
                      {property.listingAgent.company ? `, ${property.listingAgent.company}` : ''}
                    </p>
                    <p className="mt-2"><strong>Source</strong></p>
                    <p>MLS, MLS#: {property.mlsId}</p>
                  </div>

                   {/* Need to sell your current home Widget */}
                  <Card className="bg-muted/30 border-0">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex-1">
                          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                            Need to sell your current home to buy this one?
                          </h2>
                          <p className="text-lg text-muted-foreground">
                            Find out how much it will sell for today!
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            size="lg" 
                            className="h-12 px-6 bg-primary hover:bg-primary/90"
                            onClick={() => setIsContactFormOpen(true)}
                          >
                            <Home className="w-5 h-5 mr-2" />
                            Home Evaluation
                          </Button>
                          <Button 
                            size="lg" 
                            className="h-12 px-6 bg-primary hover:bg-primary/90"
                            onClick={() => setIsContactFormOpen(true)}
                          >
                            <span className="mr-2">✓</span>
                            Guaranteed Sold*
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>

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


                   {/* Mortgage Calculator */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Mortgage Calculator</h2>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Listing Price</Label>
                          <Input 
                            type="text" 
                            value={listingPrice}
                            onChange={(e) => setListingPrice(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Down Payment</Label>
                          <Input 
                            type="text" 
                            value={downPayment}
                            onChange={(e) => setDownPayment(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Interest Rate</Label>
                          <Input 
                            type="text" 
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Amortization</Label>
                          <Input type="text" value="30 Years" disabled />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Association Fees (Monthly)</Label>
                          <Input 
                            type="number" 
                            value={listing?.condominium?.fees?.maintenance || 0}
                            onChange={(e) => {}}
                          />
                        </div>
                        <div>
                          <Label className="text-sm mb-2 block">Insurance (Monthly)</Label>
                          <Input 
                            type="number" 
                            value={Math.round((parseFloat(listingPrice || "0") * 0.005) / 12)}
                            onChange={(e) => {}}
                          />
                          <p className="text-xs text-muted-foreground mt-1">Estimated at 0.5% annually</p>
                        </div>
                        <Button className="w-full" size="lg" onClick={calculateMortgage}>Calculate</Button>
                        <Separator />
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
                          <div className="text-3xl font-bold text-primary">
                            {formatPrice(
                              monthlyPayment !== null ? monthlyPayment : Math.round(
                                (property.price * 0.8 * 0.065) / 12 + // Principal & Interest
                                (listing?.taxes?.annualAmount || 0) / 12 + // Taxes
                                (listing?.condominium?.fees?.maintenance || 0) + // HOA (monthly)
                                (property.price * 0.005) / 12 // Insurance (0.5% of price annually)
                              )
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Includes principal, interest, taxes, HOA, and insurance
                          </p>
                        </div>
                        <Button 
                          className="w-full" 
                          size="lg"
                          variant="outline"
                          onClick={() => setIsContactFormOpen(true)}
                        >
                          Contact a Local Lender
                        </Button>
                      </div>
                    </Card>
                  </div>


                  {/* Get Directions & Street View */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Get Directions</h2>
                    <Card className="p-6">
                      <div className="space-y-4">
                        <Input placeholder="Enter your location" />
                        <Button className="w-full" size="lg">
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Streetview of {property.address}</h2>
                    <div className="rounded-lg overflow-hidden h-[400px] bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">Street View Available</p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Schools</h2>
                    <Card className="p-6">
                      <div className="text-sm text-muted-foreground">School information is not available for this listing.</div>
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

                   {/* Disclaimer */}
                  <div className="bg-muted/30 rounded-lg p-6 text-sm text-muted-foreground">
                    <h3 className="font-semibold text-foreground mb-2">Disclaimer</h3>
                    <p className="mb-2">
                      The data relating to real estate for sale on this website comes in part from the Internet Data Exchange program. 
                      Information is deemed reliable but not guaranteed. All measurements and all calculations of area are approximate.
                    </p>
                    <p>
                      This property is listed by Mark Spain Real Estate. Last updated: {property.dateListed}. 
                      Source: MLS #{property.mlsId}
                    </p>
                  </div>
                  
                  {/* Simple Listing Agent - One Line */}
                  <div className="text-xs text-muted-foreground border-t pt-4">
                    Naomi Richardson | <a href="tel:919-398-8357" className="hover:underline">919-398-8357</a> | <a href="mailto:naomi@markspain.com" className="hover:underline">naomi@markspain.com</a> | Mark Spain Real Estate
                  </div>
                </div>

                {/* Right sidebar - desktop only */}
                <div className="hidden lg:block space-y-6">
                  {/* CTA buttons */}
                  <div className="space-y-3">
                    <Button className="w-full" size="lg" onClick={() => setIsContactFormOpen(true)}>Request a Tour</Button>
                    <Button variant="outline" className="w-full" size="lg" onClick={() => setIsContactFormOpen(true)}>Get Pre-Approved</Button>
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
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Days on Site</span>
                        <span className="font-semibold">{property.daysOnSite}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Property Type</span>
                        <span className="font-semibold">{property.propertyType}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Property Sub Type</span>
                        <span className="font-semibold">{property.subType}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Price per Sq Ft</span>
                        <span className="font-semibold">${property.pricePerSqFt}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Date Listed</span>
                        <span className="font-semibold">{property.dateListed}</span>
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
        
        {/* Sticky Bottom CTA Bar */}
        {showStickyButtons && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-lg animate-in slide-in-from-bottom">
            <div className="max-w-7xl mx-auto flex gap-3">
              <Button 
                className="flex-1" 
                size="lg"
                onClick={() => setIsContactFormOpen(true)}
              >
                Request a Tour
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                size="lg"
                onClick={() => setIsContactFormOpen(true)}
              >
                Get Pre-Approved
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="gap-2"
                asChild
              >
                <a href="tel:919-249-8536">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call Now</span>
                </a>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Contact Form Dialog */}
    <Dialog open={isContactFormOpen} onOpenChange={setIsContactFormOpen}>
      <DialogContent className="max-w-2xl">
        <DialogTitle className="sr-only">Contact Agent - {property.address}</DialogTitle>
        <DialogDescription className="sr-only">
          Fill out the form to express interest in {property.address} or request more information from the listing agent.
        </DialogDescription>
        <div className="relative">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                  Interested in {property.address}
                </h2>
                <p className="text-sm opacity-90">{property.city}, {property.state} {property.zip}?</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>First Name</Label>
              <Input placeholder="First Name" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input placeholder="Last Name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Email" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" placeholder="Phone" />
            </div>
            <div>
              <Label>Comments</Label>
              <Textarea 
                placeholder={`Hi, I am interested in ${property.address}, ${property.city} NC, ${property.zip}`}
                rows={4}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By proceeding, you consent to receive calls, texts and voicemails at the number you provided (may be recorded and may be autodialed and use prerecorded and artificial voices), and email, from Florida Home Finder about your inquiry and other home-related matters. Msg/data rates may apply. This consent applies even if you are on a do not call list and is not a condition of any purchase.
            </p>
            <Button className="w-full" size="lg">
              Contact Agent
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
