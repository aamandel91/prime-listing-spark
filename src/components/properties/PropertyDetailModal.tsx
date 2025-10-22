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
  const [showStickyButtons, setShowStickyButtons] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Mock similar properties
  const similarProperties = [
    {
      id: "sim-1",
      title: "510 Edwalton Way",
      address: "510 Edwalton Way",
      city: property.city,
      state: property.state,
      zipCode: property.zip,
      price: 389999,
      beds: 4,
      baths: 2.5,
      sqft: 2300,
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      mlsNumber: "LP752129"
    },
    {
      id: "sim-2",
      title: "520 Edwalton Way",
      address: "520 Edwalton Way",
      city: property.city,
      state: property.state,
      zipCode: property.zip,
      price: 369999,
      beds: 5,
      baths: 3,
      sqft: 2400,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      mlsNumber: "LP752130"
    },
    {
      id: "sim-3",
      title: "530 Edwalton Way",
      address: "530 Edwalton Way",
      city: property.city,
      state: property.state,
      zipCode: property.zip,
      price: 395999,
      beds: 5,
      baths: 3.5,
      sqft: 2600,
      image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80",
      mlsNumber: "LP752131"
    },
    {
      id: "sim-4",
      title: "540 Edwalton Way",
      address: "540 Edwalton Way",
      city: property.city,
      state: property.state,
      zipCode: property.zip,
      price: 375999,
      beds: 4,
      baths: 2.5,
      sqft: 2250,
      image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=800&q=80",
      mlsNumber: "LP752132"
    }
  ];

  // Mock neighborhood listings
  const neighborhoodListings = [
    { address: "515 Edwalton Way LOT 80", city: property.city, zip: property.zip },
    { address: "525 Edwalton Way LOT 83", city: property.city, zip: property.zip },
    { address: "535 Edwalton Way LOT 84", city: property.city, zip: property.zip },
    { address: "545 Edwalton Way LOT 85", city: property.city, zip: property.zip },
    { address: "555 Edwalton Way LOT 86", city: property.city, zip: property.zip },
    { address: "565 Edwalton Way LOT 87", city: property.city, zip: property.zip },
    { address: "575 Edwalton Way LOT 88", city: property.city, zip: property.zip },
    { address: "585 Edwalton Way LOT 89", city: property.city, zip: property.zip },
    { address: "595 Edwalton Way LOT 90", city: property.city, zip: property.zip },
    { address: "605 Edwalton Way LOT 91", city: property.city, zip: property.zip },
  ];

  // Mock blogs - filter by city name
  const allBlogs = [
    {
      id: 1,
      title: "Best Neighborhoods in Fayetteville for Growing Families",
      excerpt: "Discover why Fayetteville is becoming one of North Carolina's most desirable places to raise a family.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      date: "March 15, 2024",
      category: "Community",
    },
    {
      id: 2,
      title: "Fayetteville Real Estate Market Update 2024",
      excerpt: "Stay ahead of the curve with our comprehensive analysis of Fayetteville's current market conditions.",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80",
      date: "March 12, 2024",
      category: "Market Insights",
    },
    {
      id: 3,
      title: "Top 10 Things to Do in Fayetteville, NC",
      excerpt: "Moving to Fayetteville? Here are the best attractions and activities in the area.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      date: "March 8, 2024",
      category: "Community",
    },
  ];

  // Filter blogs by city name
  const cityBlogs = allBlogs.filter(blog => 
    blog.title.toLowerCase().includes(property.city.toLowerCase())
  );

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
        <link rel="canonical" href={`${window.location.origin}/property/${propertyId}`} />
        
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
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Elementary</span>
                          <span className="font-semibold text-right">{property.elementarySchool}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Middle</span>
                          <span className="font-semibold text-right">{property.middleSchool}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">High</span>
                          <span className="font-semibold text-right">{property.highSchool}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Utilities */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Utilities</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Sewer</span>
                          <span className="font-semibold">Septic Tank</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Water Source</span>
                          <span className="font-semibold">Well</span>
                        </div>
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
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Heating</span>
                          <span className="font-semibold">Heat Pump</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Cooling</span>
                          <span className="font-semibold">Electric</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Fireplace</span>
                          <span className="font-semibold">No</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                   {/* Exterior */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Exterior</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Roof</span>
                          <span className="font-semibold">Shingle</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Foundation</span>
                          <span className="font-semibold">Combination</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                   {/* HOA */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">HOA</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Has HOA</span>
                          <span className="font-semibold">None</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                   {/* Additional Information */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                    <Card className="p-6">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Styles</span>
                          <span className="font-semibold">Ranch</span>
                        </div>
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
                    <p>Naomi Richardson, 919-398-8357, Mark Spain Real Estate</p>
                    <p className="mt-2"><strong>Source</strong></p>
                    <p>Triangle, MLS, MLS#: {property.mlsId}</p>
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
                        <Button className="w-full" size="lg">Calculate</Button>
                        <Separator />
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
                          <div className="text-3xl font-bold text-primary">
                            {formatPrice(
                              Math.round(
                                (property.price * 0.8 * 0.065) / 12 + // Principal & Interest
                                property.taxAmount / 12 + // Taxes
                                (property.hoaFee || 0) + // HOA (if any)
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

                  {/* Enhanced Schools Section */}
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Schools Near {property.address}</h2>
                    <div className="space-y-4">
                      <Card className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                              <div className="text-sm font-semibold text-primary">RATING</div>
                              <div className="text-xs text-muted-foreground mt-1">Above</div>
                              <div className="text-xs text-muted-foreground">Avg</div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{property.elementarySchool}</h3>
                            <p className="text-sm text-muted-foreground mb-2">526 Andrews Road, {property.city} NC {property.zip}</p>
                            <p className="text-sm text-muted-foreground">Public district, K-5 | 600 students</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                              <div className="text-sm font-semibold text-primary">RATING</div>
                              <div className="text-xs text-muted-foreground mt-1">Above</div>
                              <div className="text-xs text-muted-foreground">Avg</div>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2">{property.middleSchool}</h3>
                            <p className="text-sm text-muted-foreground mb-2">3200 Ramsey Street, {property.city} NC 28301</p>
                            <p className="text-sm text-muted-foreground">Public district, 6-8 | 226 students</p>
                          </div>
                        </div>
                      </Card>
                    </div>
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
              By proceeding, you consent to receive calls, texts and voicemails at the number you provided (may be recorded and may be autodialed and use prerecorded and artificial voices), and email, from Raleigh Realty about your inquiry and other home-related matters. Msg/data rates may apply. This consent applies even if you are on a do not call list and is not a condition of any purchase.
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
