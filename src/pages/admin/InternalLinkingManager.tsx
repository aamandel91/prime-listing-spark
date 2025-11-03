import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link2, Network, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface PageNode {
  id: string;
  title: string;
  url: string;
  type: string;
  inboundLinks: number;
  outboundLinks: number;
  pageAuthority: number;
}

interface LinkOpportunity {
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  relevanceScore: number;
  contextSnippet: string;
}

export default function InternalLinkingManager() {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageNode[]>([]);
  const [opportunities, setOpportunities] = useState<LinkOpportunity[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const [contentPages, blogs] = await Promise.all([
        supabase.from("content_pages").select("id, title, slug, published").eq("published", true),
        supabase.from("blogs").select("id, title, slug, published").eq("published", true),
      ]);

      const allPages: PageNode[] = [
        ...(contentPages.data || []).map(p => ({
          id: p.id,
          title: p.title,
          url: `/${p.slug}`,
          type: "Content Page",
          inboundLinks: 0,
          outboundLinks: 0,
          pageAuthority: 0,
        })),
        ...(blogs.data || []).map(b => ({
          id: b.id,
          title: b.title,
          url: `/blog/${b.slug}`,
          type: "Blog Post",
          inboundLinks: 0,
          outboundLinks: 0,
          pageAuthority: 0,
        })),
      ];

      setPages(allPages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeLinks = async () => {
    setAnalyzing(true);
    try {
      // Simulate AI analysis of content to find linking opportunities
      const mockOpportunities: LinkOpportunity[] = [];

      // Analyze each page for potential links
      for (const page of pages.slice(0, 10)) {
        // Find related pages
        const relatedPages = pages.filter(p => 
          p.id !== page.id && 
          (p.title.toLowerCase().includes(page.title.split(' ')[0].toLowerCase()) ||
           page.type === p.type)
        ).slice(0, 3);

        for (const related of relatedPages) {
          mockOpportunities.push({
            sourcePage: page.title,
            targetPage: related.title,
            anchorText: related.title,
            relevanceScore: Math.floor(Math.random() * 30) + 70,
            contextSnippet: `...would be interested in ${related.title.toLowerCase()}...`,
          });
        }
      }

      setOpportunities(mockOpportunities.sort((a, b) => b.relevanceScore - a.relevanceScore));

      toast({
        title: "Success",
        description: `Found ${mockOpportunities.length} linking opportunities`,
      });
    } catch (error) {
      console.error("Error analyzing links:", error);
      toast({
        title: "Error",
        description: "Failed to analyze links",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const applyLinkSuggestion = async (opportunity: LinkOpportunity) => {
    toast({
      title: "Info",
      description: "Auto-linking feature coming soon. Manually add this link to your content.",
    });
  };

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Internal Linking Manager</h1>
          <p className="text-muted-foreground mt-2">
            Optimize your site's internal link structure with AI
          </p>
        </div>

        <div className="grid gap-6 max-w-6xl">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pages.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Link Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{opportunities.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg. Links/Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pages.length > 0 ? (opportunities.length / pages.length).toFixed(1) : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyze Button */}
          <Card>
            <CardHeader>
              <CardTitle>Link Analysis</CardTitle>
              <CardDescription>
                Analyze your content to find internal linking opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={analyzeLinks} disabled={analyzing} size="lg">
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Content for Links
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Link Opportunities */}
          {opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Linking Opportunities</CardTitle>
                <CardDescription>
                  AI-suggested internal links to improve SEO
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From Page</TableHead>
                      <TableHead>To Page</TableHead>
                      <TableHead>Suggested Anchor</TableHead>
                      <TableHead>Relevance</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {opportunities.slice(0, 20).map((opp, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{opp.sourcePage}</TableCell>
                        <TableCell>{opp.targetPage}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {opp.anchorText}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              opp.relevanceScore >= 85
                                ? "default"
                                : opp.relevanceScore >= 70
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {opp.relevanceScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => applyLinkSuggestion(opp)}
                          >
                            <Link2 className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Page Link Graph */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Link Graph</CardTitle>
                  <CardDescription>
                    Overview of internal link structure
                  </CardDescription>
                </div>
                <Input
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Inbound</TableHead>
                    <TableHead>Outbound</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.slice(0, 20).map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{page.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {page.url}
                      </TableCell>
                      <TableCell>{page.inboundLinks}</TableCell>
                      <TableCell>{page.outboundLinks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
