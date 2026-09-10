'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layouts/AppShell';

export default function PMLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['PROJECT_MANAGER', 'COMPANY_ADMIN']}>
      <AppShell defaultRole="PROJECT_MANAGER">{children}</AppShell>
    </ProtectedRoute>
  );
}
