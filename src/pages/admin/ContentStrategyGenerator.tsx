import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, TrendingUp, FileText, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function ContentStrategyGenerator() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Analysis form
  const [keyword, setKeyword] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [competitors, setCompetitors] = useState("");

  // Content generation form
  const [contentType, setContentType] = useState("city_page");
  const [city, setCity] = useState("");
  const [state, setState] = useState("FL");
  const [propertyType, setPropertyType] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const handleAnalyze = async () => {
    if (!keyword) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter a target keyword"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const competitorList = competitors
        .split('\n')
        .map(url => url.trim())
        .filter(url => url);

      const { data, error } = await supabase.functions.invoke('analyze-content-strategy', {
        body: {
          keyword,
          targetUrl: targetUrl || undefined,
          competitors: competitorList
        }
      });

      if (error) throw error;

      if (data.success) {
        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete",
          description: `Analyzed ${data.competitorData?.length || 0} competitor pages`
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze competitors"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!keyword || !city) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please enter keyword and city"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const targetData: any = {
        city,
        state,
        propertyType: propertyType || undefined
      };

      if (contentType === 'neighborhood_page') {
        targetData.neighborhood = keyword;
      } else if (contentType === 'blog_post') {
        targetData.topic = keyword;
      }

      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          keyword,
          contentType,
          targetData,
          competitorAnalysis: analysis || undefined,
          additionalContext: additionalContext || undefined
        }
      });

      if (error) throw error;

      if (data.success) {
        setGeneratedContent(data.content);
        toast({
          title: "Content Generated",
          description: "SEO-optimized content created successfully"
        });
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: error.message || "Failed to generate content"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = async () => {
    if (!generatedContent) return;

    try {
      if (contentType === 'blog_post') {
        const { error } = await supabase.from('blogs').insert({
          title: generatedContent.title,
          slug: generatedContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          published: false,
          author_id: (await supabase.auth.getUser()).data.user?.id
        });

        if (error) throw error;

        toast({
          title: "Blog Saved",
          description: "Blog post saved as draft"
        });
        navigate('/admin/blogs');
      } else {
        const { error } = await supabase.from('content_pages').insert({
          title: generatedContent.title,
          slug: generatedContent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          content: generatedContent.content,
          meta_title: generatedContent.metaTitle,
          meta_description: generatedContent.metaDescription,
          published: false
        });

        if (error) throw error;

        toast({
          title: "Page Saved",
          description: "Content page saved as draft"
        });
        navigate('/admin/content-pages');
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Failed to save content"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Content Strategy Generator</h1>
        <p className="text-muted-foreground">
          Analyze competitors and generate SEO-optimized content that ranks
        </p>
      </div>

      <Tabs defaultValue="analyze" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analyze">
              <TrendingUp className="w-4 h-4 mr-2" />
              Competitor Analysis
            </TabsTrigger>
            <TabsTrigger value="generate">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </TabsTrigger>
            {generatedContent && (
              <TabsTrigger value="review">
                <FileText className="w-4 h-4 mr-2" />
                Review
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Analyze Competition</CardTitle>
                <CardDescription>
                  Provide your target keyword and competitor URLs to analyze their content strategy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="keyword">Target Keyword *</Label>
                  <Input
                    id="keyword"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g., homes for sale in Miami FL"
                  />
                </div>

                <div>
                  <Label htmlFor="targetUrl">Your Current Page URL (optional)</Label>
                  <Input
                    id="targetUrl"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://yoursite.com/miami-homes"
                  />
                </div>

                <div>
                  <Label htmlFor="competitors">Competitor URLs (one per line)</Label>
                  <Textarea
                    id="competitors"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="https://competitor1.com/page&#10;https://competitor2.com/page&#10;https://competitor3.com/page"
                    rows={6}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter up to 5 competitor URLs that rank for your keyword
                  </p>
                </div>

                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Competitors'}
                </Button>
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Average Word Count</Label>
                      <p className="text-2xl font-bold">{analysis.averageWordCount}</p>
                    </div>
                    <div>
                      <Label>Recommended Word Count</Label>
                      <p className="text-2xl font-bold text-primary">{analysis.recommendedWordCount}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label>Common Topics</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.commonTopics?.map((topic: string, i: number) => (
                        <Badge key={i} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Content Gaps (Opportunities)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {analysis.contentGaps?.map((gap: string, i: number) => (
                        <Badge key={i} variant="outline">{gap}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Recommended Sections</Label>
                    <div className="space-y-2 mt-2">
                      {analysis.recommendedSections?.map((section: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded">
                          <p className="font-semibold">{section.heading}</p>
                          <p className="text-sm text-muted-foreground">
                            Topics: {section.topics?.join(', ')} • ~{section.wordCount} words
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Generate SEO Content</CardTitle>
                <CardDescription>
                  {analysis 
                    ? "Using competitor analysis to create superior content" 
                    : "Generate content without analysis (less optimized)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="city_page">City Page</SelectItem>
                      <SelectItem value="neighborhood_page">Neighborhood Page</SelectItem>
                      <SelectItem value="property_type_page">Property Type Page</SelectItem>
                      <SelectItem value="blog_post">Blog Post</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Miami"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="FL"
                    />
                  </div>
                </div>

                {(contentType === 'property_type_page' || contentType === 'city_page') && (
                  <div>
                    <Label htmlFor="propertyType">Property Type (optional)</Label>
                    <Input
                      id="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      placeholder="Single Family Homes"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="additionalContext">Additional Context (optional)</Label>
                  <Textarea
                    id="additionalContext"
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Local market stats, unique selling points, recent developments..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isGenerating ? 'Generating...' : 'Generate Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {generatedContent && (
            <TabsContent value="review" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Content Preview</CardTitle>
                  <CardDescription>Review and save your SEO-optimized content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Title (H1)</Label>
                    <p className="text-2xl font-bold mt-1">{generatedContent.title}</p>
                  </div>

                  <div>
                    <Label>Meta Title</Label>
                    <p className="text-sm mt-1">{generatedContent.metaTitle}</p>
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <p className="text-sm mt-1">{generatedContent.metaDescription}</p>
                  </div>

                  {generatedContent.keywords && (
                    <div>
                      <Label>Target Keywords</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedContent.keywords.map((kw: string, i: number) => (
                          <Badge key={i}>{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <Label>Content ({generatedContent.content?.split(/\s+/).length || 0} words)</Label>
                    <div 
                      className="prose prose-sm max-w-none mt-2 p-4 bg-muted rounded"
                      dangerouslySetInnerHTML={{ __html: generatedContent.content }}
                    />
                  </div>

                  {generatedContent.internalLinks && generatedContent.internalLinks.length > 0 && (
                    <div>
                      <Label>Suggested Internal Links</Label>
                      <div className="space-y-2 mt-2">
                        {generatedContent.internalLinks.map((link: any, i: number) => (
                          <div key={i} className="p-2 bg-muted rounded text-sm">
                            <span className="font-semibold">{link.anchorText}</span>
                            <span className="text-muted-foreground"> → {link.targetPage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleSaveContent} className="flex-1">
                      Save as Draft
                    </Button>
                    <Button variant="outline" onClick={() => setGeneratedContent(null)}>
                      Discard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
    </div>
  );
}
