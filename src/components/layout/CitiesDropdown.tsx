import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const CitiesDropdown = () => {
  const eastCoast = [
    { name: "Boca Raton", slug: "boca-raton" },
    { name: "Coral Gables", slug: "coral-gables" },
    { name: "Delray Beach", slug: "delray-beach" },
    { name: "Fort Lauderdale", slug: "fort-lauderdale" },
    { name: "Jupiter", slug: "jupiter" },
    { name: "Miami", slug: "miami" },
    { name: "Parkland", slug: "parkland" },
    { name: "Pompano Beach", slug: "pompano-beach" },
    { name: "Port St Lucie", slug: "port-st-lucie" },
    { name: "West Palm Beach", slug: "west-palm-beach" },
  ];

  const westCoast = [
    { name: "Bradenton", slug: "bradenton" },
    { name: "Cape Coral", slug: "cape-coral" },
    { name: "Clearwater", slug: "clearwater" },
    { name: "Fort Myers Metro", slug: "fort-myers" },
    { name: "Marco Island", slug: "marco-island" },
    { name: "Naples", slug: "naples" },
    { name: "Sarasota", slug: "sarasota" },
    { name: "St. Petersburg", slug: "st-petersburg" },
    { name: "Tampa", slug: "tampa" },
  ];

  const centralFlorida = [
    { name: "Gainesville", slug: "gainesville" },
    { name: "Kissimmee", slug: "kissimmee" },
    { name: "Lake Mary", slug: "lake-mary" },
    { name: "Maitland", slug: "maitland" },
    { name: "Ocala", slug: "ocala" },
    { name: "Orlando", slug: "orlando" },
    { name: "Windermere", slug: "windermere" },
    { name: "Winter Park", slug: "winter-park" },
    { name: "Winter Springs", slug: "winter-springs" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger asChild>
          <Link to="/cities">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Cities
            </Button>
          </Link>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-3 gap-8 p-6 w-[800px] bg-background">
            {/* East Coast */}
            <div>
              <h3 className="text-lg font-semibold mb-4">East Coast</h3>
              <ul className="space-y-3">
                {eastCoast.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/city/${city.slug}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {city.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* West Coast */}
            <div>
              <h3 className="text-lg font-semibold mb-4">West Coast</h3>
              <ul className="space-y-3">
                {westCoast.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/city/${city.slug}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {city.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Central Florida */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Central Florida</h3>
              <ul className="space-y-3">
                {centralFlorida.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/city/${city.slug}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {city.name}
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

export default CitiesDropdown;
