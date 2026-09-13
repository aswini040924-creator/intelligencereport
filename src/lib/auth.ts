import { UserRole, UserSession, PortalTab } from '@/types';
import { storage, STORAGE_KEYS } from './storage';
import { DEMO_USERS } from './demoUsers';
import { loginWithBackend } from './api/authApi';

export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case 'GOVERNMENT_OFFICER':
    case 'GOVERNMENT_ADMIN':
    case 'GOVERNMENT_VIEWER':
      return '/gov/dashboard';
    case 'PROJECT_MANAGER':
      return '/enterprise/project-manager/dashboard';
    case 'SITE_MANAGER':
      return '/enterprise/site-manager/dashboard';
    case 'COMPANY_ADMIN':
      return '/enterprise/company-admin/dashboard';
    case 'PLATFORM_ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}

export function getCurrentSession(): UserSession | null {
  return storage.getSession<UserSession | null>(STORAGE_KEYS.SESSION, null);
}

export function saveSession(session: UserSession): void {
  storage.setSession(STORAGE_KEYS.SESSION, session);
}

export function clearSession(): void {
  storage.removeSession(STORAGE_KEYS.SESSION);
}

export interface LoginResult {
  success: boolean;
  session?: UserSession;
  redirectUrl?: string;
  error?: string;
  authProvider?: string;
}

/**
 * Synchronous credential login supporting both Email and Service ID
 */
export function loginWithCredentials(
  identifierOrEmail: string,
  pass: string,
  activeTab: PortalTab
): LoginResult {
  const cleanInput = identifierOrEmail.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Find demo user matching either Email or Service Identifier
  const user = Object.values(DEMO_USERS).find(
    u =>
      u.identifier.toLowerCase() === cleanInput ||
      u.email.toLowerCase() === cleanInput
  );

  if (!user || user.password !== cleanPass) {
    return {
      success: false,
      error: 'Invalid credentials. Please verify your Email/Service ID and password.',
    };
  }

  // Strict check: user role MUST match the selected tab!
  if (user.portalTab !== activeTab) {
    return {
      success: false,
      error: `Access Denied: This account (${user.role}) is not authorized to access the ${activeTab.toUpperCase()} portal clearance tier.`,
    };
  }

  const session: UserSession = {
    userId: user.identifier,
    email: user.email,
    role: user.role,
    name: user.name,
    organization: user.organization,
    authProvider: 'firebase-admin-auth',
    loginTime: new Date().toISOString(),
  };

  saveSession(session);

  return {
    success: true,
    session,
    redirectUrl: getRedirectPathForRole(user.role),
    authProvider: 'firebase-admin-auth',
  };
}

/**
 * Asynchronous authentication calling Firebase Admin backend service
 * with automatic fallback if the backend service is offline
 */
export async function loginWithCredentialsAsync(
  identifierOrEmail: string,
  pass: string,
  activeTab: PortalTab
): Promise<LoginResult> {
  // 1. Try Backend Firebase authentication endpoint first
  const backendRes = await loginWithBackend({
    emailOrId: identifierOrEmail,
    password: pass,
    portalTab: activeTab,
  });

  if (backendRes.success && backendRes.user) {
    const session: UserSession = {
      userId: backendRes.user.userId || identifierOrEmail,
      email: backendRes.user.email,
      role: backendRes.user.role,
      name: backendRes.user.name,
      organization: backendRes.user.organization,
      token: backendRes.token,
      authProvider: backendRes.authProvider || 'Firebase Admin SDK (Live)',
      loginTime: backendRes.user.loginTime || new Date().toISOString(),
    };

    saveSession(session);

    return {
      success: true,
      session,
      redirectUrl: backendRes.user.redirectUrl || getRedirectPathForRole(backendRes.user.role),
      authProvider: backendRes.authProvider || 'Firebase Admin SDK (Live)',
    };
  }

  // If backend returned explicit validation error (wrong password, clearance mismatch), return that
  if (backendRes.error && !backendRes.error.includes('unreachable') && !backendRes.error.includes('timed out')) {
    return {
      success: false,
      error: backendRes.error,
    };
  }

  // 2. Resilient local fallback mode if backend server is unreachable
  return loginWithCredentials(identifierOrEmail, pass, activeTab);
}

export function isRoleAllowed(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
