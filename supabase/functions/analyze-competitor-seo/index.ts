import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    console.log('Analyzing competitor:', url);

    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY not configured');
    }

    // Use Firecrawl to scrape the competitor page
    console.log('Scraping with Firecrawl...');
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html'],
      }),
    });

    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.text();
      throw new Error(`Firecrawl error: ${error}`);
    }

    const firecrawlData = await firecrawlResponse.json();
    const html = firecrawlData.html || '';
    const markdown = firecrawlData.markdown || '';

    console.log('Analyzing SEO elements...');

    // Extract meta tags
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["'](.*?)["']/i);

    // Extract headings
    const h1Matches = html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
    const h2Matches = html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    const h3Matches = html.match(/<h3[^>]*>(.*?)<\/h3>/gi) || [];

    const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '').trim();

    // Count links
    const internalLinks = (html.match(/<a[^>]*href=["'][^"']*["']/gi) || [])
      .filter((link: string) => !link.includes('http') || link.includes(new URL(url).hostname)).length;
    const externalLinks = (html.match(/<a[^>]*href=["']http/gi) || []).length - internalLinks;

    // Extract keywords from content
    const words = markdown.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w: string) => w.length > 4);
    
    const wordCount = words.reduce((acc: any, word: string) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    const topKeywords = Object.entries(wordCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    // Generate insights
    const insights = [];
    if (h1Matches.length > 1) insights.push('Multiple H1 tags detected - should use only one');
    if (h1Matches.length === 0) insights.push('No H1 tag found - add a primary heading');
    if (!descMatch) insights.push('Missing meta description - add one for better SEO');
    if (titleMatch && titleMatch[1].length > 60) insights.push('Title tag is too long (>60 chars)');
    if (descMatch && descMatch[1].length > 160) insights.push('Meta description is too long (>160 chars)');
    if (h2Matches.length < 3) insights.push('Few H2 headings - add more subheadings for better structure');
    if (internalLinks < 5) insights.push('Add more internal links for better site navigation');
    
    const result = {
      url,
      metaTags: {
        title: titleMatch ? titleMatch[1] : null,
        description: descMatch ? descMatch[1] : null,
        keywords: keywordsMatch ? keywordsMatch[1] : null,
      },
      headings: {
        h1: h1Matches.map(stripHtml),
        h2: h2Matches.map(stripHtml).slice(0, 10),
        h3: h3Matches.map(stripHtml).slice(0, 10),
      },
      links: {
        internal: internalLinks,
        external: externalLinks,
      },
      keywords: topKeywords,
      insights,
      wordCount: words.length,
    };

    console.log('Analysis complete');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error analyzing competitor:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
