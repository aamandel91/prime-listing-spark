import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const PopularSearches = () => {
  const searches = [
    { title: "Just Listed Homes", link: "/listings?filter=just-listed" },
    { title: "Open Houses", link: "/listings?filter=open-house" },
    { title: "1 Story Homes", link: "/listings?filter=1-story" },
    { title: "2 Story Homes", link: "/listings?filter=2-story" },
    { title: "Homes With Pool", link: "/listings?filter=pool" },
    { title: "55+ Adult Communities", link: "/listings?filter=55plus" },
    { title: "FHA Approved", link: "/listings?filter=fha" },
    { title: "VA Approved", link: "/listings?filter=va" },
    { title: "Gated Community", link: "/listings?filter=gated" },
    { title: "No HOA", link: "/listings?filter=no-hoa" },
    { title: "Pet Friendly Condos", link: "/listings?filter=pet-friendly" },
    { title: "Luxury", link: "/listings?filter=luxury" },
    { title: "Waterfront", link: "/listings?filter=waterfront" },
    { title: "Foreclosures", link: "/listings?filter=foreclosure" },
    { title: "Short Sales", link: "/listings?filter=short-sale" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Searches</h2>
          <p className="text-lg text-muted-foreground">
            Quick links to the most searched property types
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {searches.map((search) => (
              <Link
                key={search.title}
                to={search.link}
                className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
              >
                <Search className="w-4 h-4" />
                <span className="font-medium">{search.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
