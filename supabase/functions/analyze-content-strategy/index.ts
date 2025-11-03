import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import FirecrawlApp from 'https://esm.sh/@mendable/firecrawl-js@1.9.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, targetUrl, competitors = [] } = await req.json();
    
    console.log('Starting content analysis for keyword:', keyword);
    
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!firecrawlKey || !lovableApiKey) {
      throw new Error('Required API keys not configured');
    }

    const firecrawl = new FirecrawlApp({ apiKey: firecrawlKey });
    
    // Scrape competitor pages
    const competitorData = [];
    for (const url of competitors.slice(0, 5)) { // Limit to top 5
      try {
        console.log('Scraping competitor:', url);
        const scrapeResult = await firecrawl.scrapeUrl(url, {
          formats: ['markdown'],
          onlyMainContent: true
        });
        
        if (scrapeResult.success && scrapeResult.markdown) {
          competitorData.push({
            url,
            content: scrapeResult.markdown,
            wordCount: scrapeResult.markdown.split(/\s+/).length,
            title: scrapeResult.metadata?.title || '',
            description: scrapeResult.metadata?.description || ''
          });
        }
      } catch (error) {
        console.error('Error scraping competitor:', url, error);
      }
    }

    console.log(`Scraped ${competitorData.length} competitor pages`);

    // Analyze with AI
    const analysisPrompt = `You are an SEO content strategist. Analyze these competitor pages ranking for "${keyword}" and provide a comprehensive content strategy.

COMPETITOR DATA:
${competitorData.map((comp, i) => `
Competitor ${i + 1}: ${comp.url}
Title: ${comp.title}
Description: ${comp.description}
Word Count: ${comp.wordCount}
Content Preview: ${comp.content.substring(0, 2000)}...
`).join('\n---\n')}

Provide a detailed analysis in JSON format:
{
  "averageWordCount": number,
  "recommendedWordCount": number (20-30% more than average),
  "commonTopics": ["topic1", "topic2", ...],
  "contentGaps": ["gap1", "gap2", ...],
  "keywordDensity": {"keyword1": "frequency", ...},
  "headingStructure": ["H1 examples", "H2 patterns", ...],
  "uniqueAngles": ["angle1", "angle2", ...],
  "internalLinkingPatterns": ["pattern1", "pattern2", ...],
  "contentDepth": "surface|moderate|comprehensive",
  "recommendedSections": [
    {
      "heading": "Section heading",
      "topics": ["subtopic1", "subtopic2"],
      "wordCount": estimated_words
    }
  ],
  "schemaOpportunities": ["schema1", "schema2", ...],
  "strategicRecommendations": ["rec1", "rec2", ...]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert SEO strategist. Always respond with valid JSON only.' },
          { role: 'user', content: analysisPrompt }
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
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Store analysis in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    await supabase.from('competitor_analyses').insert({
      url: targetUrl || keyword,
      user_id: user?.id,
      status: 'completed',
      result: {
        keyword,
        competitors: competitorData.map(c => ({ url: c.url, wordCount: c.wordCount })),
        analysis,
        analyzedAt: new Date().toISOString()
      }
    });

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        analysis,
        competitorData: competitorData.map(c => ({
          url: c.url,
          wordCount: c.wordCount,
          title: c.title
        }))
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in analyze-content-strategy:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to analyze content strategy' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
