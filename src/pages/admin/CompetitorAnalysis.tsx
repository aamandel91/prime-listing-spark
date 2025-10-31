import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function CompetitorAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log('Analyzing competitor:', url);
      
      const { data, error: invokeError } = await supabase.functions.invoke('analyze-competitor-seo', {
        body: { url },
      });

      if (invokeError) throw invokeError;

      console.log('Analysis complete:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze competitor');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderMetaTags = (tags: any) => {
    if (!tags) return null;
    
    return (
      <div className="space-y-2">
        {tags.title && (
          <div>
            <span className="font-semibold">Title:</span>
            <p className="text-sm bg-muted p-2 rounded mt-1">{tags.title}</p>
          </div>
        )}
        {tags.description && (
          <div>
            <span className="font-semibold">Meta Description:</span>
            <p className="text-sm bg-muted p-2 rounded mt-1">{tags.description}</p>
          </div>
        )}
        {tags.keywords && (
          <div>
            <span className="font-semibold">Keywords:</span>
            <p className="text-sm bg-muted p-2 rounded mt-1">{tags.keywords}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Competitor SEO Analysis | Admin</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Competitor SEO Analysis</h1>
          <p className="text-muted-foreground">
            Analyze competitor real estate websites to extract SEO strategies and content insights
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">What we analyze</h2>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Meta tags (title, description, keywords)</li>
            <li>• Heading structure (H1, H2, H3)</li>
            <li>• Internal and external links</li>
            <li>• Content keywords and density</li>
            <li>• Page structure and organization</li>
            <li>• Image optimization (alt tags)</li>
          </ul>

          <div className="flex gap-2">
            <Input
              placeholder="https://competitor-website.com/city-page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold">Analysis Complete</h2>
                </div>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary flex items-center gap-1"
                >
                  View Page <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {result.metaTags && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Meta Tags</h3>
                  {renderMetaTags(result.metaTags)}
                </div>
              )}

              {result.headings && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Heading Structure</h3>
                  <div className="space-y-2">
                    {result.headings.h1 && result.headings.h1.length > 0 && (
                      <div>
                        <span className="font-semibold">H1 ({result.headings.h1.length}):</span>
                        <ul className="text-sm bg-muted p-2 rounded mt-1 space-y-1">
                          {result.headings.h1.map((h: string, i: number) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {result.headings.h2 && result.headings.h2.length > 0 && (
                      <div>
                        <span className="font-semibold">H2 ({result.headings.h2.length}):</span>
                        <ul className="text-sm bg-muted p-2 rounded mt-1 max-h-40 overflow-y-auto space-y-1">
                          {result.headings.h2.map((h: string, i: number) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.links && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Link Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded">
                      <div className="text-3xl font-bold">{result.links.internal || 0}</div>
                      <div className="text-sm text-muted-foreground">Internal Links</div>
                    </div>
                    <div className="bg-muted p-4 rounded">
                      <div className="text-3xl font-bold">{result.links.external || 0}</div>
                      <div className="text-sm text-muted-foreground">External Links</div>
                    </div>
                  </div>
                </div>
              )}

              {result.keywords && result.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Top Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.slice(0, 20).map((kw: any, i: number) => (
                      <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {kw.word} ({kw.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.insights && (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                  <h3 className="font-bold mb-2">Key Insights</h3>
                  <ul className="text-sm space-y-1">
                    {result.insights.map((insight: string, i: number) => (
                      <li key={i}>• {insight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
