import { Link } from "react-router-dom";
import { Home, Building2, Building, Warehouse, Trees, Castle, Hammer } from "lucide-react";

const PropertyTypes = () => {
  const propertyTypes = [
    {
      title: "Single Family Homes",
      icon: Home,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/single-family"
    },
    {
      title: "Townhomes",
      icon: Building,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/townhouse"
    },
    {
      title: "Condos",
      icon: Building2,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/condo"
    },
    {
      title: "1+ Acre Homes",
      icon: Trees,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/1-plus-acres"
    },
    {
      title: "Luxury Homes",
      icon: Castle,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/luxury"
    },
    {
      title: "Multi Family Homes",
      icon: Warehouse,
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/multi-family"
    },
    {
      title: "New Construction",
      icon: Hammer,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
      link: "/fayetteville/new-construction"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Property Type</h2>
          <p className="text-lg text-muted-foreground">
            Find your perfect home from our diverse property categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {propertyTypes.map((type) => (
            <Link
              key={type.title}
              to={type.link}
              className="group relative overflow-hidden rounded-lg aspect-square hover-scale"
            >
              <img
                src={type.image}
                alt={type.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <type.icon className="w-8 h-8 mb-2" />
                <h3 className="text-sm md:text-base font-semibold text-center">
                  {type.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTypes;
