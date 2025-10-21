import { Building2, Users, MapPin, TrendingUp } from "lucide-react";

const Stats = () => {
  const stats = [
    { icon: Building2, value: "15,000+", label: "Active Listings" },
    { icon: Users, value: "50,000+", label: "Happy Clients" },
    { icon: MapPin, value: "200+", label: "Cities Covered" },
    { icon: TrendingUp, value: "$2.5B+", label: "Properties Sold" },
  ];

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-premium rounded-full mb-4 shadow-medium">
                <stat.icon className="w-8 h-8 text-accent-foreground" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
