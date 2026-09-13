'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProjectSummary, DailyTask, L6Activity, L5Package } from '@/types';
import { s3Api, S3OverviewResponse } from '@/lib/api/s3Client';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { INITIAL_DAILY_TASKS } from '@/lib/mock/tasks';
import { INITIAL_L6_ACTIVITIES, INITIAL_L5_PACKAGES } from '@/lib/mock/activities';

export interface S3Risk {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  status: 'OPEN' | 'MITIGATED';
  delayImpactDays: number;
  costImpactCr: number;
  resolutionPlan: string;
  reportedBy: string;
  createdAt: string;
}

interface S3DataContextType {
  projects: ProjectSummary[];
  tasks: DailyTask[];
  activities: L6Activity[];
  packages: L5Package[];
  risks: S3Risk[];
  overview: S3OverviewResponse['overview'] | null;
  s3Status: 'connected' | 'syncing' | 'offline';
  lastSyncTime: string | null;
  bucketName: string;
  totalS3Records: number;
  isSyncing: boolean;
  syncS3: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const S3DataContext = createContext<S3DataContextType | undefined>(undefined);

export function S3DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectSummary[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<DailyTask[]>(INITIAL_DAILY_TASKS);
  const [activities, setActivities] = useState<L6Activity[]>(INITIAL_L6_ACTIVITIES);
  const [packages, setPackages] = useState<L5Package[]>(INITIAL_L5_PACKAGES);
  const [risks, setRisks] = useState<S3Risk[]>([]);
  const [overview, setOverview] = useState<S3OverviewResponse['overview'] | null>(null);
  const [s3Status, setS3Status] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState<string>('cherrodu');
  const [totalS3Records, setTotalS3Records] = useState<number>(4999);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load all live data from Express S3 backend
  const loadS3Data = useCallback(async () => {
    try {
      setS3Status('syncing');
      
      // 1. Health check
      const health = await s3Api.getHealth().catch(() => null);
      if (health?.s3?.connected) {
        setBucketName(health.s3.bucket);
        setLastSyncTime(health.s3.lastSync ? new Date(health.s3.lastSync).toLocaleTimeString() : new Date().toLocaleTimeString());
      }

      // 2. Fetch overview
      const overviewRes = await s3Api.getOverview().catch(() => null);
      if (overviewRes?.success) {
        setOverview(overviewRes.overview);
        if (overviewRes.sheetsSummary?.integratedRowsCount) {
          setTotalS3Records(overviewRes.sheetsSummary.integratedRowsCount);
        }
      }

      // 3. Fetch projects
      const projectsRes = await s3Api.getProjects({ limit: 100 }).catch(() => null);
      if (projectsRes?.success && projectsRes.projects?.length > 0) {
        setProjects(projectsRes.projects);
        storage.setLocal(STORAGE_KEYS.PROJECTS, projectsRes.projects);
      }

      // 4. Fetch tasks
      const tasksRes = await s3Api.getTasks().catch(() => null);
      if (tasksRes?.success && tasksRes.tasks?.length > 0) {
        const savedTasks = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, []);
        const mergedTasks = tasksRes.tasks.map((remoteTask: DailyTask) => {
          const localMatch = savedTasks.find(lt => lt.id === remoteTask.id);
          if (localMatch && (localMatch.status === 'SUBMITTED' || (localMatch.photos && localMatch.photos.length > 0) || localMatch.lastEvidenceAt)) {
            return {
              ...remoteTask,
              status: localMatch.status || remoteTask.status,
              reportedProgress: localMatch.reportedProgress ?? remoteTask.reportedProgress,
              reportedQuantity: localMatch.reportedQuantity ?? remoteTask.reportedQuantity,
              photoCount: localMatch.photoCount ?? remoteTask.photoCount,
              photos: localMatch.photos || remoteTask.photos,
              lastEvidenceAt: localMatch.lastEvidenceAt,
            };
          }
          return remoteTask;
        });
        setTasks(mergedTasks);
        storage.setLocal(STORAGE_KEYS.TASKS, mergedTasks);
      }

      // 5. Fetch activities
      const activitiesRes = await s3Api.getActivities().catch(() => null);
      if (activitiesRes?.success) {
        if (activitiesRes.activities?.length > 0) {
          setActivities(activitiesRes.activities);
          storage.setLocal(STORAGE_KEYS.ACTIVITIES, activitiesRes.activities);
        }
        if (activitiesRes.packages?.length > 0) {
          setPackages(activitiesRes.packages);
        }
      }

      // 6. Fetch risks
      const risksRes = await s3Api.getRisks().catch(() => null);
      if (risksRes?.success && risksRes.risks) {
        setRisks(risksRes.risks);
      }

      setS3Status('connected');
    } catch (err) {
      console.warn('[S3DataProvider] Error connecting to S3 backend:', err);
      // Fallback to local storage or mock
      const savedProjects = storage.getLocal<ProjectSummary[]>(STORAGE_KEYS.PROJECTS, []);
      if (savedProjects.length > 0) setProjects(savedProjects);
      
      const savedTasks = storage.getLocal<DailyTask[]>(STORAGE_KEYS.TASKS, []);
      if (savedTasks.length > 0) setTasks(savedTasks);

      setS3Status('offline');
    }
  }, []);

  useEffect(() => {
    loadS3Data();
  }, [loadS3Data]);

  // Force trigger S3 re-sync
  const syncS3 = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await s3Api.triggerSync();
      if (res.success) {
        await loadS3Data();
      }
    } catch (err) {
      console.error('[S3DataProvider] Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [loadS3Data]);

  return (
    <S3DataContext.Provider
      value={{
        projects,
        tasks,
        activities,
        packages,
        risks,
        overview,
        s3Status,
        lastSyncTime,
        bucketName,
        totalS3Records,
        isSyncing,
        syncS3,
        refreshData: loadS3Data,
      }}
    >
      {children}
    </S3DataContext.Provider>
  );
}

export function useS3Data() {
  const context = useContext(S3DataContext);
  if (!context) {
    throw new Error('useS3Data must be used within an S3DataProvider');
  }
  return context;
}
