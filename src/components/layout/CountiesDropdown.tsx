import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const CountiesDropdown = () => {
  const southFlorida = [
    { name: "Broward County", slug: "broward-county" },
    { name: "Martin County", slug: "martin-county" },
    { name: "Miami-Dade County", slug: "miami-dade-county" },
    { name: "Palm Beach County", slug: "palm-beach-county" },
    { name: "St Lucie County", slug: "st-lucie-county" },
  ];

  const centralFlorida = [
    { name: "Alachua County", slug: "alachua-county" },
    { name: "Lake County", slug: "lake-county" },
    { name: "Marion County", slug: "marion-county" },
    { name: "Orange County", slug: "orange-county" },
    { name: "Osceola County", slug: "osceola-county" },
    { name: "Pasco County", slug: "pasco-county" },
    { name: "Seminole County", slug: "seminole-county" },
    { name: "Sumter County", slug: "sumter-county" },
  ];

  const westFlorida = [
    { name: "Charlotte County", slug: "charlotte-county" },
    { name: "Collier County", slug: "collier-county" },
    { name: "Hillsboro County", slug: "hillsboro-county" },
    { name: "Lee County", slug: "lee-county" },
    { name: "Manatee County", slug: "manatee-county" },
    { name: "Monroe County", slug: "monroe-county" },
    { name: "Pinellas County", slug: "pinellas-county" },
    { name: "Sarasota County", slug: "sarasota-county" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
          <Button variant="ghost" className="text-foreground hover:text-primary p-0">
            Counties
          </Button>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-3 gap-8 p-6 w-[800px] bg-background z-50">
            {/* South Florida */}
            <div>
              <h3 className="text-lg font-semibold mb-4">South Florida</h3>
              <ul className="space-y-3">
                {southFlorida.map((county) => (
                  <li key={county.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?city=${encodeURIComponent(county.name.replace(' County', ''))}&state=FL&status=Active`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {county.name}
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
                {centralFlorida.map((county) => (
                  <li key={county.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?city=${encodeURIComponent(county.name.replace(' County', ''))}&state=FL&status=Active`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {county.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* West Florida */}
            <div>
              <h3 className="text-lg font-semibold mb-4">West Florida</h3>
              <ul className="space-y-3">
                {westFlorida.map((county) => (
                  <li key={county.slug}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?city=${encodeURIComponent(county.name.replace(' County', ''))}&state=FL&status=Active`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {county.name}
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

export default CountiesDropdown;
