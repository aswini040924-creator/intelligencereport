'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldX, ArrowLeft, LogOut, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { session, logout, getRedirectPathForRole } = useAuth();

  const userDashboard = session ? getRedirectPathForRole(session.role) : '/login';

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
          Error 403: Role Violation
        </span>

        <h1 className="text-2xl font-bold text-white mb-2">
          Restricted Portal Clearance
        </h1>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          You are currently logged in as{' '}
          <strong className="text-cyan-400 font-medium">
            {session?.name || 'an authenticated user'}
          </strong>{' '}
          with role{' '}
          <code className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xs font-mono">
            {session?.role || 'UNKNOWN'}
          </code>
          . This section is strictly isolated to prevent unauthorized cross-tier modifications (e.g. Site Managers cannot access PM Review, and Government Officers review monitored reports without altering baseline schedules).
        </p>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-4 text-left mb-6 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Your Current Portal:</span>
            <span className="text-slate-200 font-medium">{session?.organization || 'Infrastructure Portal'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Service Identifier:</span>
            <span className="text-slate-200 font-mono">{session?.userId || 'N/A'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => router.push(userDashboard)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-900/30"
          >
            <ArrowLeft className="w-4 h-4" />
            My Portal Dashboard
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800/60 text-xs text-slate-500">
          SITE2SCHEDULE AI — Smart India Hackathon Prototype (SIH26122)
        </div>
      </div>
    </div>
  );
}
