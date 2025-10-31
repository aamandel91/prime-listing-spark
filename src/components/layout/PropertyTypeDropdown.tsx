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
    { name: "Single Family Home", type: "Single Family" },
    { name: "Condo", type: "Condo" },
    { name: "Townhouse", type: "Townhouse" },
    { name: "Multi Family", type: "Multi-Family" },
    { name: "Land", type: "Land" },
    { name: "Commercial", type: "Commercial" },
  ];

  const rightColumn = [
    { name: "Residential Income", type: "Residential Income" },
    { name: "Mobile/Manufactured", type: "Mobile" },
    { name: "Farm/Ranch", type: "Farm" },
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
          <div className="grid grid-cols-2 gap-8 p-6 w-[600px] bg-background z-50">
            {/* Left Column */}
            <div>
              <ul className="space-y-3">
                {leftColumn.map((item) => (
                  <li key={item.type}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?type=${encodeURIComponent(item.type)}&status=A`}
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
                  <li key={item.type}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={`/listings?type=${encodeURIComponent(item.type)}&status=A`}
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
