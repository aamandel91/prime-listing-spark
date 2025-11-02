import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { EnhancedSearchBar } from "@/components/search/EnhancedSearchBar";
import { Card } from "@/components/ui/card";

const AdvancedSearch = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Advanced Property Search | Florida Real Estate</title>
        <meta 
          name="description" 
          content="Use our advanced search filters to find your perfect Florida home. Filter by price, bedrooms, location, features and more." 
        />
        <link rel="canonical" href={`${window.location.origin}/advanced-search`} />
      </Helmet>

      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Advanced Property Search</h1>
              <p className="text-lg text-muted-foreground">
                Find your perfect Florida home with comprehensive search filters
              </p>
            </div>

            {/* Enhanced Search Bar with Property Type Selector */}
            <Card className="mb-8">
              <div className="p-6">
                <EnhancedSearchBar variant="full" />
              </div>
            </Card>

            {/* Search Tips */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Save Your Searches</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the save icon to get email alerts when new properties match your criteria.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Visual Property Types</h3>
                  <p className="text-sm text-muted-foreground">
                    Select multiple property types to search across houses, condos, townhomes and more.
                  </p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-2">Active Filters</h3>
                  <p className="text-sm text-muted-foreground">
                    See all your active filters at a glance and remove them with one click.
                  </p>
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

export default AdvancedSearch;
