import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

const PropertyTypeDropdown = () => {
  const leftColumn = [
    { name: "Single Family Home", filter: "single-family" },
    { name: "Condo", filter: "condo" },
    { name: "Townhouses", filter: "townhouse" },
    { name: "Multi Family Home", filter: "multi-family" },
    { name: "FHA Approved", filter: "fha-approved" },
    { name: "Country Club", filter: "country-club" },
    { name: "Waterfront", filter: "waterfront" },
    { name: "Ocean Access", filter: "ocean-access" },
    { name: "Foreclosures", filter: "foreclosures" },
    { name: "Gated Community", filter: "gated-community" },
  ];

  const rightColumn = [
    { name: "1 Story Homes", filter: "1-story" },
    { name: "2 Story Homes", filter: "2-story" },
    { name: "Homes With Pool", filter: "pool" },
    { name: "Pet Friendly Condos", filter: "pet-friendly" },
    { name: "No HOA Homes", filter: "no-hoa" },
    { name: "55+ Community", filter: "55-plus" },
    { name: "Luxury", filter: "luxury" },
    { name: "New Construction", filter: "new-construction" },
    { name: "1+ Acres", filter: "1-plus-acres" },
    { name: "VA Approved", filter: "va-approved" },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">
          <Button variant="ghost" className="text-foreground hover:text-primary p-0">
            Property Type
          </Button>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid grid-cols-2 gap-8 p-6 w-[600px] bg-background">
            {/* Left Column */}
            <div>
              <ul className="space-y-3">
                {leftColumn.map((item) => (
                  <li key={item.filter}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/fayetteville/${item.filter}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div>
              <ul className="space-y-3">
                {rightColumn.map((item) => (
                  <li key={item.filter}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/fayetteville/${item.filter}`}
                        className="block text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
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

export default PropertyTypeDropdown;
