import { ReactNode } from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { formatINR, formatPercentage, calculateGrowth } from "@/utils/currency";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  icon: LucideIcon;
  format: 'currency' | 'percentage' | 'number';
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
  children?: ReactNode;
  compact?: boolean;
}

export const MetricCard = ({
  title,
  value,
  previousValue,
  icon: Icon,
  format,
  description,
  trend,
  className = "",
  children,
  compact = false
}: MetricCardProps) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatINR(val, { compact: true });
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return val.toLocaleString('en-IN');
      default:
        return val.toString();
    }
  };

  const growth = previousValue !== undefined ? calculateGrowth(value, previousValue) : null;
  const isPositiveGrowth = growth !== null && growth > 0;
  const isNegativeGrowth = growth !== null && growth < 0;
  
  // Determine if positive change is good (revenue, profit) or bad (expenses)
  const isGoodMetric = title.toLowerCase().includes('revenue') || 
                      title.toLowerCase().includes('profit') ||
                      title.toLowerCase().includes('cash');
  
  const shouldShowPositive = isGoodMetric ? isPositiveGrowth : isNegativeGrowth;
  const shouldShowNegative = isGoodMetric ? isNegativeGrowth : isPositiveGrowth;

  return (
    <div className={`metric-card ${className} transition-all duration-300 hover:shadow-glow group`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {description && (
                <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {growth !== null && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              shouldShowPositive ? 'bg-profit/10 text-profit' :
              shouldShowNegative ? 'bg-loss/10 text-loss' :
              'bg-muted text-muted-foreground'
            }`}>
              {Math.abs(growth) > 0.1 && (
                shouldShowPositive ? <TrendingUp className="h-3 w-3" /> :
                shouldShowNegative ? <TrendingDown className="h-3 w-3" /> : null
              )}
              {formatPercentage(Math.abs(growth))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold tracking-tight ${
              compact ? 'text-2xl' : 'text-3xl'
            } ${
              value > 0 && isGoodMetric ? 'profit-indicator' :
              value < 0 ? 'loss-indicator' :
              'text-foreground'
            }`}>
              {formatValue(value)}
            </span>
            
            {previousValue !== undefined && (
              <span className="text-sm text-muted-foreground">
                vs {formatValue(previousValue)}
              </span>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-2">
              <Badge 
                variant={trend === 'up' ? 'default' : trend === 'down' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {trend === 'up' ? 'Growing' : trend === 'down' ? 'Declining' : 'Stable'}
              </Badge>
            </div>
          )}
        </div>

        {children && (
          <div className="mt-4 pt-4 border-t border-muted/20">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};