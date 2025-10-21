import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface PriceFilterProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

const PriceFilter = ({ minValue, maxValue, onMinChange, onMaxChange }: PriceFilterProps) => {
  const [open, setOpen] = useState(false);
  const [selectedMin, setSelectedMin] = useState(minValue || "");
  const [selectedMax, setSelectedMax] = useState(maxValue || "");

  const minPriceOptions = [
    { value: "", label: "No min" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "300000", label: "$300,000" },
    { value: "400000", label: "$400,000" },
    { value: "500000", label: "$500,000" },
    { value: "600000", label: "$600,000" },
    { value: "700000", label: "$700,000" },
    { value: "800000", label: "$800,000" },
    { value: "900000", label: "$900,000" },
    { value: "1000000", label: "$1,000,000" },
    { value: "1500000", label: "$1,500,000" },
    { value: "2000000", label: "$2,000,000" },
  ];

  const maxPriceOptions = [
    { value: "", label: "No max" },
    { value: "100000", label: "$100,000" },
    { value: "200000", label: "$200,000" },
    { value: "300000", label: "$300,000" },
    { value: "400000", label: "$400,000" },
    { value: "500000", label: "$500,000" },
    { value: "600000", label: "$600,000" },
    { value: "700000", label: "$700,000" },
    { value: "800000", label: "$800,000" },
    { value: "900000", label: "$900,000" },
    { value: "1000000", label: "$1,000,000" },
    { value: "1500000", label: "$1,500,000" },
    { value: "2000000", label: "$2,000,000" },
    { value: "3000000", label: "$3,000,000" },
  ];

  const handleApply = () => {
    onMinChange(selectedMin);
    onMaxChange(selectedMax);
    setOpen(false);
  };

  const getDisplayValue = () => {
    if (!selectedMin && !selectedMax) return "Price";
    
    const formatPrice = (value: string) => {
      if (!value) return "";
      const num = parseInt(value);
      if (num >= 1000000) return `$${num / 1000000}M`;
      if (num >= 1000) return `$${num / 1000}K`;
      return `$${num}`;
    };

    if (selectedMin && selectedMax) {
      return `${formatPrice(selectedMin)} - ${formatPrice(selectedMax)}`;
    }
    if (selectedMin) {
      return `${formatPrice(selectedMin)}+`;
    }
    return `Up to ${formatPrice(selectedMax)}`;
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
      <PopoverContent className="w-96 p-0 bg-background border shadow-lg z-50" align="start">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-base mb-2 text-foreground">Minimum</h4>
              <Select value={selectedMin} onValueChange={setSelectedMin}>
                <SelectTrigger className="w-full h-12 bg-muted/50">
                  <SelectValue placeholder="No min" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {minPriceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <h4 className="font-semibold text-base mb-2 text-foreground">Maximum</h4>
              <Select value={selectedMax} onValueChange={setSelectedMax}>
                <SelectTrigger className="w-full h-12 bg-muted/50">
                  <SelectValue placeholder="No max" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {maxPriceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default PriceFilter;
