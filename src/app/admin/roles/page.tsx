'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Check, X, AlertCircle, Info, Layers, Eye } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';

interface PermissionRow {
  permission: string;
  category: string;
  description: string;
  roles: {
    PLATFORM_ADMIN: boolean;
    GOVERNMENT_ADMIN: boolean;
    GOVERNMENT_OFFICER: boolean;
    GOVERNMENT_VIEWER: boolean;
    COMPANY_ADMIN: boolean;
    PROJECT_MANAGER: boolean;
    SITE_MANAGER: boolean;
  };
}

const PERMISSIONS_MATRIX: PermissionRow[] = [
  {
    permission: 'View Global Dashboard & Rollups',
    category: 'Visibility',
    description: 'Access high-level progress curves, KPIs, and corridor status',
    roles: {
      PLATFORM_ADMIN: true,
      GOVERNMENT_ADMIN: true,
      GOVERNMENT_OFFICER: true,
      GOVERNMENT_VIEWER: true,
      COMPANY_ADMIN: true,
      PROJECT_MANAGER: true,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Create & Modify L1-L6 WBS Schedules',
    category: 'Planning',
    description: 'Establish baseline dates, activity sequences, and WBS structure',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: true,
      PROJECT_MANAGER: true,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Create & Assign Daily Field Tasks',
    category: 'Planning',
    description: 'Dispatch operational work packages to site engineers',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: true,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Submit Field Progress & Evidence',
    category: 'Execution',
    description: 'Upload geotagged photos, voice notes, and reported quantities',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: false,
      SITE_MANAGER: true,
    },
  },
  {
    permission: 'Validate Site Progress (AI Review Queue)',
    category: 'Validation',
    description: 'Adjust reported progress to validated progress (e.g. 65% to 63%)',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: true,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Government Monitoring & Report Acceptance',
    category: 'Compliance',
    description: 'Accept or reject submitted progress for payment clearance and compliance',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: true,
      GOVERNMENT_OFFICER: true,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: false,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Alter Baseline Dates or Quantities',
    category: 'Critical Invariant',
    description: 'Government monitoring acceptance CANNOT alter baseline dates or planned quantities under any circumstances',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: false,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'View Tamper-Evident SHA-256 Audit Logs',
    category: 'Governance',
    description: 'Inspect cryptographic event receipts across all lifecycle actions',
    roles: {
      PLATFORM_ADMIN: true,
      GOVERNMENT_ADMIN: true,
      GOVERNMENT_OFFICER: true,
      GOVERNMENT_VIEWER: true,
      COMPANY_ADMIN: true,
      PROJECT_MANAGER: true,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Manage Enterprise Users & Crews',
    category: 'Administration',
    description: 'Onboard site engineers, project managers, and assign corridors',
    roles: {
      PLATFORM_ADMIN: false,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: true,
      PROJECT_MANAGER: false,
      SITE_MANAGER: false,
    },
  },
  {
    permission: 'Platform Super-Admin Configuration',
    category: 'Infrastructure',
    description: 'Manage multi-tenant workspaces, node telemetry, and system keys',
    roles: {
      PLATFORM_ADMIN: true,
      GOVERNMENT_ADMIN: false,
      GOVERNMENT_OFFICER: false,
      GOVERNMENT_VIEWER: false,
      COMPANY_ADMIN: false,
      PROJECT_MANAGER: false,
      SITE_MANAGER: false,
    },
  },
];

export default function AdminRolesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Visibility', 'Planning', 'Execution', 'Validation', 'Compliance', 'Critical Invariant', 'Governance', 'Administration'];

  const filteredMatrix = PERMISSIONS_MATRIX.filter(
    row => selectedCategory === 'ALL' || row.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Roles & Permissions Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal privilege separation guaranteeing monitoring integrity and preventing baseline adulteration.
          </p>
        </div>
      </div>

      {/* Critical Invariant Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold text-amber-300 uppercase tracking-wide">
            Architectural Invariant Enforced
          </div>
          <p className="text-slate-300 mt-1 leading-relaxed">
            Government approval actions mark tasks as <code className="text-amber-400 font-mono font-bold">GOVERNMENT_APPROVED</code> for monitoring and compliance.
            Government reviews <strong className="text-white">NEVER alter baseline dates</strong>, <strong className="text-white">baseline quantities</strong>, or physical schedule contracts.
            A task may be approved by Government while remaining physical work in progress.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 min-w-[260px]">Capability & Scope</th>
                <th className="px-2 py-3.5 text-center">PLT ADM</th>
                <th className="px-2 py-3.5 text-center">GOV ADM</th>
                <th className="px-2 py-3.5 text-center">GOV OFC</th>
                <th className="px-2 py-3.5 text-center">GOV VIEWER</th>
                <th className="px-2 py-3.5 text-center">CMP ADM</th>
                <th className="px-2 py-3.5 text-center">PRJ MGR</th>
                <th className="px-2 py-3.5 text-center">SITE MGR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{row.permission}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{row.description}</div>
                    <span className="inline-block mt-1 text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {row.category}
                    </span>
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.PLATFORM_ADMIN ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.GOVERNMENT_ADMIN ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.GOVERNMENT_OFFICER ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.GOVERNMENT_VIEWER ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.COMPANY_ADMIN ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.PROJECT_MANAGER ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>

                  <td className="px-2 py-3.5 text-center">
                    {row.roles.SITE_MANAGER ? (
                      <span className="inline-flex p-1 rounded bg-emerald-500/20 text-emerald-400"><Check className="w-3.5 h-3.5" /></span>
                    ) : (
                      <span className="inline-flex p-1 rounded bg-slate-800/40 text-slate-600"><X className="w-3.5 h-3.5" /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
