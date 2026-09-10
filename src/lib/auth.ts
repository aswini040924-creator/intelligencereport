import { UserRole, UserSession, PortalTab } from '@/types';
import { storage, STORAGE_KEYS } from './storage';
import { DEMO_USERS } from './demoUsers';

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
}

export function loginWithCredentials(
  identifier: string,
  pass: string,
  activeTab: PortalTab
): LoginResult {
  const cleanId = identifier.trim();
  const cleanPass = pass.trim();

  // Find demo user matching identifier
  const user = Object.values(DEMO_USERS).find(
    u => u.identifier.toLowerCase() === cleanId.toLowerCase()
  );

  if (!user || user.password !== cleanPass) {
    return {
      success: false,
      error: 'Invalid credentials for this portal. Please check your ID and password.',
    };
  }

  // Strict check: user role MUST match the selected tab!
  // Example: Site manager cannot log in under government tab
  if (user.portalTab !== activeTab) {
    return {
      success: false,
      error: `Invalid credentials for the ${activeTab.toUpperCase()} portal. This identifier is registered under a different role.`,
    };
  }

  const session: UserSession = {
    userId: user.identifier,
    role: user.role,
    name: user.name,
    organization: user.organization,
    loginTime: new Date().toISOString(),
  };

  saveSession(session);

  return {
    success: true,
    session,
    redirectUrl: getRedirectPathForRole(user.role),
  };
}

export function isRoleAllowed(userRole: UserRole | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
