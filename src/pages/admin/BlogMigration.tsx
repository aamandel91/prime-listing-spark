import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, CheckCircle2, XCircle } from 'lucide-react';

export default function BlogMigration() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMigration = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting blog migration...');
      
      const { data, error: invokeError } = await supabase.functions.invoke('migrate-blogs', {
        body: {},
      });

      if (invokeError) throw invokeError;

      console.log('Migration completed:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message || 'Failed to migrate blogs');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog Migration Tool | Admin</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog Migration Tool</h1>
          <p className="text-muted-foreground">
            Import all blog posts from floridahomefinder.com/blog into your new CMS
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">How it works</h2>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Crawls your existing blog at floridahomefinder.com/blog</li>
            <li>• Extracts titles, content, images, and metadata from each post</li>
            <li>• Imports them into your new blog database</li>
            <li>• Skips any posts that already exist (safe to run multiple times)</li>
          </ul>

          <Button
            onClick={handleMigration}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Migrating Blogs...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Start Migration
              </>
            )}
          </Button>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold">Migration Complete!</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {result.imported}
                  </div>
                  <div className="text-sm text-muted-foreground">Blogs Imported</div>
                </div>
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {result.errors}
                  </div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>

              {result.blogs && result.blogs.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Imported Blogs:</h3>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {result.blogs.map((blog: any, i: number) => (
                      <div key={i} className="text-sm p-2 bg-muted rounded">
                        ✓ {blog.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.errorDetails && result.errorDetails.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2 text-red-600">Errors:</h3>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {result.errorDetails.map((err: any, i: number) => (
                      <div key={i} className="text-sm p-2 bg-red-50 dark:bg-red-950 rounded">
                        {err.url}: {err.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
