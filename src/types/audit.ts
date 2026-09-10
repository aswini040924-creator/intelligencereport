import { UserRole } from './auth';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  entity: 'SUBMISSION' | 'DAILY_TASK' | 'WBS_ACTIVITY' | 'PROJECT_REPORT' | 'GOVERNMENT_ACCEPTANCE' | 'USER_ACCESS';
  entityId: string;
  details: string;
  previousValue?: string;
  newValue?: string;
  sha256Hash?: string;
  status: 'VERIFIED' | 'RECORDED' | 'FLAGGED';
}
