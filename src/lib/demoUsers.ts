// ============================================================================
// DEMO ONLY - replace with backend authentication in production.
// These mock credentials are for frontend prototype and SIH demo evaluation.
// Do not use in production or claim this is secure production authentication.
// ============================================================================

import { DemoUser } from '@/types';

export const DEMO_USERS: Record<string, DemoUser> = {
  GOVERNMENT_OFFICER: {
    identifier: 'GOV-7F4K9M21',
    password: 'Gov@12345',
    role: 'GOVERNMENT_OFFICER',
    name: 'Dr. Anandvardhan Sharma, IAS',
    organization: 'Government Infrastructure Authority',
    portalTab: 'government',
    description: 'Executive Monitoring & Compliance Officer with authority to accept or query project reports and incomplete works without altering baseline schedules.',
  },
  PROJECT_MANAGER: {
    identifier: 'PM-A82LQ4P7',
    password: 'Project@12345',
    role: 'PROJECT_MANAGER',
    name: 'Er. Rajeshwar Verma, PMP',
    organization: 'Enterprise Infrastructure Ltd',
    portalTab: 'enterprise',
    description: 'Lead Project Manager responsible for setting official daily tasks, validating site reports, and committing verified progress to Earned Value curves.',
  },
  SITE_MANAGER: {
    identifier: 'SM-X72K91AB',
    password: 'Site@12345',
    role: 'SITE_MANAGER',
    name: 'Vikramjit Singh',
    organization: 'Enterprise Infrastructure Ltd',
    portalTab: 'site-manager',
    description: 'Field Execution Lead at KP 17–25 pipeline corridor; captures daily photos, measured quantities, and site obstacles.',
  },
  COMPANY_ADMIN: {
    identifier: 'ENT-ADMIN-P91X82',
    password: 'Company@12345',
    role: 'COMPANY_ADMIN',
    name: 'Sunita Majumdar',
    organization: 'Enterprise Infrastructure Ltd',
    portalTab: 'enterprise',
    description: 'Corporate Director overseeing multiple contractors, resource assignments, and tenant-wide delivery performance.',
  },
  PLATFORM_ADMIN: {
    identifier: 'ADM-PLATFORM-001',
    password: 'Admin@12345',
    role: 'PLATFORM_ADMIN',
    name: 'SysAdmin Control Desk',
    organization: 'National InfraTech Control',
    portalTab: 'admin',
    description: 'Super administrator managing tenant provisioning, role RBAC policies, and distributed node integrity.',
  },
};

export const DEMO_PORTAL_TABS = [
  {
    id: 'government' as const,
    label: 'Government',
    badge: 'Ministry / Nodal Authority',
    identifierPlaceholder: 'e.g. GOV-7F4K9M21',
    identifierLabel: 'Government Officer Service ID',
    primaryDemoUser: DEMO_USERS.GOVERNMENT_OFFICER,
    description: 'Authorized portal for Central/State Government nodal agencies, NHAI, MoPNG, and public monitoring officers.',
  },
  {
    id: 'enterprise' as const,
    label: 'Enterprise',
    badge: 'EPC / Contractor / PM',
    identifierPlaceholder: 'e.g. PM-A82LQ4P7',
    identifierLabel: 'Enterprise PM / Corporate ID',
    primaryDemoUser: DEMO_USERS.PROJECT_MANAGER,
    secondaryDemoUser: DEMO_USERS.COMPANY_ADMIN,
    description: 'Official portal for Engineering, Procurement & Construction (EPC) Project Managers and corporate admins.',
  },
  {
    id: 'site-manager' as const,
    label: 'Site Manager',
    badge: 'Field Mobile Capture',
    identifierPlaceholder: 'e.g. SM-X72K91AB',
    identifierLabel: 'Site Manager Field ID',
    primaryDemoUser: DEMO_USERS.SITE_MANAGER,
    description: 'Mobile-optimized portal for on-ground site engineers, surveyors, and field construction superintendents.',
  },
  {
    id: 'admin' as const,
    label: 'Admin',
    badge: 'System Control',
    identifierPlaceholder: 'e.g. ADM-PLATFORM-001',
    identifierLabel: 'Platform Administrator ID',
    primaryDemoUser: DEMO_USERS.PLATFORM_ADMIN,
    description: 'Platform infrastructure control, tenant provisioning, system health, and tamper-evident audit logs.',
  },
];
