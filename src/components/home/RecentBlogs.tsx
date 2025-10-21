import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

const RecentBlogs = () => {
  const blogs = [
    {
      id: 1,
      title: "10 Tips for First-Time Home Buyers in Florida",
      excerpt: "Navigate the Florida real estate market with confidence. Learn essential tips that will help you make informed decisions.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      date: "March 15, 2024",
      category: "Buying Guide"
    },
    {
      id: 2,
      title: "Understanding Florida's Housing Market Trends",
      excerpt: "Stay ahead of the curve with our comprehensive analysis of current market conditions and future predictions.",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=800&q=80",
      date: "March 12, 2024",
      category: "Market Insights"
    },
    {
      id: 3,
      title: "How to Prepare Your Home for Sale",
      excerpt: "Maximize your home's value with these proven staging and preparation techniques that attract serious buyers.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      date: "March 8, 2024",
      category: "Selling Tips"
    },
    {
      id: 4,
      title: "Best Neighborhoods for Families in Florida",
      excerpt: "Discover family-friendly communities with excellent schools, parks, and amenities perfect for growing families.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
      date: "March 5, 2024",
      category: "Community"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from Our Blog</h2>
          <p className="text-lg text-muted-foreground">
            Expert insights, market trends, and helpful tips for buyers and sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden hover-scale group">
              <div className="relative h-48 overflow-hidden">
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
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {blog.date}
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

        <div className="text-center">
          <Link to="/blog">
            <Button size="lg" variant="outline" className="group">
              View All Blog Posts
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentBlogs;
