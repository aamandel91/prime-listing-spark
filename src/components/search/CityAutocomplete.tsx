import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface City {
  name: string;
  state: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (city: City) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CITIES: City[] = [
  // Texas
  { name: "Austin", state: "TX" },
  { name: "Kyle", state: "TX" },
  { name: "San Antonio", state: "TX" },
  { name: "Houston", state: "TX" },
  { name: "Dallas", state: "TX" },
  { name: "Fort Worth", state: "TX" },
  { name: "Plano", state: "TX" },
  { name: "Arlington", state: "TX" },
  // Florida
  { name: "Miami", state: "FL" },
  { name: "Orlando", state: "FL" },
  { name: "Tampa", state: "FL" },
  { name: "Jacksonville", state: "FL" },
  { name: "Fort Lauderdale", state: "FL" },
  { name: "Naples", state: "FL" },
  { name: "Sarasota", state: "FL" },
  { name: "Clearwater", state: "FL" },
  { name: "St. Petersburg", state: "FL" },
  { name: "Cape Coral", state: "FL" },
  { name: "Fort Myers", state: "FL" },
  { name: "Boca Raton", state: "FL" },
  { name: "West Palm Beach", state: "FL" },
  { name: "Port St Lucie", state: "FL" },
  // California
  { name: "Los Angeles", state: "CA" },
  { name: "San Diego", state: "CA" },
  { name: "San Francisco", state: "CA" },
  { name: "Sacramento", state: "CA" },
];

export const CityAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Enter Location, Zip, Address or MLS #",
  className,
  onKeyDown,
}: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = CITIES.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredCities.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectCity(filteredCities[selectedIndex]);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleSelectCity = (city: City) => {
    onChange(city.name);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSelect) {
      onSelect(city);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        className={cn("pl-10", className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCities.map((city, index) => (
            <button
              key={`${city.name}-${city.state}`}
              type="button"
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3",
                selectedIndex === index && "bg-accent"
              )}
              onClick={() => handleSelectCity(city)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-foreground">{city.name}</div>
                <div className="text-sm text-muted-foreground">{city.state}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
