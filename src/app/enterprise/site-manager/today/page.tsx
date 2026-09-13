'use client';

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Camera, MapPin, ArrowRight, CheckSquare } from 'lucide-react';

export default function SiteManagerTodayPage() {
  const { todayTasks } = useTasks('PRJ-ASSAM-025');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Today&apos;s Field Assignments
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active work orders deployed by Project Manager for 10 September 2026.
          </p>
        </div>

        <Link
          href="/enterprise/site-manager/capture"
          className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>New Submission</span>
        </Link>
      </div>

      <div className="space-y-4">
        {todayTasks.map(task => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-cyan-400 text-xs font-bold block">{task.activityCode}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{task.taskName}</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{task.location} ({task.chainage})</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <RiskBadge level={task.risk} size="sm" />
                <StatusBadge status={task.status} size="sm" />
              </div>
            </div>

            {task.instructions && (
              <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed">
                <strong className="text-cyan-400 font-medium">PM Instructions: </strong>
                {task.instructions}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Target</span>
                <span className="text-slate-200 font-bold">{task.plannedQuantity} {task.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Reported</span>
                <span className="text-cyan-400 font-bold">{task.reportedQuantity} {task.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Progress</span>
                <span className="text-emerald-400 font-bold">{task.reportedProgress}%</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Link
                href={`/enterprise/site-manager/capture?taskId=${task.id}&activityCode=${task.activityCode}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Capture Field Evidence</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
