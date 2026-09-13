'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useSubmissions } from '@/hooks/useSubmissions';
import { PhotoUploader } from '@/components/shared/PhotoUploader';
import { simulateAIAnalysis } from '@/lib/mock/aiResults';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { s3Api } from '@/lib/api/s3Client';
import { evidenceApi } from '@/lib/api/evidenceApi';
import { WBSLevel, WBS_LEVEL_DEFINITIONS } from '@/types/activity';
import {
  Camera,
  MapPin,
  Clock,
  Mic,
  SendHorizontal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowLeft,
  Building2,
  Database,
  Loader2,
  FolderTree,
} from 'lucide-react';
import Link from 'next/link';

function CaptureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlProjectId = searchParams.get('projectId');
  const urlTaskId = searchParams.get('taskId');
  const urlLevel = (searchParams.get('level') as WBSLevel) || 'L6';

  // Projects list (from backend or fallback)
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    urlProjectId || 'PRJ-ASSAM-025'
  );

  // WBS Level selection (L1 - L6)
  const [selectedLevel, setSelectedLevel] = useState<WBSLevel>(urlLevel);

  // Fetch projects from backend on mount
  useEffect(() => {
    s3Api
      .getProjects({ limit: 100 })
      .then(res => {
        if (res && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects);
          if (urlProjectId && res.projects.some((p: { id: string }) => p.id === urlProjectId)) {
            setSelectedProjectId(urlProjectId);
          }
        }
      })
      .catch(err => {
        console.warn('Backend projects fetch fallback to local:', err);
      });
  }, [urlProjectId]);

  const selectedProject =
    projects.find(p => p.id === selectedProjectId) || projects[0] || INITIAL_PROJECTS[0];

  const { tasks } = useTasks(selectedProjectId);
  const { submitDailyProgress } = useSubmissions(selectedProjectId);

  // Filter tasks based on selected level, or provide contextual milestone options
  const availableTasks = useMemo(() => {
    if (tasks.length > 0) {
      return tasks;
    }
    // Fallback contextual tasks based on level
    return [
      {
        id: `TSK-${selectedProjectId}-${selectedLevel}-01`,
        projectId: selectedProjectId,
        activityId: `ACT-${selectedProjectId}-${selectedLevel}-01`,
        activityCode: `${selectedLevel}-BRG-01`,
        taskName: `${selectedProject.name} — ${WBS_LEVEL_DEFINITIONS[selectedLevel]?.title || 'Execution'}`,
        reportedProgress: 60,
        reportedQuantity: 150,
        plannedQuantity: 200,
        unit: 'Units',
        location: selectedProject.location || 'Site Corridor',
      },
    ];
  }, [tasks, selectedProjectId, selectedLevel, selectedProject]);

  // Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    urlTaskId || availableTasks[0]?.id || 'TSK-DEFAULT'
  );

  useEffect(() => {
    if (availableTasks.length > 0 && !availableTasks.some(t => t.id === selectedTaskId)) {
      setSelectedTaskId(availableTasks[0].id);
    }
  }, [availableTasks, selectedTaskId]);

  const selectedTask =
    availableTasks.find(t => t.id === selectedTaskId) || availableTasks[0];

  // Form Fields
  const [reportedProgress, setReportedProgress] = useState<number>(
    selectedTask?.reportedProgress || 65
  );
  const [quantity, setQuantity] = useState<number>(
    selectedTask?.reportedQuantity || 120
  );
  const [unit, setUnit] = useState<string>(selectedTask?.unit || 'Joints');
  const [description, setDescription] = useState<string>(
    `Field inspection and physical execution verification completed for ${selectedProject.name} at level ${selectedLevel}. Work completed in compliance with technical specifications.`
  );
  const [issues, setIssues] = useState<string>('');
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');

  // Initial photos: start empty for real evidence capture!
  const [photos, setPhotos] = useState<string[]>([]);

  const [latitude] = useState(24.8333);
  const [longitude] = useState(92.7789);
  const [locationName, setLocationName] = useState(
    selectedProject.location || 'Sector Corridor KP 17.4'
  );
  const [currentTime, setCurrentTime] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [gridFsSuccessInfo, setGridFsSuccessInfo] = useState<{
    fileCount: number;
    source: string;
    projectId: string;
    level: string;
  } | null>(null);

  useEffect(() => {
    setCurrentTime(
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'
    );
  }, []);

  // Update location when project changes
  useEffect(() => {
    if (selectedProject) {
      setLocationName(selectedProject.location || 'Project Site Corridor');
    }
  }, [selectedProject]);

  // Update fields when selected task changes
  useEffect(() => {
    if (selectedTask) {
      if (selectedTask.unit) setUnit(selectedTask.unit);
      if (selectedTask.reportedProgress && selectedTask.reportedProgress > 0) {
        setReportedProgress(selectedTask.reportedProgress);
      }
      if (selectedTask.reportedQuantity && selectedTask.reportedQuantity > 0) {
        setQuantity(selectedTask.reportedQuantity);
      }
    }
  }, [selectedTaskId, selectedTask]);

  // AI preview simulation
  const aiSimulation = simulateAIAnalysis(
    description,
    selectedTask?.activityCode || `${selectedLevel}-PIP-0245`,
    photos.length
  );

  // Quick load sample image helper
  const handleLoadSamplePhoto = () => {
    setPhotos([
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length === 0) {
      alert('Please attach or capture at least 1 photo evidence before submitting.');
      return;
    }

    if (reportedProgress < 0 || reportedProgress > 100) {
      alert('Reported progress must be between 0 and 100%.');
      return;
    }

    if (quantity < 0) {
      alert('Completed quantity must be greater than or equal to 0.');
      return;
    }

    if (!description.trim()) {
      alert('Please provide a field description of what was completed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Stream image binary to MongoDB GridFS via Express backend
      const uploadRes = await evidenceApi.uploadEvidence({
        images: photos,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        level: selectedLevel,
        wbsHierarchyPath: `L1: ${selectedProject.name} > ${selectedLevel}: ${selectedTask?.taskName || 'Activity'}`,
        taskId: selectedTask?.id || 'TSK-CUSTOM',
        taskName: selectedTask?.taskName || `${selectedLevel} Field Work`,
        activityCode: selectedTask?.activityCode || `${selectedLevel}-ACT`,
        activityName: selectedTask?.taskName,
        description,
        issues: issues || undefined,
        reportedProgress: Number(reportedProgress),
        quantity: Number(quantity),
        unit,
        location: locationName,
        latitude,
        longitude,
        voiceTranscript: voiceTranscript || undefined,
        submittedBy: 'Vikramjit Singh',
        submittedAt: new Date().toISOString(),
      });

      // 2. Also register in local state for immediate client-side tracking
      submitDailyProgress({
        projectId: selectedProject.id,
        taskId: selectedTask?.id || 'TSK-CUSTOM',
        activityId: selectedTask?.activityId || 'ACT-CUSTOM',
        activityCode: selectedTask?.activityCode || `${selectedLevel}-ACT`,
        taskName: selectedTask?.taskName || `${selectedLevel} Work`,
        description,
        issues: issues || undefined,
        reportedProgress: Number(reportedProgress),
        quantity: Number(quantity),
        unit,
        photos: uploadRes.evidence?.map(e => e.url) || photos,
        latitude,
        longitude,
        location: locationName,
        voiceTranscript: voiceTranscript || undefined,
        submittedBy: 'Vikramjit Singh',
      });

      setGridFsSuccessInfo({
        fileCount: photos.length,
        source: 'MongoDB GridFS Cluster',
        projectId: selectedProject.id,
        level: selectedLevel,
      });

      setSubmittedMessage(
        `Successfully captured & stored ${photos.length} evidence image(s) in MongoDB GridFS under project "${selectedProject.name}" (${selectedLevel}).`
      );

      setTimeout(() => {
        router.push('/enterprise/site-manager/submissions');
      }, 2500);
    } catch (err: unknown) {
      console.error('Evidence submission error:', err);
      // Fallback client-side save if network completely fails
      submitDailyProgress({
        projectId: selectedProject.id,
        taskId: selectedTask?.id || 'TSK-CUSTOM',
        activityId: selectedTask?.activityId || 'ACT-CUSTOM',
        activityCode: selectedTask?.activityCode || `${selectedLevel}-ACT`,
        taskName: selectedTask?.taskName || `${selectedLevel} Work`,
        description,
        issues: issues || undefined,
        reportedProgress: Number(reportedProgress),
        quantity: Number(quantity),
        unit,
        photos,
        latitude,
        longitude,
        location: locationName,
        voiceTranscript: voiceTranscript || undefined,
        submittedBy: 'Vikramjit Singh',
      });

      setSubmittedMessage('Saved locally. Redirecting to submissions...');
      setTimeout(() => {
        router.push('/enterprise/site-manager/submissions');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Mobile-Friendly Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Link
          href="/enterprise/site-manager/dashboard"
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 mb-0.5">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>MongoDB GridFS Connected</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Capture Daily Evidence</h1>
          <p className="text-[11px] text-slate-400">Mobile Field Submission Engine</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Success Notification */}
      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block text-sm text-emerald-300">{submittedMessage}</span>
            {gridFsSuccessInfo && (
              <div className="text-[11px] font-mono text-emerald-400/90 flex flex-wrap gap-x-3 gap-y-1">
                <span>Storage: GridFS Bucket</span>
                <span>Project: {gridFsSuccessInfo.projectId}</span>
                <span>Level: {gridFsSuccessInfo.level}</span>
              </div>
            )}
            <span className="text-[11px] text-emerald-400 block pt-0.5">
              Reflected in Project Manager Portal. Redirecting to submissions...
            </span>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-5"
      >
        {/* Project Selection Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Target Project</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {projects.length} Projects Available
            </span>
          </label>
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono font-medium"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.code || p.id} — {p.name}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Selected: <strong className="text-slate-300">{selectedProject.name}</strong> •{' '}
            {selectedProject.location}
          </p>
        </div>

        {/* WBS Level Selector (L1 - L6) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>WBS Hierarchy Level (Image Category)</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              Current: {selectedLevel}
            </span>
          </label>

          {/* Level Pills */}
          <div className="grid grid-cols-6 gap-1.5">
            {(['L1', 'L2', 'L3', 'L4', 'L5', 'L6'] as WBSLevel[]).map(lvl => {
              const isSelected = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`py-2 px-1 rounded-xl text-center font-mono text-xs font-bold transition border ${
                    isSelected
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

          {/* Level Info Banner */}
          <div className="mt-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <FolderTree className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white font-mono">{selectedLevel}</strong>:{' '}
              <span className="text-slate-300 font-semibold">
                {WBS_LEVEL_DEFINITIONS[selectedLevel]?.title}
              </span>{' '}
              — {WBS_LEVEL_DEFINITIONS[selectedLevel]?.shortDesc}
            </div>
          </div>
        </div>

        {/* Assigned Task / Milestone Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Task / Milestone under {selectedLevel}
          </label>
          <select
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono"
          >
            {availableTasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.activityCode} — {t.taskName}
              </option>
            ))}
          </select>
        </div>

        {/* Quantities & Progress */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Reported Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={reportedProgress}
              onChange={e => setReportedProgress(Number(e.target.value))}
              placeholder="e.g. 65"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Completed Qty ({unit})
            </label>
            <input
              type="number"
              min="0"
              required
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              placeholder="e.g. 260"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Work Description & Activities Performed
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what was executed on ground today..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* Obstacles & Issues */}
        <div>
          <label className="block text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Site Problems / Obstacles / Weather Issues (Optional)</span>
          </label>
          <textarea
            rows={2}
            value={issues}
            onChange={e => setIssues(e.target.value)}
            placeholder="Note any rock encounter, water seepage, wind gusts, or machine breakdown..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-200 text-xs focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>

        {/* Voice Note / Audio Update */}
        <div>
          <label className="block text-xs font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Update / Audio Transcript (Optional)</span>
          </label>
          <input
            type="text"
            value={voiceTranscript}
            onChange={e => setVoiceTranscript(e.target.value)}
            placeholder="e.g. Completed 8 joints today between KP 17.2 and 18.1..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 italic"
          />
        </div>

        {/* Multi-Photo Evidence Capture */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300">
              Site Photographs & Visual Evidence
            </label>
            {photos.length === 0 && (
              <button
                type="button"
                onClick={handleLoadSamplePhoto}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono cursor-pointer"
              >
                + Quick Demo Photo
              </button>
            )}
          </div>
          <PhotoUploader
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={8}
            taskId={selectedTask?.id}
            activityCode={selectedTask?.activityCode}
            uploaderName="Vikramjit Singh"
            projectName={selectedProject.name}
            level={selectedLevel}
          />
        </div>

        {/* Geotag & Metadata Area */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location:</span>
            </span>
            <span className="text-white font-mono">{locationName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Timestamp:</span>
            </span>
            <span className="text-white font-mono">{currentTime || 'Loading...'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Storage Destination:</span>
            <span className="text-cyan-400 font-mono font-bold">MongoDB GridFS Cluster</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Supervisor:</span>
            <span className="text-slate-200">Vikramjit Singh (SM-X72K91AB)</span>
          </div>
        </div>

        {/* Prototype AI Analysis Simulation Preview Box */}
        <div className="p-4 rounded-xl bg-[#091122] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs text-white font-mono">Prototype AI Analysis</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              {Math.round(aiSimulation.confidence * 100)}% Match
            </span>
          </div>

          <p className="text-[11px] text-cyan-200/90 leading-relaxed italic">
            &quot;Physical evidence matches selected project ({selectedProject.code}) and WBS level{' '}
            {selectedLevel}. Verified for transmission to PM Review Queue.&quot;
          </p>

          <div className="text-[10px] text-slate-500 font-mono">
            Simulated objects: {aiSimulation.detectedObjects.slice(0, 3).join(', ')}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm transition shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Streaming to MongoDB GridFS...</span>
            </>
          ) : (
            <>
              <SendHorizontal className="w-4 h-4" />
              <span>Submit Evidence to MongoDB GridFS</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function SiteManagerCapturePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-xs text-slate-400">Loading Capture Console...</div>
      }
    >
      <CaptureForm />
    </Suspense>
  );
}
