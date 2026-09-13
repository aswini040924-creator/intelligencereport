export interface PhotoEvidence {
  id: string;
  fileId?: string;
  submissionId?: string;
  projectId?: string;
  projectName?: string;
  level?: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  wbsHierarchyPath?: string;
  taskId: string;
  taskName?: string;
  activityCode: string;
  activityName?: string;
  url: string;
  filename: string;
  caption?: string;
  description?: string;
  issues?: string;
  reportedProgress?: number;
  quantity?: number;
  unit?: string;
  location: string;
  latitude: number;
  longitude: number;
  capturedAt?: string;
  submittedAt?: string;
  uploadedBy: string;
  uploadedRole?: string;
  submittedBy?: string;
  evidenceStatus?: 'VERIFIED' | 'REVIEW_PENDING' | 'FLAGGED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  status?: string;
  aiDetectedObjects?: string[];
  aiConsistency?: 'HIGH' | 'MEDIUM' | 'LOW';
  aiConfidence?: number;
  aiRemarks?: string;
  storageType?: string;
  pmApprovalStatus?: 'APPROVED' | 'REJECTED' | 'PENDING';
  pmApprovedBy?: string;
  pmApprovedAt?: string;
  pmApprovalRemarks?: string;
}

export interface PhotoApprovalRecord {
  photoId: string;
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  approvedBy: string;
  approvedAt: string;
  remarks?: string;
  taskId?: string;
  activityCode?: string;
  url?: string;
}
