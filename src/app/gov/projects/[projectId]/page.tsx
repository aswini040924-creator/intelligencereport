'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PROJECTS, INITIAL_MILESTONES } from '@/lib/mock/projects';
import { INITIAL_WBS_HIERARCHY } from '@/lib/mock/activities';
import { WBSNode } from '@/types';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { RiskBadge } from '@/components/shared/RiskBadge';
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  FolderGit2,
  Lock,
  Layers,
  Calendar,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { WBSHierarchyVisualizer } from '@/components/shared/WBSHierarchyVisualizer';

export default function GovProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || 'PRJ-ASSAM-025';

  const project = INITIAL_PROJECTS.find(p => p.id === projectId) || INITIAL_PROJECTS[0];
  const milestones = INITIAL_MILESTONES.filter(m => m.projectId === project.id);

  return (
    <div className="space-y-8">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/gov/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                {project.code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Organization: <strong className="text-slate-200">{project.organization}</strong> • Corridor: {project.corridor}
            </p>
          </div>
        </div>

        {/* Read-Only Banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Government Monitoring Tier (Read/Acceptance Mode)</span>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Overall Actual Progress"
          value={`${project.actualProgress}%`}
          subtitle="Committed EVM Actual"
          variant="emerald"
        />
        <StatCard
          title="Planned Progress"
          value={`${project.plannedProgress}%`}
          subtitle="Baseline Target"
          variant="blue"
        />
        <StatCard
          title="Schedule Variance"
          value={`${project.variance}%`}
          subtitle="Lagging behind baseline"
          variant="amber"
        />
        <StatCard
          title="Incomplete Tasks"
          value={project.incompleteTasksCount}
          subtitle="Validated &lt; 100%"
          variant="amber"
        />
        <StatCard
          title="Risk Classification"
          value={project.risk}
          subtitle="Requires attention"
          variant="red"
        />
      </div>

      {/* Milestones Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Key Contractual Milestones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {milestones.map(ms => (
            <div
              key={ms.id}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 text-[10px] font-semibold">{ms.wbsLevel}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded font-bold uppercase',
                    ms.status === 'ACHIEVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : ms.status === 'AT_RISK'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {ms.status}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-white line-clamp-2">{ms.name}</h4>
              <div className="text-[11px] text-slate-400">Target: {ms.targetDate}</div>
              <div className="text-[10px] text-emerald-400 font-medium">
                {ms.governmentApproved ? '✓ Gov Approved' : '⏳ Pending Approval'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable WBS L1 -> L6 Hierarchy */}
      <WBSHierarchyVisualizer initialExpandedLevel="L6" showTree={true} />
    </div>
  );
}
