'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { FolderGit2, ArrowUpRight } from 'lucide-react';

export default function CompanyAdminProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Enterprise Infrastructure Project Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contractor-wide active and upcoming national infrastructure contracts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {INITIAL_PROJECTS.map(p => (
          <div
            key={p.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-cyan-400 text-xs font-semibold">{p.code}</span>
                <RiskBadge level={p.risk} size="sm" />
              </div>
              <h3 className="text-base font-bold text-white">{p.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>

              <div className="mt-4 space-y-2">
                <ProgressBar
                  value={p.actualProgress}
                  target={p.plannedProgress}
                  showLabels
                  label="Portion Committed"
                  variant="emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Contract Value:</span>
                  <span className="text-white font-bold">₹{p.budgetCr} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Disbursed:</span>
                  <span className="text-emerald-400 font-bold">₹{p.spentCr} Cr</span>
                </div>
              </div>
            </div>

            <Link
              href={`/enterprise/project-manager/projects/${p.id}`}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center justify-center gap-1"
            >
              <span>View Execution Cockpit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
