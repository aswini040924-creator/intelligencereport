'use client';

import React from 'react';
import { INITIAL_L6_ACTIVITIES } from '@/lib/mock/activities';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Calendar, GitFork, AlertTriangle } from 'lucide-react';
import { formatVariance } from '@/lib/utils';

export default function PMSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Master Project Schedule & Variance Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contractual Primavera baseline schedule vs Earned Value Management (EVM) actuals.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Activity Code & Name</th>
                <th className="px-4 py-3.5">Baseline Window</th>
                <th className="px-4 py-3.5">Planned %</th>
                <th className="px-4 py-3.5">Committed Actual %</th>
                <th className="px-4 py-3.5">Schedule Variance</th>
                <th className="px-4 py-3.5">Risk</th>
                <th className="px-4 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {INITIAL_L6_ACTIVITIES.map(act => {
                const variance = act.currentProgress - act.plannedProgress;

                return (
                  <tr key={act.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3.5 max-w-xs">
                      <span className="font-mono text-cyan-400 text-xs font-semibold block">{act.code}</span>
                      <span className="font-bold text-white block mt-0.5 truncate">{act.name}</span>
                      <span className="text-[11px] text-slate-500 block">{act.chainage}</span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400">
                      <div>{act.baselineStart}</div>
                      <div className="text-slate-500 text-[10px]">to {act.baselineFinish}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                      <div className="font-bold">{act.plannedProgress}%</div>
                      <div className="w-16 mt-1">
                        <ProgressBar value={act.plannedProgress} size="sm" variant="blue" />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-white">
                      <div className="font-bold text-emerald-400">{act.currentProgress}%</div>
                      <div className="w-16 mt-1">
                        <ProgressBar value={act.currentProgress} size="sm" variant="emerald" />
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono font-bold">
                      <span
                        className={
                          variance < -10
                            ? 'text-red-400'
                            : variance < 0
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {formatVariance(variance)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RiskBadge level={act.risk} size="sm" />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                        {act.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
