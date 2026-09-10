'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layouts/AppShell';

export default function SiteManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['SITE_MANAGER', 'PROJECT_MANAGER', 'COMPANY_ADMIN']}>
      <AppShell defaultRole="SITE_MANAGER">{children}</AppShell>
    </ProtectedRoute>
  );
}
