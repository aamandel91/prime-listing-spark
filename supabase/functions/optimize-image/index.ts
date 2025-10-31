import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Image } from "https://deno.land/x/imagescript@1.3.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || '';
    const maxWidth = parseInt(formData.get('maxWidth') as string || '1920');
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing image:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Decode the image using imagescript
    let image = await Image.decode(uint8Array);
    
    // Resize if image is too large
    if (image.width > maxWidth) {
      const ratio = maxWidth / image.width;
      const newHeight = Math.round(image.height * ratio);
      image = image.resize(maxWidth, newHeight);
      console.log(`Resized image from ${image.width}x${image.height} to ${maxWidth}x${newHeight}`);
    }
    
    // Encode to optimized PNG with compression
    const optimizedBuffer = await image.encode(9); // Max PNG compression
    const optimizedBlob = new Blob([optimizedBuffer as unknown as BlobPart], { type: 'image/png' });
    
    console.log('Optimized image. Original size:', file.size, 'New size:', optimizedBlob.size, 
                'Savings:', Math.round((1 - optimizedBlob.size / file.size) * 100) + '%');
    
    // Generate filename
    const originalName = file.name.split('.').slice(0, -1).join('.');
    const timestamp = Date.now();
    const fileName = `${folder ? folder + '/' : ''}${originalName}-${timestamp}.png`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, optimizedBlob, {
        contentType: 'image/png',
        cacheControl: '31536000', // 1 year cache
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully:', publicUrl);

    return new Response(
      JSON.stringify({ 
        url: publicUrl,
        path: fileName,
        size: optimizedBlob.size,
        originalSize: file.size,
        savings: Math.round((1 - optimizedBlob.size / file.size) * 100),
        width: image.width,
        height: image.height
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in optimize-image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
