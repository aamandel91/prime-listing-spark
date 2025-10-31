import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { useRepliersListing } from "@/hooks/useRepliers";
import {
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  
  // Fetch property from Repliers API
  const { listing, loading, error } = useRepliersListing(id || "");
  
  const [contactForm, setContactForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comments: `Hi, I am interested in ${id ? `property ${id}` : "this property"}`,
  });

  // Generate next 7 days for tour scheduling
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

  // Transform API listing to component format
  const property = listing ? {
    id: listing.mlsNumber || id || "1",
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
    sqft: parseInt(listing.details?.sqft || "0"),
    acres: listing.lot?.acres || 0,
    lotSize: listing.lot?.squareFeet || 0,
    lotFeatures: listing.lot?.features || "",
    legalDescription: listing.lot?.legalDescription || "",
    yearBuilt: parseInt(listing.details?.yearBuilt || "2024"),
    daysOnSite: listing.daysOnMarket || 0,
    listDate: listing.listDate || "",
    propertyType: listing.details?.propertyType || "Residential",
    propertyClass: listing.class || "",
    subType: listing.details?.style || "Single Family",
    pricePerSqFt: listing.details?.sqft ? Math.round(listing.listPrice / parseInt(listing.details.sqft)) : 0,
    dateListed: listing.listDate ? new Date(listing.listDate).toLocaleDateString() : "Recently",
    status: listing.standardStatus || listing.lastStatus || "Active",
    description: listing.details?.description || "Beautiful property available for sale.",
    // Interior features from details
    interiorFeatures: [
      listing.details?.airConditioning && `Air Conditioning: ${listing.details.airConditioning}`,
      listing.details?.heating && `Heating: ${listing.details.heating}`,
      listing.details?.flooringType && `Flooring: ${listing.details.flooringType}`,
      listing.details?.extras && `Appliances: ${listing.details.extras}`,
    ].filter(Boolean),
    // Exterior features
    exteriorFeatures: [
      listing.details?.exteriorConstruction1 && `Construction: ${listing.details.exteriorConstruction1}`,
      listing.details?.roofMaterial && `Roof: ${listing.details.roofMaterial}`,
      listing.details?.foundationType && `Foundation: ${listing.details.foundationType}`,
      listing.details?.patio && `Outdoor: ${listing.details.patio}`,
      listing.details?.sewer && `Sewer: ${listing.details.sewer}`,
    ].filter(Boolean),
    // HOA/Community features
    hoaFeatures: [
      listing.condominium?.fees?.maintenance && `HOA Fee: $${listing.condominium.fees.maintenance}/mo`,
      listing.condominium?.condoCorp && `Association: ${listing.condominium.condoCorp}`,
      listing.condominium?.parkingType && `Parking: ${listing.condominium.parkingType}`,
      listing.nearby?.amenities && `Amenities: ${listing.nearby.amenities.join(', ')}`,
    ].filter(Boolean),
    // Additional info
    additionalInfo: [
      listing.details?.numGarageSpaces && `Garage Spaces: ${listing.details.numGarageSpaces}`,
      listing.details?.numParkingSpaces && `Parking Spaces: ${listing.details.numParkingSpaces}`,
      listing.taxes?.annualAmount && `Annual Taxes: $${listing.taxes.annualAmount}`,
      listing.taxes?.assessmentYear && `Tax Year: ${listing.taxes.assessmentYear}`,
    ].filter(Boolean),
    // Rooms array
    rooms: listing.rooms || [],
    // Agent info
    listingAgent: {
      name: listing.agents?.[0]?.name || "Contact Agent",
      phone: listing.agents?.[0]?.phones?.[0] || "",
      email: listing.agents?.[0]?.email || "",
      company: listing.agents?.[0]?.brokerage?.name || listing.office?.brokerageName || "",
    },
    // AVM data
    avm: listing.avm ? {
      value: listing.avm.value,
      high: listing.avm.high,
      low: listing.avm.low,
    } : null,
    source: listing.mlsNumber ? `MLS#: ${listing.mlsNumber}` : "",
    images: listing.images && listing.images.length > 0 
      ? listing.images.map((img: string) => `https://api.repliers.io/images/${img}`)
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"],
  } : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find the property you're looking for.
          </p>
          <Link to="/listings">
            <Button>Browse All Listings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
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

  // SEO Content
  const pageTitle = `${property.address}, ${property.city}, ${property.state} ${property.zip} | ${formatPrice(property.price)}`;
  const pageDescription = `${property.beds} bed, ${property.baths} bath ${property.subType} for sale at ${formatPrice(property.price)}. ${property.sqft.toLocaleString()} sqft on ${property.acres} acres in ${property.subdivision}. MLS# ${property.mlsId}. ${property.description.substring(0, 100)}...`;
  const pageUrl = `${window.location.origin}/property/${id}`;

  // Structured data for Product/RealEstateProperty
  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.address,
    "description": property.description,
    "image": property.images,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": pageUrl
    },
    "brand": {
      "@type": "Organization",
      "name": property.listingAgent.company
    },
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
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
        
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
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <BreadcrumbSEO 
          items={[
            { label: property.city, href: `/${property.city.toLowerCase().replace(/\s+/g, '-')}` },
            { label: property.address, href: `/property/${id}` }
          ]} 
        />
      </div>
      
      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[70vh]">
          {/* Main large image - takes up 2 columns */}
          <div className="md:col-span-2 relative rounded-lg overflow-hidden cursor-pointer group" onClick={() => setCurrentImageIndex(0)}>
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
            
            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button size="icon" variant="secondary" className="rounded-lg bg-background/95 backdrop-blur-sm hover:bg-background">
                <Search className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-lg bg-background/95 backdrop-blur-sm hover:bg-background">
                <Phone className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-lg bg-background/95 backdrop-blur-sm hover:bg-background" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="rounded-lg bg-background/95 backdrop-blur-sm hover:bg-background"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>
          
          {/* Right side grid - 2x2 */}
          <div className="hidden md:grid grid-rows-2 gap-2">
            {/* Top two images */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square" onClick={() => setCurrentImageIndex(1)}>
                <img
                  src={property.images[1] || property.images[0]}
                  alt={`${property.title} - View 2`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square" onClick={() => setCurrentImageIndex(2)}>
                <img
                  src={property.images[2] || property.images[0]}
                  alt={`${property.title} - View 3`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </div>
            
            {/* Bottom two images */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square" onClick={() => setCurrentImageIndex(3)}>
                <img
                  src={property.images[3] || property.images[0]}
                  alt={`${property.title} - View 4`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
              <div className="relative rounded-lg overflow-hidden cursor-pointer group aspect-square">
                <img
                  src={property.images[4] || property.images[1] || property.images[0]}
                  alt={`${property.title} - View 5`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = property.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {/* See all photos button overlay */}
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                  onClick={() => setCurrentImageIndex(0)}
                >
                  <div className="bg-background rounded-lg px-4 py-2 flex items-center gap-2">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-foreground rounded-sm"></div>
                    </div>
                    <span className="font-semibold text-sm">See all {property.images.length} photos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back Button - Mobile */}
        <div className="md:hidden fixed top-4 left-4 z-10">
          <Link to="/listings">
            <Button size="icon" variant="secondary" className="rounded-full bg-background/95 backdrop-blur-sm hover:bg-background">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        
        {/* Property Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.address}</h1>
          <p className="text-lg text-muted-foreground mb-4">
            {property.city}, {property.state} {property.zip}
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-3xl md:text-4xl font-bold">{formatPrice(property.price)}</div>
            {property.originalPrice && property.originalPrice !== property.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(property.originalPrice)}
              </span>
            )}
            <Badge className="bg-success/20 text-success hover:bg-success/30 border-0 px-3 py-1">
              {property.status.toUpperCase()}
            </Badge>
          </div>

          {/* Key Stats Pills */}
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

        {/* Mortgage Prequalification CTA */}
        <div className="flex items-center justify-center gap-2 py-3 text-lg">
          <span className="text-muted-foreground">Est. {formatPrice(2482)}/mo</span>
          <span className="text-muted-foreground">-</span>
          <button 
            onClick={() => setIsContactDialogOpen(true)}
            className="text-primary font-semibold hover:underline"
          >
            Get prequalified
          </button>
          <button className="text-muted-foreground hover:text-foreground">
            ⓘ
          </button>
        </div>

        <Separator />

        {/* Additional Property Info Grid */}
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
            <Home className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Property Type</div>
              <div className="font-semibold">{property.propertyType}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Sub Type</div>
              <div className="font-semibold">{property.subType}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Per Square Foot</div>
              <div className="font-semibold">${property.pricePerSqFt}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Date Listed</div>
              <div className="font-semibold">{property.dateListed}</div>
            </div>
          </div>
          {property.lotSize > 0 && (
            <div className="flex items-start gap-3">
              <Ruler className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Lot Size</div>
                <div className="font-semibold">{property.lotSize.toLocaleString()} sq ft</div>
              </div>
            </div>
          )}
          {property.county && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">County</div>
                <div className="font-semibold">{property.county}</div>
              </div>
            </div>
          )}
          {property.legalDescription && (
            <div className="flex items-start gap-3 col-span-2">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Legal Description</div>
                <div className="font-semibold text-sm">{property.legalDescription}</div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Home Evaluation CTA */}
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
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  <Home className="w-5 h-5 mr-2" />
                  Home Evaluation
                </Button>
                <Button 
                  size="lg" 
                  className="h-12 px-6 bg-primary hover:bg-primary/90"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  <span className="mr-2">✓</span>
                  Guaranteed Sold*
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-right">
              *Some terms & Conditions apply. Guarantee by eXp Realty
            </p>
          </div>
        </Card>

        <Separator />

        {/* Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Description of {property.address}</h2>
          <p className="text-muted-foreground leading-relaxed">{property.description}</p>
        </div>

        <Separator />

        {/* Home Details Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Home Details</h3>
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
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Community Information for {property.address}</h3>
            
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
                <span className="text-muted-foreground">County</span>
                <Link to={`/listings?county=${encodeURIComponent(property.county)}`} className="font-semibold text-primary hover:underline">
                  {property.county}
                </Link>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-muted-foreground">Subdivision</span>
                <Link to={`/listings?subdivision=${encodeURIComponent(property.subdivision)}`} className="font-semibold text-primary hover:underline">
                  {property.subdivision}
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <Separator />

        {/* Interior Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Interior</h3>
            
            <div className="space-y-3">
              {property.interiorFeatures.map((feature, index) => (
                <div key={index} className="flex justify-between items-start border-b border-dotted pb-2">
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Separator />

        {/* Exterior Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Exterior</h3>
            
            <div className="space-y-3">
              {property.exteriorFeatures.map((feature, index) => (
                <div key={index} className="flex justify-between items-start border-b border-dotted pb-2">
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Separator />

        {/* HOA Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">HOA</h3>
            
            <div className="space-y-3">
              {property.hoaFeatures.map((feature, index) => (
                <div key={index} className="flex justify-between items-start border-b border-dotted pb-2">
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Separator />

        {/* Additional Information Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Additional Information</h3>
            
            <div className="space-y-3 mb-6">
              {property.additionalInfo.map((info, index) => (
                <div key={index} className="flex justify-between items-start border-b border-dotted pb-2">
                  <span className="text-sm">{info}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4 className="font-semibold mb-2">Listed By</h4>
                <p className="text-sm text-muted-foreground">
                  {property.listingAgent.name}
                </p>
                {property.listingAgent.phone && (
                  <p className="text-sm text-muted-foreground">
                    {property.listingAgent.phone}
                  </p>
                )}
                {property.listingAgent.company && (
                  <p className="text-sm text-muted-foreground">
                    {property.listingAgent.company}
                  </p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Source</h4>
                <p className="text-sm text-muted-foreground">{property.source}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rooms Section - if available */}
        {property.rooms && property.rooms.length > 0 && (
          <>
            <Separator />
            <Card className="border-0 shadow-none bg-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Room Details</h3>
                
                <div className="space-y-4">
                  {property.rooms.map((room, index) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <h4 className="font-semibold mb-1">{room.description}</h4>
                      {room.level && (
                        <p className="text-sm text-muted-foreground">Level: {room.level}</p>
                      )}
                      {room.features && (
                        <p className="text-sm text-muted-foreground">{room.features}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Home Value Estimate - if available */}
        {property.avm && (
          <>
            <Separator />
            <Card className="border-0 shadow-none bg-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-6">Home Value Estimate</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Estimated Value</span>
                    <span className="text-2xl font-bold">{formatPrice(property.avm.value)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">High Estimate</span>
                    <span className="font-semibold">{formatPrice(property.avm.high)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Low Estimate</span>
                    <span className="font-semibold">{formatPrice(property.avm.low)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * This is an automated valuation model estimate and should not be used as the sole basis for determining property value.
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}

        <Separator />

        {/* Thinking of Buying - Tour Scheduling CTA */}
        <Card className="border-2">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Thinking of buying?</h2>
            
            {/* Date Selection */}
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {tourDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(date.fullDate)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-lg border-2 min-w-[100px] transition-colors ${
                      selectedDate === date.fullDate
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium text-muted-foreground">{date.dayOfWeek}</div>
                    <div className={`text-3xl font-bold ${
                      selectedDate === date.fullDate ? 'text-primary' : 'text-foreground'
                    }`}>{date.day}</div>
                    <div className="text-sm font-medium text-muted-foreground">{date.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tour Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setTourType("in-person")}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  tourType === "in-person"
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Home className={`w-6 h-6 ${tourType === "in-person" ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Tour in person</span>
              </button>
              <button
                onClick={() => setTourType("video")}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                  tourType === "video"
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Video className={`w-6 h-6 ${tourType === "video" ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="font-semibold">Tour via video chat</span>
              </button>
            </div>

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

        <Separator />

        {/* Open Houses Section */}
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
                Tour with FloridaHomeFinder and one of our agents will be there to answer all your questions.
              </p>

              {/* Sample Tour Times */}
              <div className="border-2 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Home className="w-6 h-6 text-primary" />
                  <div>
                    <div className="font-semibold">Wednesday, Oct 22</div>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      <span>9am</span>
                      <span>•</span>
                      <span>10am</span>
                      <span>•</span>
                      <span>11am</span>
                      <span>•</span>
                      <button className="hover:underline">Check for more</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Button */}
              <Button 
                className="w-full h-14 text-lg"
                size="lg"
                onClick={() => setIsContactDialogOpen(true)}
              >
                Schedule a tour
              </Button>
            </div>
          </div>
        </Card>

        <Separator />

        {/* Comments Section */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6">Comments</h3>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Add a comment" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              />
              <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        <Separator />

        {/* Location Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Location of {property.address}, {property.city}, {property.state} {property.zip}</h2>
          <div className="bg-muted rounded-lg h-80 flex items-center justify-center mb-4">
            <p className="text-muted-foreground">Map would be displayed here</p>
          </div>
          <Input placeholder="Enter your location" className="mb-2" />
          <Button className="w-full">Get Directions</Button>
        </div>

        <Separator />

        {/* Streetview Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Streetview of {property.address}, {property.city}, {property.state} {property.zip}</h2>
          <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Street View would be displayed here</p>
          </div>
        </div>

        <Separator />

        {/* Mortgage Calculator */}
        <Card className="border-0 shadow-none bg-card">
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6">Mortgage Calculator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Listing Price</label>
                <Input type="number" defaultValue={property.price} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Down Payment</label>
                <Input type="number" defaultValue={property.price * 0.1} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Interest Rate</label>
                <Input type="number" step="0.01" defaultValue="5.75" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Amortization</label>
                <Input type="text" defaultValue="30 Years" readOnly />
              </div>
              <Button className="w-full">Calculate</Button>
            </div>
          </div>
        </Card>

        <Separator />

        {/* Property Description with Links */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>
            This beautiful 5 beds 3 baths home is located at <span className="font-semibold text-foreground">{property.address}, {property.city}, {property.state} {property.zip}</span> and is listed for sale at {formatPrice(property.price)}. This home was built in {property.yearBuilt}, contains {property.sqft.toLocaleString()} square feet of living space, and sits on a {property.acres} acre lot. This residential home is priced at ${property.pricePerSqFt} per square foot.
          </p>
          <p className="mt-4">
            If you'd like to request a tour or more information on <span className="font-semibold text-foreground">{property.address}, {property.city}, {property.state} {property.zip}</span>, please call us at{" "}
            <a href="tel:919-249-8536" className="text-primary font-semibold hover:underline">919-249-8536</a> so that we can assist you in your real estate search. To find homes like {property.address}, {property.city}, {property.state} {property.zip}, you can search{" "}
            <Link to={`/${property.city.toLowerCase()}`} className="text-primary font-semibold hover:underline">homes for sale in {property.city}</Link>, or visit the neighborhood of{" "}
            <Link to={`/${property.city.toLowerCase()}/${property.subdivision.toLowerCase().replace(/\s+/g, '-')}`} className="text-primary font-semibold hover:underline">{property.subdivision}</Link>, or by{" "}
            <Link to={`/zip/${property.zip}`} className="text-primary font-semibold hover:underline">{property.zip}</Link>. We are here to help when you're ready to{" "}
            <button onClick={() => setIsContactDialogOpen(true)} className="text-primary font-semibold hover:underline">contact us</button>!
          </p>
        </div>

        <Separator />

        {/* Schools Near Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Schools Near {property.address}, {property.city}, {property.state} {property.zip}</h2>
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
                    <h4 className="font-bold text-lg mb-1">Howard L Hall Elementary</h4>
                    <p className="text-sm text-muted-foreground mb-2">526 Andrews Road, Fayetteville NC 28311</p>
                    <p className="text-sm text-muted-foreground">Public district, K-5 | 600 students</p>
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
                    <h4 className="font-bold text-lg mb-1">Reid Ross Classical Middle School</h4>
                    <p className="text-sm text-muted-foreground mb-2">3200 Ramsey Street, Fayetteville NC 28301</p>
                    <p className="text-sm text-muted-foreground">Public district, 6-8 | 226 students</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Separator />

        {/* Similar Properties Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Homes Similar to {property.address}, {property.city}, {property.state} {property.zip}</h2>
          
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                <Badge className="absolute top-2 left-2 bg-primary z-10">New - Just Now</Badge>
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" 
                  alt="Similar property"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold">$349,999</span>
                  <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">Active</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
                  <div>
                    <div className="font-bold">4</div>
                    <div className="text-muted-foreground">Beds</div>
                  </div>
                  <div>
                    <div className="font-bold">3</div>
                    <div className="text-muted-foreground">Baths</div>
                  </div>
                  <div>
                    <div className="font-bold">2469</div>
                    <div className="text-muted-foreground">Sqft</div>
                  </div>
                  <div>
                    <div className="font-bold">0.27</div>
                    <div className="text-muted-foreground">Acres</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">501 Edwalton Way LOT 83, Fayetteville, NC 28311</p>
                <p className="text-xs text-muted-foreground">MLS#: LP752129</p>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative">
                <Badge className="absolute top-2 left-2 bg-primary z-10">New - Just Now</Badge>
                <img 
                  src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" 
                  alt="Similar property"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold">$379,000</span>
                  <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">Active</Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3 text-sm">
                  <div>
                    <div className="font-bold">5</div>
                    <div className="text-muted-foreground">Beds</div>
                  </div>
                  <div>
                    <div className="font-bold">3</div>
                    <div className="text-muted-foreground">Baths</div>
                  </div>
                  <div>
                    <div className="font-bold">2519</div>
                    <div className="text-muted-foreground">Sqft</div>
                  </div>
                  <div>
                    <div className="font-bold">0.29</div>
                    <div className="text-muted-foreground">Acres</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">503 Edwalton Way, Fayetteville, NC 28311</p>
                <p className="text-xs text-muted-foreground">MLS#: LP752130</p>
              </div>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Related Blogs Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Related Blogs</h2>
          
          <div className="space-y-4">
            <Link to="/blog/1">
              <Card className="overflow-hidden hover-scale group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80" 
                  alt="Blog post"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="p-4">
                  <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                    <span>Aug 21, 2025</span>
                    <span>10 min read</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">15 Best Things To Do in Fayetteville, NC</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you looking for fun things to do in Fayetteville, NC? Here are the top 15 things to do in Fayetteville! Are you thinking about making...
                  </p>
                </div>
              </Card>
            </Link>

            <Link to="/blog/2">
              <Card className="overflow-hidden hover-scale group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80" 
                  alt="Blog post"
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="p-4">
                  <div className="flex gap-2 text-xs text-muted-foreground mb-2">
                    <span>Jun 26, 2025</span>
                    <span>7 min read</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Is Fayetteville, NC, a Safe Place to Live? (Crime Statistics)</h3>
                  <p className="text-sm text-muted-foreground">
                    Considering a move to Fayetteville? Learn about crime rates, safe neighborhoods, and what makes this North Carolina city a great place to call home.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        <Separator />

        {/* What's Your Home Worth Section */}
        <Card className="border-0 shadow-none bg-card/50 backdrop-blur">
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">What's your home worth?</h2>
            <p className="text-muted-foreground mb-6">Have a top local Realtor give you a FREE Comparative Market Analysis</p>
            <Input placeholder="Your Email" className="mb-3 max-w-md mx-auto" />
            <Button className="w-full max-w-md">Check Now</Button>
          </div>
        </Card>
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative h-32 -mt-6 -mx-6 mb-4">
              <img 
                src={property.images[0]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80 flex items-end justify-center pb-4">
                <DialogTitle className="text-white text-center text-lg">
                  Interested in {property.address}, {property.city} NC, {property.zip}?
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
            <Button className="w-full" onClick={() => setIsContactDialogOpen(false)}>Contact Agent</Button>
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
          <div className="flex items-center justify-center gap-2 mt-2 text-sm">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">|</span>
            <MessageSquare className="w-4 h-4 text-primary" />
            <a href="tel:919-249-8536" className="font-semibold text-primary hover:underline">
              919-249-8536
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
