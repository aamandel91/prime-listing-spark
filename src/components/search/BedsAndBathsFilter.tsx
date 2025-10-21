import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface BedsAndBathsFilterProps {
  bedsValue: string;
  bathsValue: string;
  onBedsChange: (value: string) => void;
  onBathsChange: (value: string) => void;
}

const BedsAndBathsFilter = ({ bedsValue, bathsValue, onBedsChange, onBathsChange }: BedsAndBathsFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState(bedsValue || "any");
  const [selectedBaths, setSelectedBaths] = useState(bathsValue || "any");
  const [exactMatchBeds, setExactMatchBeds] = useState(false);

  const bedOptions = ["any", "1", "2", "3", "4", "5"];
  const bathOptions = ["any", "1", "1.5", "2", "3", "4"];

  const handleApply = () => {
    onBedsChange(selectedBeds);
    onBathsChange(selectedBaths);
    setOpen(false);
  };

  const getDisplayValue = () => {
    const parts = [];
    if (selectedBeds !== "any") {
      parts.push(exactMatchBeds ? `${selectedBeds} bd` : `${selectedBeds}+ bd`);
    }
    if (selectedBaths !== "any") {
      parts.push(`${selectedBaths}+ ba`);
    }
    return parts.length > 0 ? parts.join(", ") : "Beds & Baths";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 justify-between bg-background hover:bg-accent hover:text-accent-foreground"
        >
          {getDisplayValue()}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-background border shadow-lg z-50" align="start">
        <div className="p-4 space-y-6">
          {/* Bedrooms Section */}
          <div>
            <h4 className="font-semibold text-base mb-1 text-muted-foreground">Number of Bedrooms</h4>
            <p className="text-sm font-semibold mb-2 text-foreground">Bedrooms</p>
            <div className="grid grid-cols-6 gap-0 border rounded-lg overflow-hidden">
              {bedOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedBeds(option)}
                  className={`py-3 px-2 text-center border-r last:border-r-0 transition-colors ${
                    selectedBeds === option
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent text-foreground"
                  }`}
                >
                  {option === "any" ? "Any" : `${option}+`}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="exact-match-beds"
                checked={exactMatchBeds}
                onCheckedChange={(checked) => setExactMatchBeds(checked as boolean)}
              />
              <Label htmlFor="exact-match-beds" className="text-sm cursor-pointer text-foreground">
                Use exact match
              </Label>
            </div>
          </div>

          {/* Bathrooms Section */}
          <div>
            <h4 className="font-semibold text-base mb-1 text-muted-foreground">Number of Bathrooms</h4>
            <p className="text-sm font-semibold mb-2 text-foreground">Bathrooms</p>
            <div className="grid grid-cols-6 gap-0 border rounded-lg overflow-hidden">
              {bathOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedBaths(option)}
                  className={`py-3 px-2 text-center border-r last:border-r-0 transition-colors ${
                    selectedBaths === option
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-accent text-foreground"
                  }`}
                >
                  {option === "any" ? "Any" : `${option}+`}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleApply}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default BedsAndBathsFilter;
