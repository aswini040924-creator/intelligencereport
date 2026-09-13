'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PhotoEvidence, PhotoApprovalRecord } from '@/types/evidence';
import { INITIAL_PHOTO_EVIDENCE } from '@/lib/mock/evidence';
import { evidenceApi } from '@/lib/api/evidenceApi';
import { STORAGE_KEYS } from '@/lib/storage';

export function useEvidence(params?: {
  projectId?: string;
  level?: string;
  taskId?: string;
}) {
  const projectId = params?.projectId;
  const level = params?.level;
  const taskId = params?.taskId;

  const [dbEvidence, setDbEvidence] = useState<PhotoEvidence[]>([]);
  const [approvals, setApprovals] = useState<Record<string, PhotoApprovalRecord>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Read latest approvals map
  const reloadApprovals = useCallback(() => {
    const current = evidenceApi.getPhotoApprovals();
    setApprovals(current);
  }, []);

  // Fetch from GridFS and local store
  const fetchEvidence = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await evidenceApi.getEvidence({
        projectId,
        level,
        taskId,
      });
      setDbEvidence(items);
    } catch (err) {
      console.warn('[useEvidence] Failed to fetch evidence:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, level, taskId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      reloadApprovals();
      fetchEvidence();
    }, 0);

    const handleUpdate = () => {
      reloadApprovals();
      fetchEvidence();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PHOTO_APPROVALS || e.key === STORAGE_KEYS.GRIDFS_EVIDENCE) {
        handleUpdate();
      }
    };

    window.addEventListener('site2schedule-evidence-updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('site2schedule-evidence-updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [reloadApprovals, fetchEvidence]);

  // Combine GridFS evidence with enriched mock evidence and apply live approval overlays
  const evidence = useMemo(() => {
    const enrichedMocks: PhotoEvidence[] = INITIAL_PHOTO_EVIDENCE.map((mock, idx) => ({
      ...mock,
      projectId: mock.projectId || (idx % 2 === 0 ? 'PRJ-ASSAM-025' : 'BRG1001'),
      projectName:
        mock.projectName ||
        (idx % 2 === 0
          ? 'Assam Natural Gas Grid Expansion Project'
          : 'Cable-Stayed Bridge Package 1'),
      level: mock.level || (idx % 3 === 0 ? 'L6' : idx % 3 === 1 ? 'L5' : 'L4'),
      storageType: mock.storageType || 'Seed Demo',
    }));

    // Filter mocks based on criteria
    const filteredMocks = enrichedMocks.filter(item => {
      const matchProject =
        !projectId ||
        projectId === 'ALL' ||
        item.projectId?.toLowerCase() === projectId.toLowerCase() ||
        item.projectName?.toLowerCase().includes(projectId.toLowerCase());

      const matchLevel =
        !level || level === 'ALL' || item.level === level;

      const matchTask =
        !taskId || taskId === 'ALL' || item.taskId === taskId;

      return matchProject && matchLevel && matchTask;
    });

    const liveIds = new Set(dbEvidence.map(e => e.fileId || e.id));
    const nonDuplicatedMocks = filteredMocks.filter(m => !liveIds.has(m.id));
    const merged = [...dbEvidence, ...nonDuplicatedMocks];

    // Overlay persisted approval records
    return merged.map(item => {
      const key = item.fileId || item.id;
      const approval = approvals[key];
      if (approval) {
        return {
          ...item,
          pmApprovalStatus: approval.status,
          pmApprovedBy: approval.approvedBy,
          pmApprovedAt: approval.approvedAt,
          pmApprovalRemarks: approval.remarks,
          evidenceStatus:
            approval.status === 'APPROVED'
              ? ('VERIFIED' as const)
              : approval.status === 'REJECTED'
              ? ('REJECTED' as const)
              : ('UNDER_REVIEW' as const),
        };
      }
      return {
        ...item,
        pmApprovalStatus: 'PENDING' as const,
        evidenceStatus: 'UNDER_REVIEW' as const,
      };
    });
  }, [dbEvidence, approvals, projectId, level, taskId]);

  // Approved evidence items strictly matching approvals map
  const approvedEvidence = useMemo(() => {
    return evidence.filter(e => {
      const key = e.fileId || e.id;
      return approvals[key]?.status === 'APPROVED';
    });
  }, [evidence, approvals]);

  // Check if a specific evidence item is approved (strictly false by default)
  const isApproved = useCallback(
    (id: string) => {
      return approvals[id]?.status === 'APPROVED';
    },
    [approvals]
  );

  // Get approval record for an item
  const getApprovalRecord = useCallback(
    (id: string): PhotoApprovalRecord | undefined => {
      return approvals[id];
    },
    [approvals]
  );

  // Approve evidence action
  const approveEvidence = useCallback(
    async (
      id: string,
      meta?: {
        taskId?: string;
        activityCode?: string;
        remarks?: string;
        url?: string;
      }
    ) => {
      const item = evidence.find(e => e.id === id || e.fileId === id);
      const res = await evidenceApi.updateApproval(id, {
        status: 'APPROVED',
        approvedBy: 'Project Manager',
        remarks: meta?.remarks || 'Approved by Project Manager via Field Evidence console',
        taskId: meta?.taskId || item?.taskId,
        activityCode: meta?.activityCode || item?.activityCode,
        url: meta?.url || item?.url,
      });

      reloadApprovals();
      return res;
    },
    [evidence, reloadApprovals]
  );

  // Revoke approval action
  const revokeEvidence = useCallback(
    async (id: string) => {
      const res = await evidenceApi.updateApproval(id, {
        status: 'PENDING',
        approvedBy: 'Project Manager',
        remarks: 'Approval revoked for re-inspection',
      });

      reloadApprovals();
      return res;
    },
    [reloadApprovals]
  );

  // Reset all approvals
  const resetApprovals = useCallback(() => {
    evidenceApi.clearAllApprovals();
    reloadApprovals();
  }, [reloadApprovals]);

  return {
    evidence,
    approvedEvidence,
    approvedCount: approvedEvidence.length,
    isLoading,
    isApproved,
    getApprovalRecord,
    approveEvidence,
    revokeEvidence,
    resetApprovals,
    refreshEvidence: fetchEvidence,
  };
}

