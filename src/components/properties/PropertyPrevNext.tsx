import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

interface PropertyPrevNextProps {
  prevPropertyUrl?: string;
  nextPropertyUrl?: string;
  className?: string;
}

export const PropertyPrevNext = ({ 
  prevPropertyUrl, 
  nextPropertyUrl, 
  className = "" 
}: PropertyPrevNextProps) => {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <Link to="/listings">
        <Button variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back To Search
        </Button>
      </Link>
      
      <div className="flex gap-2">
        {prevPropertyUrl ? (
          <Link to={prevPropertyUrl}>
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        
        {nextPropertyUrl ? (
          <Link to={nextPropertyUrl}>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
