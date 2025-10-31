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
  const texasCities = [
    { name: "Austin", slug: "austin", state: "TX" },
    { name: "Kyle", slug: "kyle", state: "TX" },
    { name: "San Antonio", slug: "san-antonio", state: "TX" },
    { name: "Houston", slug: "houston", state: "TX" },
    { name: "Dallas", slug: "dallas", state: "TX" },
    { name: "Fort Worth", slug: "fort-worth", state: "TX" },
    { name: "Plano", slug: "plano", state: "TX" },
    { name: "Arlington", slug: "arlington", state: "TX" },
  ];

  const floridaCities = [
    { name: "Miami", slug: "miami", state: "FL" },
    { name: "Orlando", slug: "orlando", state: "FL" },
    { name: "Tampa", slug: "tampa", state: "FL" },
    { name: "Jacksonville", slug: "jacksonville", state: "FL" },
    { name: "Fort Lauderdale", slug: "fort-lauderdale", state: "FL" },
    { name: "Naples", slug: "naples", state: "FL" },
    { name: "Sarasota", slug: "sarasota", state: "FL" },
  ];

  const californiaCities = [
    { name: "Los Angeles", slug: "los-angeles", state: "CA" },
    { name: "San Diego", slug: "san-diego", state: "CA" },
    { name: "San Francisco", slug: "san-francisco", state: "CA" },
    { name: "Sacramento", slug: "sacramento", state: "CA" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
          <Button variant="ghost" className="text-foreground hover:text-primary p-0">
            Cities
          </Button>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-3 gap-8 p-6 w-[800px] bg-background z-50">
            {/* Texas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Texas</h3>
              <ul className="space-y-3">
                {texasCities.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                       <Link
                        to={`/listings?city=${encodeURIComponent(city.name)}&state=${city.state}&status=Active`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {city.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Florida */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Florida</h3>
              <ul className="space-y-3">
                {floridaCities.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                       <Link
                        to={`/listings?city=${encodeURIComponent(city.name)}&state=${city.state}&status=Active`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {city.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* California */}
            <div>
              <h3 className="text-lg font-semibold mb-4">California</h3>
              <ul className="space-y-3">
                {californiaCities.map((city) => (
                  <li key={city.slug}>
                    <NavigationMenuLink asChild>
                       <Link
                        to={`/listings?city=${encodeURIComponent(city.name)}&state=${city.state}&status=Active`}
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
