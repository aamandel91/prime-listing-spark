import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@1.10.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blogUrl } = await req.json();
    
    if (!blogUrl) {
      return new Response(
        JSON.stringify({ error: 'Blog URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const app = new FirecrawlApp({ apiKey: firecrawlKey });

    console.log('Starting blog migration from:', blogUrl);

    // Crawl the blog to get all post URLs
    const crawlResult = await app.crawlUrl(blogUrl, {
      limit: 200,
      scrapeOptions: {
        formats: ['markdown', 'html'],
      }
    });

    if (!crawlResult.success) {
      throw new Error('Failed to crawl blog');
    }

    console.log(`Found ${crawlResult.data?.length || 0} pages`);

    const importedBlogs = [];
    const errors = [];

    // Process each blog post
    for (const page of crawlResult.data || []) {
      try {
        const url = page.metadata?.url || '';
        
        // Skip non-blog-post pages (listing page, categories, etc.)
        if (!url.includes('/blog/') || url.endsWith('/blog') || url.includes('/category/')) {
          continue;
        }

        console.log('Processing:', url);

        // Extract blog data from the page
        const title = page.metadata?.title || '';
        const description = page.metadata?.description || '';
        const markdown = page.markdown || '';
        const html = page.html || '';
        
        // Extract image from metadata or HTML
        let featuredImage = page.metadata?.ogImage || page.metadata?.image || '';
        if (!featuredImage && html) {
          const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) featuredImage = imgMatch[1];
        }

        // Generate slug from URL
        const slug = url.split('/blog/')[1]?.replace(/\/$/, '') || '';
        
        if (!slug || !title) {
          console.log('Skipping page - missing slug or title:', url);
          continue;
        }

        // Check if blog already exists
        const { data: existing } = await supabase
          .from('blogs')
          .select('id')
          .eq('slug', slug)
          .single();

        if (existing) {
          console.log('Blog already exists:', slug);
          continue;
        }

        // Get first user with admin role as author
        const { data: adminRole } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (!adminRole) {
          throw new Error('No admin user found');
        }

        // Insert blog post
        const { data: blog, error } = await supabase
          .from('blogs')
          .insert({
            title: title,
            slug: slug,
            excerpt: description,
            content: markdown || html,
            featured_image: featuredImage,
            author_id: adminRole.user_id,
            published: true,
            published_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error inserting blog:', error);
          errors.push({ url, error: error.message });
        } else {
          console.log('Imported:', title);
          importedBlogs.push({ title, slug, url });
        }

      } catch (error) {
        console.error('Error processing page:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push({ url: page.metadata?.url, error: errorMsg });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        imported: importedBlogs.length,
        errors: errors.length,
        blogs: importedBlogs,
        errorDetails: errors,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in migrate-blogs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
