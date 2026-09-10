'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole, UserSession, PortalTab } from '@/types';
import {
  getCurrentSession,
  saveSession,
  clearSession,
  loginWithCredentials,
  getRedirectPathForRole,
  isRoleAllowed,
  LoginResult,
} from '@/lib/auth';

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const current = getCurrentSession();
    setSession(current);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (identifier: string, pass: string, tab: PortalTab): LoginResult => {
      const result = loginWithCredentials(identifier, pass, tab);
      if (result.success && result.session) {
        setSession(result.session);
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    router.push('/login');
  }, [router]);

  const checkRole = useCallback(
    (allowedRoles: UserRole[]): boolean => {
      if (!session) return false;
      return isRoleAllowed(session.role, allowedRoles);
    },
    [session]
  );

  return {
    session,
    user: session,
    role: session?.role,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    checkRole,
    getRedirectPathForRole,
  };
}
