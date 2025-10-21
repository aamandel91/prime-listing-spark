import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, ArrowRight, Search } from "lucide-react";

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "10 Tips for First-Time Home Buyers in Florida",
      excerpt: "Navigate the Florida real estate market with confidence. Learn essential tips that will help you make informed decisions when purchasing your first home.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      date: "March 15, 2024",
      category: "Buying Guide",
      author: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Understanding Florida's Housing Market Trends",
      excerpt: "Stay ahead of the curve with our comprehensive analysis of current market conditions and future predictions for Florida's real estate landscape.",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80",
      date: "March 12, 2024",
      category: "Market Insights",
      author: "Michael Chen"
    },
    {
      id: 3,
      title: "How to Prepare Your Home for Sale",
      excerpt: "Maximize your home's value with these proven staging and preparation techniques that attract serious buyers and generate competitive offers.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      date: "March 8, 2024",
      category: "Selling Tips",
      author: "Emily Rodriguez"
    },
    {
      id: 4,
      title: "Best Neighborhoods for Families in Florida",
      excerpt: "Discover family-friendly communities with excellent schools, parks, and amenities perfect for growing families looking to settle down.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      date: "March 5, 2024",
      category: "Community",
      author: "David Martinez"
    },
    {
      id: 5,
      title: "Investment Opportunities in Florida Real Estate",
      excerpt: "Explore lucrative investment strategies and emerging markets that offer exceptional returns in Florida's dynamic property sector.",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80",
      date: "March 1, 2024",
      category: "Investment",
      author: "Jennifer Lee"
    },
    {
      id: 6,
      title: "The Complete Guide to Home Inspections",
      excerpt: "Learn what to expect during a home inspection and how to interpret the results to make informed purchasing decisions.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
      date: "February 28, 2024",
      category: "Buying Guide",
      author: "Robert Thompson"
    },
    {
      id: 7,
      title: "Luxury Real Estate Trends in South Florida",
      excerpt: "Dive into the exclusive world of luxury properties and discover what's driving demand in South Florida's premium market.",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      date: "February 25, 2024",
      category: "Luxury",
      author: "Amanda Foster"
    },
    {
      id: 8,
      title: "Navigating the Mortgage Process",
      excerpt: "Demystify the mortgage application process with our step-by-step guide to securing financing for your dream home.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
      date: "February 22, 2024",
      category: "Finance",
      author: "James Wilson"
    }
  ];

  const categories = ["All", "Buying Guide", "Selling Tips", "Market Insights", "Investment", "Community", "Luxury", "Finance"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Real Estate Blog</h1>
              <p className="text-xl mb-8 text-primary-foreground/90">
                Expert insights, market trends, and helpful tips for buyers and sellers
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search articles..."
                  className="pl-12 h-14 bg-background text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border bg-background sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden hover-scale group">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {blog.date}
                      </div>
                      <span>{blog.author}</span>
                    </div>
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                    <Link to={`/blog/${blog.id}`}>
                      <Button variant="link" className="p-0 h-auto text-primary">
                        Read More <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button variant="outline">Previous</Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
