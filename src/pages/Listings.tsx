import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";

const Listings = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Get filter parameters from URL
  const propertyType = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  
  // Sample property data - will be replaced with real data
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
      status: null
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
      status: null
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
      status: "open-house" as const
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
      status: null
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
      status: null
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
      status: "under-contract" as const
    }
  ];

  // Generate dynamic SEO content based on filters
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

  // Generate JSON-LD structured data for the listing page
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

  // Generate breadcrumb items
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

  const FiltersSidebar = () => (
    <div className="space-y-4">
      {/* Search Location */}
      <div>
        <Label>Search Location</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="City, Zip, Address, or MLS #" className="pl-9" />
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["price", "basics", "property-details"]} className="w-full">
        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price Range</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Min Price</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No Min" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="0">No Min</SelectItem>
                    <SelectItem value="100000">$100,000</SelectItem>
                    <SelectItem value="250000">$250,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="750000">$750,000</SelectItem>
                    <SelectItem value="1000000">$1,000,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Max Price</Label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="No Max" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="250000">$250,000</SelectItem>
                    <SelectItem value="500000">$500,000</SelectItem>
                    <SelectItem value="1000000">$1,000,000</SelectItem>
                    <SelectItem value="2000000">$2,000,000</SelectItem>
                    <SelectItem value="0">No Max</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Basics */}
        <AccordionItem value="basics">
          <AccordionTrigger className="text-base font-semibold">Basics</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2">
            <div>
              <Label className="text-sm">Bedrooms</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any" />
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
            </div>
            <div>
              <Label className="text-sm">Bathrooms</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

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
        <AccordionItem value="property-details">
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

      <div className="pt-4 space-y-2">
        <Button className="w-full" size="lg">Apply Filters</Button>
        <Button variant="outline" className="w-full">Clear All</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{seoContent.title}</title>
        <meta name="description" content={seoContent.description} />
        <link rel="canonical" href={`${window.location.origin}/listings`} />
        
        {/* Open Graph tags for social sharing */}
        <meta property="og:title" content={seoContent.title} />
        <meta property="og:description" content={seoContent.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={properties[0]?.image || ""} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoContent.title} />
        <meta name="twitter:description" content={seoContent.description} />
        <meta name="twitter:image" content={properties[0]?.image || ""} />
      </Helmet>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />

      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <BreadcrumbSEO items={breadcrumbItems} />
          
          {/* Header with SEO-optimized H1 */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{seoContent.h1}</h1>
            <p className="text-muted-foreground">Showing {properties.length} properties</p>
          </header>

          <div className="flex gap-6">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-20 bg-background rounded-lg shadow-medium p-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <FiltersSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-background rounded-lg shadow-medium p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select defaultValue="newest">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="beds">Most Bedrooms</SelectItem>
                      <SelectItem value="sqft">Largest Sq Ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Property Grid/List */}
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
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
