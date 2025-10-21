import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

interface BedsFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const BedsFilter = ({ value, onChange }: BedsFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState(value || "any");
  const [exactMatch, setExactMatch] = useState(false);

  const bedOptions = ["any", "1", "2", "3", "4", "5"];

  const handleApply = () => {
    onChange(selectedBeds);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (selectedBeds === "any") return "Beds";
    if (exactMatch) return `${selectedBeds} Beds`;
    return `${selectedBeds}+ Beds`;
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
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-3 text-foreground">Number of Bedrooms</h4>
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
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exact-match-beds"
              checked={exactMatch}
              onCheckedChange={(checked) => setExactMatch(checked as boolean)}
            />
            <Label htmlFor="exact-match-beds" className="text-sm cursor-pointer text-foreground">
              Use exact match
            </Label>
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

export default BedsFilter;
