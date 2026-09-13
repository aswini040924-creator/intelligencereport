'use client';

import { useState, useEffect, useCallback } from 'react';
import { DailyTask } from '@/types';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_DAILY_TASKS } from '@/lib/mock/tasks';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';
import { AuditLogEntry } from '@/types';

export function useTasks(projectId = 'PRJ-ASSAM-025') {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const reloadTasks = useCallback(() => {
    const saved = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, []);
    if (saved && saved.length > 0) {
      setTasks(saved);
    } else {
      storage.setLocal(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
      setTasks(INITIAL_DAILY_TASKS);
    }
  }, []);

  // Load from local storage or initialize, then stay in sync across portals
  useEffect(() => {
    reloadTasks();
    setIsLoaded(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TASKS) reloadTasks();
    };
    const onLocalUpdate = (e: Event) => {
      const key = (e as CustomEvent<{ key?: string }>).detail?.key;
      if (!key || key === STORAGE_KEYS.TASKS) reloadTasks();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('site2schedule-storage', onLocalUpdate);
    window.addEventListener('site2schedule-evidence-updated', reloadTasks);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('site2schedule-storage', onLocalUpdate);
      window.removeEventListener('site2schedule-evidence-updated', reloadTasks);
    };
  }, [reloadTasks]);

  const persistTasks = useCallback((newTasks: DailyTask[]) => {
    setTasks(newTasks);
    storage.setLocal(STORAGE_KEYS.TASKS, newTasks);
  }, []);

  // Project Manager creates a new official daily task
  const createDailyTask = useCallback(
    (newTaskData: Omit<DailyTask, 'id' | 'lastUpdated' | 'photoCount' | 'dprCount' | 'reportedProgress' | 'validatedProgress' | 'reportedQuantity' | 'validatedQuantity' | 'governmentReviewStatus'>) => {
      const generatedId = `TSK-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;
      
      const createdTask: DailyTask = {
        ...newTaskData,
        id: generatedId,
        reportedProgress: 0,
        validatedProgress: 0,
        reportedQuantity: 0,
        validatedQuantity: 0,
        governmentReviewStatus: 'PENDING_REVIEW',
        photoCount: 0,
        dprCount: 0,
        lastUpdated: new Date().toISOString(),
      };

      const updatedList = [createdTask, ...tasks];
      persistTasks(updatedList);

      // Create Audit Log
      const currentLogs = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
      const newAuditEntry: AuditLogEntry = {
        id: `AUD-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
        user: 'Er. Rajeshwar Verma, PMP',
        role: 'PROJECT_MANAGER',
        action: 'DAILY_TASK_CREATED',
        entity: 'DAILY_TASK',
        entityId: generatedId,
        details: `Created daily task: "${createdTask.taskName}" for activity ${createdTask.activityCode}. Assigned to ${createdTask.assignedSiteManagerName}.`,
        previousValue: 'None',
        newValue: `Planned Qty: ${createdTask.plannedQuantity} ${createdTask.unit}, Priority: ${createdTask.priority}`,
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        status: 'VERIFIED',
      };
      storage.setLocal(STORAGE_KEYS.AUDIT, [newAuditEntry, ...currentLogs]);

      return createdTask;
    },
    [tasks, persistTasks]
  );

  // Update existing task
  const updateTask = useCallback(
    (taskId: string, updates: Partial<DailyTask>) => {
      const updated = tasks.map(t => (t.id === taskId ? { ...t, ...updates, lastUpdated: new Date().toISOString() } : t));
      persistTasks(updated);
    },
    [tasks, persistTasks]
  );

  // Filter helpers
  const projectTasks = tasks.filter(t => !projectId || t.projectId === projectId);
  const todayTasks = projectTasks.filter(t => t.date === '2026-09-10' || t.date === new Date().toISOString().split('T')[0]);
  const incompleteTasks = projectTasks.filter(t => t.status === 'INCOMPLETE' || (t.validatedProgress < 100 && t.status !== 'PLANNED'));
  const overdueTasks = projectTasks.filter(t => t.status === 'OVERDUE');
  const highRiskTasks = projectTasks.filter(t => t.risk === 'HIGH' || t.risk === 'CRITICAL');
  const pendingGovReviewTasks = projectTasks.filter(t => t.governmentReviewStatus === 'PENDING_REVIEW' && t.validatedProgress > 0);

  return {
    tasks: projectTasks,
    allTasks: tasks,
    todayTasks,
    incompleteTasks,
    overdueTasks,
    highRiskTasks,
    pendingGovReviewTasks,
    isLoaded,
    createDailyTask,
    updateTask,
    refreshTasks: () => {
      const saved = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, INITIAL_DAILY_TASKS);
      setTasks(saved);
    },
  };
}
