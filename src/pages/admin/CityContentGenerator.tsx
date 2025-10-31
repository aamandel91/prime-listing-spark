import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { useRepliersListings } from '@/hooks/useRepliers';

const TEXAS_CITIES = [
  { name: 'Kyle', slug: 'kyle' },
  { name: 'Austin', slug: 'austin' },
  { name: 'San Antonio', slug: 'san-antonio' },
  { name: 'Houston', slug: 'houston' },
  { name: 'Dallas', slug: 'dallas' },
];

export default function CityContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (citySlug: string, cityName: string) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setSelectedCity(citySlug);

    try {
      console.log(`Generating content for ${cityName}...`);
      
      // Call edge function to generate city content
      const { data, error: invokeError } = await supabase.functions.invoke('generate-city-content', {
        body: { 
          city: cityName,
          citySlug: citySlug,
          state: 'TX'
        },
      });

      if (invokeError) throw invokeError;

      console.log('Content generated:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate city content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>City Content Generator | Admin</title>
      </Helmet>
      
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">City Content Generator</h1>
          <p className="text-muted-foreground">
            Generate SEO-optimized content for city pages using Firecrawl and real Repliers API data
          </p>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">How it works</h2>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>• Scrapes competitor city pages for market insights</li>
            <li>• Fetches real property data from Repliers API</li>
            <li>• Generates unique, SEO-optimized descriptions</li>
            <li>• Includes market statistics, neighborhoods, and property types</li>
          </ul>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {TEXAS_CITIES.map((city) => (
            <Card key={city.slug} className="p-6">
              <h3 className="text-xl font-bold mb-2">{city.name}, TX</h3>
              <Button
                onClick={() => handleGenerate(city.slug, city.name)}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating && selectedCity === city.slug ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

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
              <h2 className="text-2xl font-bold">Content Generated!</h2>
            </div>

            <div className="space-y-6">
              {result.description && (
                <div>
                  <h3 className="font-bold mb-2">City Description</h3>
                  <p className="text-sm bg-muted p-4 rounded">{result.description}</p>
                </div>
              )}

              {result.stats && (
                <div>
                  <h3 className="font-bold mb-2">Market Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted p-4 rounded">
                      <div className="text-2xl font-bold">{result.stats.medianPrice}</div>
                      <div className="text-sm text-muted-foreground">Median Price</div>
                    </div>
                    <div className="bg-muted p-4 rounded">
                      <div className="text-2xl font-bold">{result.stats.activeListings}</div>
                      <div className="text-sm text-muted-foreground">Active Listings</div>
                    </div>
                    <div className="bg-muted p-4 rounded">
                      <div className="text-2xl font-bold">{result.stats.avgDaysOnMarket}</div>
                      <div className="text-sm text-muted-foreground">Avg Days</div>
                    </div>
                    <div className="bg-muted p-4 rounded">
                      <div className="text-2xl font-bold">{result.stats.schools}</div>
                      <div className="text-sm text-muted-foreground">School Rating</div>
                    </div>
                  </div>
                </div>
              )}

              {result.neighborhoods && result.neighborhoods.length > 0 && (
                <div>
                  <h3 className="font-bold mb-2">Top Neighborhoods</h3>
                  <div className="space-y-2">
                    {result.neighborhoods.map((n: any, i: number) => (
                      <div key={i} className="bg-muted p-3 rounded flex justify-between">
                        <span>{n.name}</span>
                        <span className="font-bold">{n.avgPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <p className="text-sm">
                  💡 Copy this data and update the CITY_DATA object in src/pages/CityTemplate.tsx
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
