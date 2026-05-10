'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useRequireAuth(requiredPermissions?: string[]) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (isAuthenticated && requiredPermissions) {
      const hasPermission = user?.permissions.some(p =>
        requiredPermissions.includes(p)
      );
      if (!hasPermission) {
        router.push('/overview');
      }
    }
  }, [isAuthenticated, isLoading, router, requiredPermissions, user]);

  return { isAuthenticated, isLoading, user };
}
