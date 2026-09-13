import { UserRole } from '@/types';

export interface EnterpriseUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  project: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedCorridor: string;
  phone: string;
}

export const INITIAL_USERS: EnterpriseUser[] = [
  {
    id: 'USR-01',
    name: 'Dr. Anandvardhan Sharma, IAS',
    role: 'GOVERNMENT_OFFICER',
    email: 'anandvardhan.ias@gov.in',
    project: 'Assam Pipeline Expansion – Demo',
    status: 'ACTIVE',
    assignedCorridor: 'National Infrastructure Monitoring Authority',
    phone: '+91 98100 44211',
  },
  {
    id: 'USR-02',
    name: 'Er. Rajeshwar Verma, PMP',
    role: 'PROJECT_MANAGER',
    email: 'rajeshwar.verma@enterpriseinfra.com',
    project: 'Assam Pipeline Expansion – Demo',
    status: 'ACTIVE',
    assignedCorridor: 'KP 0–25 Pipeline Corridor',
    phone: '+91 94350 12890',
  },
  {
    id: 'USR-03',
    name: 'Vikramjit Singh',
    role: 'SITE_MANAGER',
    email: 'vikramjit.singh@enterpriseinfra.com',
    project: 'Assam Pipeline Expansion – Demo',
    status: 'ACTIVE',
    assignedCorridor: 'Sector 4, Cachar Valley (KP 15–25)',
    phone: '+91 97060 33819',
  },
  {
    id: 'USR-04',
    name: 'Sunita Majumdar',
    role: 'COMPANY_ADMIN',
    email: 'sunita.majumdar@enterpriseinfra.com',
    project: 'All Enterprise Projects',
    status: 'ACTIVE',
    assignedCorridor: 'Corporate HQ, Guwahati',
    phone: '+91 98640 55120',
  },
  {
    id: 'USR-05',
    name: 'Er. Debojit Barua',
    role: 'SITE_MANAGER',
    email: 'debojit.barua@enterpriseinfra.com',
    project: 'Assam Pipeline Expansion – Demo',
    status: 'ACTIVE',
    assignedCorridor: 'Sector 1, Guwahati Intake (KP 0–12)',
    phone: '+91 94351 77620',
  },
  {
    id: 'USR-06',
    name: 'Priyanka Chaliha',
    role: 'GOVERNMENT_VIEWER',
    email: 'p.chaliha@assam.gov.in',
    project: 'Assam Pipeline Expansion – Demo',
    status: 'ACTIVE',
    assignedCorridor: 'State Monitoring Cell, Dispur',
    phone: '+91 99540 88210',
  },
  {
    id: 'USR-07',
    name: 'SysAdmin Control Desk',
    role: 'PLATFORM_ADMIN',
    email: 'admin@site2schedule.ai',
    project: 'National InfraTech Platform',
    status: 'ACTIVE',
    assignedCorridor: 'Central Operations Hub',
    phone: '+91 11 2345 6789',
  },
];
