import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data - replace with actual API call
  const property = {
    id: id || "1",
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
      "This beautiful new construction home in The Hills at Stone Gate is under construction! Featuring 5 bedrooms, 2.5 bathrooms, and a 2-car garage, this home offers modern living at its finest. The open floor plan seamlessly connects the living spaces, perfect for both everyday living and entertaining.",
    interiorFeatures: [
      { label: "Interior Features", value: "Double Vanity, Kitchen Island and Separate Shower" },
      { label: "Appliances", value: "Dishwasher, Microwave, Range and Washer/Dryer" },
      { label: "Heating", value: "Heat Pump" },
      { label: "Cooling", value: "Central Air and Electric" },
      { label: "Fireplace", value: "Yes" },
      { label: "# of Fireplaces", value: "1" },
    ],
    exteriorFeatures: [
      { label: "Exterior", value: "Rain Gutters" },
      { label: "Roof", value: "" },
      { label: "Garage Spaces", value: "2" },
      { label: "Foundation", value: "" },
    ],
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      {/* Hero Image with Overlay Controls */}
      <div className="relative h-[60vh] md:h-[70vh] bg-muted">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Top Overlay Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link to="/listings">
            <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
              <Search className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
              <Phone className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
          {currentImageIndex + 1} of {property.images.length}
        </div>

        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={prevImage}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background p-2 rounded-full transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
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
          <div className="flex items-start gap-3 col-span-2">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <div className="text-sm text-muted-foreground">Date Listed</div>
              <div className="font-semibold">{property.dateListed}</div>
            </div>
          </div>
        </div>

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
                <Link to={`/city/${property.city.toLowerCase()}`} className="font-semibold text-primary hover:underline">
                  {property.city}
                </Link>
              </div>
              <div className="flex justify-between items-center border-b border-dotted pb-2">
                <span className="text-muted-foreground">State</span>
                <span className="font-semibold">{property.state}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dotted pb-2">
                <span className="text-muted-foreground">Zip Code</span>
                <Link to={`/zip/${property.zip}`} className="font-semibold text-primary hover:underline">
                  {property.zip}
                </Link>
              </div>
              <div className="flex justify-between items-center border-b border-dotted pb-2">
                <span className="text-muted-foreground">County</span>
                <Link to={`/county/${property.county.toLowerCase()}`} className="font-semibold text-primary hover:underline">
                  {property.county}
                </Link>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-muted-foreground">Subdivision</span>
                <Link to={`/subdivision/${property.subdivision.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold text-primary hover:underline">
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
                  <span className="text-muted-foreground">{feature.label}</span>
                  <span className="font-semibold text-right max-w-[60%]">{feature.value || "—"}</span>
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
                  <span className="text-muted-foreground">{feature.label}</span>
                  <span className="font-semibold text-right max-w-[60%]">{feature.value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <Button className="flex-1 h-12 text-base font-semibold" size="lg">
              Request a Tour
            </Button>
            <Button variant="outline" className="flex-1 h-12 text-base font-semibold" size="lg">
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
