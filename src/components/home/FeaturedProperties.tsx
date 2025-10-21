import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProperties = () => {
  // Mock data - will be replaced with real data
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
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Featured Properties
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our handpicked selection of premium homes
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" className="hidden md:flex items-center">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center md:hidden">
          <Link to="/listings">
            <Button variant="outline">
              View All Properties
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
