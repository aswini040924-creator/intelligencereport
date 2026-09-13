import { UserSession, PortalTab } from '@/types';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:4500';

export interface BackendLoginRequest {
  emailOrId: string;
  password: string;
  portalTab?: PortalTab;
}

export interface BackendLoginResponse {
  success: boolean;
  authProvider?: string;
  token?: string;
  user?: UserSession & { redirectUrl?: string };
  error?: string;
}

export interface FirebaseAuthStatus {
  success: boolean;
  connected: boolean;
  projectId?: string;
  provider?: string;
  tiersSupported?: string[];
}

/**
 * Attempt authentication via backend Firebase service
 */
export async function loginWithBackend(
  credentials: BackendLoginRequest
): Promise<BackendLoginResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json();
    return data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const err = error as Error;
    console.warn('[AuthApi] Backend request failed or timed out:', err.message);
    return {
      success: false,
      error:
        err.name === 'AbortError'
          ? 'Authentication request timed out. Retrying in local fallback mode.'
          : 'Backend auth service unreachable. Using local fallback.',
    };
  }
}

/**
 * Check Firebase Admin SDK connection status on backend
 */
export async function getAuthStatus(): Promise<FirebaseAuthStatus | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/status`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
