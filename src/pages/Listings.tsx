import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyMap from "@/components/map/PropertyMap";
import { PropertyDetailModal } from "@/components/properties/PropertyDetailModal";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnifiedSearchBar from "@/components/search/UnifiedSearchBar";
import { AdvancedSearchDialog } from "@/components/search/AdvancedSearchDialog";
import { useFollowUpBoss } from "@/hooks/useFollowUpBoss";
import { useRepliersListings } from "@/hooks/useRepliers";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: siteSettings } = useSiteSettings();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const { trackPropertySearch } = useFollowUpBoss();
  
  // Filter states - Initialize from URL params
  const [location, setLocation] = useState(searchParams.get("location") || searchParams.get("city") || "");
  const [debouncedLocation, setDebouncedLocation] = useState(location);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minBeds, setMinBeds] = useState(searchParams.get("beds") || "");
  const [minBaths, setMinBaths] = useState(searchParams.get("baths") || "");
  const [minGarage, setMinGarage] = useState(searchParams.get("garage") || "any");
  const [minParking, setMinParking] = useState(searchParams.get("parking") || "any");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  
  // More filters states
  const [propertyTypes, setPropertyTypes] = useState<string[]>(() => {
    const typeParam = searchParams.get("type");
    return typeParam ? [typeParam] : [];
  });
  const [minSqft, setMinSqft] = useState(searchParams.get("minSqft") || "");
  const [maxSqft, setMaxSqft] = useState(searchParams.get("maxSqft") || "");
  const [minYear, setMinYear] = useState(searchParams.get("minYearBuilt") || "");
  const [maxYear, setMaxYear] = useState(searchParams.get("maxYearBuilt") || "");
  const [features, setFeatures] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "TX");
  
  // Map status from URL to API format (Active/Pending -> A/U)
  const mapStatusToApi = (status: string | null): string => {
    if (!status) return "A";
    const normalized = status.toLowerCase();
    if (normalized === "active" || normalized === "a") return "A";
    if (normalized === "pending" || normalized === "under contract" || normalized === "u") return "U";
    return "A"; // default to Active
  };
  
  const [listingStatus, setListingStatus] = useState(() => 
    mapStatusToApi(searchParams.get("status"))
  );

  // Map status to Repliers standardStatus values
  const mapStatusToStandard = (status: string | null): string => {
    if (!status) return "Active";
    const normalized = status.toLowerCase();
    if (normalized === "active" || normalized === "a") return "Active";
    if (normalized === "pending" || normalized === "under contract" || normalized === "u") return "Pending";
    return "Active";
  };

  // Map friendly type to API acceptable values across MLS variations
  const mapTypeToSynonyms = (type: string): string[] => {
    const t = type.toLowerCase();
    if (t.includes("single")) return ["House/Single Family", "Single Family Residence", "Single Family"];
    if (t.includes("condo") || t.includes("apartment")) return ["Apartment/Condo", "Condominium", "Condo"];
    if (t.includes("town")) return ["Townhouse", "Townhome"];
    if (t.includes("multi")) return ["Multi Family", "Multi-Family", "Duplex", "Triplex", "Fourplex", "2-4 Unit", "5+ Unit"];
    if (t.includes("acre")) return ["House With Acreage"];
    return [type];
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);

  // Normalize URL parameters on mount
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let changed = false;
    
    // Normalize status parameter (Active/Pending -> A/U)
    const urlStatus = searchParams.get("status");
    if (urlStatus && urlStatus !== "A" && urlStatus !== "U") {
      const normalized = mapStatusToApi(urlStatus);
      newParams.set("status", normalized);
      changed = true;
    }
    
    // Normalize location to city parameter
    const locationParam = searchParams.get("location");
    if (locationParam && !searchParams.get("city")) {
      newParams.delete("location");
      newParams.set("city", locationParam);
      changed = true;
    }
    
    // Ensure state parameter exists
    if (!searchParams.get("state")) {
      newParams.set("state", "TX");
      changed = true;
    }
    
    if (changed) {
      setSearchParams(newParams, { replace: true });
    }
  }, []);
  
  // Fetch properties from Repliers API with pagination support
  const [page, setPage] = useState(1);
  const pageSize = 100;
  
  const { listings: apiListings, loading, error, totalCount, hasMore } = useRepliersListings({
    city: debouncedLocation || undefined,
    state: selectedState || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    bedrooms: minBeds && minBeds !== "any" ? parseInt(minBeds) : undefined,
    bathrooms: minBaths && minBaths !== "any" ? parseInt(minBaths) : undefined,
    minGarageSpaces: minGarage && minGarage !== "any" ? parseInt(minGarage) : undefined,
    minParkingSpaces: minParking && minParking !== "any" ? parseInt(minParking) : undefined,
    propertyTypeOrStyle: propertyTypes.length === 1 ? mapTypeToSynonyms(propertyTypes[0]) : undefined,
    minSqft: minSqft ? parseInt(minSqft) : undefined,
    maxSqft: maxSqft ? parseInt(maxSqft) : undefined,
    minYearBuilt: minYear ? parseInt(minYear) : undefined,
    maxYearBuilt: maxYear ? parseInt(maxYear) : undefined,
    standardStatus: mapStatusToStandard(listingStatus),
    minLotSizeSqft: searchParams.get("minLotSizeSqft") ? parseInt(searchParams.get("minLotSizeSqft")!) : undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedLocation, selectedState, minPrice, maxPrice, minBeds, minBaths, minGarage, minParking, propertyTypes, minSqft, maxSqft, minYear, maxYear, listingStatus]);

  // Transform API data to match our component format
  const allProperties = useMemo(() => {
    if (!apiListings || !Array.isArray(apiListings)) return [];
    
    const officeIds = siteSettings?.officeIds || [];
    
    return apiListings.map((listing: any) => {
      // Build full address
      const addressParts = [
        listing.address?.streetNumber,
        listing.address?.streetName,
        listing.address?.streetSuffix
      ].filter(Boolean).join(' ');

      const listingOfficeId = listing.office?.id || listing.officeId || "";
      const isHotProperty = officeIds.length > 0 && officeIds.includes(listingOfficeId);

      return {
        id: listing.mlsNumber || Math.random().toString(),
        title: addressParts || "Property",
        price: listing.listPrice || 0,
        avm: listing.estimate ? Math.round((listing.estimate.high + listing.estimate.low) / 2) : (listing.avm?.value || 0),
        beds: listing.details?.numBedrooms || 0,
        baths: listing.details?.numBathrooms || 0,
        sqft: parseInt(listing.details?.sqft || "0"),
        image: listing.images?.[0] 
          ? `https://api.repliers.io/images/${listing.images[0]}`
          : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        address: addressParts,
        city: listing.address?.city || "",
        state: listing.address?.state || "",
        zipCode: listing.address?.zip || "",
        mlsNumber: listing.mlsNumber || "",
        status: listing.openHouse && listing.openHouse.length > 0 ? "open-house" as const : null,
        type: (listing.details?.propertyType || "homes").toLowerCase(),
        yearBuilt: parseInt(listing.details?.yearBuilt || "2020"),
        hasPool: listing.details?.swimmingPool && listing.details.swimmingPool !== "None",
        isWaterfront: listing.details?.waterfront === "Yes",
        description: listing.details?.description || "",
        lat: listing.map?.latitude || 0,
        lng: listing.map?.longitude || 0,
        officeId: listingOfficeId,
        isHotProperty,
      };
    });
  }, [apiListings, siteSettings]);

  // Update URL params with current filters
  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (selectedState) params.set("state", selectedState);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minBeds && minBeds !== "any") params.set("beds", minBeds);
    if (minBaths && minBaths !== "any") params.set("baths", minBaths);
    if (minGarage && minGarage !== "any") params.set("garage", minGarage);
    if (minParking && minParking !== "any") params.set("parking", minParking);
    if (propertyTypes.length === 1) params.set("type", propertyTypes[0]);
    if (minSqft) params.set("minSqft", minSqft);
    if (maxSqft) params.set("maxSqft", maxSqft);
    if (minYear) params.set("minYearBuilt", minYear);
    if (maxYear) params.set("maxYearBuilt", maxYear);
    if (listingStatus) params.set("status", listingStatus);
    if (sortBy && sortBy !== "newest") params.set("sort", sortBy);
    setSearchParams(params);
  };

  // Handle search button click
  const handleSearch = () => {
    updateSearchParams();
    
    // Track property search in Follow Up Boss
    trackPropertySearch({
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      beds: minBeds && minBeds !== "any" ? parseInt(minBeds) : undefined,
      baths: minBaths && minBaths !== "any" ? parseInt(minBaths) : undefined,
      city: selectedCity || location,
      state: selectedState || "TX",
      subdivision: searchParams.get("subdivision") || undefined,
      county: searchParams.get("county") || undefined,
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("any");
    setMinBaths("any");
    setMinGarage("any");
    setMinParking("any");
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

    // First, separate hot properties from regular properties
    const hotProperties = filtered.filter(p => p.isHotProperty);
    const regularProperties = filtered.filter(p => !p.isHotProperty);

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
    if (minPrice && minPrice !== "0") {
      const min = parseInt(minPrice);
      filtered = filtered.filter(p => p.price >= min);
    }
    if (maxPrice && maxPrice !== "0") {
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

    // Apply all other filters to both groups
    const applyFilters = (properties: typeof filtered) => {
      let result = [...properties];

      // Filter by location (city or address)
      if (location) {
        const searchTerm = location.toLowerCase();
        result = result.filter(
          p =>
            p.city.toLowerCase().includes(searchTerm) ||
            p.address.toLowerCase().includes(searchTerm) ||
            p.state.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by selected city from dropdown
      if (selectedCity && selectedCity !== "all") {
        result = result.filter(p => p.city.toLowerCase() === selectedCity.toLowerCase());
      }

      // Filter by price range
      if (minPrice && minPrice !== "0") {
        const min = parseInt(minPrice);
        result = result.filter(p => p.price >= min);
      }
      if (maxPrice && maxPrice !== "0") {
        const max = parseInt(maxPrice);
        result = result.filter(p => p.price <= max);
      }

      // Filter by minimum beds
      if (minBeds && minBeds !== "any") {
        const beds = parseInt(minBeds);
        result = result.filter(p => p.beds >= beds);
      }

      // Filter by minimum baths
      if (minBaths && minBaths !== "any") {
        const baths = parseInt(minBaths);
        result = result.filter(p => p.baths >= baths);
      }

      // Filter by property types
      if (propertyTypes.length > 0) {
        result = result.filter(p => propertyTypes.includes(p.type));
      }

      // Filter by square footage
      if (minSqft) {
        result = result.filter(p => p.sqft >= parseInt(minSqft));
      }
      if (maxSqft) {
        result = result.filter(p => p.sqft <= parseInt(maxSqft));
      }

      // Filter by year built
      if (minYear) {
        result = result.filter(p => p.yearBuilt >= parseInt(minYear));
      }
      if (maxYear) {
        result = result.filter(p => p.yearBuilt <= parseInt(maxYear));
      }

      // Filter by features
      if (features.includes("pool")) {
        result = result.filter(p => p.hasPool);
      }
      if (features.includes("waterfront")) {
        result = result.filter(p => p.isWaterfront);
      }
      if (features.includes("open-house")) {
        result = result.filter(p => p.status === "open-house");
      }

      return result;
    };

    const filteredHot = applyFilters(hotProperties);
    const filteredRegular = applyFilters(regularProperties);

    // Sort each group independently
    const sortProperties = (properties: typeof filtered) => {
      const sorted = [...properties];
      switch (sortBy) {
        case "price-low":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "beds":
          sorted.sort((a, b) => b.beds - a.beds);
          break;
        case "sqft":
          sorted.sort((a, b) => b.sqft - a.sqft);
          break;
        case "newest":
        default:
          sorted.sort((a, b) => (b.yearBuilt || 0) - (a.yearBuilt || 0));
          break;
      }
      return sorted;
    };

    // Combine: hot properties first, then regular properties
    return [...sortProperties(filteredHot), ...sortProperties(filteredRegular)];
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
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <UnifiedSearchBar variant="inline" />
              </div>
              
              <AdvancedSearchDialog
                open={isFiltersOpen}
                onOpenChange={setIsFiltersOpen}
                listingStatus={listingStatus}
                onStatusChange={setListingStatus}
                minBeds={minBeds}
                onMinBedsChange={setMinBeds}
                minBaths={minBaths}
                onMinBathsChange={setMinBaths}
                minGarage={minGarage}
                onMinGarageChange={setMinGarage}
                minParking={minParking}
                onMinParkingChange={setMinParking}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onApply={handleSearch}
                onClear={clearFilters}
              />
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
                    <PropertyCard 
                      key={property.id} 
                      {...property} 
                      onOpenModal={setSelectedPropertyId}
                    />
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
                <div className="flex flex-col items-center gap-4 mt-8">
                  <p className="text-sm text-muted-foreground">
                    Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalCount)} of {totalCount} properties
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1 || loading}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(5, Math.ceil(totalCount / pageSize)) }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        onClick={() => setPage(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    <Button 
                      variant="outline"
                      onClick={() => setPage(p => p + 1)}
                      disabled={!hasMore || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Property Detail Modal */}
      {selectedPropertyId && (
        <PropertyDetailModal
          isOpen={!!selectedPropertyId}
          onClose={() => setSelectedPropertyId(null)}
          propertyId={selectedPropertyId}
        />
      )}

      <Footer />
    </div>
  );
};

export default Listings;