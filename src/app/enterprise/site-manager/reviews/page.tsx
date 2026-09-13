'use client';

import React, { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useReviews } from '@/hooks/useReviews';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { GovReviewBadge } from '@/components/shared/GovReviewBadge';
import { Modal } from '@/components/shared/Modal';
import { PhotoEvidenceModal } from '@/components/shared/PhotoEvidenceModal';
import {
  Search,
  Eye,
  CheckCircle2,
  HelpCircle,
  Camera,
} from 'lucide-react';
import { DailyTask } from '@/types';

export default function SiteManagerTaskReviewsPage() {
  const { tasks, refreshTasks } = useTasks('PRJ-ASSAM-025');
  const { siteManagerReviewTask, isProcessing } = useReviews();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);
  const [photoModalTask, setPhotoModalTask] = useState<DailyTask | null>(null);
  const [actionModal, setActionModal] = useState<{
    task: DailyTask;
    action: 'APPROVE_REPORT' | 'REJECT_REPORT' | 'REQUEST_CLARIFICATION';
  } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredTasks = tasks.filter(
    t =>
      t.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.activityCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecuteAction = () => {
    if (!actionModal) return;

    siteManagerReviewTask(
      actionModal.task.id,
      actionModal.action,
      remarks || 'Site manager field review recorded for Project Manager visibility.',
      'Vikramjit Singh'
    );

    setToastMessage(
      `Review for ${actionModal.task.activityCode} sent to the Project Manager board.`
    );
    setActionModal(null);
    setRemarks('');
    refreshTasks();
    setTimeout(() => setToastMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Site Manager Task Reviews
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review assigned field tasks. Approvals, rejections, and clarification requests are written to the shared task record and shown immediately on the Project Manager board.
          </p>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search tasks by name or L6 ID (e.g. L6-PIP-0245)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3.5">Task & L6 ID</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">PM Validated</th>
                <th className="px-4 py-3.5">Planned %</th>
                <th className="px-4 py-3.5">Reported %</th>
                <th className="px-4 py-3.5">Evidence</th>
                <th className="px-4 py-3.5">Task Status</th>
                <th className="px-4 py-3.5">Site Review</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-cyan-400 text-xs font-semibold block">
                      {task.activityCode}
                    </span>
                    <span className="font-medium text-white block max-w-xs truncate">
                      {task.taskName}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                    {task.chainage}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-emerald-400 font-bold">
                    {task.validatedProgress}%
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400">
                    {task.plannedProgress}%
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-cyan-300">
                    {task.reportedProgress}%
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setPhotoModalTask(task)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition"
                      title="Inspect attached photographic evidence"
                    >
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{task.photoCount || 4} photos</span>
                    </button>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={task.status} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <GovReviewBadge status={task.governmentReviewStatus} source="site" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-right space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedTask(task)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionModal({ task, action: 'APPROVE_REPORT' })}
                      className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white"
                      title="Approve Report"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionModal({ task, action: 'REQUEST_CLARIFICATION' })}
                      className="p-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white"
                      title="Request Clarification from Project Manager"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask ? `${selectedTask.activityCode}: ${selectedTask.taskName}` : ''}
        subtitle="Field verification detail — updates sync to the Project Manager"
        maxWidth="2xl"
      >
        {selectedTask && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Planned Baseline</span>
                <span className="text-slate-300 font-bold">{selectedTask.plannedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Site Reported</span>
                <span className="text-cyan-400 font-bold">{selectedTask.reportedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PM Validated</span>
                <span className="text-emerald-400 font-bold">{selectedTask.validatedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Physical Status</span>
                <span className="text-amber-400 font-bold">{selectedTask.status}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block font-semibold mb-1">PM Instructions / Work Scope:</span>
              <p className="text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
                {selectedTask.instructions || 'Standard mainline pipelay specifications apply.'}
              </p>
            </div>

            {selectedTask.governmentRemarks && (
              <div>
                <span className="text-slate-400 block font-semibold mb-1">Last Review Remarks:</span>
                <p className="text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
                  {selectedTask.governmentRemarks}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>Location Chainage:</span>
                <span className="text-white font-mono">{selectedTask.chainage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attached Field Evidence:</span>
                <button
                  type="button"
                  onClick={() => setPhotoModalTask(selectedTask)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-semibold transition"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect {selectedTask.photoCount || 4} Photos →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!actionModal}
        onClose={() => setActionModal(null)}
        title={
          actionModal?.action === 'APPROVE_REPORT'
            ? 'Confirm Site Task Review'
            : actionModal?.action === 'REQUEST_CLARIFICATION'
            ? 'Request Clarification from Project Manager'
            : 'Reject Report'
        }
        subtitle={actionModal ? `${actionModal.task.activityCode}` : ''}
        maxWidth="md"
      >
        {actionModal && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-300">
              You are applying <strong>{actionModal.action}</strong> for task {actionModal.task.activityCode} ({actionModal.task.taskName}). The Project Manager Daily Tasks board will show this status.
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Remarks for Project Manager:</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                placeholder="Enter field remarks that the Project Manager will see..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 resize-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteAction}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs disabled:opacity-50"
              >
                Confirm & Sync to PM
              </button>
            </div>
          </div>
        )}
      </Modal>

      <PhotoEvidenceModal
        isOpen={!!photoModalTask}
        onClose={() => setPhotoModalTask(null)}
        task={photoModalTask}
        title="Site Manager Field Photographic Evidence"
        onApprove={t => setActionModal({ task: t, action: 'APPROVE_REPORT' })}
        onRequestClarification={t => setActionModal({ task: t, action: 'REQUEST_CLARIFICATION' })}
      />
    </div>
  );
}
