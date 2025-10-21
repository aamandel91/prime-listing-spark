import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sqftRange, setSqftRange] = useState([0, 10000]);
  const [bedroomsMin, setBedroomsMin] = useState("");
  const [bathroomsMin, setBathroomsMin] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [yearBuiltMin, setYearBuiltMin] = useState("");
  const [lotSizeMin, setLotSizeMin] = useState("");
  const [features, setFeatures] = useState({
    pool: false,
    waterfront: false,
    garage: false,
    newConstruction: false,
    gatedCommunity: false,
    furnished: false,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (priceRange[0] > 0) params.append('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000000) params.append('maxPrice', priceRange[1].toString());
    if (sqftRange[0] > 0) params.append('minSqft', sqftRange[0].toString());
    if (sqftRange[1] < 10000) params.append('maxSqft', sqftRange[1].toString());
    if (bedroomsMin) params.append('beds', bedroomsMin);
    if (bathroomsMin) params.append('baths', bathroomsMin);
    if (propertyType) params.append('type', propertyType);
    if (city) params.append('city', city);
    if (zipCode) params.append('zipCode', zipCode);
    if (yearBuiltMin) params.append('yearBuilt', yearBuiltMin);
    if (lotSizeMin) params.append('lotSize', lotSizeMin);
    
    Object.entries(features).forEach(([key, value]) => {
      if (value) params.append(key, 'true');
    });

    navigate(`/listings?${params.toString()}`);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Advanced Property Search</h1>
              <p className="text-lg text-muted-foreground">
                Find your perfect Florida home with our comprehensive search filters
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
                <CardDescription>Customize your search criteria to find exactly what you're looking for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="Enter ZIP code"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={5000000}
                      step={50000}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Square Footage */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Square Footage</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{sqftRange[0].toLocaleString()} sq ft</span>
                      <span>{sqftRange[1].toLocaleString()} sq ft</span>
                    </div>
                    <Slider
                      value={sqftRange}
                      onValueChange={setSqftRange}
                      min={0}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Property Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger id="propertyType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-family">Single Family</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="multi-family">Multi-Family</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedroomsMin">Min Bedrooms</Label>
                      <Select value={bedroomsMin} onValueChange={setBedroomsMin}>
                        <SelectTrigger id="bedroomsMin">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathroomsMin">Min Bathrooms</Label>
                      <Select value={bathroomsMin} onValueChange={setBathroomsMin}>
                        <SelectTrigger id="bathroomsMin">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Criteria */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Criteria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearBuiltMin">Min Year Built</Label>
                      <Input
                        id="yearBuiltMin"
                        type="number"
                        placeholder="e.g., 2000"
                        value={yearBuiltMin}
                        onChange={(e) => setYearBuiltMin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lotSizeMin">Min Lot Size (sq ft)</Label>
                      <Input
                        id="lotSizeMin"
                        type="number"
                        placeholder="e.g., 5000"
                        value={lotSizeMin}
                        onChange={(e) => setLotSizeMin(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Features & Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(features).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setFeatures({ ...features, [key]: checked as boolean })
                          }
                        />
                        <Label htmlFor={key} className="cursor-pointer">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSearch}
                    className="w-full md:w-auto"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Properties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdvancedSearch;
