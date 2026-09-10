'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderGit2,
  CheckSquare,
  AlertTriangle,
  Calendar,
  FileText,
  Bell,
  ShieldCheck,
  Camera,
  Layers,
  Sparkles,
  GitFork,
  Image as ImageIcon,
  History,
  Users,
  Settings,
  Activity,
  Lock,
  Building2,
  Flame,
  Clock,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  role: UserRole;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ role, collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  // Define nav links based on role
  const getNavLinks = (): NavItem[] => {
    switch (role) {
      case 'GOVERNMENT_OFFICER':
      case 'GOVERNMENT_ADMIN':
      case 'GOVERNMENT_VIEWER':
        return [
          { href: '/gov/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/gov/projects', label: 'Projects', icon: FolderGit2 },
          { href: '/gov/tasks', label: 'Task Reviews', icon: CheckSquare },
          { href: '/gov/incomplete-works', label: 'Incomplete Works', icon: AlertTriangle, badge: '5 Pending' },
          { href: '/gov/risks', label: 'Risks & Delays', icon: Flame },
          { href: '/gov/milestones', label: 'Milestones', icon: Calendar },
          { href: '/gov/reports', label: 'Reports', icon: FileText },
          { href: '/gov/alerts', label: 'Alerts', icon: Bell },
          { href: '/gov/audit', label: 'Audit Trail', icon: ShieldCheck },
        ];

      case 'PROJECT_MANAGER':
        return [
          { href: '/enterprise/project-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/enterprise/project-manager/projects', label: 'Projects', icon: FolderGit2 },
          { href: '/enterprise/project-manager/daily-tasks', label: 'Daily Tasks Board', icon: CheckSquare },
          { href: '/enterprise/project-manager/schedule', label: 'Master Schedule', icon: Calendar },
          { href: '/enterprise/project-manager/activities', label: 'L5/L6 Activities', icon: Layers },
          { href: '/enterprise/project-manager/review', label: 'AI Review Queue', icon: Sparkles, badge: 'Active' },
          { href: '/enterprise/project-manager/incomplete', label: 'Incomplete Works', icon: AlertTriangle },
          { href: '/enterprise/project-manager/evidence', label: 'Field Evidence', icon: ImageIcon },
          { href: '/enterprise/project-manager/risks', label: 'Project Risks', icon: Flame },
          { href: '/enterprise/project-manager/dependencies', label: 'Dependencies', icon: GitFork },
          { href: '/enterprise/project-manager/reports', label: 'Reports', icon: FileText },
          { href: '/enterprise/project-manager/audit', label: 'Audit Trail', icon: ShieldCheck },
        ];

      case 'SITE_MANAGER':
        return [
          { href: '/enterprise/site-manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/enterprise/site-manager/today', label: "Today's Tasks", icon: CheckSquare },
          { href: '/enterprise/site-manager/capture', label: 'Capture Update', icon: Camera, highlight: true },
          { href: '/enterprise/site-manager/submissions', label: 'My Submissions', icon: CheckSquare },
          { href: '/enterprise/site-manager/history', label: 'History & Logs', icon: History },
        ];

      case 'COMPANY_ADMIN':
        return [
          { href: '/enterprise/company-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/enterprise/company-admin/projects', label: 'Projects', icon: FolderGit2 },
          { href: '/enterprise/company-admin/users', label: 'Users & Crews', icon: Users },
          { href: '/enterprise/company-admin/settings', label: 'Settings', icon: Settings },
        ];

      case 'PLATFORM_ADMIN':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { href: '/admin/tenants', label: 'Tenants', icon: Building2 },
          { href: '/admin/users', label: 'Users', icon: Users },
          { href: '/admin/roles', label: 'Roles & RBAC', icon: Lock },
          { href: '/admin/system-health', label: 'System Health', icon: Activity },
          { href: '/admin/security', label: 'Security', icon: ShieldCheck },
          { href: '/admin/audit', label: 'Global Audit', icon: History },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getPortalLabel = () => {
    if (role.startsWith('GOVERNMENT')) return { title: 'GOVERNMENT PORTAL', badge: 'Monitoring & Compliance' };
    if (role === 'PROJECT_MANAGER') return { title: 'PROJECT MANAGER', badge: 'EPC Execution Desk' };
    if (role === 'SITE_MANAGER') return { title: 'SITE MANAGER', badge: 'Mobile Field Operations' };
    if (role === 'COMPANY_ADMIN') return { title: 'ENTERPRISE ADMIN', badge: 'Corporate Control' };
    return { title: 'PLATFORM ADMIN', badge: 'Central Infrastructure' };
  };

  const portalInfo = getPortalLabel();

  return (
    <aside className="w-64 bg-[#090e1a] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex flex-col">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-sm">
            S2S
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight group-hover:text-cyan-400 transition">
              SITE2SCHEDULE
            </span>
            <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono">
              AI
            </span>
          </div>
        </Link>

        <div className="mt-4 pt-3 border-t border-slate-800/50">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {portalInfo.title}
          </div>
          <div className="text-[10px] text-cyan-400 font-medium">
            {portalInfo.badge}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navLinks.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/gov/dashboard' && item.href !== '/enterprise/project-manager/dashboard' && item.href !== '/enterprise/site-manager/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition duration-150 group',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : item.highlight
                  ? 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition',
                    isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-semibold font-mono',
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span>SIH 2026 Prototype</span>
          <span className="font-mono text-cyan-500">v1.0-FE</span>
        </div>
        <div className="text-[10px] text-slate-600">
          SIH26122 National Solution
        </div>
      </div>
    </aside>
  );
}
