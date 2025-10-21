import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const SearchDropdown = () => {
  const regions = [
    { name: "Broward/Palm Beach", slug: "broward-palm-beach" },
    { name: "FL Keys", slug: "fl-keys" },
    { name: "Ft Myers/Cape Coral/Naples", slug: "ft-myers-cape-coral-naples" },
    { name: "Miami", slug: "miami" },
    { name: "Orlando", slug: "orlando" },
    { name: "Port St Lucie Metro", slug: "port-st-lucie" },
    { name: "Sarasota", slug: "sarasota" },
    { name: "Tampa/St Pete", slug: "tampa-st-pete" },
  ];

  const tools = [
    { name: "Advanced Search", path: "/advanced-search" },
    { name: "Search by Map", path: "/listings?view=map" },
    { name: "Property Tracker", path: "/property-tracker" },
    { name: "Featured Listings", path: "/listings?featured=true" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger asChild>
          <Link to="/advanced-search">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Search
            </Button>
          </Link>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-2 gap-8 p-6 w-[600px]">
            {/* Search By Region */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Search By Region</h3>
              <ul className="space-y-3">
                {regions.map((region) => (
                  <li key={region.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?region=${region.slug}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {region.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Search Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Search Tools</h3>
              <ul className="space-y-3">
                {tools.map((tool) => (
                  <li key={tool.path}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={tool.path}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
};

export default SearchDropdown;
