'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_L6_ACTIVITIES, INITIAL_L5_PACKAGES } from '@/lib/mock/activities';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { WBSHierarchyVisualizer } from '@/components/shared/WBSHierarchyVisualizer';
import { Layers, Plus, Sparkles, Filter, CheckCircle2, AlertTriangle, ArrowRight, FolderGit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PMActivitiesPage() {
  const [activeView, setActiveView] = useState<'L6_ACTIVITIES' | 'L5_PACKAGES' | 'WBS_VISUALIZER'>('L6_ACTIVITIES');
  const [selectedL5Filter, setSelectedL5Filter] = useState<string>('ALL');

  const filteredActivities = INITIAL_L6_ACTIVITIES.filter(act => {
    if (selectedL5Filter === 'ALL') return true;
    return act.l5Id === selectedL5Filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Operational Focus Tier: Level 5 & Level 6</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pipeline Erection Activity Management (L5 & L6)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Granular ground-truth execution dictionary. Connects daily field progress reports and camera evidence with master schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/enterprise/project-manager/daily-tasks"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Deploy Daily Field Task</span>
          </Link>
        </div>
      </div>

      {/* L1 -> L6 Cascade Breadcrumb Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-slate-400 font-mono text-[11px]">
          <span className="text-slate-500">L1 Entire Project</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-500">L2 Pipeline Package</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-500">L3 Pipeline Section</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-500">L4 Construction Phase</span>
          <span className="text-slate-600">→</span>
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
            L5 Pipeline Erection ★
          </span>
          <span className="text-cyan-400 font-bold">→</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
            L6 Specific Activity ★
          </span>
        </div>

        <div className="text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Core SITE2SCHEDULE AI Focus Area</span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('L6_ACTIVITIES')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition',
              activeView === 'L6_ACTIVITIES'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            )}
          >
            L6 Specific Pipeline Erection Activities ({INITIAL_L6_ACTIVITIES.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveView('L5_PACKAGES')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition',
              activeView === 'L5_PACKAGES'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            )}
          >
            L5 Pipeline Erection Work Packages ({INITIAL_L5_PACKAGES.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveView('WBS_VISUALIZER')}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5',
              activeView === 'WBS_VISUALIZER'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full L1 → L6 Architecture</span>
          </button>
        </div>

        {/* L5 Filter when viewing L6 */}
        {activeView === 'L6_ACTIVITIES' && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedL5Filter}
              onChange={e => setSelectedL5Filter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans"
            >
              <option value="ALL">All L5 Pipeline Erection Disciplines</option>
              {INITIAL_L5_PACKAGES.map(pkg => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: L6 SPECIFIC PIPELINE ERECTION ACTIVITIES */}
      {activeView === 'L6_ACTIVITIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map(act => (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {act.code}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      L6 ACTIVITY
                    </span>
                  </div>
                  <RiskBadge level={act.risk} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-white mt-1">{act.name}</h3>

                {/* Parent L5 Tag */}
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono">Parent L5 Erection:</span>
                  <span className="text-blue-300 font-medium truncate">{act.l5Name}</span>
                </div>

                <p className="text-xs text-slate-400 mt-0.5">{act.location} ({act.chainage})</p>

                <div className="mt-3">
                  <ProgressBar
                    value={act.currentProgress}
                    target={act.plannedProgress}
                    showLabels
                    label="PM Validated Actual vs Planned Target"
                    variant="emerald"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Baseline Dates:</span>
                    <span className="text-slate-300">{act.baselineStart} to {act.baselineFinish}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Assigned Lead:</span>
                    <span className="text-white truncate block">{act.assignedSiteManagerName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  Progress Qty: <strong className="text-white">{act.actualQuantity}</strong> / {act.plannedQuantity} {act.unit}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                  Status: {act.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: L5 PIPELINE ERECTION PACKAGES */}
      {activeView === 'L5_PACKAGES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Level 5 (Pipeline Erection Work Packages):</strong>
              <p className="text-slate-400 mt-0.5">
                These represent the physical construction disciplines. Each L5 package aggregates progress directly from its child L6 specific activities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_L5_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      LEVEL 5 WORK PACKAGE
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">{pkg.code}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-2">{pkg.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-1 line-clamp-2">{pkg.wbsPath}</p>

                  <div className="mt-4">
                    <ProgressBar
                      value={pkg.actualProgress}
                      target={pkg.plannedProgress}
                      showLabels
                      label="Rollup Erection Progress"
                      variant={pkg.actualProgress >= pkg.plannedProgress ? 'emerald' : 'amber'}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Contains {pkg.activitiesCount} L6 Activities</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedL5Filter(pkg.id);
                      setActiveView('L6_ACTIVITIES');
                    }}
                    className="text-cyan-400 hover:underline font-semibold text-[11px] flex items-center gap-1"
                  >
                    <span>View L6 Tasks</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: FULL L1 TO L6 WBS VISUALIZER */}
      {activeView === 'WBS_VISUALIZER' && (
        <WBSHierarchyVisualizer initialExpandedLevel="L6" showTree={true} />
      )}
    </div>
  );
}
