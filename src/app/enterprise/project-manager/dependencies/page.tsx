'use client';

import React from 'react';
import { GitFork, ArrowRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function PMDependenciesPage() {
  const chains = [
    {
      seq: 'Core Mechanical Welding & QA Chain',
      nodes: [
        { code: 'L6-PIP-0245', name: '24-inch Pipeline Welding', progress: 63, status: 'INCOMPLETE' },
        { code: 'L6-PIP-0246', name: 'NDT Radiographic Testing', progress: 20, status: 'IN_PROGRESS' },
        { code: 'L6-PIP-0247', name: 'Field Joint Coating (3LPE)', progress: 0, status: 'PLANNED' },
        { code: 'L6-PIP-0248', name: 'Pipe Lowering & Ditch Drop', progress: 82, status: 'IN_PROGRESS' },
      ],
      desc: 'Welding must achieve 100% NDT clearance before joint coating can be applied; lowering follows holiday detection.',
    },
    {
      seq: 'River Crossing Special Engineering Chain',
      nodes: [
        { code: 'L6-PIP-0244', name: 'Trench Excavation KP 19', progress: 97.5, status: 'COMPLETED' },
        { code: 'L6-PIP-0249', name: 'Barak River HDD Reaming', progress: 50, status: 'OVERDUE' },
        { code: 'L6-PIP-0255', name: 'Railway Tie-In Fit-Up', progress: 25, status: 'INCOMPLETE' },
      ],
      desc: 'HDD river pull-back is critical predecessor for section pressure tie-in.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Activity Predecessor & Successor Dependency Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing sequencing dependencies across L6 activities: 0245 (Welding) → 0246 (NDT) → 0247 (Coating).
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {chains.map((c, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-cyan-400" />
              {c.seq}
            </h3>

            <div className="flex flex-col lg:flex-row items-center gap-3 overflow-x-auto py-2">
              {c.nodes.map((node, i) => (
                <React.Fragment key={node.code}>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-w-[200px] w-full lg:w-auto space-y-1 font-mono">
                    <span className="text-xs font-bold text-cyan-400">{node.code}</span>
                    <h4 className="text-xs font-bold text-white font-sans">{node.name}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Progress:</span>
                      <span className="text-emerald-400 font-bold">{node.progress}%</span>
                    </div>
                  </div>

                  {i < c.nodes.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-slate-600 shrink-0 hidden lg:block" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800/60">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
