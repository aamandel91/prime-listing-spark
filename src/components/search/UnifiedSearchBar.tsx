import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UnifiedSearchBarProps {
  variant?: "hero" | "inline";
  className?: string;
}

const UnifiedSearchBar = ({ variant = "inline", className = "" }: UnifiedSearchBarProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [location, setLocation] = useState(searchParams.get("city") || "");
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "FL");
  const [status, setStatus] = useState(searchParams.get("status") || "A");
  const [propertyType, setPropertyType] = useState(searchParams.get("propertyType") || "all");
  const [beds, setBeds] = useState(parseInt(searchParams.get("beds") || "0"));
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "0");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "5000000");

  const statusOptions = [
    { value: "A", label: "Active" },
    { value: "P", label: "Pending" },
    { value: "S", label: "Sold" },
    { value: "all", label: "All Status" },
  ];

  const propertyTypes = [
    { value: "all", label: "All Listings" },
    { value: "Residential", label: "House" },
    { value: "Condominium", label: "Condo" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Land", label: "Land" },
  ];

  const priceOptions = [
    { value: "0", label: "$0" },
    { value: "100000", label: "$100K" },
    { value: "200000", label: "$200K" },
    { value: "300000", label: "$300K" },
    { value: "400000", label: "$400K" },
    { value: "500000", label: "$500K" },
    { value: "750000", label: "$750K" },
    { value: "1000000", label: "$1M" },
    { value: "1500000", label: "$1.5M" },
    { value: "2000000", label: "$2M" },
    { value: "3000000", label: "$3M" },
    { value: "5000000", label: "$5M+" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (location) {
      params.set("city", location);
      params.set("state", selectedState);
    }
    
    if (status !== "all") {
      params.set("status", status);
    }
    
    if (propertyType !== "all") {
      params.set("propertyType", propertyType);
    }
    
    if (beds > 0) {
      params.set("beds", beds.toString());
    }
    
    if (minPrice !== "0") {
      params.set("minPrice", minPrice);
    }
    
    if (maxPrice !== "5000000") {
      params.set("maxPrice", maxPrice);
    }
    
    navigate(`/listings?${params.toString()}`);
  };

  const incrementBeds = () => {
    setBeds(prev => Math.min(prev + 1, 10));
  };

  const decrementBeds = () => {
    setBeds(prev => Math.max(prev - 1, 0));
  };

  const isHero = variant === "hero";

  return (
    <div className={`${isHero ? 'bg-background/95 backdrop-blur-sm rounded-xl shadow-large p-4' : 'bg-background border border-border rounded-lg p-3'} ${className}`}>
      <div className="flex flex-col lg:flex-row gap-2 items-center">
        {/* Status Dropdown */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} w-full lg:w-32 bg-background`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-background z-[100]">
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Property Type Dropdown */}
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} w-full lg:w-40 bg-background`}>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent className="bg-background z-[100]">
            {propertyTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location Input */}
        <div className="flex-1 w-full">
          <CityAutocomplete
            value={location}
            onChange={setLocation}
            onSelect={(city) => setSelectedState(city.state)}
            placeholder="City, Zip, or Address"
            className={`${isHero ? 'h-12' : 'h-10'} border-input`}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Beds Counter */}
        <div className={`flex items-center gap-2 ${isHero ? 'h-12' : 'h-10'} px-3 border border-input rounded-md bg-background w-full lg:w-36`}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={decrementBeds}
            className="h-6 w-6 p-0 hover:bg-secondary"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium flex-1 text-center whitespace-nowrap">
            {beds === 0 ? "0+ Beds" : `${beds}+ Beds`}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={incrementBeds}
            className="h-6 w-6 p-0 hover:bg-secondary"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="flex items-center gap-1 w-full lg:w-auto">
          <Select value={minPrice} onValueChange={setMinPrice}>
            <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} w-full lg:w-28 bg-background text-xs`}>
              <span className="text-muted-foreground text-xs mr-1">min</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-[100]">
              {priceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={maxPrice} onValueChange={setMaxPrice}>
            <SelectTrigger className={`${isHero ? 'h-12' : 'h-10'} w-full lg:w-28 bg-background text-xs`}>
              <span className="text-muted-foreground text-xs mr-1">max</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background z-[100]">
              {priceOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          className={`${isHero ? 'h-12 px-8' : 'h-10 px-6'} w-full lg:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold whitespace-nowrap`}
          onClick={handleSearch}
        >
          <Search className={`${isHero ? 'w-5 h-5' : 'w-4 h-4'} mr-2`} />
          Search
        </Button>
      </div>
    </div>
  );
};

export default UnifiedSearchBar;
