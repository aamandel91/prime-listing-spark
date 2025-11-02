import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Clock } from "lucide-react";

interface PropertyHistoryItem {
  listDate: string;
  listPrice: number;
  status: string;
  soldDate?: string;
  soldPrice?: number;
  daysOnMarket?: number;
}

interface PropertyHistoryProps {
  history?: PropertyHistoryItem[];
  className?: string;
}

export const PropertyHistory = ({ history, className = "" }: PropertyHistoryProps) => {
  if (!history || history.length === 0) {
    return null;
  }

  const formatPrice = (price: number | undefined) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string | undefined) => {
    if (!date || date === "0000-00-00") return "N/A";
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      'Active': { variant: 'default', label: 'Active' },
      'Sold': { variant: 'secondary', label: 'Sold' },
      'Pending': { variant: 'outline', label: 'Pending' },
      'Expired': { variant: 'destructive', label: 'Expired' },
      'Terminated': { variant: 'destructive', label: 'Terminated' },
      'Lsd': { variant: 'secondary', label: 'Leased' },
      'Ter': { variant: 'destructive', label: 'Terminated' },
    };

    const statusInfo = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle>Property History</CardTitle>
        </div>
        <CardDescription>
          Historical listing and sales data for this property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    List Date
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">List Price</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Sold Date
                  </div>
                </TableHead>
                <TableHead className="min-w-[120px]">Sold Price</TableHead>
                <TableHead className="min-w-[100px]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Days on Market
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(item.listDate)}</TableCell>
                  <TableCell className="font-medium">{formatPrice(item.listPrice)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>{formatDate(item.soldDate)}</TableCell>
                  <TableCell className="font-medium">{formatPrice(item.soldPrice)}</TableCell>
                  <TableCell>{item.daysOnMarket || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
