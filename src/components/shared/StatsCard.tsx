import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  className?: string;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
  success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
  warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
  info: 'bg-gradient-to-br from-info/10 to-info/5 border-info/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
  info: 'bg-info/20 text-info',
};

export function StatsCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  variant = 'default',
  className,
}: StatsCardProps) {
  const isPositive = trend && trend > 0;

  return (
    <Card
      className={cn(
        'overflow-hidden border transition-all duration-300 hover:shadow-card-hover animate-slide-up',
        variantStyles[variant],
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    isPositive ? 'text-success' : 'text-destructive'
                  )}
                >
                  {isPositive ? '+' : ''}
                  {trend}%
                </span>
                {trendLabel && (
                  <span className="text-sm text-muted-foreground">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              iconStyles[variant]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
