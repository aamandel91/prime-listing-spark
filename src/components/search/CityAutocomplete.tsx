import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchItem {
  value: string;
  label: string;
  type: 'city' | 'zip' | 'neighborhood';
  state: string;
}

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (item: { name: string; state: string }) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SEARCH_DATA: SearchItem[] = [
  // Texas Cities
  { value: "Austin", label: "Austin", type: "city", state: "TX" },
  { value: "Kyle", label: "Kyle", type: "city", state: "TX" },
  { value: "San Antonio", label: "San Antonio", type: "city", state: "TX" },
  { value: "Houston", label: "Houston", type: "city", state: "TX" },
  { value: "Dallas", label: "Dallas", type: "city", state: "TX" },
  { value: "Fort Worth", label: "Fort Worth", type: "city", state: "TX" },
  { value: "Plano", label: "Plano", type: "city", state: "TX" },
  { value: "Arlington", label: "Arlington", type: "city", state: "TX" },
  
  // Florida Cities
  { value: "Miami", label: "Miami", type: "city", state: "FL" },
  { value: "Orlando", label: "Orlando", type: "city", state: "FL" },
  { value: "Tampa", label: "Tampa", type: "city", state: "FL" },
  { value: "Jacksonville", label: "Jacksonville", type: "city", state: "FL" },
  { value: "Fort Lauderdale", label: "Fort Lauderdale", type: "city", state: "FL" },
  { value: "Naples", label: "Naples", type: "city", state: "FL" },
  { value: "Sarasota", label: "Sarasota", type: "city", state: "FL" },
  { value: "Clearwater", label: "Clearwater", type: "city", state: "FL" },
  { value: "St. Petersburg", label: "St. Petersburg", type: "city", state: "FL" },
  { value: "Cape Coral", label: "Cape Coral", type: "city", state: "FL" },
  { value: "Fort Myers", label: "Fort Myers", type: "city", state: "FL" },
  { value: "Boca Raton", label: "Boca Raton", type: "city", state: "FL" },
  { value: "West Palm Beach", label: "West Palm Beach", type: "city", state: "FL" },
  { value: "Port St Lucie", label: "Port St Lucie", type: "city", state: "FL" },
  
  // California Cities
  { value: "Los Angeles", label: "Los Angeles", type: "city", state: "CA" },
  { value: "San Diego", label: "San Diego", type: "city", state: "CA" },
  { value: "San Francisco", label: "San Francisco", type: "city", state: "CA" },
  { value: "Sacramento", label: "Sacramento", type: "city", state: "CA" },

  // Texas Zip Codes
  { value: "78701", label: "78701", type: "zip", state: "TX" },
  { value: "78702", label: "78702", type: "zip", state: "TX" },
  { value: "78751", label: "78751", type: "zip", state: "TX" },
  { value: "78704", label: "78704", type: "zip", state: "TX" },
  { value: "77001", label: "77001", type: "zip", state: "TX" },
  { value: "75201", label: "75201", type: "zip", state: "TX" },
  
  // Florida Zip Codes
  { value: "33101", label: "33101", type: "zip", state: "FL" },
  { value: "32801", label: "32801", type: "zip", state: "FL" },
  { value: "33602", label: "33602", type: "zip", state: "FL" },
  { value: "34102", label: "34102", type: "zip", state: "FL" },
  { value: "34236", label: "34236", type: "zip", state: "FL" },
  
  // California Zip Codes
  { value: "90001", label: "90001", type: "zip", state: "CA" },
  { value: "92101", label: "92101", type: "zip", state: "CA" },
  { value: "94102", label: "94102", type: "zip", state: "CA" },

  // Texas Neighborhoods
  { value: "Downtown Austin", label: "Downtown Austin", type: "neighborhood", state: "TX" },
  { value: "South Congress", label: "South Congress", type: "neighborhood", state: "TX" },
  { value: "East Austin", label: "East Austin", type: "neighborhood", state: "TX" },
  { value: "Hyde Park", label: "Hyde Park", type: "neighborhood", state: "TX" },
  { value: "The Heights", label: "The Heights (Houston)", type: "neighborhood", state: "TX" },
  { value: "Uptown Dallas", label: "Uptown Dallas", type: "neighborhood", state: "TX" },
  
  // Florida Neighborhoods
  { value: "South Beach", label: "South Beach", type: "neighborhood", state: "FL" },
  { value: "Wynwood", label: "Wynwood", type: "neighborhood", state: "FL" },
  { value: "Winter Park", label: "Winter Park", type: "neighborhood", state: "FL" },
  { value: "Hyde Park Tampa", label: "Hyde Park (Tampa)", type: "neighborhood", state: "FL" },
  { value: "Old Naples", label: "Old Naples", type: "neighborhood", state: "FL" },
  
  // California Neighborhoods
  { value: "Beverly Hills", label: "Beverly Hills", type: "neighborhood", state: "CA" },
  { value: "La Jolla", label: "La Jolla", type: "neighborhood", state: "CA" },
  { value: "Pacific Heights", label: "Pacific Heights", type: "neighborhood", state: "CA" },
];

export const CityAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Search by City, Zip, Neighborhood, Address or MLS #",
  className,
  onKeyDown,
}: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = SEARCH_DATA.filter(item =>
        item.value.toLowerCase().includes(value.toLowerCase()) ||
        item.label.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 12);
      setFilteredItems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredItems([]);
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
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex]);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    onChange(item.value);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.blur(); // Blur input to prevent dropdown from reopening
    if (onSelect) {
      onSelect({ name: item.value, state: item.state });
    }
  };

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  const typeLabels = {
    city: 'Cities',
    zip: 'Zip Codes',
    neighborhood: 'Neighborhoods'
  };

  const typeOrder: Array<'city' | 'zip' | 'neighborhood'> = ['city', 'neighborhood', 'zip'];

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
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-auto">
          {typeOrder.map((type) => {
            const items = groupedItems[type];
            if (!items || items.length === 0) return null;
            
            let flatIndex = 0;
            for (const t of typeOrder) {
              if (t === type) break;
              flatIndex += groupedItems[t]?.length || 0;
            }

            return (
              <div key={type}>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                  {typeLabels[type]}
                </div>
                {items.map((item, index) => {
                  const currentIndex = flatIndex + index;
                  return (
                    <button
                      key={`${item.type}-${item.value}-${item.state}`}
                      type="button"
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3",
                        selectedIndex === currentIndex && "bg-accent"
                      )}
                      onClick={() => handleSelectItem(item)}
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.state}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
