import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <div className={cn("text-xs flex items-center mt-1 font-medium", trend.positive ? "text-emerald-600" : "text-rose-600")}>
              {trend.positive ? "+" : ""}{trend.value}% {trend.label}
            </div>
          )}
        </div>
      </CardContent>
      {/* Decorative gradient at bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-primary/40 to-primary/10" />
    </Card>
  );
}
