'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layouts/AppShell';

export default function CompanyAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'PLATFORM_ADMIN']}>
      <AppShell defaultRole="COMPANY_ADMIN">{children}</AppShell>
    </ProtectedRoute>
  );
}
