import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2, Search, MapPin, Home } from "lucide-react";
import { useRepliersBuildings } from "@/hooks/useRepliersBuildings";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export const BuildingsSearch = () => {
  const navigate = useNavigate();
  const { buildings, loading, searchBuildings } = useRepliersBuildings();
  const [searchTerm, setSearchTerm] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("FL");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchBuildings({
      name: searchTerm,
      city: city || undefined,
      state: state || undefined,
    });
  };

  const handleBuildingClick = (building: any) => {
    // Navigate to listings page filtered by the building
    const searchParams = new URLSearchParams({
      city: building.address.city || "",
      state: building.address.state || "",
    });
    
    if (building.name) {
      searchParams.set("keyword", building.name);
    }
    
    navigate(`/listings?${searchParams.toString()}`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Search Buildings & Condos
        </CardTitle>
        <CardDescription>
          Find condominiums, apartment buildings, and multi-family properties by name or location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Building name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="col-span-1 md:col-span-2"
            />
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="max-w-[100px]"
            />
            <Button type="submit" disabled={loading} className="flex-1">
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search Buildings"}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="mt-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        )}

        {!loading && buildings.length > 0 && (
          <div className="mt-6 space-y-3">
            {buildings.map((building) => (
              <Card
                key={building.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleBuildingClick(building)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        {building.name}
                      </h3>
                      {building.address.fullAddress && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {building.address.fullAddress}
                        </p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm">
                        {building.propertyType && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Home className="w-4 h-4" />
                            {building.propertyType}
                          </span>
                        )}
                        {building.units && (
                          <span className="text-muted-foreground">
                            {building.units} units
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && buildings.length === 0 && searchTerm && (
          <div className="mt-6 text-center py-8 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No buildings found matching your search</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
