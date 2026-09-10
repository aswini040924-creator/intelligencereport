'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { INITIAL_L6_ACTIVITIES } from '@/lib/mock/activities';
import { useTasks } from '@/hooks/useTasks';
import { useSubmissions } from '@/hooks/useSubmissions';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WBSHierarchyVisualizer } from '@/components/shared/WBSHierarchyVisualizer';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Flame,
  Image as ImageIcon,
  CheckSquare,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function PMProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.projectId as string) || 'PRJ-ASSAM-025';
  const project = INITIAL_PROJECTS.find(p => p.id === projectId) || INITIAL_PROJECTS[0];

  const { tasks, todayTasks, incompleteTasks } = useTasks(project.id);
  const { pendingReviews } = useSubmissions(project.id);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DAILY' | 'WBS' | 'INCOMPLETE' | 'RISKS' | 'EVIDENCE'>('OVERVIEW');

  const l6ProgressData = INITIAL_L6_ACTIVITIES.slice(0, 6).map(act => ({
    name: act.code,
    planned: act.plannedProgress,
    actual: act.currentProgress,
  }));

  const burnData = [
    { day: '04 Sep', actual: 12, target: 14 },
    { day: '05 Sep', actual: 14, target: 14 },
    { day: '06 Sep', actual: 10, target: 14 },
    { day: '07 Sep', actual: 11, target: 14 },
    { day: '08 Sep', actual: 8, target: 14 },
    { day: '09 Sep', actual: 9, target: 14 },
    { day: '10 Sep', actual: 8, target: 14 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/enterprise/project-manager/projects"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Code: <span className="font-mono text-cyan-400">{project.code}</span> • Corridor: {project.corridor}
            </p>
          </div>
        </div>

        <Link
          href="/enterprise/project-manager/review"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Review Queue ({pendingReviews.length})</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'DAILY', label: "Daily Progress" },
          { id: 'WBS', label: 'L5/L6 Activities' },
          { id: 'INCOMPLETE', label: `Incomplete (${incompleteTasks.length})` },
          { id: 'RISKS', label: 'Risks & Delays' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as typeof activeTab)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW CONTENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Committed Actual" value={`${project.actualProgress}%`} variant="emerald" />
            <StatCard title="Baseline Target" value={`${project.plannedProgress}%`} variant="blue" />
            <StatCard title="Schedule Variance" value={`${project.variance}%`} variant="amber" />
            <StatCard title="Pending AI Reviews" value={pendingReviews.length} variant="cyan" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">L6 Activity Progress (Planned vs Actual)</h3>
              <p className="text-xs text-slate-400 mb-4">Core pipeline work packages</p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={l6ProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Bar dataKey="planned" fill="#2563eb" radius={[6, 6, 0, 0]} name="Planned %" />
                    <Bar dataKey="actual" fill="#10b981" radius={[6, 6, 0, 0]} name="Actual %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-1">Daily Completion Burn Rate</h3>
              <p className="text-xs text-slate-400 mb-4">Assam Corridor Daily Joint Completion</p>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={burnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="target" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} name="Daily Target" />
                    <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 3 }} name="Actual Done" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DAILY PROGRESS TAB */}
      {activeTab === 'DAILY' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Field Tasks ({tasks.length} tasks)</h3>
            <Link href="/enterprise/project-manager/daily-tasks" className="text-xs text-cyan-400 hover:underline">
              Open Daily Task Board →
            </Link>
          </div>
          <div className="space-y-2">
            {tasks.slice(0, 6).map(t => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-cyan-400 font-semibold">{t.activityCode}</span>
                  <div className="text-white font-medium mt-0.5">{t.taskName}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{t.location}</div>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span>Planned: <strong className="text-slate-300">{t.plannedProgress}%</strong></span>
                  <span>Validated: <strong className="text-emerald-400">{t.validatedProgress}%</strong></span>
                  <StatusBadge status={t.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WBS ACTIVITIES TAB */}
      {activeTab === 'WBS' && (
        <div className="space-y-4">
          <WBSHierarchyVisualizer initialExpandedLevel="L6" showTree={true} />
        </div>
      )}

      {/* INCOMPLETE TAB */}
      {activeTab === 'INCOMPLETE' && (
        <div className="space-y-3">
          {incompleteTasks.map(t => (
            <div key={t.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-cyan-400 font-bold">{t.activityCode}</span>
                <div className="text-white font-medium mt-0.5">{t.taskName}</div>
              </div>
              <div className="flex items-center gap-4 font-mono">
                <span className="text-red-400 font-bold">Variance: {t.validatedProgress - t.plannedProgress}%</span>
                <Link href="/enterprise/project-manager/review" className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs">
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RISKS TAB */}
      {activeTab === 'RISKS' && (
        <div className="space-y-3">
          <Link href="/enterprise/project-manager/risks" className="text-xs text-cyan-400 hover:underline block mb-2">
            Open Full Risk Matrix →
          </Link>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            5 Identified Corridor Hazards being monitored under EPC execution protocol.
          </div>
        </div>
      )}
    </div>
  );
}
