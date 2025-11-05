import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  sizes = "100vw"
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate srcset for responsive images with optimized sizing
  const generateSrcSet = () => {
    if (!src.includes('unsplash.com')) return undefined;
    
    const widths = [320, 480, 640, 768, 1024, 1280, 1536, 1920];
    const maxWidth = width || 1920;
    
    return widths
      .filter(w => w <= maxWidth)
      .map(w => {
        // Replace both w= parameter and increase quality slightly for smaller images
        const quality = w <= 640 ? 85 : 80;
        return `${src.replace(/w=\d+/, `w=${w}`).replace(/q=\d+/, `q=${quality}`)} ${w}w`;
      })
      .join(', ');
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}>
      {!isLoaded && !error && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse" 
          style={{ 
            // Reserve space to prevent CLS
            aspectRatio: width && height ? `${width}/${height}` : '16/9' 
          }}
        />
      )}
      <img
        src={error ? 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3EImage unavailable%3C/text%3E%3C/svg%3E' : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        width={width}
        height={height}
        srcSet={generateSrcSet()}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
};

export default OptimizedImage;