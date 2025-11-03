import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, CheckCircle2, XCircle, ExternalLink, Clock, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Analysis {
  id: string;
  created_at: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: any;
  error_message: string | null;
}

export default function CompetitorAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [url, setUrl] = useState('');
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchAnalyses, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('competitor_analyses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses((data as Analysis[]) || []);
    } catch (err: any) {
      console.error('Error fetching analyses:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Create analysis job
      const { data: job, error: insertError } = await supabase
        .from('competitor_analyses')
        .insert({
          url,
          user_id: user.user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('Starting analysis job:', job.id);

      // Start the background analysis
      const { error: invokeError } = await supabase.functions.invoke('analyze-competitor-seo', {
        body: { analysisId: job.id },
      });

      if (invokeError) throw invokeError;

      toast({
        title: 'Analysis Started',
        description: 'Your competitor analysis is running in the background. You can navigate away and check back later.',
      });

      setUrl('');
      fetchAnalyses();
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to start analysis');
      toast({
        title: 'Error',
        description: err.message || 'Failed to start analysis',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('competitor_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Deleted',
        description: 'Analysis deleted successfully',
      });

      fetchAnalyses();
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete analysis',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="text-yellow-600 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'processing':
        return <span className="text-blue-600 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Processing</span>;
      case 'completed':
        return <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>;
      case 'failed':
        return <span className="text-red-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Failed</span>;
      default:
        return status;
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

        {/* Analysis History */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Analysis History</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalyses}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {analyses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No analyses yet. Start your first competitor analysis above.
            </p>
          ) : (
            <div className="space-y-2">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(analysis.status)}
                      <a
                        href={analysis.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {analysis.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(analysis.created_at).toLocaleString()}
                    </p>
                    {analysis.error_message && (
                      <p className="text-xs text-red-600 mt-1">Error: {analysis.error_message}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {analysis.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        View Results
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(analysis.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {selectedAnalysis?.result && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold">Analysis Results</h2>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={selectedAnalysis.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary flex items-center gap-1"
                  >
                    View Page <ExternalLink className="w-3 h-3" />
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedAnalysis(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>

              {selectedAnalysis.result.metaTags && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Meta Tags</h3>
                  {renderMetaTags(selectedAnalysis.result.metaTags)}
                </div>
              )}

              {selectedAnalysis.result.headings && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Heading Structure</h3>
                  <div className="space-y-2">
                    {selectedAnalysis.result.headings.h1 && selectedAnalysis.result.headings.h1.length > 0 && (
                      <div>
                        <span className="font-semibold">H1 ({selectedAnalysis.result.headings.h1.length}):</span>
                        <ul className="text-sm bg-muted p-2 rounded mt-1 space-y-1">
                          {selectedAnalysis.result.headings.h1.map((h: string, i: number) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedAnalysis.result.headings.h2 && selectedAnalysis.result.headings.h2.length > 0 && (
                      <div>
                        <span className="font-semibold">H2 ({selectedAnalysis.result.headings.h2.length}):</span>
                        <ul className="text-sm bg-muted p-2 rounded mt-1 max-h-40 overflow-y-auto space-y-1">
                          {selectedAnalysis.result.headings.h2.map((h: string, i: number) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedAnalysis.result.links && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Link Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded">
                      <div className="text-3xl font-bold">{selectedAnalysis.result.links.internal || 0}</div>
                      <div className="text-sm text-muted-foreground">Internal Links</div>
                    </div>
                    <div className="bg-muted p-4 rounded">
                      <div className="text-3xl font-bold">{selectedAnalysis.result.links.external || 0}</div>
                      <div className="text-sm text-muted-foreground">External Links</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedAnalysis.result.keywords && selectedAnalysis.result.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-lg">Top Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnalysis.result.keywords.slice(0, 20).map((kw: any, i: number) => (
                      <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {kw.word} ({kw.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedAnalysis.result.insights && (
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                  <h3 className="font-bold mb-2">Key Insights</h3>
                  <ul className="text-sm space-y-1">
                    {selectedAnalysis.result.insights.map((insight: string, i: number) => (
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
