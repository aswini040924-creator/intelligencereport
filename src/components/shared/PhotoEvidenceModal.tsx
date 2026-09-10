'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  User,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Layers,
  Grid,
  Film,
  Hash,
  FileText,
  AlertTriangle,
  Info,
  Check,
  HelpCircle,
} from 'lucide-react';
import { PhotoEvidence, DailyTask } from '@/types';
import { INITIAL_PHOTO_EVIDENCE } from '@/lib/mock/evidence';
import { INITIAL_SUBMISSIONS } from '@/lib/mock/submissions';
import { cn } from '@/lib/utils';

interface PhotoEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: DailyTask | null;
  submissionId?: string;
  photos?: PhotoEvidence[];
  title?: string;
  onApprove?: (task: DailyTask) => void;
  onRequestClarification?: (task: DailyTask) => void;
}

// Fallback high-resolution construction pipeline photos for tasks without explicit evidence entries
const DEFAULT_FALLBACK_PHOTOS: PhotoEvidence[] = [
  {
    id: 'EVD-FB-01',
    submissionId: 'SUB-1045',
    taskId: 'TSK-2026-0910-01',
    activityCode: 'L6-PIP-0245',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    filename: 'WELD_KP17_J142_ROOTPASS.JPG',
    caption: 'PHOTO 01: 24-inch Carbon Steel Pipeline SMAW Root Pass welding under protective canvas shelter at KP 17.4.',
    location: 'Sector 4, Cachar Valley (KP 17.4)',
    latitude: 24.8333,
    longitude: 92.7789,
    capturedAt: '2026-09-10 14:32 IST',
    uploadedBy: 'Vikramjit Singh',
    uploadedRole: 'SITE_MANAGER',
    evidenceStatus: 'VERIFIED',
    aiDetectedObjects: ['24-inch pipeline', 'welding_arc', 'welding_torch', 'ppe_helmet', 'grounding_clamp'],
    aiConsistency: 'HIGH',
    aiRemarks: 'Pipeline detected. Welding activity detected. Geometric diameter and joint alignment match engineering drawings. Consistency: HIGH (96%).',
  },
  {
    id: 'EVD-FB-02',
    submissionId: 'SUB-1045',
    taskId: 'TSK-2026-0910-01',
    activityCode: 'L6-PIP-0245',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    filename: 'WELD_KP17_J143_HOTPASS.JPG',
    caption: 'PHOTO 02: Hot pass and filler deposition on joint J-143. Preheating coil visible around pipe circumference.',
    location: 'Sector 4, Cachar Valley (KP 17.4)',
    latitude: 24.8334,
    longitude: 92.7791,
    capturedAt: '2026-09-10 14:45 IST',
    uploadedBy: 'Vikramjit Singh',
    uploadedRole: 'SITE_MANAGER',
    evidenceStatus: 'VERIFIED',
    aiDetectedObjects: ['induction_heating_band', 'welder', 'interpass_pyrometer', 'pipe_bevel'],
    aiConsistency: 'HIGH',
    aiRemarks: 'Induction heating verified. Digital temperature gauge reads 112°C. Meets minimum 100°C specification.',
  },
  {
    id: 'EVD-FB-03',
    submissionId: 'SUB-1045',
    taskId: 'TSK-2026-0910-01',
    activityCode: 'L6-PIP-0245',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    filename: 'WELD_KP17_BEVEL_INSPECT.JPG',
    caption: 'PHOTO 03: External clamp alignment inspection on joint J-144 showing zero hi-lo mismatch.',
    location: 'Sector 4, Cachar Valley (KP 17.5)',
    latitude: 24.8335,
    longitude: 92.7793,
    capturedAt: '2026-09-10 15:10 IST',
    uploadedBy: 'Vikramjit Singh',
    uploadedRole: 'SITE_MANAGER',
    evidenceStatus: 'VERIFIED',
    aiDetectedObjects: ['pipe_clamp', 'bridge_cam_gauge', 'pipe_wall_14mm'],
    aiConsistency: 'HIGH',
    aiRemarks: 'Bevel angle 30° (+5/-0) identified. Root gap ~2.4mm confirmed within allowable tolerance.',
  },
  {
    id: 'EVD-FB-04',
    submissionId: 'SUB-1045',
    taskId: 'TSK-2026-0910-01',
    activityCode: 'L6-PIP-0245',
    url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
    filename: 'WELD_KP17_CAPPING_FINISHED.JPG',
    caption: 'PHOTO 04: Finished capping pass with uniform weld ripple profile and numbered joint stencil J-142.',
    location: 'Sector 4, Cachar Valley (KP 17.4)',
    latitude: 24.8332,
    longitude: 92.7788,
    capturedAt: '2026-09-10 15:40 IST',
    uploadedBy: 'Vikramjit Singh',
    uploadedRole: 'SITE_MANAGER',
    evidenceStatus: 'VERIFIED',
    aiDetectedObjects: ['completed_weld_crown', 'stencil_marking_J142', 'inspection_stamp'],
    aiConsistency: 'HIGH',
    aiRemarks: 'Weld bead reinforcement height estimated at 1.8mm (limit 2.5mm). Stencil J-142 recognized via OCR.',
  },
];

export function PhotoEvidenceModal({
  isOpen,
  onClose,
  task,
  submissionId,
  photos,
  title = 'Government Field Photographic Evidence Audit',
  onApprove,
  onRequestClarification,
}: PhotoEvidenceModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'CAROUSEL' | 'SCROLLABLE_FEED' | 'GRID'>('CAROUSEL');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [showAiBoxes, setShowAiBoxes] = useState<boolean>(true);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation (Esc to close, left/right arrows for photos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (viewMode === 'CAROUSEL') {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, viewMode, activePhotoIndex]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset photo index when task changes
  useEffect(() => {
    setActivePhotoIndex(0);
    setIsZoomed(false);
  }, [task?.id, submissionId]);

  if (!isOpen) return null;

  // Resolve photos list
  const resolveEvidencePhotos = (): PhotoEvidence[] => {
    if (photos && photos.length > 0) return photos;

    if (task) {
      // 1. Try matching in INITIAL_PHOTO_EVIDENCE by taskId or activityCode
      const matched = INITIAL_PHOTO_EVIDENCE.filter(
        e => e.taskId === task.id || e.activityCode === task.activityCode
      );
      if (matched.length > 0) return matched;

      // 2. Try matching in INITIAL_SUBMISSIONS
      const sub = INITIAL_SUBMISSIONS.find(
        s => s.taskId === task.id || s.activityCode === task.activityCode
      );
      if (sub && sub.photos && sub.photos.length > 0) {
        return sub.photos.map((url, idx) => ({
          id: `EVD-SUB-${idx + 1}`,
          submissionId: sub.id,
          taskId: task.id,
          activityCode: task.activityCode,
          url,
          filename: `SITE_IMG_${task.activityCode}_${idx + 1}.JPG`,
          caption: `Photo ${idx + 1}: ${task.taskName} - Field progress visual record taken at ${task.chainage || 'corridor site'}.`,
          location: task.chainage ? `Sector 4 (${task.chainage})` : sub.location,
          latitude: sub.latitude || 24.8333 + idx * 0.0002,
          longitude: sub.longitude || 92.7789 + idx * 0.0002,
          capturedAt: `2026-09-10 ${14 + idx}:30 IST`,
          uploadedBy: sub.submittedBy || task.assignedSiteManagerName || 'Vikramjit Singh',
          uploadedRole: 'SITE_MANAGER',
          evidenceStatus: 'VERIFIED',
          aiDetectedObjects: [
            task.activityCode.includes('PIP') ? 'pipeline' : 'structural_steel',
            'field_machinery',
            'safety_cones',
            'personnel_ppe',
          ],
          aiConsistency: 'HIGH',
          aiRemarks: `Visual alignment confirmed with ${task.activityCode} specifications. Joint integrity verified.`,
        }));
      }
    }

    if (submissionId) {
      const sub = INITIAL_SUBMISSIONS.find(s => s.id === submissionId);
      if (sub && sub.photos && sub.photos.length > 0) {
        return sub.photos.map((url, idx) => ({
          id: `EVD-SUBID-${idx + 1}`,
          submissionId: sub.id,
          taskId: sub.taskId,
          activityCode: sub.activityCode,
          url,
          filename: `SITE_SUB_${sub.id}_${idx + 1}.JPG`,
          caption: `Photo ${idx + 1}: Field execution evidence for ${sub.taskName}`,
          location: sub.location,
          latitude: sub.latitude,
          longitude: sub.longitude,
          capturedAt: sub.submittedAt,
          uploadedBy: sub.submittedBy,
          uploadedRole: 'SITE_MANAGER',
          evidenceStatus: 'VERIFIED',
          aiDetectedObjects: ['24-inch pipeline', 'welding_arc', 'preheating_coil'],
          aiConsistency: 'HIGH',
          aiRemarks: 'Visual objects cross-validated against daily report items.',
        }));
      }
    }

    return DEFAULT_FALLBACK_PHOTOS;
  };

  const evidenceList = resolveEvidencePhotos();
  const activePhoto = evidenceList[activePhotoIndex] || evidenceList[0];

  const handlePrev = () => {
    setActivePhotoIndex(prev => (prev > 0 ? prev - 1 : evidenceList.length - 1));
    setIsZoomed(false);
  };

  const handleNext = () => {
    setActivePhotoIndex(prev => (prev < evidenceList.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  // Scroll active thumbnail into view
  const scrollToThumbnail = (index: number) => {
    setActivePhotoIndex(index);
    setIsZoomed(false);
    if (thumbnailStripRef.current) {
      const thumb = thumbnailStripRef.current.children[index] as HTMLElement;
      if (thumb) {
        thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Dialogue Box Container */}
      <div className="w-full max-w-6xl max-h-[95vh] bg-[#0b101d] border border-slate-700/80 rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden relative">
        {/* Dialogue Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/10">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {task ? task.activityCode : activePhoto.activityCode}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Government Audit Certified
                </span>
                {task && (
                  <span className="text-[10px] font-mono text-slate-400">
                    Chainage: <strong className="text-white">{task.chainage || 'KP 17.2–18.1'}</strong>
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                {title}
              </h2>
              {task && (
                <p className="text-xs text-slate-400 truncate max-w-xl">
                  {task.taskName} • Supervisor: <span className="text-slate-200">{task.assignedSiteManagerName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Mode Controls & Close */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('CAROUSEL')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition',
                  viewMode === 'CAROUSEL'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
                title="Single Photo Carousel with Metadata"
              >
                <Film className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Inspector</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('SCROLLABLE_FEED')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition',
                  viewMode === 'SCROLLABLE_FEED'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
                title="Scrollable Vertical Feed of all Photos"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Scrollable Feed</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition',
                  viewMode === 'GRID'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
                title="All Photos Grid"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
              aria-label="Close dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Comparison Bar (Government Authority Review Context) */}
        {task && (
          <div className="bg-slate-950/90 border-b border-slate-800/80 px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-mono gap-3 shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 font-sans">Verification Target:</span>
              <span className="text-slate-300">
                Planned: <strong className="text-white">{task.plannedProgress}%</strong>
              </span>
              <span className="text-cyan-400">
                Reported by Site: <strong>{task.reportedProgress}%</strong> ({task.reportedQuantity} {task.unit})
              </span>
              <span className="text-emerald-400">
                Validated by PM: <strong>{task.validatedProgress}%</strong> ({task.validatedQuantity} {task.unit})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-sans">Attached Records:</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                {evidenceList.length} Geotagged Photos
              </span>
            </div>
          </div>
        )}

        {/* DIALOGUE BODY: 3 VIEW MODES */}

        {/* MODE 1: INSPECTOR / CAROUSEL WITH SCROLLABLE THUMBNAIL TRAY */}
        {viewMode === 'CAROUSEL' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Split View: Photo Stage + Inspection Panel */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
              {/* Left Column: Photo Stage (7 cols) */}
              <div className="lg:col-span-7 bg-black/60 flex flex-col justify-between p-4 relative min-h-[320px] lg:min-h-0 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
                {/* Photo Toolbar */}
                <div className="flex items-center justify-between z-10 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-slate-200 text-xs font-mono border border-slate-700">
                      Photo {activePhotoIndex + 1} of {evidenceList.length}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono hidden sm:inline truncate max-w-[200px]">
                      {activePhoto.filename}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setShowAiBoxes(!showAiBoxes)}
                      className={cn(
                        'px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition',
                        showAiBoxes ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                      )}
                      title="Toggle AI Object Detection Overlays"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>AI Detections</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                    >
                      {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* The Image Container with scrollable pan when zoomed */}
                <div className="flex-1 relative flex items-center justify-center overflow-auto rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption}
                    className={cn(
                      'transition-all duration-300 max-h-[52vh] object-contain rounded-xl select-none',
                      isZoomed ? 'scale-150 cursor-grab max-h-none' : 'scale-100 cursor-default'
                    )}
                  />

                  {/* Simulated AI Object Detection Bounding Box Overlays */}
                  {showAiBoxes && !isZoomed && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                      <div className="relative w-full h-full max-h-[50vh]">
                        {/* Box 1: Pipeline Joint */}
                        <div className="absolute top-[25%] left-[20%] w-[55%] h-[40%] border-2 border-dashed border-cyan-400/80 rounded-lg bg-cyan-400/5">
                          <span className="absolute -top-3 left-2 px-1.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono font-bold text-[9px]">
                            {activePhoto.aiDetectedObjects[0] || 'pipeline_weld'} (96%)
                          </span>
                        </div>

                        {/* Box 2: Secondary Feature */}
                        <div className="absolute bottom-[15%] right-[15%] w-[30%] h-[25%] border-2 border-dashed border-emerald-400/80 rounded-lg bg-emerald-400/5">
                          <span className="absolute -top-3 right-2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-bold text-[9px]">
                            {activePhoto.aiDetectedObjects[1] || 'safety_cordon'} (94%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Previous / Next Arrow Buttons */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-slate-700 shadow-xl transition"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md border border-slate-700 shadow-xl transition"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption Bar */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{activePhoto.caption}</p>
                </div>
              </div>

              {/* Right Column: Scrollable Verification Telemetry (5 cols) */}
              <div className="lg:col-span-5 flex flex-col min-h-0 bg-slate-900/40 overflow-y-auto p-4 sm:p-5 space-y-4">
                {/* Geotag Verification Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      Geotag & Corridor Coordinates
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      CORRIDOR VERIFIED
                    </span>
                  </div>

                  <div className="text-xs space-y-1 font-mono">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Coordinates:</span>
                      <span className="text-cyan-300">
                        {activePhoto.latitude.toFixed(4)}° N, {activePhoto.longitude.toFixed(4)}° E
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Location / Chainage:</span>
                      <span className="text-white">{activePhoto.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/60">
                      <span>Geofence Boundary Check:</span>
                      <span className="text-emerald-400 font-sans">Within 15m RoW Buffer</span>
                    </div>
                  </div>
                </div>

                {/* AI Automated Consistency Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      Prototype AI Vision Analysis
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-mono font-bold',
                        activePhoto.aiConsistency === 'HIGH'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      )}
                    >
                      {activePhoto.aiConsistency} MATCH (96%)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    {activePhoto.aiRemarks}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] text-slate-400 block font-semibold">Detected Visual Entities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.aiDetectedObjects.map((obj, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-cyan-300 border border-blue-500/20 font-mono text-[10px]"
                        >
                          #{obj}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chain of Custody & Metadata Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Evidence Chain of Custody
                  </span>

                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Capture Timestamp:</span>
                      <span className="font-mono text-slate-200">{activePhoto.capturedAt}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Submitting Supervisor:</span>
                      <span className="text-white font-medium">{activePhoto.uploadedBy} ({activePhoto.uploadedRole})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Raw Camera File:</span>
                      <span className="font-mono text-cyan-400">{activePhoto.filename}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Hash className="w-3 h-3 text-emerald-400" />
                        SHA-256 Checksum:
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]" title="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855">
                        e3b0c44298fc...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Horizontal Scrollable Thumbnail Strip (Feature explicitly requested!) */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-3 shrink-0">
              <div className="text-xs font-semibold text-slate-400 whitespace-nowrap pl-2 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Evidence Strip ({evidenceList.length}):</span>
              </div>

              {/* Scrollable container with smooth horizontal scroll */}
              <div
                ref={thumbnailStripRef}
                className="flex-1 flex items-center gap-3 overflow-x-auto py-1 px-1 scrollbar-thin scrollbar-thumb-slate-700"
              >
                {evidenceList.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    onClick={() => scrollToThumbnail(idx)}
                    className={cn(
                      'relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 group',
                      activePhotoIndex === idx
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105 ring-2 ring-cyan-500/20'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <span
                      className={cn(
                        'absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold leading-none',
                        activePhotoIndex === idx
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-black/80 text-white'
                      )}
                    >
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CONTINUOUS SCROLLABLE VERTICAL FEED OF ALL PHOTOS */}
        {viewMode === 'SCROLLABLE_FEED' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 bg-slate-950/60">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Continuous Scrollable Audit Stream: Review all attached photographic evidence sequentially.</span>
                </div>
                <span className="font-mono text-cyan-400 font-bold">{evidenceList.length} Photos</span>
              </div>

              {evidenceList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl"
                >
                  {/* Photo Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-[11px]">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white">{item.filename}</span>
                      <span className="text-slate-400 font-mono text-[11px]">• {item.capturedAt}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                      GPS: {item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E
                    </span>
                  </div>

                  {/* Photo High-Resolution Rendering */}
                  <div className="bg-black/80 p-2 flex items-center justify-center">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="max-h-[550px] w-auto object-contain rounded-2xl"
                    />
                  </div>

                  {/* Evidence Card & Telemetry */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {item.caption}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/80">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 text-[11px] block font-semibold mb-1">
                          AI Computer Vision Assessment:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {item.aiRemarks}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.aiDetectedObjects.map((obj, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-blue-500/10 text-cyan-300 text-[9px] font-mono"
                            >
                              #{obj}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Location:</span>
                          <span className="text-slate-200">{item.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Supervisor:</span>
                          <span className="text-white font-sans">{item.uploadedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Integrity:</span>
                          <span className="text-emerald-400">SHA-256 Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODE 3: GRID VIEW */}
        {viewMode === 'GRID' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/60">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidenceList.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => {
                    setActivePhotoIndex(idx);
                    setViewMode('CAROUSEL');
                  }}
                  className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/60 overflow-hidden transition-all duration-200 shadow-lg flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold">
                      #{idx + 1}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500/80 text-slate-950 font-mono text-[10px] font-bold">
                      96% Match
                    </div>
                  </div>
                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-white text-xs truncate">{item.filename}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.caption}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                      <span>{item.capturedAt}</span>
                      <span className="text-cyan-400 group-hover:underline">Inspect →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DIALOGUE FOOTER (Government Authority Action Integration) */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Evidence recorded in immutable audit log under National Infrastructure Monitoring Framework.
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {task && onApprove && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApprove(task);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Approve Report</span>
              </button>
            )}

            {task && onRequestClarification && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestClarification(task);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Request Clarification</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
            >
              Close Dialogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
