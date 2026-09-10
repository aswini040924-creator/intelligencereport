import { RiskLevel } from './risk';

export interface SiteSubmission {
  id: string; // e.g. 'SUB-1045'
  projectId: string;
  taskId: string;
  activityId: string;
  activityCode: string;
  taskName: string;
  description: string;
  issues?: string;
  reportedProgress: number; // e.g. 65%
  quantity: number; // e.g. 330
  unit: string;
  photos: string[]; // URLs / data preview URLs
  latitude: number;
  longitude: number;
  location: string;
  voiceTranscript?: string;
  submittedBy: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED';
  aiConfidence: number; // e.g. 0.95
  aiConsistency: 'HIGH' | 'MEDIUM' | 'LOW';
  risk: RiskLevel;

  // PM Review & Validation fields (stored separately, never overwriting original site submission)
  validatedProgress?: number; // e.g. 63%
  validatedQuantity?: number; // e.g. 320
  pmComment?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ReviewAction {
  id: string;
  submissionId: string;
  taskId: string;
  reviewer: string;
  action: 'APPROVE' | 'MODIFY_APPROVE' | 'REJECT' | 'REQUEST_REVISION';
  previousReportedValue: number; // e.g. 65%
  newValue: number;              // e.g. 63%
  comment: string;
  timestamp: string;
}
