import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Get filter parameters from URL
  const propertyType = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  
  // Sample property data
  const properties = [
    {
      id: "1",
      title: "Modern Family Home",
      price: 850000,
      beds: 4,
      baths: 3,
      sqft: 3200,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      address: "123 Palm Avenue",
      city: "Miami",
      state: "FL",
      status: null,
      description: "Beautiful modern family home featuring an open floor plan with high ceilings, gourmet kitchen with stainless steel appliances, spacious master suite with walk-in closet, and a large backyard perfect for entertaining. Located in a desirable neighborhood with excellent schools nearby."
    },
    {
      id: "2",
      title: "Luxury Waterfront Condo",
      price: 1250000,
      beds: 3,
      baths: 2.5,
      sqft: 2400,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      address: "456 Ocean Drive",
      city: "Fort Lauderdale",
      state: "FL",
      isHotProperty: true,
      status: null,
      description: "Stunning waterfront condo with breathtaking ocean views from every room. Features include floor-to-ceiling windows, modern kitchen with granite countertops, luxurious master bathroom with spa tub, private balcony, and access to world-class amenities including pool, fitness center, and concierge service."
    },
    {
      id: "3",
      title: "Charming Townhouse",
      price: 425000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      address: "789 Grove Street",
      city: "Orlando",
      state: "FL",
      status: "open-house" as const,
      description: "Charming townhouse in a gated community with three bedrooms, two full bathrooms, and updated kitchen with new appliances. Enjoy the attached two-car garage, private patio, community pool, and playground. Close to shopping, dining, and major highways."
    },
    {
      id: "4",
      title: "Spacious Ranch Home",
      price: 675000,
      beds: 5,
      baths: 3,
      sqft: 3800,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      address: "321 Sunset Blvd",
      city: "Tampa",
      state: "FL",
      status: null,
      description: "Spacious single-story ranch home on a large corner lot with mature landscaping. Five bedrooms including a master suite with sitting area, formal dining room, great room with fireplace, updated kitchen, and three-car garage. Perfect for large families or multi-generational living."
    },
    {
      id: "5",
      title: "Contemporary Villa",
      price: 2100000,
      beds: 5,
      baths: 4.5,
      sqft: 5200,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      address: "555 Bay Road",
      city: "Naples",
      state: "FL",
      isHotProperty: true,
      status: null,
      description: "Exquisite contemporary villa with stunning architecture and designer finishes throughout. Features include soaring ceilings, walls of glass, chef's kitchen with premium appliances, wine cellar, home theater, resort-style pool with spa, outdoor kitchen, and four-car garage. Located in an exclusive waterfront community."
    },
    {
      id: "6",
      title: "Cozy Cottage",
      price: 320000,
      beds: 2,
      baths: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      address: "888 Pine Street",
      city: "Sarasota",
      state: "FL",
      status: "under-contract" as const,
      description: "Adorable cottage perfect for first-time buyers or downsizing. Features include hardwood floors, updated kitchen and bathrooms, cozy living room with fireplace, covered front porch, and fenced backyard. Walking distance to parks, shops, and restaurants in the heart of Sarasota."
    }
  ];

  // Generate dynamic SEO content
  const seoContent = useMemo(() => {
    const typeMap: Record<string, string> = {
      "single-family": "Single Family Homes",
      "townhome": "Townhomes",
      "condo": "Condos",
      "acreage": "Homes on 1+ Acre",
      "luxury": "Luxury Homes",
      "multi-family": "Multi-Family Homes",
      "new-construction": "New Construction Homes"
    };

    const cityName = city ? city.replace(/%20/g, " ") : "";
    const typeName = propertyType ? typeMap[propertyType] || propertyType : "Properties";
    
    const location = cityName || "Florida";
    const title = `${typeName} for Sale in ${location} | FloridaHomeFinder.com`;
    const h1 = `${typeName} for Sale in ${location}`;
    const description = `Browse ${properties.length}+ ${typeName.toLowerCase()} for sale in ${location}. Updated every 15 minutes. Find your dream home with FloridaHomeFinder.com - Florida's #1 real estate resource.`;
    
    return { title, h1, description };
  }, [propertyType, city, properties.length]);

  // Generate JSON-LD structured data
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": properties.length,
    "itemListElement": properties.map((property, index) => ({
      "@type": "RealEstateListing",
      "position": index + 1,
      "name": property.title,
      "url": `${window.location.origin}/property/${property.id}`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": property.address,
        "addressLocality": property.city,
        "addressRegion": property.state,
        "addressCountry": "US"
      },
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "USD"
      }
    }))
  };

  // Generate breadcrumbs
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: "Listings", href: "/listings" }];
    if (propertyType) {
      const typeMap: Record<string, string> = {
        "single-family": "Single Family Homes",
        "townhome": "Townhomes",
        "condo": "Condos",
        "acreage": "1+ Acre Homes",
        "luxury": "Luxury Homes",
        "multi-family": "Multi-Family",
        "new-construction": "New Construction"
      };
      items.push({
        label: typeMap[propertyType] || propertyType,
        href: `/listings?type=${propertyType}`
      });
    }
    return items;
  }, [propertyType]);

  const MoreFiltersContent = () => (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["status", "type", "details"]} className="w-full">
          {/* Status */}
          <AccordionItem value="status">
            <AccordionTrigger className="text-base font-semibold">Status</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="active" defaultChecked />
                <Label htmlFor="active" className="text-sm font-normal cursor-pointer">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="pending" />
                <Label htmlFor="pending" className="text-sm font-normal cursor-pointer">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="coming-soon" />
                <Label htmlFor="coming-soon" className="text-sm font-normal cursor-pointer">Coming Soon</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property Type */}
          <AccordionItem value="type">
            <AccordionTrigger className="text-base font-semibold">Property Type</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="homes" defaultChecked />
                <Label htmlFor="homes" className="text-sm font-normal cursor-pointer">Homes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="townhomes" />
                <Label htmlFor="townhomes" className="text-sm font-normal cursor-pointer">Townhomes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="condos" />
                <Label htmlFor="condos" className="text-sm font-normal cursor-pointer">Condos/Apartments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="land" />
                <Label htmlFor="land" className="text-sm font-normal cursor-pointer">Lot/Land</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="multi-family" />
                <Label htmlFor="multi-family" className="text-sm font-normal cursor-pointer">Multi-Family</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="manufactured" />
                <Label htmlFor="manufactured" className="text-sm font-normal cursor-pointer">Manufactured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="farm" />
                <Label htmlFor="farm" className="text-sm font-normal cursor-pointer">Farm</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Property Details */}
          <AccordionItem value="details">
            <AccordionTrigger className="text-base font-semibold">Property Details</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label className="text-sm">Square Feet</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-sm">Lot Size (Acres)</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="0.25">0.25+</SelectItem>
                    <SelectItem value="0.5">0.5+</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Year Built</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-sm">Garage Spaces</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              <div>
                <Label className="text-sm">Days on Site</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Features */}
          <AccordionItem value="features">
            <AccordionTrigger className="text-base font-semibold">Property Features</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="hoa" />
                <Label htmlFor="hoa" className="text-sm font-normal cursor-pointer">HOA Fee</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="senior" />
                <Label htmlFor="senior" className="text-sm font-normal cursor-pointer">Senior Community</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ranch" />
                <Label htmlFor="ranch" className="text-sm font-normal cursor-pointer">Ranch Home</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="new-construction" />
                <Label htmlFor="new-construction" className="text-sm font-normal cursor-pointer">New Construction</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="basement" />
                <Label htmlFor="basement" className="text-sm font-normal cursor-pointer">Basement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="golf" />
                <Label htmlFor="golf" className="text-sm font-normal cursor-pointer">Golf Course</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="pool" />
                <Label htmlFor="pool" className="text-sm font-normal cursor-pointer">Pool</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="waterfront" />
                <Label htmlFor="waterfront" className="text-sm font-normal cursor-pointer">Waterfront</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="gated" />
                <Label htmlFor="gated" className="text-sm font-normal cursor-pointer">Gated Community</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="first-floor-master" />
                <Label htmlFor="first-floor-master" className="text-sm font-normal cursor-pointer">First Floor Master Bedroom</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location */}
          <AccordionItem value="location">
            <AccordionTrigger className="text-base font-semibold">Location & Schools</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <Label className="text-sm">County</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="miami-dade">Miami-Dade</SelectItem>
                    <SelectItem value="broward">Broward</SelectItem>
                    <SelectItem value="palm-beach">Palm Beach</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">City</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="miami">Miami</SelectItem>
                    <SelectItem value="fort-lauderdale">Fort Lauderdale</SelectItem>
                    <SelectItem value="orlando">Orlando</SelectItem>
                    <SelectItem value="tampa">Tampa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Elementary School</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="school1">School 1</SelectItem>
                    <SelectItem value="school2">School 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Middle School</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="school1">School 1</SelectItem>
                    <SelectItem value="school2">School 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">High School</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="school1">School 1</SelectItem>
                    <SelectItem value="school2">School 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Builders</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select builder" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="builder1">Builder 1</SelectItem>
                    <SelectItem value="builder2">Builder 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* More Features */}
          <AccordionItem value="more-features">
            <AccordionTrigger className="text-base font-semibold">Additional Features</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="open-house" />
                <Label htmlFor="open-house" className="text-sm font-normal cursor-pointer">Open House & Tour</Label>
              </div>
              <div className="space-y-1 mt-3">
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Architectural Styles
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Basement Features
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Community Features
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Construction Materials
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Exterior Features
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Foundation
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Green Energy Efficient
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Interior Features
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Levels
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Pool Features
                </Button>
                <Button variant="link" className="p-0 h-auto text-sm text-primary justify-start w-full">
                  Structure Types
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 space-y-2 sticky bottom-0 bg-background pb-4 border-t">
          <Button className="w-full" size="lg" onClick={() => setIsFiltersOpen(false)}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full">Clear All</Button>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{seoContent.title}</title>
        <meta name="description" content={seoContent.description} />
        <link rel="canonical" href={`${window.location.origin}/listings`} />
        
        <meta property="og:title" content={seoContent.title} />
        <meta property="og:description" content={seoContent.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={properties[0]?.image || ""} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoContent.title} />
        <meta name="twitter:description" content={seoContent.description} />
        <meta name="twitter:image" content={properties[0]?.image || ""} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />

      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Top Search Bar */}
        <div className="bg-background border-b border-border sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Enter City, Zip, or Address"
                  className="pl-10 h-12"
                />
              </div>
              
              <Select>
                <SelectTrigger className="md:w-40 h-12">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="0-250">$0 - $250k</SelectItem>
                  <SelectItem value="250-500">$250k - $500k</SelectItem>
                  <SelectItem value="500-750">$500k - $750k</SelectItem>
                  <SelectItem value="750-1000">$750k - $1M</SelectItem>
                  <SelectItem value="1000+">$1M+</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="md:w-32 h-12">
                  <SelectValue placeholder="Beds" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="md:w-32 h-12">
                  <SelectValue placeholder="Baths" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-12 px-6">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>More Filters</DialogTitle>
                  </DialogHeader>
                  <MoreFiltersContent />
                </DialogContent>
              </Dialog>
              
              <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Map and Results Split View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Map - Left Side (50%) */}
          <div className="hidden lg:block w-1/2 h-[calc(100vh-180px)] sticky top-[180px]">
            <PropertyMap properties={properties} />
          </div>

          {/* Results - Right Side (50%) */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="p-6">
              <BreadcrumbSEO items={breadcrumbItems} />
              
              <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{seoContent.h1}</h1>
                <p className="text-muted-foreground">{properties.length} homes</p>
              </header>

              {/* Sort */}
              <div className="mb-6 flex justify-between items-center">
                <Select defaultValue="newest">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="beds">Most Bedrooms</SelectItem>
                    <SelectItem value="sqft">Largest Sq Ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Cards - 2 Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline">Previous</Button>
                  <Button variant="default">1</Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Listings;
