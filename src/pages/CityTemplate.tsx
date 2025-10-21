import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Building2, School, DollarSign } from "lucide-react";

const CityTemplate = () => {
  const { citySlug } = useParams();
  
  // Mock data - will be dynamically generated
  const cityData = {
    name: "Beverly Hills",
    state: "CA",
    description: "Beverly Hills is a prestigious city known for luxury real estate, world-class shopping on Rodeo Drive, and stunning hillside properties. The community offers excellent schools, beautiful parks, and a safe, family-friendly environment.",
    stats: {
      medianPrice: "$2,500,000",
      activeListings: 234,
      avgDaysOnMarket: 45,
      schools: "9.5/10",
    },
    neighborhoods: [
      { name: "Trousdale Estates", slug: "trousdale-estates", avgPrice: "$4.2M" },
      { name: "Beverly Hills Flats", slug: "beverly-hills-flats", avgPrice: "$3.8M" },
      { name: "Beverly Hills Post Office", slug: "bhpo", avgPrice: "$5.1M" },
    ],
    propertyTypes: [
      { type: "Single Family", count: 156 },
      { type: "Condos", count: 45 },
      { type: "Townhomes", count: 23 },
      { type: "Multi-Family", count: 10 },
    ],
  };

  const featuredProperties = [
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
      title: "Contemporary Estate",
      price: 2850000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      beds: 6,
      baths: 5,
      sqft: 6200,
      address: "789 Estate Dr",
      city: "Beverly Hills",
      state: "CA",
      isHotProperty: true,
      status: "open-house" as const,
    },
    {
      id: "3",
      title: "Hillside Masterpiece",
      price: 4200000,
      image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
      beds: 7,
      baths: 6,
      sqft: 8500,
      address: "456 Summit Way",
      city: "Beverly Hills",
      state: "CA",
      isHotProperty: false,
      status: null,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=80"
              alt={`${cityData.name} cityscape`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-accent mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Real Estate in {cityData.name}, {cityData.state}
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover luxury homes and investment opportunities in one of California's most prestigious communities
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* City Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="p-6 text-center">
              <DollarSign className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">
                {cityData.stats.medianPrice}
              </div>
              <div className="text-sm text-muted-foreground">Median Price</div>
            </Card>
            <Card className="p-6 text-center">
              <Building2 className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">
                {cityData.stats.activeListings}
              </div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">
                {cityData.stats.avgDaysOnMarket}
              </div>
              <div className="text-sm text-muted-foreground">Avg Days on Market</div>
            </Card>
            <Card className="p-6 text-center">
              <School className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">
                {cityData.stats.schools}
              </div>
              <div className="text-sm text-muted-foreground">School Rating</div>
            </Card>
          </div>

          {/* About Section */}
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              About {cityData.name}
            </h2>
            <p className="text-foreground text-lg leading-relaxed">
              {cityData.description}
            </p>
          </Card>

          {/* Featured Properties */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-primary">
                Featured Properties in {cityData.name}
              </h2>
              <Button variant="outline">View All Listings</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Neighborhoods */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Popular Neighborhoods
              </h2>
              <div className="space-y-4">
                {cityData.neighborhoods.map((neighborhood) => (
                  <a
                    key={neighborhood.slug}
                    href={`/neighborhood/${neighborhood.slug}`}
                    className="flex justify-between items-center p-4 bg-secondary rounded-lg hover:bg-secondary/70 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-foreground">
                        {neighborhood.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg Price: {neighborhood.avgPrice}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Explore
                    </Button>
                  </a>
                ))}
              </div>
            </Card>

            {/* Property Types */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-primary mb-6">
                Property Types Available
              </h2>
              <div className="space-y-4">
                {cityData.propertyTypes.map((type) => (
                  <div
                    key={type.type}
                    className="flex justify-between items-center p-4 bg-secondary rounded-lg"
                  >
                    <span className="font-medium text-foreground">{type.type}</span>
                    <span className="text-accent font-bold">{type.count} listings</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CityTemplate;
