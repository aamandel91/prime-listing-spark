import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { useRepliersLocationsAutocomplete } from "@/hooks/useRepliersLocations";
import { cn } from "@/lib/utils";

interface SimpleSearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SimpleSearchBar({ 
  placeholder = "Enter city, neighborhood, or ZIP code",
  className 
}: SimpleSearchBarProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const { suggestions, loading } = useRepliersLocationsAutocomplete(searchTerm);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationSelect = (location: any) => {
    setSearchTerm(location.name);
    setShowDropdown(false);
    handleSearch(location.name);
  };

  const handleSearch = (locationValue?: string) => {
    const location = locationValue || searchTerm;
    if (!location.trim()) return;
    
    const params = new URLSearchParams();
    params.append("location", location);
    navigate(`/listings?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" ref={locationRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-14 text-base bg-background border-border"
            />
          </div>
          <Button 
            size="lg" 
            onClick={() => handleSearch()}
            className="h-14 px-8 text-base font-semibold"
          >
            <Search className="w-5 h-5 mr-2" />
            Search Properties
          </Button>
        </div>

        {/* Location Autocomplete Dropdown */}
        {showDropdown && searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading locations...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.id}-${index}`}
                    onClick={() => handleLocationSelect(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{suggestion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {suggestion.type === 'city' && 'City'}
                        {suggestion.type === 'neighborhood' && 'Neighborhood'}
                        {suggestion.type === 'area' && 'Area'}
                        {suggestion.state && ` • ${suggestion.state}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No locations found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
