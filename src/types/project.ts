import { RiskLevel } from './risk';

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  organization: string;
  location: string;
  corridor: string;
  startDate: string;
  targetFinishDate: string;
  baselineFinishDate: string;
  plannedProgress: number; // e.g. 80 (%)
  actualProgress: number;  // e.g. 63 (%)
  variance: number;        // actual - planned, e.g. -17 (%)
  risk: RiskLevel;
  incompleteTasksCount: number;
  overdueTasksCount: number;
  pendingGovReviewsCount: number;
  governmentStatus: 'ON_TRACK' | 'AT_RISK' | 'DELAYED' | 'CRITICAL_REVIEW';
  projectManager: string;
  description: string;
  totalActivitiesCount: number;
  budgetCr: number;
  spentCr: number;
}

export interface WBSNode {
  id: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';
  levelTitle?: string; // e.g., 'Entire Project', 'Pipeline Package', 'Pipeline Section', 'Construction Phase', 'Pipeline Erection', 'Specific Pipeline Erection Activity'
  code: string;
  name: string;
  parentId?: string;
  isFocusArea?: boolean; // True for L5 and L6
  description?: string;
  wbsPath?: string;
  plannedProgress: number;
  actualProgress: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'INCOMPLETE';
  children?: WBSNode[];
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  wbsLevel: string;
  targetDate: string;
  completedDate?: string;
  status: 'ACHIEVED' | 'PENDING' | 'AT_RISK' | 'DELAYED';
  weightagePercent: number;
  governmentApproved: boolean;
}
