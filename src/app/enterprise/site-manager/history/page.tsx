'use client';

import React from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { History, CheckCircle2, MapPin, Image as ImageIcon } from 'lucide-react';

export default function SiteManagerHistoryPage() {
  const { approvedSubmissions } = useSubmissions('PRJ-ASSAM-025');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Historical Completed Field Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Archived and validated execution records signed off by Project Management.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {approvedSubmissions.map(sub => (
          <div
            key={sub.id}
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 text-xs"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold">{sub.id}</span>
                <span className="font-semibold text-white">{sub.taskName}</span>
              </div>
              <p className="text-slate-400 mt-0.5">{sub.location}</p>
            </div>

            <div className="flex items-center gap-4 font-mono shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px]">Validated</span>
                <span className="text-emerald-400 font-bold">{sub.validatedProgress}%</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                APPROVED
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
