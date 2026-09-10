'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layouts/AppShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
      <AppShell defaultRole="PLATFORM_ADMIN">{children}</AppShell>
    </ProtectedRoute>
  );
}
