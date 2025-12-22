import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType =
  | 'active'
  | 'inactive'
  | 'low-stock'
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'paid'
  | 'unpaid'
  | 'refunded'
  | 'in-stock'
  | 'out-of-stock';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted',
  },
  'low-stock': {
    label: 'Low Stock',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  },
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  },
  processing: {
    label: 'Processing',
    className: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  },
  paid: {
    label: 'Paid',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  unpaid: {
    label: 'Unpaid',
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-muted text-muted-foreground border-border hover:bg-muted',
  },
  'in-stock': {
    label: 'In Stock',
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
  'out-of-stock': {
    label: 'Out of Stock',
    className: 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn('font-medium', config.className, className)}>
      {config.label}
    </Badge>
  );
}
