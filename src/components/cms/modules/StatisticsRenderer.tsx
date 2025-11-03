import { StatisticsModule } from "@/types/contentModules";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsRendererProps {
  module: StatisticsModule;
}

export function StatisticsRenderer({ module }: StatisticsRendererProps) {
  return (
    <div className="module-statistics">
      {module.title && <h2 className="text-3xl font-bold mb-6">{module.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {module.stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold mb-1">
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
