import { SingleVideoModule } from "@/types/contentModules";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SingleVideoRendererProps {
  module: SingleVideoModule;
}

export default function SingleVideoRenderer({ module }: SingleVideoRendererProps) {
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    const fetchVideo = async () => {
      if (module.videoId) {
        const { data } = await supabase
          .from("videos")
          .select("video_url, title")
          .eq("id", module.videoId)
          .single();
        
        if (data) {
          setVideoUrl(data.video_url);
        }
      } else if (module.videoUrl) {
        setVideoUrl(module.videoUrl);
      }
    };

    fetchVideo();
  }, [module.videoId, module.videoUrl]);

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") 
        ? url.split("/").pop() 
        : new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (!videoUrl) return null;

  return (
    <div className="module-single-video max-w-4xl mx-auto">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="aspect-video">
        <iframe
          src={getVideoEmbedUrl(videoUrl)}
          title={module.title || "Video"}
          className="w-full h-full rounded-lg"
          allowFullScreen
        />
      </div>
    </div>
  );
}
