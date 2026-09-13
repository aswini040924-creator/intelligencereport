'use client';

import React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useEvidence } from '@/hooks/useEvidence';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import {
  HardHat,
  Camera,
  CheckSquare,
  Clock,
  CheckCircle2,
  RotateCcw,
  MapPin,
  ArrowRight,
  SendHorizontal,
  ShieldCheck,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

export default function SiteManagerDashboardPage() {
  const { todayTasks, tasks } = useTasks('PRJ-ASSAM-025');
  const { submissions } = useSubmissions('PRJ-ASSAM-025');
  const { approvedEvidence, approvedCount, isApproved } = useEvidence({
    projectId: 'PRJ-ASSAM-025',
  });

  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'INCOMPLETE').length;
  const pendingCount = submissions.filter(s => s.status === 'UNDER_REVIEW').length;
  const revisionCount = submissions.filter(s => s.status === 'REVISION_REQUIRED').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mobile-First Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 mb-1">
            <HardHat className="w-3.5 h-3.5" />
            <span>Field Superintendent Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Site Manager Field Cockpit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Supervisor: <strong className="text-slate-200">Vikramjit Singh</strong> • Assam KP 17–25 Corridor
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* PM Approved Field Evidence Chip */}
          <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>{approvedCount}</strong> PM Approved Visuals
            </span>
          </div>

          {/* Primary Action Button: Capture Evidence */}
          <Link
            href="/enterprise/site-manager/capture"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 transition"
          >
            <Camera className="w-4 h-4" />
            <span>Capture Evidence</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Today's Work"
          value={todayTasks.length}
          subtitle="Assigned work"
          icon={CheckSquare}
          variant="cyan"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Active corridors"
          icon={Clock}
          variant="blue"
        />
        <StatCard
          title="PM Approved"
          value={approvedCount}
          subtitle="Validated evidence"
          icon={ShieldCheck}
          variant="emerald"
        />
        <StatCard
          title="Under Review"
          value={pendingCount}
          subtitle="Awaiting PM sign-off"
          icon={SendHorizontal}
          variant="amber"
        />
      </div>

      {/* PM Validated Evidence Stream (Reflecting PM Approvals in Real Time) */}
      {approvedEvidence.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/70 to-slate-900/70 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Field Evidence Officially Approved by Project Manager</span>
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {approvedEvidence.length} Verified Records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {approvedEvidence.slice(0, 3).map(item => (
              <div
                key={item.fileId || item.id}
                className="rounded-xl overflow-hidden bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.caption || 'Evidence'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                    {item.activityCode}
                  </div>
                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-emerald-500/90 text-white font-mono text-[9px] font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>APPROVED</span>
                  </div>
                </div>

                <div className="p-2.5 space-y-1">
                  <p className="text-[11px] text-white font-medium line-clamp-1">
                    {item.caption || item.taskName || item.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                    <span className="truncate max-w-[120px]">{item.location}</span>
                    <span className="text-emerald-400 font-semibold">
                      {item.pmApprovedAt ? new Date(item.pmApprovedAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <span>Today&apos;s Field Assignments (10 Sep 2026)</span>
          </h2>
          <Link href="/enterprise/site-manager/today" className="text-xs text-cyan-400 hover:underline">
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {todayTasks.slice(0, 4).map(task => {
            const hasApprovedEvidence =
              isApproved(task.id) ||
              approvedEvidence.some(
                e => e.taskId === task.id || e.activityCode === task.activityCode
              );

            return (
              <div
                key={task.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 text-xs font-bold block">
                        {task.activityCode}
                      </span>
                      {hasApprovedEvidence && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PM Approved Evidence</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mt-0.5">{task.taskName}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>{task.location} ({task.chainage})</span>
                    </p>
                  </div>
                  <StatusBadge status={task.status} size="sm" />
                </div>

                {/* Quantities & Progress */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Planned Qty</span>
                    <span className="text-slate-200 font-semibold">{task.plannedQuantity} {task.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Reported Qty</span>
                    <span className="text-cyan-400 font-bold">{task.reportedQuantity} {task.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Progress</span>
                    <span className="text-emerald-400 font-bold">{task.reportedProgress}%</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/enterprise/site-manager/capture?taskId=${task.id}&activityCode=${task.activityCode}`}
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Capture Evidence</span>
                  </Link>

                  <Link
                    href={`/enterprise/site-manager/capture?taskId=${task.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                  >
                    Update
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
