import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      keyword, 
      contentType, // 'city_page', 'neighborhood_page', 'blog_post', 'property_type_page'
      targetData, // { city, state, propertyType, etc. }
      competitorAnalysis, // Optional: previous analysis result
      additionalContext // Optional: unique data points, local stats, etc.
    } = await req.json();
    
    console.log('Generating SEO content for:', { keyword, contentType, targetData });
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build comprehensive prompt based on analysis and context
    const systemPrompt = `You are an expert real estate SEO content writer. Create comprehensive, engaging, and well-researched content that:
- Ranks better than competitors by being more thorough and useful
- Uses natural keyword integration (never keyword stuffing)
- Includes proper heading hierarchy (H1, H2, H3)
- Provides unique local insights and data
- Engages readers with compelling narratives
- Follows E-E-A-T principles (Experience, Expertise, Authoritativeness, Trust)
- Includes calls-to-action naturally throughout
- Uses semantic keywords and related terms
- Provides actionable information`;

    const contentPrompt = buildContentPrompt(contentType, keyword, targetData, competitorAnalysis, additionalContext);

    console.log('Calling AI to generate content...');
    
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contentPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = JSON.parse(aiData.choices[0].message.content);

    console.log('Content generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-seo-content:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate content' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function buildContentPrompt(
  contentType: string,
  keyword: string,
  targetData: any,
  competitorAnalysis: any,
  additionalContext: any
): string {
  const analysisSection = competitorAnalysis ? `
COMPETITOR ANALYSIS INSIGHTS:
- Average competitor word count: ${competitorAnalysis.averageWordCount}
- Recommended word count: ${competitorAnalysis.recommendedWordCount}
- Common topics covered: ${competitorAnalysis.commonTopics?.join(', ')}
- Content gaps to fill: ${competitorAnalysis.contentGaps?.join(', ')}
- Unique angles to pursue: ${competitorAnalysis.uniqueAngles?.join(', ')}
- Recommended sections: ${JSON.stringify(competitorAnalysis.recommendedSections, null, 2)}
` : '';

  const contextSection = additionalContext ? `
ADDITIONAL CONTEXT:
${JSON.stringify(additionalContext, null, 2)}
` : '';

  switch (contentType) {
    case 'city_page':
      return `Create comprehensive SEO-optimized content for a real estate city page.

TARGET KEYWORD: ${keyword}
CITY: ${targetData.city}
STATE: ${targetData.state}
PROPERTY TYPE: ${targetData.propertyType || 'all types'}

${analysisSection}
${contextSection}

Generate content in this JSON format:
{
  "title": "SEO-optimized H1 title (include city and keyword)",
  "metaTitle": "Meta title (50-60 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "content": "Full HTML content with proper heading structure (H2, H3). ${competitorAnalysis?.recommendedWordCount || 2000}+ words. Include sections on: Overview, Neighborhoods, Market Trends, Lifestyle & Amenities, Schools, Transportation, Investment Opportunities, and FAQ.",
  "internalLinks": [
    {
      "anchorText": "suggested anchor text",
      "targetPage": "suggested page to link to (e.g., neighborhood, property type)"
    }
  ],
  "keywords": ["primary keyword", "semantic keywords"],
  "schema": {
    "type": "LocalBusiness",
    "properties": {}
  }
}`;

    case 'neighborhood_page':
      return `Create detailed SEO content for a neighborhood/subdivision page.

TARGET KEYWORD: ${keyword}
NEIGHBORHOOD: ${targetData.neighborhood}
CITY: ${targetData.city}
STATE: ${targetData.state}

${analysisSection}
${contextSection}

Generate content in this JSON format:
{
  "title": "SEO-optimized H1 title",
  "metaTitle": "Meta title (50-60 chars)",
  "metaDescription": "Meta description (150-160 chars)",
  "content": "Full HTML content. ${competitorAnalysis?.recommendedWordCount || 1800}+ words. Cover: Overview, Property Types, Amenities, Schools, Demographics, Price Trends, Why Live Here, and FAQ.",
  "internalLinks": [...],
  "keywords": [...],
  "schema": {...}
}`;

    case 'blog_post':
      return `Create an engaging, SEO-optimized blog post for a real estate website.

TARGET KEYWORD: ${keyword}
TOPIC: ${targetData.topic}
CITY/AREA: ${targetData.city || 'Florida'}

${analysisSection}
${contextSection}

Generate content in this JSON format:
{
  "title": "Compelling, clickable H1 title",
  "metaTitle": "Meta title (50-60 chars)",
  "metaDescription": "Meta description (150-160 chars)",
  "excerpt": "Brief 150-word excerpt",
  "content": "Full HTML blog content. ${competitorAnalysis?.recommendedWordCount || 1500}+ words. Make it engaging, informative, and actionable. Include expert insights, data, and examples.",
  "featuredImage": "Description of ideal featured image",
  "internalLinks": [
    {
      "anchorText": "natural anchor text",
      "targetPage": "suggested page (city/neighborhood/guide)"
    }
  ],
  "keywords": [...],
  "category": "suggested blog category"
}`;

    case 'property_type_page':
      return `Create SEO content for a property type page in a specific city.

TARGET KEYWORD: ${keyword}
PROPERTY TYPE: ${targetData.propertyType}
CITY: ${targetData.city}
STATE: ${targetData.state}

${analysisSection}
${contextSection}

Generate content in this JSON format:
{
  "title": "SEO-optimized H1 title",
  "metaTitle": "Meta title (50-60 chars)",
  "metaDescription": "Meta description (150-160 chars)",
  "content": "Full HTML content. ${competitorAnalysis?.recommendedWordCount || 1800}+ words. Cover: Overview, Popular Areas, Price Ranges, Market Trends, Buyer's Guide, Investment Analysis, and FAQ.",
  "internalLinks": [...],
  "keywords": [...],
  "schema": {...}
}`;

    default:
      return `Create comprehensive SEO-optimized content.

TARGET KEYWORD: ${keyword}
${JSON.stringify(targetData, null, 2)}

${analysisSection}
${contextSection}

Generate well-structured, SEO-optimized content in JSON format with title, metaTitle, metaDescription, content (HTML), internalLinks, and keywords.`;
  }
}
