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
    { name: "Austin Metro", city: "Austin", state: "TX" },
    { name: "San Antonio", city: "San Antonio", state: "TX" },
    { name: "Houston", city: "Houston", state: "TX" },
    { name: "Dallas/Fort Worth", city: "Dallas", state: "TX" },
    { name: "Miami Metro", city: "Miami", state: "FL" },
    { name: "Orlando", city: "Orlando", state: "FL" },
    { name: "Tampa Bay", city: "Tampa", state: "FL" },
    { name: "Los Angeles", city: "Los Angeles", state: "CA" },
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
        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
          <Button variant="ghost" className="text-foreground hover:text-primary p-0">
            Search
          </Button>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-2 gap-8 p-6 w-[600px] bg-background z-50">
            {/* Search By Region */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Search By Region</h3>
              <ul className="space-y-3">
                {regions.map((region) => (
                  <li key={region.city}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?city=${encodeURIComponent(region.city)}&state=${region.state}&status=A`}
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
