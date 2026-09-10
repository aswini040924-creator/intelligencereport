'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { getCurrentSession, isRoleAllowed } from '@/lib/auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getCurrentSession();

    if (!session) {
      // Unauthenticated -> redirect to login
      router.replace('/login');
      return;
    }

    if (!isRoleAllowed(session.role, allowedRoles)) {
      // Authenticated but wrong role -> redirect to unauthorized
      router.replace('/unauthorized');
      return;
    }

    setIsAuthorized(true);
  }, [allowedRoles, router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-400">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span className="text-sm font-medium">Verifying authorization clearance...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-300 p-6">
        <div className="max-w-md w-full p-6 rounded-2xl bg-red-950/20 border border-red-900/40 text-center">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Access Clearance Denied</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your role does not have authorization to view this secure portal section.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition"
          >
            Authenticate with Authorized Credentials
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
