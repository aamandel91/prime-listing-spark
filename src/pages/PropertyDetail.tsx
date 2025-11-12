import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useTrafficSource } from "@/hooks/useTrafficSource";
import RegistrationModal from "@/components/auth/RegistrationModal";
import OpenHouseSignIn from "@/components/properties/OpenHouseSignIn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useRepliersListing } from "@/hooks/useRepliers";
import { useTourRequest } from "@/hooks/useTourRequest";
import { PropertyEstimate } from "@/components/properties/PropertyEstimate";
import { PropertyNavigation } from "@/components/properties/PropertyNavigation";
import { PropertyBadges } from "@/components/properties/PropertyBadges";
import { CommunityListings } from "@/components/properties/CommunityListings";
import { RelatedPages } from "@/components/properties/RelatedPages";
import { PropertyPrevNext } from "@/components/properties/PropertyPrevNext";
import { SimilarProperties } from "@/components/properties/SimilarProperties";
import { PhotoGalleryModal } from "@/components/properties/PhotoGalleryModal";
import { PropertyHistory } from "@/components/properties/PropertyHistory";
import { MarketStatistics } from "@/components/properties/MarketStatistics";
import { NeighborhoodFollow } from "@/components/properties/NeighborhoodFollow";
import { EnhancedTimePicker } from "@/components/properties/EnhancedTimePicker";
import PropertyMap from "@/components/map/PropertyMap";
import { NearbyPlaces } from "@/components/properties/NearbyPlaces";
import { parsePropertyUrl, extractMlsFromOldUrl, generatePropertyUrl } from "@/lib/propertyUrl";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  Search,
  Phone,
  Share2,
  Heart,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Home,
  Clock,
  DollarSign,
  Building,
  Ruler,
  MessageSquare,
  Send,
  ChevronRight as ChevronRightIcon,
  Video,
  Loader2,
  FileText,
  Eye,
  Mountain,
  Waves,
  Check,
  X as XIcon,
} from "lucide-react";

export default function PropertyDetail() {
  const { id, propertySlug } = useParams();
  const location = useLocation();
  const isOpenHouse = location.pathname.endsWith('/openhouse');
  
  // Parse the URL to get property identifier
  let propertyId = id;
  if (!id && propertySlug) {
    // Normalize and extract trailing MLS segment: supports "...-MLS123456" or "...-123456"
    const cleanedSlug = propertySlug.replace(/^\/|\/$/g, '');
    const endMatch = cleanedSlug.match(/(?:^|-)(?:MLS)?([A-Z0-9]{6,})$/i);
    if (endMatch) {
      propertyId = endMatch[1];
    } else {
      // If no MLS found in URL, this is likely an invalid property URL for MLS lookup
      propertyId = "";
    }
  } else if (!id && !propertySlug) {
    // Try old URL format
    propertyId = extractMlsFromOldUrl(location.pathname) || "";
  }
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const [listingPrice, setListingPrice] = useState("0");
  const [downPayment, setDownPayment] = useState("0");
  const [interestRate, setInterestRate] = useState("5.75");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [propertyNoindex, setPropertyNoindex] = useState(false);
  const [forceRegistration, setForceRegistration] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [enhancement, setEnhancement] = useState<any>(null);
  const [selectedTiming, setSelectedTiming] = useState<string>("select");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: ''
  });
  
  // Fetch property from Repliers API
  const { listing, loading, error } = useRepliersListing(propertyId || "");
  const { submitTourRequest } = useTourRequest();
  const { isPPC, loading: trafficLoading } = useTrafficSource();

  // Track property view
  useEffect(() => {
    if (listing && user) {
      const trackView = async () => {
        await supabase.from('property_views').insert({
          property_mls: listing.mlsNumber,
          user_id: user.id,
          source_url: window.location.href
        });
      };
      trackView();
    }
  }, [listing, user]);

  // Check if property is saved
  useEffect(() => {
    if (listing && user) {
      const checkSaved = async () => {
        const { data } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('property_id', listing.mlsNumber)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsFavorite(!!data);
      };
      checkSaved();
    }
  }, [listing, user]);

  // Initialize mortgage calculator values and calculate automatically
  useEffect(() => {
    if (listing) {
      setListingPrice(listing.listPrice?.toString() || "0");
      setDownPayment((listing.listPrice * 0.2).toString() || "0");
    }
  }, [listing]);

  // Auto-calculate mortgage when values change
  useEffect(() => {
    if (listingPrice && downPayment && interestRate && listing) {
      const principal = parseFloat(listingPrice) - parseFloat(downPayment);
      const rate = parseFloat(interestRate) / 100 / 12;
      const payments = 30 * 12;
      
      const monthlyPrincipalInterest = principal * (rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1);
      const annualTaxAmount = listing.taxes?.annualAmount || 0;
      const monthlyTax = (annualTaxAmount || (parseFloat(listingPrice) * 0.01)) / 12;
      const monthlyHOA = listing.condominium?.fees?.maintenance || 0;
      const monthlyInsurance = Math.round((parseFloat(listingPrice) * 0.005) / 12);
      
      const total = monthlyPrincipalInterest + monthlyTax + monthlyHOA + monthlyInsurance;
      setMonthlyPayment(total);
    }
  }, [listingPrice, downPayment, interestRate, listing]);

  // Check if user is authenticated
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Check listing enhancement
  useEffect(() => {
    if (listing) {
      const checkEnhancement = async () => {
        const { data } = await supabase
          .from('listing_enhancements')
          .select('*')
          .eq('property_mls', listing.mlsNumber)
          .maybeSingle();
        
        setEnhancement(data);
      };
      checkEnhancement();
    }
  }, [listing]);

  if (loading || trafficLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    // Avoid infinite redirect loop - check if we're already on a 404-like path
    if (location.pathname === '/404' || location.pathname.includes('404')) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/listings">
            <Button>Browse All Listings</Button>
          </Link>
        </div>
      );
    }
    return <Navigate to="/404" replace />;
  }

  // Transform Repliers data to local format
  const property = {
    mlsId: listing.mlsNumber,
    address: listing.address?.streetNumber && listing.address?.streetName 
      ? `${listing.address.streetNumber} ${listing.address.streetName}${listing.address.streetSuffix ? ' ' + listing.address.streetSuffix : ''}`
      : listing.address?.fullAddress || "Address not available",
    city: listing.address?.city || "",
    state: listing.address?.state || "",
    zip: listing.address?.zip || "",
    price: listing.listPrice || 0,
    pricePerSqFt: listing.details?.sqft ? Math.round(listing.listPrice / Number(listing.details.sqft)) : 0,
    beds: listing.details?.numBedrooms || 0,
    baths: listing.details?.numBathrooms || 0,
    sqft: Number(listing.details?.sqft) || 0,
    acres: listing.lot?.squareFeet ? (listing.lot.squareFeet / 43560).toFixed(2) : listing.lot?.acres?.toFixed(2) || "0",
    yearBuilt: listing.details?.yearBuilt || "",
    status: listing.lastStatus || "Active",
    daysOnSite: listing.daysOnMarket || 0,
    subdivision: listing.address?.neighborhood || "Neighborhood",
    images: listing.images || [],
    title: `${listing.address?.streetNumber || ''} ${listing.address?.streetName || ''}`,
    description: listing.details?.description || "",
    interior: {},
    exterior: {},
    hoa: {
      fee: listing.condominium?.fees?.maintenance || 0,
      frequency: listing.condominium?.fees?.frequency || "Monthly"
    },
    taxAssessedValue: listing.taxes?.annualAmount || 0,
    annualTaxAmount: listing.taxes?.annualAmount || 0,
    virtualTourUrl: null
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSave = async () => {
    if (!user) {
      // Show login modal or redirect
      return;
    }

    if (isFavorite) {
      await supabase
        .from('saved_properties')
        .delete()
        .eq('property_id', property.mlsId)
        .eq('user_id', user.id);
      setIsFavorite(false);
    } else {
      await supabase.from('saved_properties').insert({
        property_id: property.mlsId,
        user_id: user.id
      });
      setIsFavorite(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.title,
        text: `Check out this property: ${property.address}`,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleHide = async () => {
    if (!user) return;
    
    await supabase.from('hidden_properties').insert({
      property_id: property.mlsId,
      user_id: user.id
    });
  };

  // Generate next 7 days for tour scheduling
  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        day: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  const tourDates = getNextSevenDays();

  // SEO meta data
  const pageTitle = enhancement?.custom_title || 
    `${property.address}, ${property.city}, ${property.state} ${property.zip} | For Sale ${formatPrice(property.price)}`;
  const pageDescription = enhancement?.custom_description || 
    `View photos and details for ${property.address}, ${property.city}, ${property.state} ${property.zip}. This ${property.beds} bed, ${property.baths} bath, ${property.sqft.toLocaleString()} sqft home is for sale at ${formatPrice(property.price)}.`;
  const pageUrl = `${window.location.origin}${generatePropertyUrl({
    address: property.address,
    city: property.city,
    state: property.state,
    zip: property.zip,
    mlsNumber: property.mlsId
  })}`;

  // Structured data for SEO
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    "name": property.title,
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
      "latitude": listing.map?.latitude,
      "longitude": listing.map?.longitude
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.sqft,
      "unitCode": "FTK"
    },
    "numberOfRooms": property.beds,
    "numberOfBathroomsTotal": property.baths,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": pageUrl
    },
    "image": property.images,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "1"
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Number of Bedrooms",
        "value": property.beds
      },
      {
        "@type": "PropertyValue",
        "name": "Number of Bathrooms",
        "value": property.baths
      },
      {
        "@type": "PropertyValue",
        "name": "Floor Size",
        "value": property.sqft,
        "unitCode": "FTK"
      },
      {
        "@type": "PropertyValue",
        "name": "Year Built",
        "value": property.yearBuilt
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <RegistrationModal 
        open={showRegistrationModal}
        onClose={() => {
          // Redirect to listings if they close without registering
          if (!user) {
            window.location.href = '/listings';
          }
        }}
        onSuccess={() => setShowRegistrationModal(false)}
      />

      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        
        {/* Conditionally add noindex/nofollow for enhanced listings or based on SEO settings */}
        {(enhancement || propertyNoindex) && (
          <meta name="robots" content="noindex, nofollow" />
        )}
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={property.images[0]} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={property.images[0]} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(propertySchema)}
        </script>
      </Helmet>
      
      <Navbar />
      
      {/* Photo Gallery Modal */}
      <PhotoGalleryModal
        images={property.images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentImageIndex}
      />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <BreadcrumbSEO 
          items={[
            { label: property.city, href: `/${property.city.toLowerCase().replace(/\s+/g, '-')}` },
            { label: property.address, href: pageUrl }
          ]} 
        />
      </div>
      
      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[70vh]">
          {/* Main large image - takes up 2 columns */}
          <div className="md:col-span-2 relative rounded-lg overflow-hidden cursor-pointer group" onClick={() => setIsGalleryOpen(true)}>
            <img
              src={property.images[0]}
              alt={`${property.title} - Main view`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
              }}
            />
            {/* For Sale Badge */}
            <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-destructive"></div>
              <span className="font-semibold text-sm">For sale</span>
            </div>
            
            {/* View All Photos Button */}
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-background/95 backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryOpen(true);
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View all {property.images.length} photos
              </Button>
            </div>
          </div>
          
          {/* Grid of smaller images */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {property.images.slice(1, 5).map((image, index) => (
              <div 
                key={index} 
                className="relative rounded-lg overflow-hidden cursor-pointer group h-full"
                onClick={() => {
                  setCurrentImageIndex(index + 1);
                  setIsGalleryOpen(true);
                }}
              >
                <img
                  src={image}
                  alt={`${property.title} - View ${index + 2}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Property Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Badges */}
          {listing.details?.waterfront && (
            <PropertyBadges 
              isWaterfront={listing.details.waterfront}
            />
          )}

          {/* Back to Search & Prev/Next Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Search
            </Button>
            
            <PropertyPrevNext />
          </div>

          {/* Virtual Tour Button - Removed as virtualTourUrl doesn't exist */}

          {/* Navigation Tabs */}
          <PropertyNavigation onNavigate={(section) => {
            const element = document.getElementById(section);
            element?.scrollIntoView({ behavior: 'smooth' });
          }} />

          {/* Price and Basic Info */}
          <div>
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">{formatPrice(property.price)}</h1>
              <span className="text-xl text-muted-foreground">${property.pricePerSqFt}/sqft</span>
            </div>
            
            {monthlyPayment !== null && (
              <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-sm text-muted-foreground mb-1">Est. Monthly Payment</div>
                <div className="text-2xl font-bold text-primary">{formatPrice(monthlyPayment)}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground mt-1">Includes principal, interest, taxes, HOA & insurance</p>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-lg mb-4">
              <div className="flex items-center gap-1">
                <Bed className="w-5 h-5" />
                <span className="font-semibold">{property.beds}</span> beds
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-5 h-5" />
                <span className="font-semibold">{property.baths}</span> baths
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-5 h-5" />
                <span className="font-semibold">{property.sqft.toLocaleString()}</span> sqft
              </div>
            </div>
            
            <div className="flex items-start gap-2 text-lg">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">{property.address}</p>
                <p className="text-muted-foreground">{property.city}, {property.state} {property.zip}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleSave}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleHide}
            >
              <XIcon className="w-4 h-4 mr-2" />
              Hide
            </Button>
          </div>

          <Separator />

          {/* Property Estimate */}
          <PropertyEstimate 
            listPrice={property.price}
            estimatedValue={listing.avm?.value || listing.estimate?.value}
            pricePerSqft={property.pricePerSqFt}
            confidence={listing.avm?.confidence ? 
              (listing.avm.confidence > 0.8 ? "high" : listing.avm.confidence > 0.5 ? "medium" : "low") : 
              undefined
            }
            lastUpdated={listing.avm?.date || listing.estimate?.date}
          />

          <Separator />

          {/* Property History - Placeholder for future integration */}
          {/* Note: Property history data would need to be sourced from Repliers API or another data source */}

          {/* Market Statistics */}
          <MarketStatistics 
            neighborhood={property.subdivision || undefined}
            city={property.city}
            state={property.state}
            propertyType={listing.details?.propertyType}
            className="mt-6"
          />

          <Separator />

          {/* Neighborhood Follow */}
          <NeighborhoodFollow 
            neighborhood={property.subdivision || property.city}
            city={property.city}
            state={property.state}
            className="mt-6"
          />

          <Separator />

          {/* Enhanced Listing Documents */}
          {enhancement?.documents && enhancement.documents.length > 0 && (
            <>
              <Card className="border-0 shadow-none bg-card">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Property Documents</h3>
                  <div className="space-y-2">
                    {enhancement.documents.map((doc: any, index: number) => (
                      <Card key={index} className="border hover:border-primary transition-colors cursor-pointer">
                        <div className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div>
                              <h3 className="font-semibold">{doc.title}</h3>
                              <p className="text-xs text-muted-foreground">{doc.type || 'PDF Document'}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            View
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </Card>
              <Separator />
            </>
          )}

          {/* Home Details Section */}
          <Card className="border-0 shadow-none bg-card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Home Details for {property.address}</h3>
              <p className="text-sm font-medium mb-4">{property.address}, {property.city}, {property.state} {property.zip}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold">{property.status}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">MLS #ID</span>
                  <span className="font-semibold">{property.mlsId}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-semibold">{formatPrice(property.price)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Bedrooms</span>
                  <span className="font-semibold">{property.beds}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Bathrooms</span>
                  <span className="font-semibold">{property.baths}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Square Footage</span>
                  <span className="font-semibold">{property.sqft.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Acres</span>
                  <span className="font-semibold">{property.acres}</span>
                </div>
                <div className="flex justify-between items-center border-b border-dotted pb-2">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-semibold">{property.yearBuilt}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-muted-foreground">Days on Site</span>
                  <span className="font-semibold">{property.daysOnSite}</span>
                </div>
              </div>
            </div>
          </Card>

          <Separator />

          {/* Community Information */}
          <Collapsible defaultOpen={true}>
            <CollapsibleTrigger className="w-full">
              <Card className="border-0 shadow-none bg-card">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-left flex items-center justify-between hover:text-primary transition-colors">
                    Community Information for {property.address}
                    <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                  </h3>
                </div>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="border-0 shadow-none bg-card">
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-dotted pb-2">
                      <span className="text-muted-foreground">Address</span>
                      <span className="font-semibold">{property.address}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dotted pb-2">
                      <span className="text-muted-foreground">City</span>
                      <Link to={`/listings?city=${encodeURIComponent(property.city)}`} className="font-semibold text-primary hover:underline">
                        {property.city}
                      </Link>
                    </div>
                    <div className="flex justify-between items-center border-b border-dotted pb-2">
                      <span className="text-muted-foreground">State</span>
                      <span className="font-semibold">{property.state}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-dotted pb-2">
                      <span className="text-muted-foreground">Zip Code</span>
                      <Link to={`/listings?zip=${property.zip}`} className="font-semibold text-primary hover:underline">
                        {property.zip}
                      </Link>
                    </div>
                    <div className="flex justify-between items-center border-b border-dotted pb-2">
                      <span className="text-muted-foreground">Subdivision/Community</span>
                      <span className="font-semibold">{property.subdivision}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Interior Features */}
          {listing.details && (
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                  Interior Features of {property.address}
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                  {listing.details.airConditioning && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Air Conditioning</p>
                      <p className="font-medium">{listing.details.airConditioning}</p>
                    </div>
                  )}
                  {listing.details.heating && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Heating</p>
                      <p className="font-medium">{listing.details.heating}</p>
                    </div>
                  )}
                  {listing.details.flooringType && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Flooring</p>
                      <p className="font-medium">{listing.details.flooringType}</p>
                    </div>
                  )}
                  {listing.details.basement && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Basement</p>
                      <p className="font-medium">{listing.details.basement}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {listing.details && <Separator />}

          {/* Exterior Features */}
          {listing.details && (
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                  Exterior Features of {property.address}
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                  {listing.details.exteriorConstruction1 && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Exterior Construction</p>
                      <p className="font-medium">{listing.details.exteriorConstruction1}</p>
                    </div>
                  )}
                  {listing.details.roofMaterial && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Roof Material</p>
                      <p className="font-medium">{listing.details.roofMaterial}</p>
                    </div>
                  )}
                  {listing.details.foundationType && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Foundation</p>
                      <p className="font-medium">{listing.details.foundationType}</p>
                    </div>
                  )}
                  {listing.details.patio && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Patio</p>
                      <p className="font-medium">{listing.details.patio}</p>
                    </div>
                  )}
                  {listing.details.pool && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Pool</p>
                      <p className="font-medium">Yes</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {property.exterior && Object.keys(property.exterior).length > 0 && <Separator />}

          {/* HOA Information */}
          {property.hoa && (
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="w-full">
                <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                  HOA Information for {property.address}
                  <ChevronDown className="h-5 w-5 transition-transform duration-200" />
                </h2>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-4 pb-4">
                  {property.hoa.fee && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">HOA Fee</p>
                      <p className="font-medium">${property.hoa.fee}/month</p>
                    </div>
                  )}
                  {property.hoa.frequency && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Frequency</p>
                      <p className="font-medium">{property.hoa.frequency}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {property.hoa && <Separator />}

          {/* Additional Information */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                Additional Information for {property.address}
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              </h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                {property.taxAssessedValue && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tax Assessed Value</p>
                    <p className="font-medium">{formatPrice(property.taxAssessedValue)}</p>
                  </div>
                )}
                {property.annualTaxAmount && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Annual Tax Amount</p>
                    <p className="font-medium">{formatPrice(property.annualTaxAmount)}</p>
                  </div>
                )}
                {listing.details?.propertyType && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Property Type</p>
                    <p className="font-medium">{listing.details.propertyType}</p>
                  </div>
                )}
                {listing.details?.sqft && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Building Size</p>
                    <p className="font-medium">{Number(listing.details.sqft).toLocaleString()} sq ft</p>
                  </div>
                )}
                {listing.lot?.squareFeet && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="font-medium">{listing.lot.squareFeet.toLocaleString()} sq ft</p>
                  </div>
                )}
                {listing.details?.yearBuilt && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Year Built</p>
                    <p className="font-medium">{listing.details.yearBuilt}</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Location & Map */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Location of {property.address}, {property.city}, {property.state} {property.zip}</h2>
            <div className="rounded-lg overflow-hidden border h-[400px]">
              <PropertyMap 
                properties={[{
                  id: listing.mlsNumber,
                  title: property.title,
                  price: property.price,
                  address: property.address,
                  city: property.city,
                  state: property.state,
                  beds: property.beds,
                  baths: property.baths,
                  sqft: property.sqft,
                  lat: listing.map?.latitude,
                  lng: listing.map?.longitude,
                  image: property.images[0]
                }]}
                center={listing.map?.latitude && listing.map?.longitude ? {
                  lat: listing.map.latitude,
                  lng: listing.map.longitude
                } : undefined}
                zoom={15}
              />
            </div>
          </div>

          <Separator />

          {/* Mortgage Calculator */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                Mortgage Calculator for {property.address}
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              </h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Listing Price</label>
                      <Input 
                        type="number" 
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Down Payment</label>
                      <Input 
                        type="number" 
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Interest Rate</label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Amortization</label>
                      <Input type="text" value="30 Years" readOnly />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Association Fees (Monthly)</label>
                      <Input 
                        type="number" 
                        value={listing?.condominium?.fees?.maintenance || 0}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Insurance (Monthly)</label>
                      <Input 
                        type="number" 
                        value={Math.round((parseFloat(listingPrice || "0") * 0.005) / 12)}
                        readOnly
                      />
                      <p className="text-xs text-muted-foreground mt-1">Estimated at 0.5% annually</p>
                    </div>
                    
                    {monthlyPayment !== null && (
                      <div className="bg-primary/10 p-4 rounded-lg mt-4">
                        <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Payment</div>
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(monthlyPayment)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Includes principal, interest, taxes, HOA, and insurance
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Property Description with Links */}
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>
              This beautiful {property.beds} beds {property.baths} baths home is located at <span className="font-semibold text-foreground">{property.address}, {property.city}, {property.state} {property.zip}</span> and is listed for sale at {formatPrice(property.price)}. This home was built in {property.yearBuilt}, contains {property.sqft.toLocaleString()} square feet of living space, and sits on a {property.acres} acre lot. This residential home is priced at ${property.pricePerSqFt} per square foot.
            </p>
            <p className="mt-4">
              If you would like to request a tour or more information on <span className="font-semibold text-foreground">{property.address}, {property.city}, {property.state} {property.zip}</span>, please call us at{" "}
              <a href="tel:919-249-8536" className="text-primary font-semibold hover:underline">919-249-8536</a> so that we can assist you in your real estate search. To find homes like {property.address}, {property.city}, {property.state} {property.zip}, you can search{" "}
              <Link to={`/${property.city.toLowerCase()}`} className="text-primary font-semibold hover:underline">homes for sale in {property.city}</Link>, or visit the neighborhood of{" "}
              <Link to={`/${property.city.toLowerCase()}/${property.subdivision.toLowerCase().replace(/\s+/g, '-')}`} className="text-primary font-semibold hover:underline">{property.subdivision}</Link>, or by{" "}
              <Link to={`/zip/${property.zip}`} className="text-primary font-semibold hover:underline">{property.zip}</Link>. We are here to help when you are ready to{" "}
              <button onClick={() => setIsContactDialogOpen(true)} className="text-primary font-semibold hover:underline">contact us</button>!
            </p>
          </div>

          <Separator />

          {/* Schools Near Section */}
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="w-full">
              <h2 className="text-2xl font-bold mb-4 text-left flex items-center justify-between hover:text-primary transition-colors">
                Schools Near {property.address}, {property.city}, {property.state} {property.zip}
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              </h2>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="border bg-card">
                <div className="p-6">
                  <p className="text-sm mb-4">Schools in <span className="font-semibold">{property.address}</span></p>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-primary/10 rounded-lg flex flex-col items-center justify-center border-2 border-primary">
                          <div className="text-xs font-semibold">RATING</div>
                          <div className="text-lg font-bold">Above</div>
                          <div className="text-lg font-bold">Avg</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Elementary School</h4>
                        <p className="text-sm text-muted-foreground mb-2">School information would appear here</p>
                        <p className="text-sm text-muted-foreground">Public district, K-5</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-primary/10 rounded-lg flex flex-col items-center justify-center border-2 border-primary">
                          <div className="text-xs font-semibold">RATING</div>
                          <div className="text-lg font-bold">Above</div>
                          <div className="text-lg font-bold">Avg</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">Middle School</h4>
                        <p className="text-sm text-muted-foreground mb-2">School information would appear here</p>
                        <p className="text-sm text-muted-foreground">Public district, 6-8</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <Separator />


          {/* Similar Properties & Comparables */}
          {listing && <SimilarProperties currentProperty={listing} className="mt-6" />}
          
          <Separator />

          {/* Nearby Places */}
          {listing?.map?.latitude && listing?.map?.longitude && (
            <NearbyPlaces 
              latitude={listing.map.latitude}
              longitude={listing.map.longitude}
              className="mt-6" 
            />
          )}
          
          <Separator />

          {/* Community Listings */}
          <CommunityListings 
            city={property.city}
            state={property.state}
            currentMlsNumber={property.mlsId}
            className="mt-6"
          />
          
          <Separator />

          {/* Related Pages */}
          <RelatedPages 
            city={property.city}
            state={property.state}
            className="mt-6"
          />
        </div>

        {/* Right Column - Contact Card (Sticky) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card className="border-2">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-6">Contact Agent</h3>
                
                {/* Request Showing Button */}
                <Button 
                  className="w-full h-14 text-lg mb-2"
                  size="lg"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  Request showing
                </Button>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Tour for free, no strings attached
                </p>

                {/* OR Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-lg font-semibold text-muted-foreground">OR</span>
                  </div>
                </div>

                {/* Start an Offer Button */}
                <Button 
                  variant="outline" 
                  className="w-full h-14 text-lg mb-2 border-2"
                  size="lg"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  Start an offer
                </Button>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  Make a winning offer with the help of a local agent
                </p>

                {/* Get Pre-approved Link */}
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-primary text-lg font-semibold"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    Get pre-approved
                  </Button>
                </div>
              </div>
            </Card>

            <Separator className="my-6" />

            {/* Open Houses & Schedule Tour Section */}
            <Card className="border-2">
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-6">Open houses</h2>
                
                {/* No Open Houses Message */}
                <div className="flex items-start gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
                  <p className="text-lg text-muted-foreground">No upcoming open houses</p>
                </div>

                {/* Schedule Tour */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">Schedule a tour today</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Tour with us and one of our agents will be there to answer all your questions.
                  </p>

                  {/* Tour Type Selection - Large Buttons */}
                  <div className="space-y-3">
                    <button 
                      className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                        tourType === "in-person" ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTourType("in-person")}
                    >
                      <Home className={`w-6 h-6 ${tourType === "in-person" ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Tour in person</span>
                    </button>
                    
                    <button 
                      className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                        tourType === "video" ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setTourType("video")}
                    >
                      <Video className={`w-6 h-6 ${tourType === "video" ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="font-semibold">Tour via video chat</span>
                    </button>
                  </div>

                  {/* Tour Date Selection */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Select a date</label>
                    <div className="grid grid-cols-3 gap-2">
                      {tourDates.slice(0, 6).map((date) => (
                        <Button
                          key={date.fullDate}
                          variant={selectedDate === date.fullDate ? "default" : "outline"}
                          className="flex flex-col h-auto py-3"
                          onClick={() => setSelectedDate(date.fullDate)}
                        >
                          <span className="text-xs">{date.dayOfWeek}</span>
                          <span className="text-lg font-bold">{date.day}</span>
                          <span className="text-xs">{date.month}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Button */}
                  <Button 
                    className="w-full h-14 text-lg"
                    size="lg"
                    onClick={() => setIsContactDialogOpen(true)}
                    disabled={!selectedDate}
                  >
                    Schedule a tour
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative h-48 -mx-6 -mt-6">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 flex items-end justify-center pb-4">
                <DialogTitle className="text-white text-center text-lg">
                  Interested in {property.address}, {property.city} {property.state}, {property.zip}?
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Name</label>
              <Input 
                placeholder="First Name" 
                value={contactForm.firstName}
                onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Last Name</label>
              <Input 
                placeholder="Last Name" 
                value={contactForm.lastName}
                onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input 
                type="email"
                placeholder="Email" 
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Phone</label>
              <Input 
                type="tel"
                placeholder="Phone" 
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-3 block">When would you like to view this property?</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  type="button"
                  variant={selectedTiming === "asap" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setSelectedTiming("asap")}
                >
                  <Check className={`w-4 h-4 mr-2 ${selectedTiming === "asap" ? "" : "opacity-0"}`} />
                  ASAP
                </Button>
                <Button
                  type="button"
                  variant={selectedTiming === "this-week" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setSelectedTiming("this-week")}
                >
                  <Check className={`w-4 h-4 mr-2 ${selectedTiming === "this-week" ? "" : "opacity-0"}`} />
                  This Week
                </Button>
                <Button
                  type="button"
                  variant={selectedTiming === "next-week" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setSelectedTiming("next-week")}
                >
                  <Check className={`w-4 h-4 mr-2 ${selectedTiming === "next-week" ? "" : "opacity-0"}`} />
                  Next Week
                </Button>
                <Button
                  type="button"
                  variant={selectedTiming === "select" ? "default" : "outline"}
                  className="h-10"
                  onClick={() => setSelectedTiming("select")}
                >
                  <Check className={`w-4 h-4 mr-2 ${selectedTiming === "select" ? "" : "opacity-0"}`} />
                  Select Day
                </Button>
              </div>
              
              {/* Enhanced Time Picker */}
              {selectedDate && (
                <EnhancedTimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                  label="Preferred Time"
                  className="mt-4"
                />
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comments</label>
              <Textarea 
                placeholder="Comments" 
                value={contactForm.comments}
                onChange={(e) => setContactForm({...contactForm, comments: e.target.value})}
                rows={4}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By proceeding, you consent to receive calls, texts and voicemails at the number you provided (may be recorded and may be autodialed and use prerecorded and artificial voices), and email, from Florida Home Finder about your inquiry and other home-related matters. Msg/data rates may apply. This consent applies even if you are on a do not call list and is not a condition of any purchase.
            </p>
            <Button 
              className="w-full" 
              onClick={async () => {
                if (!contactForm.firstName || !contactForm.lastName || !contactForm.email) {
                  return;
                }
                
                // If we have a selected date, submit as tour request
                if (selectedDate) {
                  await submitTourRequest({
                    property_mls: property.mlsId,
                    property_address: `${property.address}, ${property.city}, ${property.state} ${property.zip}`,
                    visitor_name: `${contactForm.firstName} ${contactForm.lastName}`,
                    visitor_email: contactForm.email,
                    visitor_phone: contactForm.phone,
                    tour_date: selectedDate,
                    tour_type: tourType,
                    comments: contactForm.comments,
                  });
                }
                
                setIsContactDialogOpen(false);
              }}
            >
              {selectedDate ? 'Schedule Tour' : 'Contact Agent'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button 
              className="flex-1 h-12 text-base font-semibold" 
              size="lg"
              onClick={() => setIsContactDialogOpen(true)}
            >
              Request a Tour
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-12 text-base font-semibold" 
              size="lg"
              onClick={() => setIsContactDialogOpen(true)}
            >
              Ask a Question
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
