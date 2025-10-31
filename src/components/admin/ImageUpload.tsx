import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { convertToWebP, isImageFile, validateImageSize } from '@/lib/imageUtils';
import { supabase } from '@/integrations/supabase/client';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
  folder?: string;
  maxSizeMB?: number;
  className?: string;
}

export const ImageUpload = ({ 
  onImageUploaded, 
  folder = 'content-images',
  maxSizeMB = 10,
  className = '' 
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploadedUrl(null);

    // Validate file type
    if (!isImageFile(file)) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size
    if (!validateImageSize(file, maxSizeMB)) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    setIsUploading(true);

    try {
      console.log('Converting to WebP...');
      const webpFile = await convertToWebP(file, 0.85);
      console.log('WebP conversion complete:', webpFile.name, webpFile.size);

      // Upload to Supabase Storage
      const fileName = `${folder}/${Date.now()}-${webpFile.name}`;
      console.log('Uploading to storage:', fileName);

      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, webpFile, {
          contentType: 'image/webp',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      console.log('Image uploaded successfully:', publicUrl);
      setUploadedUrl(publicUrl);
      
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Image Upload (WebP)</h3>
          {preview && !isUploading && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {!preview ? (
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to {maxSizeMB}MB (will be converted to WebP)
            </p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {!preview && (
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting & Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Select Image
              </>
            )}
          </Button>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {uploadedUrl && (
          <Alert>
            <AlertDescription className="flex items-center gap-2">
              ✓ Image uploaded successfully
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};
