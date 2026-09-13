export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ProjectRisk {
  id: string;
  projectId: string;
  activityId?: string;
  title: string;
  description: string;
  level: RiskLevel;
  category: 'SCHEDULE' | 'WEATHER' | 'MATERIAL' | 'CLEARANCE' | 'EXECUTION' | 'SAFETY';
  impact: string;
  mitigationPlan: string;
  reportedBy: string;
  identifiedDate: string;
  status: 'OPEN' | 'MONITORED' | 'MITIGATED' | 'CLOSED';
}
