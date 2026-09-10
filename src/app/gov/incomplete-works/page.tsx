'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useReviews } from '@/hooks/useReviews';
import { StatCard } from '@/components/shared/StatCard';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { GovReviewBadge } from '@/components/shared/GovReviewBadge';
import { Modal } from '@/components/shared/Modal';
import { PhotoEvidenceModal } from '@/components/shared/PhotoEvidenceModal';
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Camera,
  MessageSquare,
  HelpCircle,
  AlertOctagon,
  ArrowRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyTask } from '@/types';

export default function GovIncompleteWorksPage() {
  const { incompleteTasks, overdueTasks, highRiskTasks, pendingGovReviewTasks, refreshTasks } =
    useTasks('PRJ-ASSAM-025');
  const { governmentReviewTask, isProcessing } = useReviews();

  // Review modal state
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [photoModalTask, setPhotoModalTask] = useState<DailyTask | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE_REPORT' | 'REQUEST_CLARIFICATION' | 'ESCALATE'>('APPROVE_REPORT');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleOpenReview = (task: DailyTask, action: 'APPROVE_REPORT' | 'REQUEST_CLARIFICATION' | 'ESCALATE') => {
    setSelectedTask(task);
    setReviewAction(action);
    setReviewRemarks(
      action === 'APPROVE_REPORT'
        ? 'Field evidence and PM validated progress reviewed and accepted. Compliance logged.'
        : action === 'REQUEST_CLARIFICATION'
        ? 'Request detailed weld inspection report and explanation for output shortfall.'
        : 'Escalated to Project Director due to critical schedule variance impact.'
    );
  };

  const handleConfirmReview = () => {
    if (!selectedTask) return;

    governmentReviewTask(
      selectedTask.id,
      reviewAction,
      reviewRemarks,
      'Dr. Anandvardhan Sharma, IAS'
    );

    setSuccessToast(
      reviewAction === 'APPROVE_REPORT'
        ? `Task ${selectedTask.activityCode} successfully accepted at Government Monitoring Tier. Note: Baseline schedule remains intact.`
        : `Task ${selectedTask.activityCode} updated: ${reviewAction}.`
    );

    setSelectedTask(null);
    refreshTasks();

    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Official Incomplete Works Compliance Bureau</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Incomplete Works & Physical Discrepancy Review
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review reported contractor field claims vs PM-validated actuals for activities with progress &lt; 100%.
          </p>
        </div>
      </div>

      {/* Distinction Notification Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block">Critical Governance Policy Notice:</strong>
          <p className="text-slate-400 leading-relaxed">
            Government approval sets status to <strong className="text-emerald-400 font-mono">GOVERNMENT_APPROVED</strong>. This does <strong className="text-white">NOT</strong> mean the task is physically complete. It certifies: <em className="text-slate-300">&quot;The reported field state and photographic evidence have been officially reviewed and accepted by the nodal authority without modifying the engineering baseline schedule.&quot;</em>
          </p>
        </div>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Incomplete Tasks"
          value={incompleteTasks.length}
          subtitle="Validated &lt; 100%"
          icon={AlertTriangle}
          variant="amber"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          subtitle="Past milestone deadline"
          icon={Clock}
          variant="red"
        />
        <StatCard
          title="High-Risk Incomplete"
          value={highRiskTasks.length}
          subtitle="Critical path activities"
          icon={AlertOctagon}
          variant="red"
        />
        <StatCard
          title="Pending Acceptance"
          value={pendingGovReviewTasks.length}
          subtitle="Awaiting officer sign-off"
          icon={FileText}
          variant="cyan"
        />
      </div>

      {/* Incomplete Task Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>Incomplete Work Packages in Assam Pipeline Corridor</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono font-normal">
            {incompleteTasks.length} Records
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {incompleteTasks.map(task => {
            const variance = task.validatedProgress - task.plannedProgress;

            return (
              <div
                key={task.id}
                className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 transition flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Top Bar with L6 code and Risk */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-mono text-cyan-400 text-xs font-bold block">
                        {task.activityCode}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                        {task.taskName}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{task.location} ({task.chainage})</p>
                    </div>
                    <RiskBadge level={task.risk} size="sm" />
                  </div>

                  {/* 3-Tier Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center my-3">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Planned Baseline</span>
                      <span className="text-slate-200 font-bold font-mono text-base">{task.plannedProgress}%</span>
                      <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{task.plannedQuantity} {task.unit}</span>
                    </div>

                    <div className="border-x border-slate-800">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">Site Reported</span>
                      <span className="text-cyan-400 font-bold font-mono text-base">{task.reportedProgress}%</span>
                      <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{task.reportedQuantity} {task.unit}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold">PM Validated</span>
                      <span className="text-emerald-400 font-bold font-mono text-base">{task.validatedProgress}%</span>
                      <span className="text-[10px] text-slate-500 block font-mono mt-0.5">{task.validatedQuantity} {task.unit}</span>
                    </div>
                  </div>

                  {/* Discrepancy & Variance Notice */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="text-slate-400">Schedule Variance:</span>
                    <span
                      className={cn(
                        'font-mono font-bold',
                        variance < 0 ? 'text-red-400' : 'text-emerald-400'
                      )}
                    >
                      {variance}% {variance < 0 ? '(Slippage)' : '(Ahead)'}
                    </span>
                  </div>

                  {/* Evidence & Supervisor Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => setPhotoModalTask(task)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 font-semibold transition group shadow-sm"
                      title="Open Scrollable Field Photographic Evidence Dialogue"
                    >
                      <Camera className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                      <span>Inspect Field Photos ({task.photoCount || 4})</span>
                    </button>
                    <span className="text-[11px] text-slate-400">Site Manager: {task.assignedSiteManagerName}</span>
                  </div>

                  {/* Current Gov Acceptance Status */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Gov Acceptance:</span>
                    <GovReviewBadge status={task.governmentReviewStatus} detailed />
                  </div>
                </div>

                {/* Government Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleOpenReview(task, 'APPROVE_REPORT')}
                    className="px-2.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition"
                  >
                    Approve Report
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(task, 'REQUEST_CLARIFICATION')}
                    className="px-2.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-semibold transition"
                  >
                    Clarify
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(task, 'ESCALATE')}
                    className="px-2.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Government Acceptance Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={
          reviewAction === 'APPROVE_REPORT'
            ? 'Authorize Government Monitoring Acceptance'
            : reviewAction === 'REQUEST_CLARIFICATION'
            ? 'Request Engineering Clarification'
            : 'Escalate High-Risk Activity'
        }
        subtitle={selectedTask ? `${selectedTask.activityCode}: ${selectedTask.taskName}` : ''}
        maxWidth="lg"
      >
        {selectedTask && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Task Identifier:</span>
                <span className="font-mono text-cyan-400 font-semibold">{selectedTask.id}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Site Reported Progress:</span>
                <span className="font-mono text-white font-bold">{selectedTask.reportedProgress}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>PM Validated Progress:</span>
                <span className="font-mono text-emerald-400 font-bold">{selectedTask.validatedProgress}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Physical Completion:</span>
                <span className="font-mono text-amber-400 font-semibold">INCOMPLETE (Remaining: {100 - selectedTask.validatedProgress}%)</span>
              </div>
            </div>

            {/* Direct Link to Scrollable Photo Evidence Dialogue */}
            <button
              type="button"
              onClick={() => setPhotoModalTask(selectedTask)}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-semibold transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Inspect All Attached Field Evidence Photos ({selectedTask.photoCount || 4} Photos)</span>
            </button>

            <div className="space-y-1.5">
              <label className="block text-slate-300 font-semibold">
                Official Compliance & Monitoring Remarks
              </label>
              <textarea
                value={reviewRemarks}
                onChange={e => setReviewRemarks(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 resize-none text-xs"
                placeholder="Enter remarks..."
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-400">
              * Note: Clicking &quot;Authorize&quot; registers compliance acceptance into the verifiable audit trail. Contractual baseline schedules are not altered.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReview}
                disabled={isProcessing}
                className={cn(
                  'px-5 py-2 rounded-xl font-bold text-xs text-white transition shadow-lg',
                  reviewAction === 'APPROVE_REPORT'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                    : reviewAction === 'REQUEST_CLARIFICATION'
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-900/30'
                    : 'bg-red-600 hover:bg-red-500 shadow-red-900/30'
                )}
              >
                {reviewAction === 'APPROVE_REPORT'
                  ? 'Confirm Acceptance (GOVERNMENT_APPROVED)'
                  : reviewAction === 'REQUEST_CLARIFICATION'
                  ? 'Issue Clarification Request'
                  : 'Escalate to Authority'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Government Scrollable Photo Evidence Dialogue Box */}
      <PhotoEvidenceModal
        isOpen={!!photoModalTask}
        onClose={() => setPhotoModalTask(null)}
        task={photoModalTask}
        title="Government Field Photographic Evidence Audit"
        onApprove={t => handleOpenReview(t, 'APPROVE_REPORT')}
        onRequestClarification={t => handleOpenReview(t, 'REQUEST_CLARIFICATION')}
      />
    </div>
  );
}
