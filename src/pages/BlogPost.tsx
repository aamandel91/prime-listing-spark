import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbSEO } from "@/components/ui/breadcrumb-seo";
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();

  // Mock blog data - in a real app, this would come from an API
  const allBlogs = [
    {
      id: 1,
      title: "10 Tips for First-Time Home Buyers in Florida",
      excerpt: "Navigate the Florida real estate market with confidence. Learn essential tips that will help you make informed decisions when purchasing your first home.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      date: "March 15, 2024",
      category: "Buying Guide",
      author: "Sarah Johnson",
      readTime: "8 min read",
      content: `
        <h2>Getting Started with Your Home Search</h2>
        <p>Buying your first home in Florida is an exciting milestone, but it can also feel overwhelming. With so many factors to consider, from location and budget to market conditions and financing options, first-time buyers often don't know where to begin.</p>
        
        <p>Florida's real estate market offers unique opportunities and challenges. The state's diverse regions, from bustling metropolitan areas to peaceful coastal towns, each have their own character and market dynamics. Understanding these nuances is key to making a smart purchase.</p>

        <h2>1. Get Pre-Approved for a Mortgage</h2>
        <p>Before you start house hunting, getting pre-approved for a mortgage is crucial. This process involves a lender reviewing your financial situation and determining how much they're willing to lend you. Pre-approval shows sellers you're a serious buyer and gives you a clear budget to work with.</p>

        <h2>2. Research Florida's Housing Markets</h2>
        <p>Florida isn't a monolithic market. Miami, Tampa, Orlando, and Jacksonville each have different price points, inventory levels, and buyer demographics. Take time to research which areas align with your lifestyle and budget.</p>

        <h2>3. Consider Hurricane Insurance</h2>
        <p>Florida's hurricane season is a reality that affects homeownership costs. Hurricane insurance is often required by lenders and can significantly impact your monthly housing expenses. Factor this into your budget from the start.</p>

        <h2>4. Work with a Local Real Estate Agent</h2>
        <p>A knowledgeable local agent can be invaluable, especially for first-time buyers. They understand market trends, neighborhood dynamics, and can guide you through the entire buying process.</p>

        <h2>5. Don't Skip the Home Inspection</h2>
        <p>In Florida's humid climate, homes can face unique challenges like moisture damage, mold, and pest issues. A thorough home inspection can uncover problems that aren't visible during showings and give you negotiating leverage.</p>

        <h2>6. Understand HOA Rules</h2>
        <p>Many Florida communities have Homeowners Associations with specific rules and fees. Review these carefully before buying to ensure they align with your lifestyle and budget.</p>

        <h2>7. Factor in Property Taxes</h2>
        <p>Florida has no state income tax, but property taxes vary by county. Research property tax rates in your target areas to understand the full cost of homeownership.</p>

        <h2>8. Time Your Purchase Wisely</h2>
        <p>Florida's real estate market has seasonal patterns, with peak activity in winter months when snowbirds arrive. Understanding these cycles can help you time your purchase for better deals.</p>

        <h2>9. Build an Emergency Fund</h2>
        <p>Homeownership comes with unexpected expenses. Having 3-6 months of expenses saved can help you handle surprises like AC repairs or roof damage without financial stress.</p>

        <h2>10. Think Long-Term</h2>
        <p>Consider how your needs might change over the next 5-10 years. Are you planning to start a family? Will you need a home office? Buying with the future in mind can save you from needing to move again too soon.</p>

        <h2>Final Thoughts</h2>
        <p>Buying your first home in Florida is a significant investment, but with proper preparation and guidance, it can be a smooth and rewarding experience. Take your time, do your research, and don't hesitate to ask questions throughout the process.</p>
      `
    },
    {
      id: 2,
      title: "Understanding Florida's Housing Market Trends",
      excerpt: "Stay ahead of the curve with our comprehensive analysis of current market conditions and future predictions for Florida's real estate landscape.",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1200&q=80",
      date: "March 12, 2024",
      category: "Market Insights",
      author: "Michael Chen",
      readTime: "6 min read",
      content: `
        <h2>Current Market Overview</h2>
        <p>Florida's housing market continues to show resilience and growth, driven by population influx, remote work trends, and the state's attractive tax environment. Understanding these trends is crucial for both buyers and sellers.</p>

        <h2>Price Trends and Appreciation</h2>
        <p>Home prices in Florida have seen steady appreciation over the past several years, with some markets experiencing double-digit growth. However, the rate of increase is beginning to moderate as inventory levels improve.</p>

        <h2>Supply and Demand Dynamics</h2>
        <p>While inventory remains below historic averages in many Florida markets, we're seeing gradual improvements. New construction is helping to meet demand, particularly in growing suburban areas.</p>

        <h2>Regional Variations</h2>
        <p>Different regions of Florida are experiencing varying market conditions. South Florida remains competitive with limited inventory, while Central and North Florida are seeing more balanced conditions.</p>
      `
    },
    // Add more blog posts as needed
  ];

  const blog = allBlogs.find(b => b.id === parseInt(id || "1")) || allBlogs[0];
  
  const relatedPosts = allBlogs
    .filter(b => b.category === blog.category && b.id !== blog.id)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = blog.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  // SEO Content
  const pageTitle = `${blog.title} | FloridaHomeFinder Blog`;
  const pageDescription = blog.excerpt;
  const pageUrl = `${window.location.origin}/blog/${id}`;

  // Structured data for Article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": blog.image,
      "width": 1200,
      "height": 630
    },
    "datePublished": blog.date,
    "dateModified": blog.date,
    "author": {
      "@type": "Person",
      "name": blog.author,
      "url": `${window.location.origin}/blog?author=${encodeURIComponent(blog.author)}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "FloridaHomeFinder",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "articleSection": blog.category,
    "keywords": `${blog.category}, Florida real estate, home buying, real estate tips, ${blog.author}`,
    "wordCount": blog.content.split(' ').length,
    "articleBody": blog.excerpt
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${window.location.origin}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.category,
        "item": `${window.location.origin}/blog?category=${encodeURIComponent(blog.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": blog.title,
        "item": pageUrl
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${blog.category}, Florida real estate, real estate tips, ${blog.author}, home buying guide, property market`} />
        <meta name="author" content={blog.author} />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:site_name" content="FloridaHomeFinder" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blog.title} />
        <meta property="article:published_time" content={blog.date} />
        <meta property="article:modified_time" content={blog.date} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        <meta property="article:tag" content={blog.category} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@FloridaHomeFinder" />
        <meta name="twitter:creator" content={`@${blog.author.replace(' ', '')}`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={blog.image} />
        <meta name="twitter:image:alt" content={blog.title} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[50vh] md:h-[60vh] bg-muted">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link to="/blog">
              <Button size="icon" variant="secondary" className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 max-w-4xl -mt-20 relative z-10">
          <Card className="p-8 md:p-12">
            {/* Breadcrumbs */}
            <BreadcrumbSEO 
              items={[
                { label: "Blog", href: "/blog" },
                { label: blog.category, href: `/blog?category=${encodeURIComponent(blog.category)}` },
                { label: blog.title, href: `/blog/${id}` }
              ]} 
            />
            
            {/* Category Badge */}
            <div className="mb-4">
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {blog.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{blog.date}</span>
              </div>
              <span>{blog.readTime}</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 mb-8">
              <span className="text-sm font-medium mr-2">Share:</span>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: blog.title,
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <Separator className="mb-8" />

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 mb-16">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="overflow-hidden hover-scale group h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-sm font-semibold text-primary">
                          {post.category}
                        </span>
                        <h3 className="text-lg font-bold mt-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {post.date}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
