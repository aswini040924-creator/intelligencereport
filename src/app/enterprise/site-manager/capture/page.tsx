'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useSubmissions } from '@/hooks/useSubmissions';
import { PhotoUploader } from '@/components/shared/PhotoUploader';
import { simulateAIAnalysis } from '@/lib/mock/aiResults';
import {
  Camera,
  MapPin,
  Clock,
  Mic,
  SendHorizontal,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

function CaptureForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTaskId = searchParams.get('taskId');

  const { tasks } = useTasks('PRJ-ASSAM-025');
  const { submitDailyProgress } = useSubmissions('PRJ-ASSAM-025');

  // Selected Task
  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    initialTaskId || 'TSK-2026-0910-01'
  );

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  // Form Fields
  const [reportedProgress, setReportedProgress] = useState<number>(
    selectedTask?.reportedProgress || 65
  );
  const [quantity, setQuantity] = useState<number>(
    selectedTask?.reportedQuantity || 260
  );
  const [unit, setUnit] = useState<string>(selectedTask?.unit || 'Joints');
  const [description, setDescription] = useState<string>(
    '24-inch CS pipeline welding completed at KP 17.2–18.1. Completed 8 additional root and hot passes on mainline joints. Preheating maintained at 110°C.'
  );
  const [issues, setIssues] = useState<string>(
    'Intermittent wind gusts required additional argon purge flow. Joint J-151 bevel had slight handling notch requiring cosmetic grinding.'
  );
  const [voiceTranscript, setVoiceTranscript] = useState<string>(
    'Site reporting here Vikramjit Singh. Completed 8 joints today between KP 17.2 and 18.1 with propane preheating.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  ]);

  const [latitude] = useState(24.8333);
  const [longitude] = useState(92.7789);
  const [locationName] = useState('Sector 4, Cachar Valley (KP 17.4)');
  const [currentTime, setCurrentTime] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST');
  }, []);

  // Update fields when selected task changes
  useEffect(() => {
    if (selectedTask) {
      setUnit(selectedTask.unit);
      if (selectedTask.reportedProgress > 0) {
        setReportedProgress(selectedTask.reportedProgress);
      }
      if (selectedTask.reportedQuantity > 0) {
        setQuantity(selectedTask.reportedQuantity);
      }
    }
  }, [selectedTaskId, selectedTask]);

  // Deterministic Prototype AI preview
  const aiSimulation = simulateAIAnalysis(
    description,
    selectedTask?.activityCode || 'L6-PIP-0245',
    photos.length
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      submitDailyProgress({
        projectId: 'PRJ-ASSAM-025',
        taskId: selectedTask.id,
        activityId: selectedTask.activityId,
        activityCode: selectedTask.activityCode,
        taskName: selectedTask.taskName,
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

      setSubmittedMessage('Submitted successfully. Awaiting Project Manager review.');

      setTimeout(() => {
        router.push('/enterprise/site-manager/submissions');
      }, 2000);
    } catch {
      alert('Failed to save submission.');
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
          <h1 className="text-lg font-bold text-white tracking-tight">Capture Daily Progress</h1>
          <p className="text-[11px] text-slate-400">Mobile Field Submission Engine</p>
        </div>
        <div className="w-8" />
      </div>

      {/* Success Notification */}
      {submittedMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold block">{submittedMessage}</span>
            <span className="text-[11px] text-emerald-300">Redirecting to submissions tracking...</span>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 space-y-5">
        {/* Task Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Assigned Daily Task
          </label>
          <select
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 text-xs font-mono"
          >
            {tasks.map(t => (
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
            <span>Voice Update / Audio Transcript</span>
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
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Site Photographs & Evidence
          </label>
          <PhotoUploader
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={8}
            taskId={selectedTask.id}
            activityCode={selectedTask.activityCode}
            uploaderName="Vikramjit Singh"
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
            &quot;Pipeline and welding activity detected. Evidence appears consistent with the selected task {selectedTask?.activityCode}.&quot;
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
          <SendHorizontal className="w-4 h-4" />
          <span>{isSubmitting ? 'Transmitting Evidence...' : 'Submit Daily Progress Update'}</span>
        </button>
      </form>
    </div>
  );
}

export default function SiteManagerCapturePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading Capture Console...</div>}>
      <CaptureForm />
    </Suspense>
  );
}
