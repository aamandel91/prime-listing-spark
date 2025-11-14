import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { PhotoGalleryModal } from '@/components/properties/PhotoGalleryModal';

interface PropertyPhotoGalleryProps {
  images: string[];
  address: string;
}

export function PropertyPhotoGallery({ images, address }: PropertyPhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[500px] bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative w-full">
        {/* Main Image */}
        <div className="relative w-full h-[600px] lg:h-[700px] bg-gray-900">
          <img
            src={images[currentIndex]}
            alt={`${address} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 h-12 w-12 rounded-full shadow-lg"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 h-12 w-12 rounded-full shadow-lg"
                onClick={handleNext}
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </>
          )}

          {/* Photo Counter & Full Screen Button */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4">
            <div className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-semibold shadow-lg">
              {currentIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-900 px-6 rounded-full shadow-lg"
              onClick={() => setIsGalleryOpen(true)}
            >
              <Maximize2 className="w-5 h-5 mr-2" />
              View All {images.length} Photos
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="bg-background border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex gap-3 overflow-x-auto">
                {images.slice(0, 10).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden border-3 transition-all ${
                      index === currentIndex
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
                {images.length > 10 && (
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex-shrink-0 w-32 h-20 rounded-lg border-2 border-dashed border-muted-foreground flex items-center justify-center text-sm font-medium text-muted-foreground hover:bg-muted hover:border-primary transition-colors"
                  >
                    +{images.length - 10} more
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Gallery Modal */}
      <PhotoGalleryModal
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={currentIndex}
      />
    </>
  );
}
