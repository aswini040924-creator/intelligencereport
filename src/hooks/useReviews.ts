'use client';

import { useState, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { SiteSubmission, DailyTask, ReviewAction, AuditLogEntry, NotificationItem } from '@/types';
import { INITIAL_SUBMISSIONS } from '@/lib/mock/submissions';
import { INITIAL_DAILY_TASKS } from '@/lib/mock/tasks';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';
import { INITIAL_NOTIFICATIONS } from '@/lib/mock/notifications';

export function useReviews() {
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Project Manager validation & approval
  const pmValidateSubmission = useCallback(
    (
      submissionId: string,
      action: 'APPROVE' | 'MODIFY_APPROVE' | 'REJECT' | 'REQUEST_REVISION',
      validatedProgress: number,
      validatedQuantity: number,
      pmComment: string,
      pmName = 'Er. Rajeshwar Verma, PMP'
    ) => {
      setIsProcessing(true);
      const submissions = storage.getLocal<SiteSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
      const tasks = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
      const audits = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
      const reviews = storage.getLocal<ReviewAction[]>(STORAGE_KEYS.REVIEWS, []);

      const sub = submissions.find(s => s.id === submissionId);
      if (!sub) {
        setIsProcessing(false);
        return { success: false, error: 'Submission not found' };
      }

      const previousReported = sub.reportedProgress;
      const isApproved = action === 'APPROVE' || action === 'MODIFY_APPROVE';

      // Update submission (store validatedProgress separately without overwriting reportedProgress)
      const updatedSubmissions = submissions.map(s => {
        if (s.id === submissionId) {
          return {
            ...s,
            status: isApproved ? ('APPROVED' as const) : action === 'REJECT' ? ('REJECTED' as const) : ('REVISION_REQUIRED' as const),
            validatedProgress: isApproved ? validatedProgress : undefined,
            validatedQuantity: isApproved ? validatedQuantity : undefined,
            pmComment,
            reviewedBy: pmName,
            reviewedAt: new Date().toISOString(),
          };
        }
        return s;
      });
      storage.setLocal(STORAGE_KEYS.SUBMISSIONS, updatedSubmissions);

      // Update associated Daily Task
      const updatedTasks = tasks.map(t => {
        if (t.id === sub.taskId) {
          let nextStatus: DailyTask['status'] = t.status;
          if (isApproved) {
            if (validatedProgress >= 100) nextStatus = 'COMPLETED';
            else if (validatedProgress > 0) nextStatus = 'INCOMPLETE';
            else nextStatus = 'PLANNED';
          } else if (action === 'REQUEST_REVISION') {
            nextStatus = 'REVISION_REQUIRED';
          } else if (action === 'REJECT') {
            nextStatus = 'REJECTED';
          }

          return {
            ...t,
            validatedProgress: isApproved ? validatedProgress : t.validatedProgress,
            validatedQuantity: isApproved ? validatedQuantity : t.validatedQuantity,
            status: nextStatus,
            governmentReviewStatus: isApproved ? ('PENDING_REVIEW' as const) : t.governmentReviewStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return t;
      });
      storage.setLocal(STORAGE_KEYS.TASKS, updatedTasks);

      // Create ReviewAction record
      const newReviewAction: ReviewAction = {
        id: `REV-${Date.now()}`,
        submissionId,
        taskId: sub.taskId,
        reviewer: pmName,
        action,
        previousReportedValue: previousReported,
        newValue: validatedProgress,
        comment: pmComment,
        timestamp: new Date().toISOString(),
      };
      storage.setLocal(STORAGE_KEYS.REVIEWS, [newReviewAction, ...reviews]);

      // Create Audit Log
      const newAuditLog: AuditLogEntry = {
        id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        user: pmName,
        role: 'PROJECT_MANAGER',
        action: action === 'MODIFY_APPROVE' ? 'PM_VALIDATED_PROGRESS_MODIFIED' : isApproved ? 'PM_SUBMISSION_APPROVED' : `PM_${action}`,
        entity: 'SUBMISSION',
        entityId: submissionId,
        details: `Project Manager ${isApproved ? 'validated and approved' : action} field submission for ${sub.activityCode}. Reported: ${previousReported}%, Validated: ${validatedProgress}%. Remarks: "${pmComment}"`,
        previousValue: `Reported: ${previousReported}% (${sub.quantity} ${sub.unit})`,
        newValue: isApproved ? `Validated: ${validatedProgress}% (${validatedQuantity} ${sub.unit})` : action,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'VERIFIED',
      };
      storage.setLocal(STORAGE_KEYS.AUDIT, [newAuditLog, ...audits]);

      // Notification for Government Officer (if validated progress approved)
      if (isApproved) {
        const notifs = storage.getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
        const newNotif: NotificationItem = {
          id: `NOTIF-${Date.now()}`,
          recipientRole: 'GOVERNMENT_OFFICER',
          title: 'Validated Task Report Ready for Acceptance',
          message: `PM ${pmName} validated ${validatedProgress}% on ${sub.activityCode} (${sub.taskName}). Awaiting monitoring review.`,
          timestamp: 'Just now',
          read: false,
          type: 'INFO',
          link: '/gov/incomplete-works',
        };
        storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);
      }

      setIsProcessing(false);
      return { success: true };
    },
    []
  );

  // 2. Government Monitoring Review & Acceptance
  // CRITICAL: Government approval does NOT edit baseline schedule and does NOT equal task completion.
  const governmentReviewTask = useCallback(
    (
      taskId: string,
      action: 'APPROVE_REPORT' | 'REJECT_REPORT' | 'REQUEST_CLARIFICATION' | 'ESCALATE',
      remarks: string,
      officerName = 'Dr. Anandvardhan Sharma, IAS'
    ) => {
      setIsProcessing(true);
      const tasks = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
      const audits = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);

      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        setIsProcessing(false);
        return { success: false, error: 'Task not found' };
      }

      let nextGovStatus: DailyTask['governmentReviewStatus'] = 'PENDING_REVIEW';
      if (action === 'APPROVE_REPORT') nextGovStatus = 'GOVERNMENT_APPROVED';
      else if (action === 'REJECT_REPORT') nextGovStatus = 'GOVERNMENT_REJECTED';
      else if (action === 'REQUEST_CLARIFICATION' || action === 'ESCALATE') nextGovStatus = 'CLARIFICATION_REQUESTED';

      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            governmentReviewStatus: nextGovStatus,
            governmentRemarks: remarks,
            governmentReviewedAt: new Date().toISOString(),
            governmentReviewedBy: officerName,
            lastUpdated: new Date().toISOString(),
            // CRITICAL: Baseline dates & quantities are strictly preserved!
          };
        }
        return t;
      });
      storage.setLocal(STORAGE_KEYS.TASKS, updatedTasks);

      // Audit Log for Government Monitoring Acceptance
      const newAuditLog: AuditLogEntry = {
        id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        user: officerName,
        role: 'GOVERNMENT_OFFICER',
        action: action === 'APPROVE_REPORT' ? 'GOVERNMENT_MONITORING_APPROVED' : `GOVERNMENT_${action}`,
        entity: 'GOVERNMENT_ACCEPTANCE',
        entityId: taskId,
        details: `Government compliance review by ${officerName}: ${action} for task ${task.activityCode} (${task.taskName}). Reported: ${task.reportedProgress}%, PM Validated: ${task.validatedProgress}%. Note: Baseline schedule remains intact. Remarks: "${remarks}"`,
        previousValue: `Gov Status: ${task.governmentReviewStatus}`,
        newValue: `Gov Status: ${nextGovStatus}`,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'VERIFIED',
      };
      storage.setLocal(STORAGE_KEYS.AUDIT, [newAuditLog, ...audits]);

      // Notification for Project Manager
      const notifs = storage.getLocal<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        recipientRole: 'PROJECT_MANAGER',
        title: `Government Review Update: ${task.activityCode}`,
        message: `${officerName} marked ${task.activityCode} as ${nextGovStatus}. Remarks: "${remarks}".`,
        timestamp: 'Just now',
        read: false,
        type: action === 'APPROVE_REPORT' ? 'SUCCESS' : 'WARNING',
        link: '/enterprise/project-manager/daily-tasks',
      };
      storage.setLocal(STORAGE_KEYS.NOTIFICATIONS, [newNotif, ...notifs]);

      setIsProcessing(false);
      return { success: true };
    },
    []
  );

  return {
    isProcessing,
    pmValidateSubmission,
    governmentReviewTask,
  };
}
