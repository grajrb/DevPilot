'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-900/50 text-green-400 border border-green-800',
  warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-800',
  error: 'bg-red-900/50 text-red-400 border border-red-800',
  neutral: 'bg-gray-800 text-gray-400 border border-gray-700',
  info: 'bg-blue-900/50 text-blue-400 border border-blue-800',
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', variantStyles[variant], className)}>
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          variant === 'success' && 'bg-green-400',
          variant === 'warning' && 'bg-yellow-400',
          variant === 'error' && 'bg-red-400',
          variant === 'info' && 'bg-blue-400',
          variant === 'neutral' && 'bg-gray-400',
        )}
      />
      {label}
    </span>
  );
}