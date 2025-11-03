import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const blogUrlSchema = z.string().url({ message: "Please enter a valid URL" }).min(1, { message: "URL is required" });

export default function BlogMigration() {
  const [blogUrl, setBlogUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  const validateUrl = (url: string) => {
    try {
      blogUrlSchema.parse(url);
      setUrlError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setUrlError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleMigration = async () => {
    if (!validateUrl(blogUrl)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Starting blog migration for:', blogUrl);
      
      const { data, error: invokeError } = await supabase.functions.invoke('migrate-blogs', {
        body: { blogUrl: blogUrl.trim() },
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
    <>
      <Helmet>
        <title>Blog Migration Tool | Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog Migration Tool</h1>
          <p className="text-muted-foreground">
            Import blog posts from your existing website into the CMS
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Migration Settings</h2>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="blogUrl">Blog URL</Label>
              <Input
                id="blogUrl"
                type="url"
                placeholder="https://example.com/blog"
                value={blogUrl}
                onChange={(e) => {
                  setBlogUrl(e.target.value);
                  if (urlError) validateUrl(e.target.value);
                }}
                onBlur={() => validateUrl(blogUrl)}
                className={urlError ? "border-red-500" : ""}
              />
              {urlError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {urlError}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Enter the full URL of your blog (e.g., https://yourdomain.com/blog)
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Crawls all blog posts from the provided URL</li>
              <li>• Extracts titles, content, images, and metadata</li>
              <li>• Imports them into your blog database</li>
              <li>• Skips posts that already exist (safe to run multiple times)</li>
            </ul>
          </div>

          <Button
            onClick={handleMigration}
            disabled={isLoading || !blogUrl}
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
          <Alert variant="destructive">
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
    </>
  );
}
