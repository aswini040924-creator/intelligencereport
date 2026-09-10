'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_PROJECTS } from '@/lib/mock/projects';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Search, Filter, FolderGit2, ArrowUpRight } from 'lucide-react';
import { cn, formatVariance } from '@/lib/utils';

export default function GovProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredProjects = INITIAL_PROJECTS.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || p.risk === riskFilter;
    const matchesStatus = statusFilter === 'ALL' || p.governmentStatus === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Monitored Infrastructure Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official central and state government infrastructure monitoring registry.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, code, or contractor..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="LOW">Low Risk</option>
          <option value="MEDIUM">Medium Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="CRITICAL">Critical Risk</option>
        </select>

        {/* Government Status Filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="ON_TRACK">On Track</option>
          <option value="AT_RISK">At Risk</option>
          <option value="DELAYED">Delayed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-5 py-3.5">Project ID & Name</th>
                <th className="px-5 py-3.5">Contractor / EPC</th>
                <th className="px-5 py-3.5">Planned %</th>
                <th className="px-5 py-3.5">Actual %</th>
                <th className="px-5 py-3.5">Variance</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">Incomplete Tasks</th>
                <th className="px-5 py-3.5">Gov Status</th>
                <th className="px-5 py-3.5 text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredProjects.map(project => (
                <tr key={project.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4">
                    <div className="font-mono text-cyan-400 font-semibold">{project.id}</div>
                    <div className="font-bold text-white text-sm mt-0.5">{project.name}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{project.location}</div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-200">{project.organization}</div>
                    <div className="text-[11px] text-slate-500">PM: {project.projectManager}</div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono text-slate-300">
                    <div className="font-bold">{project.plannedProgress}%</div>
                    <div className="w-16 mt-1">
                      <ProgressBar value={project.plannedProgress} size="sm" variant="blue" />
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono text-white">
                    <div className="font-bold text-emerald-400">{project.actualProgress}%</div>
                    <div className="w-16 mt-1">
                      <ProgressBar value={project.actualProgress} size="sm" variant="emerald" />
                    </div>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-bold',
                        project.variance < -10
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : project.variance < 0
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      )}
                    >
                      {formatVariance(project.variance)}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap">
                    <RiskBadge level={project.risk} />
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono">
                    <span className="text-amber-400 font-bold">{project.incompleteTasksCount}</span>
                    <span className="text-slate-500 text-[11px] ml-1">tasks</span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap font-mono font-medium">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[11px] font-bold uppercase',
                        project.governmentStatus === 'ON_TRACK'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : project.governmentStatus === 'AT_RISK'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      )}
                    >
                      {project.governmentStatus.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <Link
                      href={`/gov/projects/${project.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-medium transition"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
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
