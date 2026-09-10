'use client';

import React, { useState } from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useReviews } from '@/hooks/useReviews';
import { useTasks } from '@/hooks/useTasks';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Modal } from '@/components/shared/Modal';
import { simulateAIAnalysis } from '@/lib/mock/aiResults';
import { SiteSubmission } from '@/types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Mic,
  Image as ImageIcon,
  Check,
  X,
  RotateCcw,
  Eye,
  FileText,
  Building2,
  HardHat,
  ChevronRight,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PMReviewPage() {
  const { submissions, pendingReviews, persistSubmissions } = useSubmissions('PRJ-ASSAM-025');
  const { pmValidateSubmission, isProcessing } = useReviews();
  const { refreshTasks } = useTasks('PRJ-ASSAM-025');

  // Active selected submission for detailed two-column manual review
  const [selectedSub, setSelectedSub] = useState<SiteSubmission | null>(
    pendingReviews.length > 0 ? pendingReviews[0] : submissions[0] || null
  );

  // Validation Form State
  const [validatedProgressInput, setValidatedProgressInput] = useState<number>(
    selectedSub ? selectedSub.validatedProgress || Math.max(0, selectedSub.reportedProgress - 2) : 63
  );
  const [validatedQuantityInput, setValidatedQuantityInput] = useState<number>(
    selectedSub ? selectedSub.validatedQuantity || Math.max(0, selectedSub.quantity - 8) : 252
  );
  const [pmCommentInput, setPmCommentInput] = useState<string>(
    selectedSub?.pmComment ||
      'Weld count reconciled with tally sheet. 2 joints on steep slope require crown grinding verification before crediting. Validated at 63% (252 joints).'
  );

  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // When selected submission changes, update form inputs
  const handleSelectSubmission = (sub: SiteSubmission) => {
    setSelectedSub(sub);
    setValidatedProgressInput(sub.validatedProgress || Math.max(0, sub.reportedProgress - 2));
    setValidatedQuantityInput(sub.validatedQuantity || Math.max(0, sub.quantity - 8));
    setPmCommentInput(
      sub.pmComment ||
        `Verified field photos and daily weld logs for ${sub.activityCode}. Approved with minor reconciliation adjustment.`
    );
  };

  const handleAction = (action: 'APPROVE' | 'MODIFY_APPROVE' | 'REJECT' | 'REQUEST_REVISION') => {
    if (!selectedSub) return;

    if (validatedProgressInput < 0 || validatedProgressInput > 100) {
      alert('Progress must be between 0 and 100.');
      return;
    }

    if (validatedQuantityInput < 0) {
      alert('Quantity must be greater than or equal to 0.');
      return;
    }

    pmValidateSubmission(
      selectedSub.id,
      action,
      validatedProgressInput,
      validatedQuantityInput,
      pmCommentInput,
      'Er. Rajeshwar Verma, PMP'
    );

    setToastMessage(
      action === 'MODIFY_APPROVE' || action === 'APPROVE'
        ? `Submission ${selectedSub.id} successfully validated! Reported: ${selectedSub.reportedProgress}%, Validated: ${validatedProgressInput}%. Committed to schedule.`
        : `Submission ${selectedSub.id} marked as ${action}.`
    );

    // Refresh local lists
    refreshTasks();

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const currentAI = selectedSub
    ? simulateAIAnalysis(selectedSub.description, selectedSub.activityCode, selectedSub.photos.length)
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Multi-Modal Review Queue</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Field Evidence Verification & Validation Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare Site Manager reported claims against AI suggestions and commit verified physical progress to the official schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {pendingReviews.length} Pending PM Review
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-xs text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Queue Horizontal Carousel / Selector */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Review Queue ({submissions.length} Submissions)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {submissions.slice(0, 4).map(sub => {
            const isSelected = selectedSub?.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => handleSelectSubmission(sub)}
                className={cn(
                  'p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2 select-none',
                  isSelected
                    ? 'bg-blue-950/40 border-cyan-400 shadow-md shadow-blue-900/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">{sub.id}</span>
                  <StatusBadge status={sub.status} size="sm" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{sub.taskName}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Reported: <strong className="text-cyan-300 font-mono">{sub.reportedProgress}%</strong></span>
                    <span>AI Match: <strong className="text-emerald-400 font-mono">{Math.round(sub.aiConfidence * 100)}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono">
                  <span>{sub.photos.length} photos</span>
                  <span>{sub.submittedBy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN MANUAL REVIEW WORKSPACE */}
      {selectedSub && currentAI ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Original Site Submission (5 Cols) */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <HardHat className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Original Site Submission</h3>
              </div>
              <span className="font-mono text-xs text-cyan-400 font-semibold">{selectedSub.id}</span>
            </div>

            {/* Task and Chainage Meta */}
            <div>
              <span className="text-[11px] text-slate-500 font-mono uppercase font-semibold">Assigned Activity</span>
              <h4 className="text-sm font-bold text-white mt-0.5">{selectedSub.taskName}</h4>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedSub.location} ({selectedSub.latitude}° N, {selectedSub.longitude}° E)</span>
              </p>
            </div>

            {/* Reported Numbers Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Reported Progress</span>
                <span className="text-xl font-bold text-cyan-400">{selectedSub.reportedProgress}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Reported Quantity</span>
                <span className="text-xl font-bold text-white">{selectedSub.quantity} <span className="text-xs font-normal text-slate-400">{selectedSub.unit}</span></span>
              </div>
            </div>

            {/* Description & Issues */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Field Description:</span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
                  {selectedSub.description}
                </p>
              </div>

              {selectedSub.issues && (
                <div>
                  <span className="text-amber-400 font-semibold block mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Site Obstacles / Remarks:
                  </span>
                  <p className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed">
                    {selectedSub.issues}
                  </p>
                </div>
              )}

              {selectedSub.voiceTranscript && (
                <div>
                  <span className="text-cyan-400 font-semibold block mb-1 flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> Audio Transcript:
                  </span>
                  <p className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-slate-300 italic leading-relaxed">
                    &ldquo;{selectedSub.voiceTranscript}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Photo Evidence Thumbnails */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Submitted Photographs ({selectedSub.photos.length})</span>
                <span className="text-[11px] text-slate-500 font-mono">Click to enlarge</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedSub.photos.map((photo, i) => (
                  <div
                    key={i}
                    onClick={() => setEnlargedPhoto(photo)}
                    className="group relative rounded-xl overflow-hidden border border-slate-800 aspect-video cursor-pointer bg-slate-950"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={`Evidence ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-150"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800 font-mono">
              <span>Submitted by: {selectedSub.submittedBy}</span>
              <span>Time: {new Date(selectedSub.submittedAt).toLocaleTimeString()} IST</span>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Interpretation & Approval Panel (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* AI Interpretation Box */}
            <div className="p-6 rounded-2xl bg-[#0a1120] border border-cyan-500/30 space-y-4 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">AI Multi-Modal Interpretation</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                  {Math.round(currentAI.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Matched WBS Activity:</span>
                  <span className="font-mono text-cyan-400 font-bold">{currentAI.matchedActivity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Extracted Specification:</span>
                  <span className="text-white font-medium">{currentAI.extractedActivity}</span>
                </div>
                {currentAI.materialDetected && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Detected Materials:</span>
                    <span className="text-slate-200">{currentAI.materialDetected}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Evidence Consistency:</span>
                  <span className="text-emerald-400 font-bold font-mono">HIGH (Simulated)</span>
                </div>
              </div>

              {/* Detected Objects Tags */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Computer Vision Detected Objects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentAI.detectedObjects.map((obj, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reasoning Points */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
                <span className="text-slate-300 font-semibold block">Inference Reasoning:</span>
                {currentAI.reasoning.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * Prototype AI Analysis: Deterministic local simulation. Connect to Vertex AI / YOLO models for production inference.
              </p>
            </div>

            {/* APPROVAL PANEL */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Project Manager Validation Panel</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">Er. Rajeshwar Verma, PMP</span>
              </div>

              {/* Input Fields: Validated Progress % & Validated Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Validated Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={validatedProgressInput}
                    onChange={e => setValidatedProgressInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Original Reported: <strong className="text-slate-400 font-mono">{selectedSub.reportedProgress}%</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Validated Quantity ({selectedSub.unit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={validatedQuantityInput}
                    onChange={e => setValidatedQuantityInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Original Reported: <strong className="text-slate-400 font-mono">{selectedSub.quantity}</strong>
                  </span>
                </div>
              </div>

              {/* PM Comment Text Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Manager Engineering Remarks
                </label>
                <textarea
                  rows={3}
                  value={pmCommentInput}
                  onChange={e => setPmCommentInput(e.target.value)}
                  placeholder="Enter remarks explaining any adjustment from site reported claim..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Dual Value Distinction Notice */}
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-[11px] text-slate-400">
                Notice: Approving will set validated progress to <strong className="text-emerald-400 font-mono">{validatedProgressInput}%</strong>. The Site Manager&apos;s original report of <strong className="text-cyan-400 font-mono">{selectedSub.reportedProgress}%</strong> is strictly preserved for audit trails.
              </div>

              {/* 4 Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction('APPROVE')}
                  disabled={isProcessing}
                  className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('MODIFY_APPROVE')}
                  disabled={isProcessing}
                  className="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Modify & Approve</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('REQUEST_REVISION')}
                  disabled={isProcessing}
                  className="px-3 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 font-semibold text-xs transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Revision</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAction('REJECT')}
                  disabled={isProcessing}
                  className="px-3 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-semibold text-xs transition flex items-center justify-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Enlarged Photo Modal */}
      <Modal
        isOpen={!!enlargedPhoto}
        onClose={() => setEnlargedPhoto(null)}
        title="Field Photo Evidence Inspection"
        subtitle={selectedSub ? `${selectedSub.activityCode}: ${selectedSub.taskName}` : ''}
        maxWidth="4xl"
      >
        {enlargedPhoto && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={enlargedPhoto}
                alt="Enlarged field evidence"
                className="w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
