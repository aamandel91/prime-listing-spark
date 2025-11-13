import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePropertyComparison } from "@/hooks/usePropertyComparison";
import { PropertyComparisonModal } from "./PropertyComparisonModal";
import { X, Scale } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ComparisonBar = () => {
  const { selectedProperties, clearAll } = usePropertyComparison();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedProperties.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  {selectedProperties.length} {selectedProperties.length === 1 ? 'property' : 'properties'} selected
                </span>
                <div className="hidden sm:flex gap-2">
                  {selectedProperties.map((property) => (
                    <div
                      key={property.mls}
                      className="text-xs bg-muted px-2 py-1 rounded truncate max-w-[150px]"
                    >
                      {property.address.split(',')[0]}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  disabled={selectedProperties.length < 2}
                >
                  Compare Properties
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <PropertyComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
