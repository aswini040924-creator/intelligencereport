/**
 * S3 API Client for Frontend
 * Connects directly to Express backend (/api/s3/*) to provide dynamic Amazon S3 data
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500';

export interface S3HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  s3: {
    connected: boolean;
    bucket: string;
    region: string;
    objectKey: string;
    lastSync: string;
    totalProjects: number;
    totalTasks: number;
    totalActivities: number;
  };
}

export interface S3OverviewResponse {
  success: boolean;
  source: string;
  lastSyncDate: string;
  overview: {
    totalProjects: number;
    totalCostCr: number;
    totalSpentCr: number;
    avgProgress: number;
    delayedProjectsCount: number;
    highRiskCount: number;
    totalStates: number;
    totalAgencies: number;
    states: string[];
    agencies: string[];
  };
  sheetsSummary: {
    integratedRowsCount: number;
    l1ProjectsCount: number;
    l2BaselineCount: number;
    l3ProgressCount: number;
    l4IssuesCount: number;
    l5OutcomeCount: number;
  };
}

export const s3Api = {
  getBackendUrl(): string {
    return BACKEND_URL;
  },

  async getHealth(): Promise<S3HealthResponse> {
    const res = await fetch(`${BACKEND_URL}/api/health`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  },

  async getOverview(): Promise<S3OverviewResponse> {
    const res = await fetch(`${BACKEND_URL}/api/s3/overview`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Overview fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getProjects(params?: { search?: string; state?: string; risk?: string; status?: string; limit?: number; page?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.state && params.state !== 'ALL') query.set('state', params.state);
    if (params?.risk && params.risk !== 'ALL') query.set('risk', params.risk);
    if (params?.status && params.status !== 'ALL') query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.page) query.set('page', String(params.page));

    const res = await fetch(`${BACKEND_URL}/api/s3/projects?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Projects fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getProject(id: string) {
    const res = await fetch(`${BACKEND_URL}/api/s3/projects/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Project ${id} fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getActivities(projectId?: string) {
    const url = projectId 
      ? `${BACKEND_URL}/api/s3/activities?projectId=${encodeURIComponent(projectId)}`
      : `${BACKEND_URL}/api/s3/activities`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Activities fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getTasks(params?: { projectId?: string; status?: string; assignedSiteManagerId?: string }) {
    const query = new URLSearchParams();
    if (params?.projectId) query.set('projectId', params.projectId);
    if (params?.status) query.set('status', params.status);
    if (params?.assignedSiteManagerId) query.set('assignedSiteManagerId', params.assignedSiteManagerId);

    const res = await fetch(`${BACKEND_URL}/api/s3/tasks?${query.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Tasks fetch failed: ${res.statusText}`);
    return res.json();
  },

  async getRisks(severity?: string) {
    const url = severity
      ? `${BACKEND_URL}/api/s3/risks?severity=${encodeURIComponent(severity)}`
      : `${BACKEND_URL}/api/s3/risks`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Risks fetch failed: ${res.statusText}`);
    return res.json();
  },

  async triggerSync(): Promise<{ success: boolean; message: string; lastSyncDate: string }> {
    const res = await fetch(`${BACKEND_URL}/api/s3/sync`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`S3 sync failed: ${res.statusText}`);
    return res.json();
  },
};
