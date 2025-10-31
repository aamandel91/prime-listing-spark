import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const PopularSearches = () => {
  // Only show searches that map to actual API capabilities
  const searches = [
    { title: "Homes For Sale", link: "/listings?state=FL&status=A" },
    { title: "Miami Properties", link: "/listings?city=Miami&state=FL" },
    { title: "Tampa Homes", link: "/listings?city=Tampa&state=FL" },
    { title: "Orlando Real Estate", link: "/listings?city=Orlando&state=FL" },
    { title: "Jacksonville Homes", link: "/listings?city=Jacksonville&state=FL" },
    { title: "Under $300K", link: "/listings?maxPrice=300000&state=FL" },
    { title: "$300K - $500K", link: "/listings?minPrice=300000&maxPrice=500000&state=FL" },
    { title: "Luxury Homes $1M+", link: "/listings?minPrice=1000000&state=FL" },
    { title: "3+ Bedrooms", link: "/listings?beds=3&state=FL" },
    { title: "4+ Bedrooms", link: "/listings?beds=4&state=FL" },
    { title: "New Construction", link: "/listings?minYearBuilt=2020&state=FL" },
    { title: "Large Homes 2500+ SqFt", link: "/listings?minSqft=2500&state=FL" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Searches</h2>
          <p className="text-lg text-muted-foreground">
            Quick links to the most searched property types
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {searches.map((search) => (
              <Link
                key={search.title}
                to={search.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">{search.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
