import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeaturedCity {
  slug: string;
  updated_at: string;
}

interface FeaturedCounty {
  slug: string;
  updated_at: string;
}

interface Blog {
  slug: string;
  updated_at: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    console.log('Generating content sitemap...');

    const baseUrl = req.headers.get('origin') || 'https://yourdomain.com';

    // Fetch featured cities
    const { data: cities, error: citiesError } = await supabase
      .from('featured_cities')
      .select('slug, updated_at')
      .eq('featured', true);

    if (citiesError) {
      console.error('Error fetching cities:', citiesError);
      throw citiesError;
    }

    // Fetch featured counties
    const { data: counties, error: countiesError } = await supabase
      .from('featured_counties')
      .select('slug, updated_at')
      .eq('featured', true);

    if (countiesError) {
      console.error('Error fetching counties:', countiesError);
      throw countiesError;
    }

    // Fetch published blogs
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug, updated_at')
      .eq('published', true);

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError);
      throw blogsError;
    }

    // Build XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add homepage
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += '    <changefreq>daily</changefreq>\n';
    xml += '    <priority>1.0</priority>\n';
    xml += '  </url>\n';

    // Add static pages
    const staticPages = [
      { path: '/listings', priority: '0.9', changefreq: 'daily' },
      { path: '/cities', priority: '0.8', changefreq: 'weekly' },
      { path: '/counties', priority: '0.8', changefreq: 'weekly' },
      { path: '/blog', priority: '0.7', changefreq: 'weekly' },
      { path: '/advanced-search', priority: '0.7', changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add city pages
    (cities as FeaturedCity[] || []).forEach(city => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/cities/${city.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(city.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    // Add county pages
    (counties as FeaturedCounty[] || []).forEach(county => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/counties/${county.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(county.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    });

    // Add blog posts
    (blogs as Blog[] || []).forEach(blog => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(blog.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    console.log(`Generated content sitemap with ${(cities?.length || 0) + (counties?.length || 0) + (blogs?.length || 0) + staticPages.length + 1} URLs`);

    // Update last generated timestamp
    await supabase
      .from('seo_settings')
      .update({ 
        setting_value: { 
          timestamp: new Date().toISOString(), 
          description: 'Last time sitemaps were generated' 
        } 
      })
      .eq('setting_key', 'sitemap_last_generated');

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
