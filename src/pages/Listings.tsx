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
import BedsAndBathsFilter from "@/components/search/BedsAndBathsFilter";
import PriceFilter from "@/components/search/PriceFilter";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Filter states - Initialize from URL params
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minBeds, setMinBeds] = useState(searchParams.get("beds") || "");
  const [minBaths, setMinBaths] = useState(searchParams.get("baths") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  
  // More filters states
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [minSqft, setMinSqft] = useState("");
  const [maxSqft, setMaxSqft] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  
  // Sample property data (expanded with more properties and attributes)
  const allProperties = [
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
      type: "homes",
      yearBuilt: 2018,
      hasPool: true,
      isWaterfront: false,
      description: "Beautiful modern family home featuring an open floor plan with high ceilings, gourmet kitchen with stainless steel appliances, spacious master suite with walk-in closet, and a large backyard perfect for entertaining. Located in a desirable neighborhood with excellent schools nearby.",
      lat: 25.7617,
      lng: -80.1918
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
      type: "condos",
      yearBuilt: 2020,
      hasPool: true,
      isWaterfront: true,
      description: "Stunning waterfront condo with breathtaking ocean views from every room. Features include floor-to-ceiling windows, modern kitchen with granite countertops, luxurious master bathroom with spa tub, private balcony, and access to world-class amenities including pool, fitness center, and concierge service.",
      lat: 26.1224,
      lng: -80.1373
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
      type: "townhomes",
      yearBuilt: 2015,
      hasPool: false,
      isWaterfront: false,
      description: "Charming townhouse in a gated community with three bedrooms, two full bathrooms, and updated kitchen with new appliances. Enjoy the attached two-car garage, private patio, community pool, and playground. Close to shopping, dining, and major highways.",
      lat: 28.5383,
      lng: -81.3792
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
      type: "homes",
      yearBuilt: 2010,
      hasPool: true,
      isWaterfront: false,
      description: "Spacious single-story ranch home on a large corner lot with mature landscaping. Five bedrooms including a master suite with sitting area, formal dining room, great room with fireplace, updated kitchen, and three-car garage. Perfect for large families or multi-generational living.",
      lat: 27.9506,
      lng: -82.4572
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
      type: "homes",
      yearBuilt: 2022,
      hasPool: true,
      isWaterfront: true,
      description: "Exquisite contemporary villa with stunning architecture and designer finishes throughout. Features include soaring ceilings, walls of glass, chef's kitchen with premium appliances, wine cellar, home theater, resort-style pool with spa, outdoor kitchen, and four-car garage. Located in an exclusive waterfront community.",
      lat: 26.1420,
      lng: -81.7948
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
      type: "homes",
      yearBuilt: 2005,
      hasPool: false,
      isWaterfront: false,
      description: "Adorable cottage perfect for first-time buyers or downsizing. Features include hardwood floors, updated kitchen and bathrooms, cozy living room with fireplace, covered front porch, and fenced backyard. Walking distance to parks, shops, and restaurants in the heart of Sarasota.",
      lat: 27.3364,
      lng: -82.5307
    }
  ];

  // Update URL params with current filters
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minBeds) params.set("beds", minBeds);
    if (minBaths) params.set("baths", minBaths);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  };

  // Handle search button click
  const handleSearch = () => {
    updateSearchParams();
  };

  // Clear all filters
  const clearFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("any");
    setMinBaths("any");
    setPropertyTypes([]);
    setMinSqft("");
    setMaxSqft("");
    setMinYear("");
    setMaxYear("");
    setFeatures([]);
    setSelectedCity("all");
    setSortBy("newest");
    setSearchParams(new URLSearchParams());
  };

  // Toggle property type
  const togglePropertyType = (type: string) => {
    setPropertyTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Toggle feature
  const toggleFeature = (feature: string) => {
    setFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let filtered = [...allProperties];

    // Filter by location (city or address)
    if (location) {
      const searchTerm = location.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.city.toLowerCase().includes(searchTerm) ||
          p.address.toLowerCase().includes(searchTerm) ||
          p.state.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by selected city from dropdown
    if (selectedCity && selectedCity !== "all") {
      filtered = filtered.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by price range
    if (minPrice) {
      const min = parseInt(minPrice);
      filtered = filtered.filter(p => p.price >= min);
    }
    if (maxPrice) {
      const max = parseInt(maxPrice);
      filtered = filtered.filter(p => p.price <= max);
    }

    // Filter by minimum beds
    if (minBeds && minBeds !== "any") {
      const beds = parseInt(minBeds);
      filtered = filtered.filter(p => p.beds >= beds);
    }

    // Filter by minimum baths
    if (minBaths && minBaths !== "any") {
      const baths = parseInt(minBaths);
      filtered = filtered.filter(p => p.baths >= baths);
    }

    // Filter by property types
    if (propertyTypes.length > 0) {
      filtered = filtered.filter(p => propertyTypes.includes(p.type));
    }

    // Filter by square footage
    if (minSqft) {
      filtered = filtered.filter(p => p.sqft >= parseInt(minSqft));
    }
    if (maxSqft) {
      filtered = filtered.filter(p => p.sqft <= parseInt(maxSqft));
    }

    // Filter by year built
    if (minYear) {
      filtered = filtered.filter(p => p.yearBuilt >= parseInt(minYear));
    }
    if (maxYear) {
      filtered = filtered.filter(p => p.yearBuilt <= parseInt(maxYear));
    }

    // Filter by features
    if (features.includes("pool")) {
      filtered = filtered.filter(p => p.hasPool);
    }
    if (features.includes("waterfront")) {
      filtered = filtered.filter(p => p.isWaterfront);
    }
    if (features.includes("open-house")) {
      filtered = filtered.filter(p => p.status === "open-house");
    }

    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "beds":
        filtered.sort((a, b) => b.beds - a.beds);
        break;
      case "sqft":
        filtered.sort((a, b) => b.sqft - a.sqft);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
        break;
    }

    return filtered;
  }, [location, selectedCity, minPrice, maxPrice, minBeds, minBaths, propertyTypes, minSqft, maxSqft, minYear, maxYear, features, sortBy, allProperties]);

  // Generate dynamic SEO content
  const seoContent = useMemo(() => {
    const locationName = location || selectedCity || "Florida";
    const title = `Real Estate & Homes for Sale in ${locationName} | FloridaHomeFinder.com`;
    const h1 = `Homes for Sale in ${locationName}`;
    const description = `Browse ${filteredProperties.length} homes for sale in ${locationName}. Updated every 15 minutes. Find your dream home with FloridaHomeFinder.com - Florida's #1 real estate resource.`;
    
    return { title, h1, description };
  }, [location, selectedCity, filteredProperties.length]);

  // Generate JSON-LD structured data
  const listingSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": filteredProperties.length,
    "itemListElement": filteredProperties.map((property, index) => ({
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
    if (location) {
      items.push({
        label: location,
        href: `/listings?location=${location}`
      });
    }
    return items;
  }, [location]);

  const MoreFiltersContent = () => (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        <Accordion type="multiple" defaultValue={["type", "details"]} className="w-full">
          {/* Property Type */}
          <AccordionItem value="type">
            <AccordionTrigger className="text-base font-semibold">Property Type</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="homes"
                  checked={propertyTypes.includes("homes")}
                  onCheckedChange={() => togglePropertyType("homes")}
                />
                <Label htmlFor="homes" className="text-sm font-normal cursor-pointer">Homes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="townhomes"
                  checked={propertyTypes.includes("townhomes")}
                  onCheckedChange={() => togglePropertyType("townhomes")}
                />
                <Label htmlFor="townhomes" className="text-sm font-normal cursor-pointer">Townhomes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="condos"
                  checked={propertyTypes.includes("condos")}
                  onCheckedChange={() => togglePropertyType("condos")}
                />
                <Label htmlFor="condos" className="text-sm font-normal cursor-pointer">Condos/Apartments</Label>
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
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minSqft}
                    onChange={(e) => setMinSqft(e.target.value)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxSqft}
                    onChange={(e) => setMaxSqft(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Year Built</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Min"
                    type="number"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                  />
                  <Input
                    placeholder="Max"
                    type="number"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Features */}
          <AccordionItem value="features">
            <AccordionTrigger className="text-base font-semibold">Property Features</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pool"
                  checked={features.includes("pool")}
                  onCheckedChange={() => toggleFeature("pool")}
                />
                <Label htmlFor="pool" className="text-sm font-normal cursor-pointer">Pool</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="waterfront"
                  checked={features.includes("waterfront")}
                  onCheckedChange={() => toggleFeature("waterfront")}
                />
                <Label htmlFor="waterfront" className="text-sm font-normal cursor-pointer">Waterfront</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="open-house"
                  checked={features.includes("open-house")}
                  onCheckedChange={() => toggleFeature("open-house")}
                />
                <Label htmlFor="open-house" className="text-sm font-normal cursor-pointer">Open House & Tour</Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Location */}
          <AccordionItem value="location">
            <AccordionTrigger className="text-base font-semibold">Location</AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2">
              <div>
                <Label className="text-sm">City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="Miami">Miami</SelectItem>
                    <SelectItem value="Fort Lauderdale">Fort Lauderdale</SelectItem>
                    <SelectItem value="Orlando">Orlando</SelectItem>
                    <SelectItem value="Tampa">Tampa</SelectItem>
                    <SelectItem value="Naples">Naples</SelectItem>
                    <SelectItem value="Sarasota">Sarasota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-4 space-y-2 sticky bottom-0 bg-background pb-4 border-t">
          <Button className="w-full" size="lg" onClick={() => {
            setIsFiltersOpen(false);
            updateSearchParams();
          }}>
            Apply Filters
          </Button>
          <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All</Button>
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
        <meta property="og:image" content={filteredProperties[0]?.image || ""} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoContent.title} />
        <meta name="twitter:description" content={seoContent.description} />
        <meta name="twitter:image" content={filteredProperties[0]?.image || ""} />
      </Helmet>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />

      <Navbar />
      
      <main className="flex-1 flex flex-col">
        {/* Top Search Bar */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Enter City, Zip, or Address"
                  className="pl-10 h-12"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              
              <PriceFilter 
                minValue={minPrice} 
                maxValue={maxPrice}
                onMinChange={setMinPrice}
                onMaxChange={setMaxPrice}
              />
              
              <BedsAndBathsFilter 
                bedsValue={minBeds}
                bathsValue={minBaths}
                onBedsChange={setMinBeds}
                onBathsChange={setMinBaths}
              />

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
              
              <Button
                className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleSearch}
              >
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
            <PropertyMap properties={filteredProperties} />
          </div>

          {/* Results - Right Side (50%) */}
          <div className="w-full lg:w-1/2 overflow-y-auto">
            <div className="p-6">
              <BreadcrumbSEO items={breadcrumbItems} />
              
              <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{seoContent.h1}</h1>
                <p className="text-muted-foreground">{filteredProperties.length} homes</p>
              </header>

              {/* Sort */}
              <div className="mb-6 flex justify-between items-center">
                <Select value={sortBy} onValueChange={setSortBy}>
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
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">No properties found matching your criteria.</p>
                  <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
                </div>
              )}

              {/* Pagination */}
              {filteredProperties.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <Button variant="outline">Previous</Button>
                    <Button variant="default">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">Next</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Listings;