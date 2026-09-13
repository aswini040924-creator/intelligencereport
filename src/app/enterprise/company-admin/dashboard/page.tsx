'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { INITIAL_USERS } from '@/lib/mock/users';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Building2, Users, FolderGit2, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CompanyAdminDashboardPage() {
  const pms = INITIAL_USERS.filter(u => u.role === 'PROJECT_MANAGER').length;
  const sms = INITIAL_USERS.filter(u => u.role === 'SITE_MANAGER').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Corporate Enterprise Administration</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Enterprise Infrastructure Ltd Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Corporate oversight across all contractor teams, PM validations, and pipeline projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard title="Active Projects" value="3" subtitle="Corridors" icon={FolderGit2} variant="cyan" />
        <StatCard title="Project Managers" value={pms || 1} subtitle="Assigned" icon={Users} variant="blue" />
        <StatCard title="Site Managers" value={sms || 2} subtitle="On field" icon={Users} variant="emerald" />
        <StatCard title="Avg Progress" value="62.5%" subtitle="Portfolio wide" variant="emerald" />
        <StatCard title="High-Risk Items" value="4" subtitle="Schedule risks" icon={AlertTriangle} variant="red" />
        <StatCard title="Pending Reviews" value="3" subtitle="Awaiting PM signoff" variant="amber" />
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Portfolio Construction Projects</h3>
          <Link href="/enterprise/company-admin/projects" className="text-xs text-cyan-400 hover:underline">
            View All Projects →
          </Link>
        </div>

        <div className="space-y-3">
          {INITIAL_PROJECTS.map(p => (
            <div key={p.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-cyan-400 font-bold">{p.code}</span>
                <div className="text-white font-semibold text-sm mt-0.5">{p.name}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">PM: {p.projectManager}</div>
              </div>

              <div className="w-48 text-right font-mono">
                <div className="text-emerald-400 font-bold mb-1">{p.actualProgress}% / {p.plannedProgress}% Target</div>
                <ProgressBar value={p.actualProgress} target={p.plannedProgress} size="sm" variant="emerald" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
