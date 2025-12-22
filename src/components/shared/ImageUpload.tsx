import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in MB
  accept?: string[];
  className?: string;
  disabled?: boolean;
}

const DEFAULT_MAX_SIZE = 2; // 2MB
const DEFAULT_ACCEPT = ['image/png', 'image/jpeg', 'image/webp'];

export function ImageUpload({
  value,
  onChange,
  onError,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
  className,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (!accept.includes(file.type)) {
        return `Invalid file type. Accepted: ${accept.map((t) => t.split('/')[1]).join(', ')}`;
      }

      // Check file size
      const maxBytes = maxSize * 1024 * 1024;
      if (file.size > maxBytes) {
        return `File too large. Maximum size: ${maxSize}MB`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const processFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onError?.(validationError);
        return;
      }

      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.onerror = () => {
        const err = 'Failed to read file';
        setError(err);
        onError?.(err);
      };
      reader.readAsDataURL(file);
    },
    [validateFile, onChange, onError]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [disabled, processFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {value ? (
        // Preview state
        <div className="relative group">
          <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-xl border bg-muted">
            <img
              src={value}
              alt="Product preview"
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
          </div>
          <div className="absolute -top-2 -right-2 flex gap-1">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-7 w-7 rounded-full shadow-md"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 w-full max-w-[200px]"
            onClick={handleClick}
            disabled={disabled}
          >
            <Upload className="mr-2 h-4 w-4" />
            Replace Image
          </Button>
        </div>
      ) : (
        // Upload state
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 transition-all cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-destructive'
          )}
        >
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              isDragging ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            {error ? (
              <AlertCircle className="h-6 w-6 text-destructive" />
            ) : (
              <ImageIcon
                className={cn('h-6 w-6', isDragging ? 'text-primary' : 'text-muted-foreground')}
              />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragging ? 'Drop image here' : 'Click or drag to upload'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PNG, JPEG, WebP • Max {maxSize}MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
