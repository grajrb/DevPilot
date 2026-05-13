'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4', className)}>
      {icon && <div className="text-gray-600 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-300">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-md text-center">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}