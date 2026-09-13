'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { s3Api } from '@/lib/api/s3Client';
import { PhotoEvidence } from '@/types/evidence';
import { WBSLevel } from '@/types/activity';
import { Modal } from '@/components/shared/Modal';
import { useEvidence } from '@/hooks/useEvidence';
import {
  Image as ImageIcon,
  Eye,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Layers,
  Database,
  Filter,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function PMEvidencePage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedApprovalFilter, setSelectedApprovalFilter] = useState<'ALL' | 'PENDING' | 'APPROVED'>('ALL');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEvidence | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Centralized reactive evidence hook
  const {
    evidence,
    approvedEvidence,
    approvedCount,
    isLoading,
    isApproved,
    approveEvidence,
    revokeEvidence,
    resetApprovals,
    refreshEvidence,
  } = useEvidence({
    projectId: selectedProjectId,
    level: selectedLevel,
  });

  // Fetch available projects from S3 backend
  useEffect(() => {
    s3Api
      .getProjects({ limit: 100 })
      .then(res => {
        if (res && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects);
        }
      })
      .catch(err => {
        console.warn('Backend projects fetch fallback to local:', err);
      });
  }, []);

  // Filter evidence by approval status in addition to project and level
  const filteredEvidence = useMemo(() => {
    return evidence.filter(item => {
      const itemApproved = isApproved(item.fileId || item.id);
      if (selectedApprovalFilter === 'APPROVED') return itemApproved;
      if (selectedApprovalFilter === 'PENDING') return !itemApproved;
      return true;
    });
  }, [evidence, selectedApprovalFilter, isApproved]);

  // Handle Approve action
  const handleApprove = async (evd: PhotoEvidence, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = evd.fileId || evd.id;
    setApprovingId(id);

    try {
      await approveEvidence(id, {
        taskId: evd.taskId,
        activityCode: evd.activityCode,
        url: evd.url,
        remarks: 'Validated and Approved by Project Manager',
      });

      // Update selectedPhoto if modal is currently viewing this photo
      if (selectedPhoto && (selectedPhoto.id === id || selectedPhoto.fileId === id)) {
        setSelectedPhoto({
          ...selectedPhoto,
          pmApprovalStatus: 'APPROVED',
          evidenceStatus: 'VERIFIED',
          pmApprovedBy: 'Project Manager',
          pmApprovedAt: new Date().toISOString(),
        });
      }

      setToastMessage(
        `Field Evidence for ${evd.activityCode} has been APPROVED. Reflecting on Site Manager console & Government Dashboard.`
      );
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setApprovingId(null);
    }
  };

  // Handle Revoke action
  const handleRevoke = async (evd: PhotoEvidence, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = evd.fileId || evd.id;
    setApprovingId(id);

    try {
      await revokeEvidence(id);

      if (selectedPhoto && (selectedPhoto.id === id || selectedPhoto.fileId === id)) {
        setSelectedPhoto({
          ...selectedPhoto,
          pmApprovalStatus: 'PENDING',
          evidenceStatus: 'UNDER_REVIEW',
          pmApprovedBy: undefined,
          pmApprovedAt: undefined,
        });
      }

      setToastMessage(`Approval revoked for ${evd.activityCode}.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Revoke failed:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const isModalPhotoApproved = selectedPhoto
    ? isApproved(selectedPhoto.fileId || selectedPhoto.id)
    : false;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1 pr-2 font-medium">{toastMessage}</div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/60"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header with Project and GridFS Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 mb-2">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>MongoDB GridFS Photographic Cluster</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Field Photographic Evidence Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and approve field visual submissions. Approvals immediately propagate to the Site Manager console and the Government Oversight dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Approved Count Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>{approvedCount}</strong> Approved
              </span>
            </div>
            {approvedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  resetApprovals();
                  setToastMessage('All field evidence approvals reset to unapproved.');
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                title="Reset all back to unapproved"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={refreshEvidence}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2 flex-1">
            <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-300 shrink-0">Filter by Project:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="flex-1 max-w-md px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Projects ({projects.length})</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code || p.id} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Approval Status Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedApprovalFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedApprovalFilter === 'ALL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({evidence.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedApprovalFilter('PENDING')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedApprovalFilter === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending ({evidence.length - approvedCount})
              </button>
              <button
                type="button"
                onClick={() => setSelectedApprovalFilter('APPROVED')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedApprovalFilter === 'APPROVED'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Approved ({approvedCount})
              </button>
            </div>

            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              Showing <strong className="text-cyan-400">{filteredEvidence.length}</strong> items
            </span>
          </div>
        </div>

        {/* WBS Level Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>WBS Level:</span>
          </span>
          {['ALL', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6'].map(lvl => {
            const isSelected = selectedLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1 rounded-xl font-mono text-xs font-semibold transition border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {lvl === 'ALL' ? 'All Levels' : lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {filteredEvidence.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Evidence Matches Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No photographic evidence found for the selected project, level, or approval status filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvidence.map(evd => {
            const isGridFs = evd.storageType === 'GridFS' || !!evd.fileId;
            const itemApproved = isApproved(evd.fileId || evd.id);
            const isProcessing = approvingId === (evd.fileId || evd.id);

            return (
              <div
                key={evd.fileId || evd.id}
                onClick={() => setSelectedPhoto(evd)}
                className={`group rounded-2xl overflow-hidden bg-slate-900/60 border transition cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-lg ${
                  itemApproved
                    ? 'border-emerald-500/40 hover:border-emerald-400/70 hover:shadow-emerald-950/20'
                    : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-950/20'
                }`}
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={evd.url}
                      alt={evd.caption || evd.taskName || 'Evidence'}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />

                    {/* Top Badges: Project Code & WBS Level */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-black/75 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        {evd.projectId || 'PRJ'}
                      </span>
                      {evd.level && (
                        <span className="px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 font-mono text-[10px] font-bold border border-blue-500/30">
                          {evd.level}
                        </span>
                      )}
                    </div>

                    {/* Right Badge: Approval Status Stamp */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {itemApproved ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/90 text-white font-mono text-[10px] font-bold flex items-center gap-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>PM APPROVED</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-500/85 text-slate-950 font-mono text-[10px] font-bold">
                          UNDER REVIEW
                        </span>
                      )}
                    </div>

                    {/* Bottom Badge: Storage Indicator */}
                    {isGridFs && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 font-mono text-[10px] border border-cyan-500/40 flex items-center gap-1">
                        <Database className="w-3 h-3 text-cyan-400" />
                        <span>GridFS</span>
                      </span>
                    )}

                    {/* Hover Inspect Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        {evd.activityCode}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {evd.submittedAt
                          ? new Date(evd.submittedAt).toLocaleDateString()
                          : evd.capturedAt || 'Recent'}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white line-clamp-2">
                      {evd.caption || evd.taskName || evd.description}
                    </h3>
                  </div>
                </div>

                {/* Card Action Bar with Approve Button */}
                <div>
                  <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/90 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate max-w-[150px]">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{evd.location}</span>
                    </div>

                    {/* Approve Action Button */}
                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      {itemApproved ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold shadow-sm shadow-emerald-950/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Approved</span>
                          </span>

                          <button
                            type="button"
                            onClick={e => handleRevoke(evd, e)}
                            title="Revoke approval"
                            className="p-1.5 rounded-xl text-slate-500 hover:text-amber-400 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={e => handleApprove(evd, e)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isProcessing ? 'Saving...' : 'Approve'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="px-4 py-1.5 bg-slate-950/60 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>By: {evd.submittedBy || evd.uploadedBy || 'Site Manager'}</span>
                    {itemApproved && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> PM Validated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enlarged Inspection Modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={
          selectedPhoto
            ? `${selectedPhoto.projectId || 'Project'} • ${selectedPhoto.level || 'WBS'}: ${selectedPhoto.activityCode}`
            : ''
        }
        subtitle={selectedPhoto?.projectName || selectedPhoto?.caption}
        maxWidth="4xl"
      >
        {selectedPhoto && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Field evidence'}
                className="w-full max-h-[55vh] object-contain mx-auto"
              />
            </div>

            {/* PM Approval Action Box inside Inspection Modal */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Project Manager Official Field Sign-Off</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isModalPhotoApproved
                    ? 'This photographic evidence has been validated & accepted. Recorded on Site Manager & Government dashboards.'
                    : 'Verify visual joint execution against Master schedule specifications before approving.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isModalPhotoApproved ? (
                  <>
                    <span className="px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Approved by PM</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRevoke(selectedPhoto)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
                    >
                      Revoke
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedPhoto)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 hover:scale-[1.02] transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Field Evidence</span>
                  </button>
                )}
              </div>
            </div>

            {/* Technical Metadata Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Project</span>
                  <span className="text-cyan-400 font-bold">{selectedPhoto.projectId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">WBS Level</span>
                  <span className="text-white font-bold">{selectedPhoto.level || 'L6'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Storage</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedPhoto.fileId ? 'MongoDB GridFS' : 'Database Stored'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">AI Consistency</span>
                  <span className="text-purple-400 font-bold">
                    {selectedPhoto.aiConsistency || 'HIGH'}
                  </span>
                </div>
              </div>

              {selectedPhoto.description && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-1">Field Remarks:</span>
                  <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 leading-relaxed italic">
                    &ldquo;{selectedPhoto.description}&rdquo;
                  </p>
                </div>
              )}

              {selectedPhoto.issues && (
                <div>
                  <span className="text-amber-400 font-semibold block mb-1">Obstacles / Issues:</span>
                  <p className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200">
                    {selectedPhoto.issues}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedPhoto.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    {selectedPhoto.submittedAt
                      ? new Date(selectedPhoto.submittedAt).toLocaleString()
                      : selectedPhoto.capturedAt || 'Logged Today'}
                  </span>
                </div>
                <div className="text-right font-mono text-slate-500">
                  By: {selectedPhoto.submittedBy || selectedPhoto.uploadedBy}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
