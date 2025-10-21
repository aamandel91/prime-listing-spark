import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface BathsFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const BathsFilter = ({ value, onChange }: BathsFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBaths, setSelectedBaths] = useState(value || "any");

  const bathOptions = ["any", "1", "1.5", "2", "3", "4"];

  const handleApply = () => {
    onChange(selectedBaths);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (selectedBaths === "any") return "Baths";
    return `${selectedBaths}+ Baths`;
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
            <h4 className="font-semibold text-lg mb-3 text-foreground">Number of Bathrooms</h4>
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

export default BathsFilter;
