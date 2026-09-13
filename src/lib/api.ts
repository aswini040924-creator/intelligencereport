import { ProjectSummary } from '@/types';

// Default to localhost:4500 if not configured
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4500';

export interface HealthResponse {
  isOnline: boolean;
  latencyMs: number;
  data?: {
    status: string;
    uptimeSeconds: number;
    port: number;
    services: {
      s3: {
        bucket: string;
        region: string;
        configured: boolean;
      };
      mongodb: {
        configured: boolean;
      };
    };
  };
  error?: string;
}

export interface S3StatsResponse {
  success: boolean;
  dataset?: {
    filename: string;
    bucket: string;
    fetchedAt: string;
    sheets: string[];
  };
  metrics?: {
    totalProjects: number;
    totalCostCr: number;
    totalExpenditureCr: number;
    avgPhysicalProgress: number;
    avgFinancialProgress: number;
    delayedProjectsCount: number;
    highRiskProjectsCount: number;
  };
  distributions?: {
    byState: Record<string, number>;
    byRisk: Record<string, number>;
    byMilestone: Record<string, number>;
  };
  error?: string;
}

export interface SheetDataResponse {
  success: boolean;
  sheet: string;
  totalRecords: number;
  page: number;
  limit: number;
  totalPages: number;
  columns: string[];
  records: Record<string, any>[];
  error?: string;
}

export interface BackendProjectsResponse {
  success: boolean;
  totalRecords: number;
  page: number;
  limit: number;
  totalPages: number;
  projects: ProjectSummary[];
  error?: string;
}

/**
 * Check connectivity and ping latency to Express Backend
 */
export async function checkBackendHealth(): Promise<HealthResponse> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;
    if (!res.ok) {
      return { isOnline: false, latencyMs, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { isOnline: true, latencyMs, data };
  } catch (err: any) {
    return {
      isOnline: false,
      latencyMs: Date.now() - startTime,
      error: err.name === 'AbortError' ? 'Connection Timeout (4s)' : err.message || 'Offline',
    };
  }
}

/**
 * Fetch overview statistics of the AWS S3 bridge dataset
 */
export async function getS3Stats(): Promise<S3StatsResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/s3-data/stats`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch available sheets in the S3 Excel file
 */
export async function getS3Sheets(): Promise<{ success: boolean; sheets: string[]; mainSheet?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/s3-data/sheets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      sheets: [
        'Integrated_L1_L6',
        'L1_Project',
        'L2_Baseline',
        'L3_Progress',
        'L4_Issues',
        'L5_Outcome',
        'L6_Analysis',
      ],
    };
  }
}

/**
 * Fetch paginated & filtered records for a specific sheet from Express
 */
export async function getS3SheetData(
  sheetName: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    risk?: string;
    sector?: string;
  } = {}
): Promise<SheetDataResponse> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.state) query.set('state', params.state);
    if (params.risk) query.set('risk', params.risk);
    if (params.sector) query.set('sector', params.sector);

    const url = `${API_BASE_URL}/api/s3-data/sheet/${encodeURIComponent(sheetName)}?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      sheet: sheetName,
      totalRecords: 0,
      page: params.page || 1,
      limit: params.limit || 25,
      totalPages: 0,
      columns: [],
      records: [],
      error: err.message,
    };
  }
}

/**
 * Fetch bridge construction projects mapped into frontend ProjectSummary format
 */
export async function getBackendProjects(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    risk?: string;
  } = {}
): Promise<BackendProjectsResponse> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.state) query.set('state', params.state);
    if (params.risk) query.set('risk', params.risk);

    const url = `${API_BASE_URL}/api/projects?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      totalRecords: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0,
      projects: [],
      error: err.message,
    };
  }
}

/**
 * Force refresh the S3 workbook cache in the Express backend
 */
export async function refreshS3Cache(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/s3-data/refresh`, {
      method: 'POST',
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

/**
 * Sync / Save a Site Submission to Express backend
 */
export async function saveSubmissionToBackend(submissionData: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData),
    });
    return await res.json();
  } catch (err: any) {
    console.warn('[apiClient] Could not save submission to Express backend:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all submissions from Express backend
 */
export async function fetchSubmissionsFromBackend(projectId?: string) {
  try {
    const url = projectId
      ? `${API_BASE_URL}/api/submissions?projectId=${encodeURIComponent(projectId)}`
      : `${API_BASE_URL}/api/submissions`;
    const res = await fetch(url);
    return await res.json();
  } catch (err: any) {
    console.warn('[apiClient] Could not fetch submissions from Express backend:', err);
    return { success: false, submissions: [] };
  }
}
