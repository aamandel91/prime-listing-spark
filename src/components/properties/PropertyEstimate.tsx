import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AuthGate } from "@/components/auth/AuthGate";

interface PropertyEstimateProps {
  listPrice: number;
  estimatedValue?: number;
  pricePerSqft?: number;
  marketTrend?: "up" | "down" | "stable";
  lastUpdated?: string;
  confidence?: "high" | "medium" | "low";
  className?: string;
}

export const PropertyEstimate = ({
  listPrice,
  estimatedValue,
  pricePerSqft,
  marketTrend = "stable",
  lastUpdated,
  confidence = "medium",
  className = "",
}: PropertyEstimateProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateVariance = () => {
    if (!estimatedValue) return null;
    const variance = ((listPrice - estimatedValue) / estimatedValue) * 100;
    return variance;
  };

  const variance = calculateVariance();

  const getTrendIcon = () => {
    switch (marketTrend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getConfidenceBadge = () => {
    const variants = {
      high: "default" as const,
      medium: "secondary" as const,
      low: "outline" as const,
    };
    return (
      <Badge variant={variants[confidence]} className="text-xs">
        {confidence} confidence
      </Badge>
    );
  };

  return (
    <AuthGate 
      title="Sign in to view property valuation"
      description="Get access to detailed property estimates, market trends, and pricing analysis"
    >
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Property Valuation</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Estimated value is based on comparable properties, market trends,
                    and property characteristics. Values are updated regularly.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* List Price */}
          <div>
            <div className="text-sm text-muted-foreground mb-1">List Price</div>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(listPrice)}
            </div>
          </div>

          {/* Estimated Value */}
          {estimatedValue && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">Estimated Market Value</div>
                {getConfidenceBadge()}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(estimatedValue)}
                </div>
                {variance !== null && (
                  <Badge
                    variant={Math.abs(variance) < 5 ? "secondary" : variance > 0 ? "destructive" : "default"}
                    className="flex items-center gap-1"
                  >
                    {variance > 0 ? "+" : ""}
                    {variance.toFixed(1)}%
                  </Badge>
                )}
              </div>
              {variance !== null && (
                <p className="text-sm text-muted-foreground mt-2">
                  {variance > 5
                    ? "List price is above estimated value"
                    : variance < -5
                    ? "List price is below estimated value"
                    : "List price is near estimated value"}
                </p>
              )}
            </div>
          )}

          {/* Additional Metrics */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            {pricePerSqft && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Price per Sq Ft</div>
                <div className="text-lg font-semibold text-foreground">
                  {formatCurrency(pricePerSqft)}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-muted-foreground mb-1">Market Trend</div>
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="text-lg font-semibold text-foreground capitalize">
                  {marketTrend}
                </span>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-muted-foreground border-t pt-4">
              Last updated: {new Date(lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AuthGate>
  );
};
