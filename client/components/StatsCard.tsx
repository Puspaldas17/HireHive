import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
  danger: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
};

const iconColorStyles = {
  default: 'text-muted-foreground',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

export function StatsCard({
  title,
  value,
  icon,
  description,
  variant = 'default',
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-6',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        {icon && (
          <div className={cn('mt-1', iconColorStyles[variant])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
