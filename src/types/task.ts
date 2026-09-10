import { RiskLevel } from './risk';

export type TaskStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'INCOMPLETE'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'REJECTED'
  | 'REVISION_REQUIRED';

export type GovReviewStatus =
  | 'PENDING_REVIEW'
  | 'GOVERNMENT_APPROVED'
  | 'GOVERNMENT_REJECTED'
  | 'CLARIFICATION_REQUESTED';

export interface DailyTask {
  id: string;
  projectId: string;
  activityId: string; // references L6Activity
  activityCode: string; // e.g. 'L6-PIP-0245'
  taskName: string; // e.g. '24-inch Pipeline Welding KP 17.2-18.1'
  date: string; // YYYY-MM-DD
  deadline: string;
  location: string;
  chainage: string;
  unit: string;
  plannedQuantity: number;
  reportedQuantity: number;
  validatedQuantity: number;
  plannedProgress: number; // e.g., 80%
  reportedProgress: number; // e.g., 65% (Site Manager)
  validatedProgress: number; // e.g., 63% (PM Validated)
  assignedSiteManagerId: string;
  assignedSiteManagerName: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: TaskStatus;
  governmentReviewStatus: GovReviewStatus;
  governmentRemarks?: string;
  governmentReviewedAt?: string;
  governmentReviewedBy?: string;
  instructions?: string;
  expectedCompletion: string;
  photoCount: number;
  dprCount: number;
  risk: RiskLevel;
  lastUpdated: string;
}
