'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function GovAlertsPage() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Government Alerts & Compliance Warnings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications concerning schedule variance thresholds, incomplete work escalations, and weather advisories.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            className={cn(
              'p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3.5',
              notif.read
                ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                : 'bg-slate-900/80 border-blue-500/30 text-slate-200 shadow-md'
            )}
          >
            <div
              className={cn(
                'p-2 rounded-xl shrink-0 mt-0.5',
                notif.type === 'ACTION_REQUIRED'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : notif.type === 'WARNING'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-blue-500/10 text-cyan-400 border border-blue-500/20'
              )}
            >
              {notif.type === 'WARNING' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : notif.type === 'ACTION_REQUIRED' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Info className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                <span className="text-[11px] font-mono text-slate-500">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
