import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  BedDouble,
  Bath,
  Square,
  MapPin,
  Calendar,
  Home,
  Ruler,
  Car,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - will be replaced with real data
  const property = {
    id,
    title: "Modern Luxury Villa with Pool",
    price: 1250000,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    ],
    beds: 5,
    baths: 4,
    sqft: 4500,
    lotSize: 10000,
    yearBuilt: 2020,
    parking: 3,
    address: "123 Luxury Lane",
    city: "Beverly Hills",
    state: "CA",
    zip: "90210",
    isHotProperty: true,
    status: "open-house" as const,
    description: `Experience luxury living at its finest in this stunning modern villa. This exceptional property features soaring ceilings, floor-to-ceiling windows, and an open-concept design that seamlessly blends indoor and outdoor living.

The gourmet kitchen is a chef's dream with top-of-the-line appliances, custom cabinetry, and a large island perfect for entertaining. The spacious master suite boasts a spa-like bathroom and a private balcony with breathtaking views.

Outside, enjoy the resort-style pool, outdoor kitchen, and beautifully landscaped grounds. Located in a prestigious neighborhood with award-winning schools and convenient access to shopping and dining.`,
    features: [
      "Hardwood Floors",
      "Granite Countertops",
      "Stainless Steel Appliances",
      "Walk-in Closets",
      "Central Air",
      "Smart Home System",
      "Security System",
      "Pool",
      "Spa/Hot Tub",
      "Outdoor Kitchen",
      "Home Theater",
      "Wine Cellar",
    ],
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Image Gallery */}
        <section className="relative h-[500px] bg-black">
          <img
            src={property.images[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-large transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-large transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-4 right-4 hidden md:flex gap-2 justify-center">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentImageIndex ? "border-accent scale-110" : "border-white/50"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Property Header */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.isHotProperty && (
                    <Badge className="bg-accent text-accent-foreground text-sm">
                      🔥 Hot Property
                    </Badge>
                  )}
                  {property.status === "open-house" && (
                    <Badge className="bg-success text-success-foreground text-sm">
                      Open House
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                  {property.title}
                </h1>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">
                    {property.address}, {property.city}, {property.state} {property.zip}
                  </span>
                </div>

                <div className="text-4xl font-bold text-accent mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <BedDouble className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{property.beds}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <Bath className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{property.baths}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <Square className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{property.sqft.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Sqft</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                    <Car className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-2xl font-bold">{property.parking}</div>
                      <div className="text-sm text-muted-foreground">Parking</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-8">
                  <Button className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Agent
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-primary mb-4">About This Property</h2>
                <p className="text-foreground whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </Card>

              {/* Property Details */}
              <Card className="p-6 mb-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Property Type</div>
                      <div className="font-medium">Single Family</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Year Built</div>
                      <div className="font-medium">{property.yearBuilt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Lot Size</div>
                      <div className="font-medium">{property.lotSize.toLocaleString()} sqft</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Square className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Living Area</div>
                      <div className="font-medium">{property.sqft.toLocaleString()} sqft</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Contact Sidebar */}
            <div>
              <Card className="p-6 sticky top-20">
                <h3 className="text-xl font-bold text-primary mb-4">Contact Agent</h3>
                <form className="space-y-4">
                  <div>
                    <Input placeholder="Your Name" />
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address" />
                  </div>
                  <div>
                    <Input type="tel" placeholder="Phone Number" />
                  </div>
                  <div>
                    <Textarea
                      placeholder="I'm interested in this property..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">Listed by</div>
                  <div className="font-semibold text-foreground">Premier Properties</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    MLS# {id}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
