import { VideosGridModule } from "@/types/contentModules";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface VideosGridRendererProps {
  module: VideosGridModule;
}

export function VideosGridRenderer({ module }: VideosGridRendererProps) {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      let query = supabase.from("videos").select("*").eq("published", true);
      
      if (module.featured) {
        query = query.eq("featured", true);
      }
      
      if (module.category) {
        query = query.eq("category", module.category);
      }
      
      query = query.order("sort_order").limit(module.limit || 6);
      
      const { data } = await query;
      setVideos(data || []);
    };

    fetchVideos();
  }, [module.featured, module.category, module.limit]);

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") 
        ? url.split("/").pop() 
        : new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div className="module-videos-grid">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardContent className="pt-6">
              <div className="aspect-video mb-4">
                <iframe
                  src={getVideoEmbedUrl(video.video_url)}
                  title={video.title}
                  className="w-full h-full rounded"
                  allowFullScreen
                />
              </div>
              <h3 className="font-semibold mb-2">{video.title}</h3>
              {video.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {video.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
