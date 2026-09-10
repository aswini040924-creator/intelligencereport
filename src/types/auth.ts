export type UserRole =
  | 'PLATFORM_ADMIN'
  | 'GOVERNMENT_ADMIN'
  | 'GOVERNMENT_OFFICER'
  | 'GOVERNMENT_VIEWER'
  | 'COMPANY_ADMIN'
  | 'PROJECT_MANAGER'
  | 'SITE_MANAGER';

export type PortalTab = 'government' | 'enterprise' | 'site-manager' | 'admin';

export interface UserSession {
  userId: string;
  role: UserRole;
  name: string;
  organization: string;
  loginTime: string;
  email?: string;
  avatar?: string;
}

export interface DemoUser {
  identifier: string;
  password: string;
  role: UserRole;
  name: string;
  organization: string;
  portalTab: PortalTab;
  description: string;
}
