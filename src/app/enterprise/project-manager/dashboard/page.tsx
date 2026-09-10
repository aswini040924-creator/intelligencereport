'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { useTasks } from '@/hooks/useTasks';
import { useSubmissions } from '@/hooks/useSubmissions';
import {
  FolderGit2,
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  Layers,
  Activity,
  PlusCircle,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function PMDashboardPage() {
  const { tasks, todayTasks, incompleteTasks, highRiskTasks } = useTasks('PRJ-ASSAM-025');
  const { pendingReviews } = useSubmissions('PRJ-ASSAM-025');

  const mainProject = INITIAL_PROJECTS[0];

  const plannedVsActualData = [
    { activity: 'Excavation', planned: 100, actual: 97.5 },
    { activity: 'Welding', planned: 80, actual: 63 },
    { activity: 'NDT Testing', planned: 50, actual: 20 },
    { activity: 'HDD River', planned: 75, actual: 50 },
    { activity: 'Coating', planned: 30, actual: 0 },
    { activity: 'Lowering', planned: 90, actual: 82 },
  ];

  const dailyBurnData = [
    { date: '04 Sep', planned: 14, actual: 12 },
    { date: '05 Sep', planned: 14, actual: 14 },
    { date: '06 Sep', planned: 14, actual: 10 },
    { date: '07 Sep', planned: 14, actual: 11 },
    { date: '08 Sep', planned: 14, actual: 8 },
    { date: '09 Sep', planned: 14, actual: 9 },
    { date: '10 Sep', planned: 14, actual: 8 },
  ];

  const riskPieData = [
    { name: 'Low', value: 16, color: '#10b981' },
    { name: 'Medium', value: 8, color: '#3b82f6' },
    { name: 'High', value: 4, color: '#f59e0b' },
    { name: 'Critical', value: 2, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Official EPC Project Management Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Project Manager Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active corridor: <strong className="text-slate-200">{mainProject.name}</strong> • KP 0–25 Pipeline Corridor
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/enterprise/project-manager/review"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-900/30"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>AI Review Queue ({pendingReviews.length})</span>
          </Link>

          <Link
            href="/enterprise/project-manager/daily-tasks"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Daily Tasks Board</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Overall Progress"
          value={`${mainProject.actualProgress}%`}
          subtitle="Committed Actual"
          variant="emerald"
        />
        <StatCard
          title="Schedule Variance"
          value={`${mainProject.variance}%`}
          subtitle="Behind baseline"
          variant="amber"
        />
        <StatCard
          title="AI Reviews Pending"
          value={pendingReviews.length}
          subtitle="Field submissions"
          icon={Sparkles}
          variant="cyan"
        />
        <StatCard
          title="Today's Tasks"
          value={todayTasks.length}
          subtitle="10 Sep scheduled"
          icon={CheckSquare}
          variant="blue"
        />
        <StatCard
          title="Incomplete Tasks"
          value={incompleteTasks.length}
          subtitle="Progress &lt; 100%"
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="High Risk Activities"
          value={highRiskTasks.length}
          subtitle="Critical path items"
          icon={Flame}
          variant="red"
        />
      </div>

      {/* Action Banner for Pending Reviews */}
      {pendingReviews.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-slate-900/80 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {pendingReviews.length} NEW SITE SUBMISSIONS REQUIRE PM VALIDATION
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              SUB-1045: 24-inch Pipeline Welding at KP 17.4 (Reported: 65%)
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic AI matched L6-PIP-0245 with 95% confidence. 4 geotagged field photos uploaded by Vikramjit Singh.
            </p>
          </div>

          <Link
            href="/enterprise/project-manager/review"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-2 transition shadow-lg shadow-blue-900/40"
          >
            <span>Open Manual Review Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planned vs Actual by Activity */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Planned vs Actual by L6 Activity</h3>
              <p className="text-xs text-slate-400">Assam Pipeline Package 2 milestone activities</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-slate-300">Planned %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-300">PM Validated %</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plannedVsActualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="activity" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="planned" fill="#2563eb" radius={[6, 6, 0, 0]} name="Planned %" />
                <Bar dataKey="actual" fill="#10b981" radius={[6, 6, 0, 0]} name="PM Validated %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-1">Corridor Risk Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Activities by delay probability</p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px]">
            {riskPieData.map(r => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-slate-400">{r.name}:</span>
                <span className="text-white font-mono font-bold">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Progress Burn Rate */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Daily Production Rate Trend</h3>
            <p className="text-xs text-slate-400">Target output vs verified daily completions (Joints/day)</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyBurnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="planned" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} name="Daily Planned Target" />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 3 }} name="PM Validated Output" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
