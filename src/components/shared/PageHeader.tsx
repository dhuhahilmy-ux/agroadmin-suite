import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            {actionIcon || <Plus className="h-4 w-4" />}
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
