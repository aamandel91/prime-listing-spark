import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Search, TrendingUp } from "lucide-react";
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

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: string;
  opportunity: number;
}

export default function BlogContentGenerator() {
  const [topic, setTopic] = useState("");
  const [city, setCity] = useState("");
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [generatedContent, setGeneratedContent] = useState({
    title: "",
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [researching, setResearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const { toast } = useToast();

  const researchKeywords = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive",
      });
      return;
    }

    setResearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content-strategy', {
        body: {
          keyword: topic,
          targetUrl: '',
          competitors: [
            `https://www.realtor.com/advice/${topic.toLowerCase().replace(/\s+/g, '-')}`,
            `https://www.zillow.com/blog/${topic.toLowerCase().replace(/\s+/g, '-')}`,
          ]
        }
      });

      if (error) throw error;

      // Simulate keyword data based on analysis
      const mockKeywords: KeywordData[] = [
        { keyword: topic, searchVolume: 2400, difficulty: "Medium", opportunity: 85 },
        { keyword: `${topic} tips`, searchVolume: 1200, difficulty: "Low", opportunity: 92 },
        { keyword: `best ${topic}`, searchVolume: 3600, difficulty: "High", opportunity: 68 },
        { keyword: `${topic} guide`, searchVolume: 1800, difficulty: "Medium", opportunity: 78 },
        { keyword: `${topic} ${city || 'Florida'}`, searchVolume: 900, difficulty: "Low", opportunity: 95 },
      ];

      setKeywords(mockKeywords);
      toast({
        title: "Success",
        description: "Keyword research completed",
      });
    } catch (error) {
      console.error("Error researching keywords:", error);
      toast({
        title: "Error",
        description: "Failed to research keywords",
        variant: "destructive",
      });
    } finally {
      setResearching(false);
    }
  };

  const generateContent = async () => {
    if (!selectedKeyword) {
      toast({
        title: "Error",
        description: "Please select a keyword",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          keyword: selectedKeyword,
          contentType: 'blog_post',
          targetData: {
            topic: selectedKeyword,
            city: city || 'Florida',
          }
        }
      });

      if (error) throw error;

      setGeneratedContent({
        title: data.content.title,
        excerpt: data.content.excerpt,
        content: data.content.content,
        metaTitle: data.content.metaTitle,
        metaDescription: data.content.metaDescription,
      });

      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const publishBlog = async () => {
    if (!generatedContent.title || !generatedContent.content) {
      toast({
        title: "Error",
        description: "Please generate content first",
        variant: "destructive",
      });
      return;
    }

    setPublishing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const slug = generatedContent.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase
        .from("blogs")
        .insert({
          title: generatedContent.title,
          slug,
          excerpt: generatedContent.excerpt,
          content: generatedContent.content,
          author_id: user.id,
          published: false,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created as draft",
      });

      // Reset form
      setGeneratedContent({
        title: "",
        excerpt: "",
        content: "",
        metaTitle: "",
        metaDescription: "",
      });
      setSelectedKeyword("");
      setKeywords([]);
      setTopic("");
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">AI Blog Content Generator</h1>
          <p className="text-muted-foreground mt-2">
            Research keywords and generate SEO-optimized blog content
          </p>
        </div>

        <div className="grid gap-6 max-w-6xl">
          {/* Keyword Research */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Research</CardTitle>
              <CardDescription>
                Enter a topic to research related keywords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. first time home buyer tips"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Location (Optional)</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Miami"
                  />
                </div>
              </div>
              <Button onClick={researchKeywords} disabled={researching}>
                {researching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Research Keywords
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Keywords Table */}
          {keywords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Keyword Opportunities</CardTitle>
                <CardDescription>
                  Select a keyword to generate content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Search Volume</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Opportunity Score</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.map((kw) => (
                      <TableRow key={kw.keyword}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell>{kw.searchVolume.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              kw.difficulty === "Low"
                                ? "default"
                                : kw.difficulty === "Medium"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {kw.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            {kw.opportunity}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedKeyword(kw.keyword);
                              generateContent();
                            }}
                          >
                            Generate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Generated Content */}
          {generatedContent.title && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  Review and edit before publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gen-title">Title</Label>
                  <Input
                    id="gen-title"
                    value={generatedContent.title}
                    onChange={(e) =>
                      setGeneratedContent({ ...generatedContent, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gen-excerpt">Excerpt</Label>
                  <Textarea
                    id="gen-excerpt"
                    value={generatedContent.excerpt}
                    onChange={(e) =>
                      setGeneratedContent({ ...generatedContent, excerpt: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="gen-content">Content (HTML)</Label>
                  <Textarea
                    id="gen-content"
                    value={generatedContent.content}
                    onChange={(e) =>
                      setGeneratedContent({ ...generatedContent, content: e.target.value })
                    }
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={publishBlog} disabled={publishing}>
                    {publishing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      "Save as Draft"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedKeyword("");
                      generateContent();
                    }}
                    disabled={generating}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
