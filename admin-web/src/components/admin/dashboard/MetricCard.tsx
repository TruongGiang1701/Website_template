import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    isUp: boolean;
  };
  isLoading?: boolean;
}

export function MetricCard({ title, value, icon: Icon, change, isLoading }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {isLoading ? (
              <div className="mt-2 h-7 w-24 animate-pulse bg-secondary rounded" />
            ) : (
              <h3 className="mt-1 text-2xl font-bold text-foreground">{value}</h3>
            )}
          </div>
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        
        {change && (
          <div className="mt-4 flex items-center gap-1.5">
            <div className={cn(
              "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
              change.isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
            )}>
              {change.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change.value}%
            </div>
            <span className="text-xs text-muted-foreground">so với tháng trước</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
