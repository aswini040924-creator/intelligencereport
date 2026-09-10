'use client';

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GovReviewBadge } from '@/components/shared/GovReviewBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { formatVariance } from '@/lib/utils';

export default function PMIncompletePage() {
  const { incompleteTasks } = useTasks('PRJ-ASSAM-025');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Project Manager Incomplete Tasks Bureau
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking slippage remediation and field re-assignments for activities with progress &lt; 100%.
          </p>
        </div>

        <Link
          href="/enterprise/project-manager/review"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Review Field Submissions</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incompleteTasks.map(task => {
          const variance = task.validatedProgress - task.plannedProgress;

          return (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="font-mono text-cyan-400 text-xs font-bold">{task.activityCode}</span>
                  <RiskBadge level={task.risk} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-white">{task.taskName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{task.location} ({task.chainage})</p>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center my-3 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Planned</span>
                    <span className="text-slate-300 font-bold">{task.plannedProgress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Reported</span>
                    <span className="text-cyan-400 font-bold">{task.reportedProgress}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Validated</span>
                    <span className="text-emerald-400 font-bold">{task.validatedProgress}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Variance:</span>
                  <span className={variance < 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {formatVariance(variance)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <GovReviewBadge status={task.governmentReviewStatus} size="sm" />
                <Link
                  href="/enterprise/project-manager/review"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                >
                  <span>Inspect Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
