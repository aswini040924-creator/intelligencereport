'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GovReviewBadge } from '@/components/shared/GovReviewBadge';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { useTasks } from '@/hooks/useTasks';
import { useS3Data } from '@/context/S3DataContext';
import { useEvidence } from '@/hooks/useEvidence';
import { S3SyncStatusBadge } from '@/components/shared/S3SyncStatusBadge';
import { PhotoEvidence } from '@/types/evidence';
import {
  FolderGit2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Flame,
  Activity,
  Layers,
  Camera,
  Eye,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react';
import { PhotoEvidenceModal } from '@/components/shared/PhotoEvidenceModal';
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

export default function GovDashboardPage() {
  const { tasks, incompleteTasks, pendingGovReviewTasks } = useTasks('PRJ-ASSAM-025');
  const { projects: s3Projects, overview } = useS3Data();
  const { approvedEvidence, approvedCount, isApproved } = useEvidence();

  const [showEvidenceModal, setShowEvidenceModal] = React.useState(false);
  const [selectedAuditPhoto, setSelectedAuditPhoto] = React.useState<PhotoEvidence | null>(null);

  const projectsList = s3Projects.length > 0 ? s3Projects : INITIAL_PROJECTS;
  const mainProject = projectsList[0];
  const featuredTask = tasks.find(t => t.id === 'TSK-2026-0910-01') || tasks[0];

  const onTrackCount = projectsList.filter(p => p.governmentStatus === 'ON_TRACK').length;
  const atRiskCount = projectsList.filter(p => p.governmentStatus === 'AT_RISK').length;
  const delayedCount = overview?.delayedProjectsCount ?? projectsList.filter(p => p.governmentStatus === 'DELAYED').length;

  // Chart Data: Planned vs Actual across active S3 projects
  const progressComparisonData = projectsList.slice(0, 6).map(p => ({
    name: p.name.replace('Cable-Stayed', 'CS').replace('Bridge Package', 'Pkg').slice(0, 16),
    planned: p.plannedProgress,
    actual: p.actualProgress,
    variance: p.variance,
  }));

  // Daily Trend Data (last 7 days simulated completion trend)
  const completionTrendData = [
    { day: '04 Sep', plannedRate: 14, actualWelds: 12 },
    { day: '05 Sep', plannedRate: 14, actualWelds: 14 },
    { day: '06 Sep', plannedRate: 14, actualWelds: 10 },
    { day: '07 Sep', plannedRate: 14, actualWelds: 11 },
    { day: '08 Sep', plannedRate: 14, actualWelds: 8 },
    { day: '09 Sep', plannedRate: 14, actualWelds: 9 },
    { day: '10 Sep', plannedRate: 14, actualWelds: 8 },
  ];

  // Risk Distribution Data dynamically computed from S3
  const highRiskCount = overview?.highRiskCount ?? projectsList.filter(p => p.risk === 'HIGH' || p.risk === 'CRITICAL').length;
  const mediumRiskCount = projectsList.filter(p => p.risk === 'MEDIUM').length;
  const lowRiskCount = Math.max(1, projectsList.length - highRiskCount - mediumRiskCount);

  const riskDistributionData = [
    { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
    { name: 'Medium Risk', value: mediumRiskCount, color: '#3b82f6' },
    { name: 'High Risk', value: highRiskCount, color: '#f59e0b' },
    { name: 'Critical Risk', value: Math.max(2, Math.round(highRiskCount * 0.15)), color: '#ef4444' },
  ];

  const isFeaturedTaskEvidenceApproved = featuredTask ? isApproved(featuredTask.id) : false;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Authorized Monitoring & Acceptance Tier</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Government Compliance & Project Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-project oversight: Planned Primavera schedules vs PM-validated field execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* PM-Approved Evidence Metric Badge */}
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>{approvedCount}</strong> PM-Approved Visuals
            </span>
          </div>

          <Link
            href="/gov/incomplete-works"
            className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Review Incomplete Works ({pendingGovReviewTasks.length})</span>
          </Link>

          <Link
            href="/gov/audit"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            Audit Trail
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Projects"
          value="3"
          subtitle="Active corridors"
          icon={FolderGit2}
          variant="cyan"
        />
        <StatCard
          title="On Track"
          value="1"
          subtitle="Within -5% margin"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatCard
          title="At Risk"
          value="1"
          subtitle="Assam Pipeline"
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="Delayed"
          value="1"
          subtitle="Bengaluru Metro"
          icon={Clock}
          variant="red"
        />
        <StatCard
          title="Incomplete Tasks"
          value={incompleteTasks.length}
          subtitle="Field activities"
          icon={Layers}
          variant="amber"
        />
        <StatCard
          title="Pending Gov Reviews"
          value={pendingGovReviewTasks.length}
          subtitle="Awaiting acceptance"
          icon={FileCheck2}
          variant="cyan"
        />
      </div>

      {/* Featured Notification / Highlight Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-slate-900/60 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
              HIGH-PRIORITY FIELD UPDATE
            </span>
            <span className="text-xs text-slate-400">Assam Pipeline Expansion – Demo</span>
            {isFeaturedTaskEvidenceApproved && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Field Evidence: Approved by PM</span>
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-white">
            Task: 24-inch CS Pipeline Welding (KP 17.2–18.1)
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
            <span>Reported by Site Manager: <strong className="text-cyan-400 font-mono">65%</strong></span>
            <span>Validated by Project Manager: <strong className="text-emerald-400 font-mono">63%</strong></span>
            <span>Status: <strong className="text-amber-400 font-mono">Incomplete (-17% Var)</strong></span>
            <span>Government Acceptance: <strong className="text-purple-400 font-mono">Pending Review</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => setShowEvidenceModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-cyan-500/10"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Inspect Field Photos ({featuredTask?.photoCount || 4})</span>
          </button>

          <Link
            href="/gov/incomplete-works"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <span>Open Review Screen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* DEDICATED SECTION: PM-Approved Field Photographic Evidence Stream */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900/80 to-slate-900/80 border border-emerald-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Project Manager Validated Photographic Evidence Stream</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live visual audit records officially validated and approved by Project Manager in the Field Evidence desk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              {approvedEvidence.length} Approved Visual Records
            </span>
          </div>
        </div>

        {approvedEvidence.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500">
            No field evidence photos have been approved by the Project Manager yet. Approvals granted in the Project Manager Field Evidence portal will immediately display here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {approvedEvidence.slice(0, 4).map(item => (
              <div
                key={item.fileId || item.id}
                onClick={() => setSelectedAuditPhoto(item)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-slate-950/90 border border-slate-800 hover:border-emerald-500/60 transition shadow-md hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.caption || 'Evidence'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 rounded bg-black/80 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        {item.activityCode}
                      </span>
                      {item.level && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 font-mono text-[9px] font-bold">
                          {item.level}
                        </span>
                      )}
                    </div>

                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-mono text-[10px] font-bold flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>PM APPROVED</span>
                    </span>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {item.caption || item.taskName || item.description}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>
                </div>

                <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Sign-off: {item.pmApprovedBy || 'Project Manager'}</span>
                  <span className="text-cyan-400 group-hover:underline">Inspect →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Planned vs Actual Progress */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Planned vs Actual Progress Comparison</h3>
              <p className="text-xs text-slate-400">Master Level 5/6 planned baseline vs committed actuals</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-600" />
                <span className="text-slate-300">Planned %</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-slate-300">Actual %</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="planned" fill="#2563eb" radius={[6, 6, 0, 0]} name="Planned %" />
                <Bar dataKey="actual" fill="#10b981" radius={[6, 6, 0, 0]} name="Actual %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-1">Project Risk Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Classified by schedule impact severity</p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
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
            {riskDistributionData.map(r => (
              <div key={r.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-slate-400">{r.name}:</span>
                <span className="text-white font-mono font-bold">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Daily Rate Trend & Incomplete Tasks Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Completion Rate Line Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-1">Daily Weld Rate vs Target</h3>
          <p className="text-xs text-slate-400 mb-4">Assam Corridor KP 17–18 actual output</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="plannedRate" stroke="#64748b" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Target Joints" />
                <Line type="monotone" dataKey="actualWelds" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 3 }} name="Actual Welds" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Incomplete Works Awaiting Review List */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Incomplete Tasks Awaiting Government Review</h3>
                <p className="text-xs text-slate-400">Tasks validated by PM with progress &lt; 100%</p>
              </div>
              <Link href="/gov/incomplete-works" className="text-xs text-cyan-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {pendingGovReviewTasks.slice(0, 4).map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-xs font-semibold">{task.activityCode}</span>
                      <span className="text-white text-xs font-medium truncate">{task.taskName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Planned: <strong className="text-slate-300 font-mono">{task.plannedProgress}%</strong></span>
                      <span>PM Validated: <strong className="text-emerald-400 font-mono">{task.validatedProgress}%</strong></span>
                      <span>Reported: <strong className="text-slate-400 font-mono">{task.reportedProgress}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <RiskBadge level={task.risk} size="sm" />
                    <Link
                      href="/gov/incomplete-works"
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 italic mt-4">
            Note: Government approval signifies acceptance of reported state & evidence, not physical completion.
          </div>
        </div>
      </div>

      {/* Featured Task Photo Evidence Modal */}
      <PhotoEvidenceModal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        task={featuredTask}
        title="Field Evidence Visual Audit — 24-inch CS Pipeline Welding"
      />

      {/* Specific Selected Approved Photo Modal */}
      {selectedAuditPhoto && (
        <PhotoEvidenceModal
          isOpen={!!selectedAuditPhoto}
          onClose={() => setSelectedAuditPhoto(null)}
          photos={[selectedAuditPhoto]}
          title={`PM Validated Field Visual Audit — ${selectedAuditPhoto.activityCode}`}
        />
      )}
    </div>
  );
}
