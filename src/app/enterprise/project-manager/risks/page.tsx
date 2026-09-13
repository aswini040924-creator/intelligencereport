'use client';

import React from 'react';
import { INITIAL_RISKS } from '@/lib/mock/risks';
import { RiskBadge } from '@/components/shared/RiskBadge';
import { Flame, ShieldAlert, Plus } from 'lucide-react';

export default function PMRisksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Project Risk Log & Schedule Impact Mitigation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Contractor risk matrix with proactive contingency and resource redeployment measures.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INITIAL_RISKS.map(risk => (
          <div
            key={risk.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-mono text-cyan-400 text-xs font-semibold">{risk.id}</span>
                <RiskBadge level={risk.level} />
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{risk.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{risk.description}</p>

              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Schedule Impact:</span>
                  <span className="text-red-300 font-medium">{risk.impact}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block text-[10px]">Action Plan:</span>
                  <span className="text-slate-300">{risk.mitigationPlan}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/60 font-mono">
              <span>Category: {risk.category}</span>
              <span>Status: {risk.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
