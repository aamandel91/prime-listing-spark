import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, MapPin, Grid3x3, List } from "lucide-react";

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 5000000]);

  // Mock data
  const properties = [
    {
      id: "1",
      title: "Modern Luxury Villa",
      price: 1250000,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      beds: 5,
      baths: 4,
      sqft: 4500,
      address: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      isHotProperty: true,
      status: null,
    },
    {
      id: "2",
      title: "Contemporary Downtown Condo",
      price: 850000,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      beds: 3,
      baths: 2,
      sqft: 2200,
      address: "456 Urban St",
      city: "San Francisco",
      state: "CA",
      isHotProperty: true,
      status: "open-house" as const,
    },
    {
      id: "3",
      title: "Elegant Colonial Estate",
      price: 2100000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      beds: 6,
      baths: 5,
      sqft: 6200,
      address: "789 Estate Dr",
      city: "Greenwich",
      state: "CT",
      isHotProperty: false,
      status: null,
    },
    {
      id: "4",
      title: "Charming Craftsman Home",
      price: 675000,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      beds: 4,
      baths: 3,
      sqft: 2800,
      address: "321 Oak Avenue",
      city: "Portland",
      state: "OR",
      isHotProperty: false,
      status: "under-contract" as const,
    },
    {
      id: "5",
      title: "Waterfront Paradise",
      price: 3500000,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      beds: 7,
      baths: 6,
      sqft: 8500,
      address: "555 Beach Road",
      city: "Miami Beach",
      state: "FL",
      isHotProperty: true,
      status: null,
    },
    {
      id: "6",
      title: "Mountain View Retreat",
      price: 950000,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
      beds: 4,
      baths: 3,
      sqft: 3200,
      address: "888 Summit Drive",
      city: "Aspen",
      state: "CO",
      isHotProperty: false,
      status: "open-house" as const,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-secondary/30">
        {/* Search Header */}
        <section className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Search Properties</h1>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-foreground/60 w-5 h-5" />
                <Input
                  placeholder="City, Neighborhood, or ZIP"
                  className="pl-10 h-12 bg-white text-foreground border-0"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="md:w-48 h-12 bg-white text-foreground border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-family">Single Family</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhome">Townhome</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <Card className="p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-primary">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Price Range
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000000}
                      step={50000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${(priceRange[0] / 1000).toFixed(0)}K</span>
                      <span>${(priceRange[1] / 1000).toFixed(0)}K</span>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Bedrooms</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1+", "2+", "3+", "4+"].map((bed) => (
                        <Button key={bed} variant="outline" size="sm">
                          {bed}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Bathrooms</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["1+", "2+", "3+", "4+"].map((bath) => (
                        <Button key={bath} variant="outline" size="sm">
                          {bath}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Property Status */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Status</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="open-house">Open House</SelectItem>
                        <SelectItem value="under-contract">Under Contract</SelectItem>
                        <SelectItem value="hot-property">Hot Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Apply Filters
                  </Button>
                </div>
              </Card>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {properties.length} Properties Found
                  </h2>
                  <p className="text-muted-foreground">Showing all available listings</p>
                </div>

                <div className="flex items-center gap-2">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="sqft">Square Feet</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden md:flex border border-border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Property Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button variant="outline">Previous</Button>
                  <Button variant="outline" className="bg-accent text-accent-foreground">1</Button>
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
