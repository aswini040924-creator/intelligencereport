'use client';

import { useState, useEffect, useCallback } from 'react';
import { SiteSubmission, AuditLogEntry, NotificationItem } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_SUBMISSIONS } from '@/lib/mock/submissions';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock/notifications';
import { simulateAIAnalysis } from '@/lib/mock/aiResults';
import { useTasks } from './useTasks';

export function useSubmissions(projectId = 'PRJ-ASSAM-025') {
  const [submissions, setSubmissions] = useState<SiteSubmission[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { updateTask } = useTasks(projectId);

  useEffect(() => {
    const saved = storage.getLocal<SiteSubmission[]>(STORAGE_KEYS.SUBMISSIONS, []);
    if (saved && saved.length > 0) {
      setSubmissions(saved);
    } else {
      storage.setLocal(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
      setSubmissions(INITIAL_SUBMISSIONS);
    }
    setIsLoaded(true);
  }, []);

  const persistSubmissions = useCallback((newList: SiteSubmission[]) => {
    setSubmissions(newList);
    storage.setLocal(STORAGE_KEYS.SUBMISSIONS, newList);
  }, []);

  // Site Manager submits field progress
  const submitDailyProgress = useCallback(
    (submissionData: {
      projectId: string;
      taskId: string;
      activityId: string;
      activityCode: string;
      taskName: string;
      description: string;
      issues?: string;
      reportedProgress: number;
      quantity: number;
      unit: string;
      photos: string[];
      latitude: number;
      longitude: number;
      location: string;
      voiceTranscript?: string;
      submittedBy: string;
    }): SiteSubmission => {
      const newId = `SUB-${Math.floor(Math.random() * 900) + 1050}`;
      const aiAnalysis = simulateAIAnalysis(
        submissionData.description,
        submissionData.activityCode,
        submissionData.photos.length
      );

      const newSubmission: SiteSubmission = {
        ...submissionData,
        id: newId,
        submittedAt: new Date().toISOString(),
        status: 'UNDER_REVIEW',
        aiConfidence: aiAnalysis.confidence,
        aiConsistency: aiAnalysis.evidenceStatus,
        risk: submissionData.reportedProgress < 50 ? 'HIGH' : 'MEDIUM',
      };

      const updatedSubmissions = [newSubmission, ...submissions];
      persistSubmissions(updatedSubmissions);

      // Update the task status to SUBMITTED and record reported progress
      updateTask(submissionData.taskId, {
        status: 'SUBMITTED',
        reportedProgress: submissionData.reportedProgress,
        reportedQuantity: submissionData.quantity,
        photoCount: submissionData.photos.length,
      });

      // 1. Audit Trail Record
      const logs = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
      const newAudit: AuditLogEntry = {
        id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        user: submissionData.submittedBy,
        role: 'SITE_MANAGER',
        action: 'SITE_PROGRESS_SUBMITTED',
        entity: 'SUBMISSION',
        entityId: newId,
        details: `Site Manager submitted daily update for ${submissionData.activityCode} (${submissionData.taskName}): reported ${submissionData.reportedProgress}% (${submissionData.quantity} ${submissionData.unit}) with ${submissionData.photos.length} photos.`,
        previousValue: 'Previous Field Report',
        newValue: `Reported Progress: ${submissionData.reportedProgress}%`,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'VERIFIED',
      };
      storage.setLocal(STORAGE_KEYS.AUDIT, [newAudit, ...logs]);

      // 2. Notification for Project Manager
      const notifs = storage.getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientRole: 'PROJECT_MANAGER',
        title: 'New Site Submission Awaiting Review',
        message: `${submissionData.submittedBy} submitted ${submissionData.photos.length} photos and ${submissionData.reportedProgress}% progress for ${submissionData.activityCode}.`,
        timestamp: 'Just now',
        read: false,
        type: 'ACTION_REQUIRED',
        link: '/enterprise/project-manager/review',
      };
      storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

      return newSubmission;
    },
    [submissions, persistSubmissions, updateTask]
  );

  const getSubmissionById = useCallback(
    (id: string) => submissions.find(s => s.id === id),
    [submissions]
  );

  return {
    submissions: submissions.filter(s => !projectId || s.projectId === projectId),
    allSubmissions: submissions,
    pendingReviews: submissions.filter(s => s.status === 'UNDER_REVIEW'),
    approvedSubmissions: submissions.filter(s => s.status === 'APPROVED'),
    isLoaded,
    submitDailyProgress,
    getSubmissionById,
    persistSubmissions,
  };
}
