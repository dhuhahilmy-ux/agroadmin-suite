import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductThumbnailProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

export function ProductThumbnail({
  src,
  alt,
  size = 'sm',
  className,
}: ProductThumbnailProps) {
  const sizeClass = sizeClasses[size];

  if (!src) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-muted border border-border',
          sizeClass,
          className
        )}
      >
        <Package className={cn('text-muted-foreground', size === 'sm' ? 'h-5 w-5' : 'h-7 w-7')} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-border bg-muted',
        sizeClass,
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
