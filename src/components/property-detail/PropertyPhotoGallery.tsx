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
        <div className="relative w-full h-[500px] bg-black">
          <img
            src={images[currentIndex]}
            alt={`${address} - Photo ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                onClick={handleNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Photo Counter & Full Screen Button */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4">
            <div className="bg-black/70 text-white px-3 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsGalleryOpen(true)}
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              View All Photos
            </Button>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="bg-background border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="flex gap-2 overflow-x-auto">
                {images.slice(0, 10).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-all ${
                      index === currentIndex
                        ? 'border-primary'
                        : 'border-transparent opacity-60 hover:opacity-100'
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
                    className="flex-shrink-0 w-24 h-16 rounded border-2 border-dashed border-muted-foreground flex items-center justify-center text-sm text-muted-foreground hover:bg-muted"
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
