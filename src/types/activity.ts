import { RiskLevel } from './risk';

export type WBSLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface WBSLevelInfo {
  level: WBSLevel;
  title: string;
  shortDesc: string;
  isFocusArea: boolean; // True for L5 and L6
}

export const WBS_LEVEL_DEFINITIONS: Record<WBSLevel, WBSLevelInfo> = {
  L1: {
    level: 'L1',
    title: 'Entire Project',
    shortDesc: 'Top-level master infrastructure contract & overall schedule',
    isFocusArea: false,
  },
  L2: {
    level: 'L2',
    title: 'Pipeline Package',
    shortDesc: 'Major EPC contract package awarded to contractor',
    isFocusArea: false,
  },
  L3: {
    level: 'L3',
    title: 'Pipeline Section',
    shortDesc: 'Geographical chainage corridor stretch (e.g., KP 0–25)',
    isFocusArea: false,
  },
  L4: {
    level: 'L4',
    title: 'Construction Phase',
    shortDesc: 'Engineering lifecycle phase (Civil, Mechanical, RoW execution)',
    isFocusArea: false,
  },
  L5: {
    level: 'L5',
    title: 'Pipeline Erection',
    shortDesc: 'Physical erection work package where crews and equipment deploy (Core Focus Area)',
    isFocusArea: true,
  },
  L6: {
    level: 'L6',
    title: 'Specific Pipeline Erection Activity',
    shortDesc: 'Granular field execution unit linked to DPRs, photos, quantities & AI validation (Core Focus Area)',
    isFocusArea: true,
  },
};

export interface L6Activity {
  id: string;
  projectId: string;
  l5Id: string;
  code: string; // e.g., 'L6-PIP-0245'
  name: string; // e.g., '24-inch CS Pipeline Welding'
  level: 'L6';
  levelName: 'Specific Pipeline Erection Activity';
  l5Name: string; // e.g., 'Mainline Pipeline Erection'
  l4Name?: string; // e.g., 'Mechanical Construction Phase'
  l3Name?: string; // e.g., 'Pipeline Section 4 (KP 0–25)'
  l2Name?: string; // e.g., 'Pipeline Package 02 (Mainline Transmission)'
  l1Name?: string; // e.g., 'Assam Pipeline Expansion Project'
  wbsHierarchyPath: string; // e.g., 'L1: Entire Project > L2: Pipeline Package > L3: Pipeline Section > L4: Construction Phase > L5: Pipeline Erection > L6: Specific Activity'
  chainage: string; // e.g., 'KP 17–18'
  location: string;
  unit: string; // e.g., 'Joints' or 'Meters'
  plannedQuantity: number;
  actualQuantity: number;
  plannedProgress: number; // e.g., 80%
  currentProgress: number; // e.g., 63% (PM validated)
  reportedProgress?: number; // e.g., 65% (last site manager report)
  baselineStart: string;
  baselineFinish: string;
  plannedStart: string;
  plannedFinish: string;
  dependencies: string[]; // e.g., ['L6-PIP-0244']
  risk: RiskLevel;
  status: 'PLANNED' | 'IN_PROGRESS' | 'INCOMPLETE' | 'OVERDUE' | 'COMPLETED';
  assignedSiteManagerId: string;
  assignedSiteManagerName: string;
  isFocusArea?: boolean;
}

export interface L5Package {
  id: string;
  projectId: string;
  code: string;
  name: string;
  level: 'L5';
  levelName: 'Pipeline Erection';
  wbsPath: string; // e.g., 'L1: Entire Project > L2: Pipeline Package > L3: Pipeline Section > L4: Construction Phase > L5: Pipeline Erection'
  plannedProgress: number;
  actualProgress: number;
  activitiesCount: number;
  isFocusArea?: boolean;
}
