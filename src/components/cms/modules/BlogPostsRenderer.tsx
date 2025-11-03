import { BlogPostsModule } from "@/types/contentModules";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

interface BlogPostsRendererProps {
  module: BlogPostsModule;
}

export function BlogPostsRenderer({ module }: BlogPostsRendererProps) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      let query = supabase.from("blogs").select("*").eq("published", true);
      
      query = query.order("published_at", { ascending: false }).limit(module.limit || 6);
      
      const { data } = await query;
      setPosts(data || []);
    };

    fetchPosts();
  }, [module.category, module.limit]);

  return (
    <div className="module-blog-posts">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              {post.featured_image && (
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                )}
                {post.published_at && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
