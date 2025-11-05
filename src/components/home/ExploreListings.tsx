import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OptimizedImage from "@/components/OptimizedImage";

const ExploreListings = () => {
  const metros = [
    {
      name: "Miami Metro",
      image: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80",
      searchParams: "?city=Miami"
    },
    {
      name: "Broward/Palm Beach Metro",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80",
      searchParams: "?city=Fort%20Lauderdale"
    },
    {
      name: "Port St Lucie Metro",
      image: "https://images.unsplash.com/photo-1542401886-65d6c61db217?auto=format&fit=crop&w=800&q=80",
      searchParams: "?city=Port%20St%20Lucie"
    },
    {
      name: "Orlando Metro",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
      searchParams: "?city=Orlando"
    },
    {
      name: "Tampa/St Pete Metro",
      image: "https://images.unsplash.com/photo-1605708613525-284002547674?auto=format&fit=crop&w=800&q=80",
      searchParams: "?city=Tampa"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Explore Listings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metros.map((metro) => (
            <Link 
              key={metro.name}
              to={`/listings${metro.searchParams}`}
              className="group relative h-80 rounded-lg overflow-hidden hover-scale"
            >
              <OptimizedImage
                src={metro.image}
                alt={metro.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                width={640}
                height={480}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold mb-4 text-center px-4">
                  {metro.name}
                </h3>
                <Button 
                  variant="outline" 
                  className="border-white text-white bg-white/10 hover:bg-white hover:text-foreground backdrop-blur-sm"
                >
                  View Listings
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreListings;
