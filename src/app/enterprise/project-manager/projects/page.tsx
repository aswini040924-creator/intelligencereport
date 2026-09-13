'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { FolderGit2, ArrowUpRight } from 'lucide-react';
import { formatVariance } from '@/lib/utils';

export default function PMProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Assigned Enterprise Infrastructure Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Projects under execution by Enterprise Infrastructure Ltd.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_PROJECTS.map(project => (
          <div
            key={project.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-cyan-400 text-xs font-semibold">{project.id}</span>
                <RiskBadge level={project.risk} size="sm" />
              </div>

              <h3 className="text-base font-bold text-white">{project.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.description}</p>

              <div className="mt-4 space-y-2">
                <ProgressBar
                  value={project.actualProgress}
                  target={project.plannedProgress}
                  showLabels
                  label="Committed vs Planned Target"
                  variant="emerald"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Variance:</span>
                  <span className={project.variance < 0 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {formatVariance(project.variance)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Budget:</span>
                  <span className="text-slate-200">₹{project.budgetCr} Cr</span>
                </div>
              </div>
            </div>

            <Link
              href={`/enterprise/project-manager/projects/${project.id}`}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <span>Inspect Project Cockpit</span>
              <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
