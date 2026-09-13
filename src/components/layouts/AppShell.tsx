'use client';

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '@/hooks/useAuth';

interface AppShellProps {
  children: React.ReactNode;
  defaultRole?: UserRole;
}

export function AppShell({ children, defaultRole }: AppShellProps) {
  const { session } = useAuth();
  const activeRole = session?.role || defaultRole || 'GOVERNMENT_OFFICER';
  const [selectedProjectId, setSelectedProjectId] = useState('PRJ-ASSAM-025');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-row antialiased">
      {/* Role-Specific Sidebar */}
      <Sidebar role={activeRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
