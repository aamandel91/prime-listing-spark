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
      <div className="relative w-full bg-black">
        {/* Main Hero Image */}
        <div className="relative w-full h-[500px] lg:h-[700px]">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 h-14 w-14 rounded-full shadow-xl transition-all hover:scale-110"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-900 h-14 w-14 rounded-full shadow-xl transition-all hover:scale-110"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Photo Counter */}
          <div className="absolute bottom-6 left-6">
            <div className="bg-black/75 backdrop-blur-sm text-white px-5 py-2.5 rounded-full font-semibold text-base">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* View All Photos Button */}
          <div className="absolute bottom-6 right-6">
            <Button
              size="lg"
              className="bg-white/95 hover:bg-white text-gray-900 px-8 rounded-full shadow-xl font-semibold"
              onClick={() => setIsGalleryOpen(true)}
            >
              <Maximize2 className="w-5 h-5 mr-2" />
              View All {images.length} Photos
            </Button>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {images.slice(0, 16).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden transition-all ${
                    index === currentIndex
                      ? 'ring-4 ring-primary scale-105'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              {images.length > 16 && (
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground flex flex-col items-center justify-center text-xs font-medium text-muted-foreground hover:bg-muted hover:border-primary transition-all"
                >
                  <span className="text-lg font-bold">+{images.length - 16}</span>
                  <span>more</span>
                </button>
              )}
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
