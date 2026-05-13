'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  className?: string;
}

const trendColors = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
};

export function KpiCard({ title, value, change, trend, icon, className }: KpiCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">{title}</p>
        {icon && <div className="text-gray-500">{icon}</div>}
      </div>
      <div className="flex items-end justify-between mt-2">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {change && (
          <span className={cn('text-sm', trend && trendColors[trend])}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

export function KpiCardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
}