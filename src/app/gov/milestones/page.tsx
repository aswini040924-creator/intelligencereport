'use client';

import React, { useState } from 'react';
import { INITIAL_MILESTONES } from '@/lib/mock/projects';
import { Calendar, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Milestone } from '@/types';

export default function GovMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  const toggleApproval = (id: string) => {
    setMilestones(prev =>
      prev.map(m => (m.id === id ? { ...m, governmentApproved: !m.governmentApproved } : m))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Government Milestone Acceptance Bureau
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contractual weightages and escrow disbursement milestone verification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {milestones.map((ms, index) => (
          <div
            key={ms.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0 text-sm">
                0{index + 1}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 text-xs font-semibold">{ms.wbsLevel}</span>
                  <span className="font-bold text-white text-base">{ms.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
                  <span>Target Date: <strong className="text-slate-300 font-mono">{ms.targetDate}</strong></span>
                  {ms.completedDate && (
                    <span>Achieved: <strong className="text-emerald-400 font-mono">{ms.completedDate}</strong></span>
                  )}
                  <span>Weightage: <strong className="text-white font-mono">{ms.weightagePercent}%</strong> of Contract</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase',
                  ms.status === 'ACHIEVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : ms.status === 'AT_RISK'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-slate-800 text-slate-400'
                )}
              >
                {ms.status}
              </span>

              <button
                type="button"
                onClick={() => toggleApproval(ms.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5',
                  ms.governmentApproved
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                )}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{ms.governmentApproved ? 'Gov Accepted' : 'Sign Acceptance'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
