'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppShell } from '@/components/layouts/AppShell';

export default function GovLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['GOVERNMENT_OFFICER', 'GOVERNMENT_ADMIN', 'GOVERNMENT_VIEWER']}>
      <AppShell defaultRole="GOVERNMENT_OFFICER">{children}</AppShell>
    </ProtectedRoute>
  );
}
