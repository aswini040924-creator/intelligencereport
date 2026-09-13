'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Clock, GitPullRequest, FileWarning } from 'lucide-react';

export default function ProblemPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <div className="tricolor-ribbon" />
      <header className="px-6 py-4 border-b border-slate-800/80 bg-[#070b14]/90 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/login" className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-medium text-xs">
          Open Portal
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Problem Statement SIH26122</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            The Planned vs Execution Disconnect
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Analysis of real-world infrastructure failures reveals that schedule collapse begins at the daily field capture tier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Unstructured Field Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Site supervisors routinely share photos on informal messaging groups. Critical details like chainage markers, bevel angles, weld crowns, and weather conditions are lost without structured metadata.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Clock className="w-8 h-8 text-red-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Latency in Master Schedule Updates</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Primavera schedules require manual entry by planning engineers, creating a 7-to-14 day blind spot where equipment breakdown or clearance stall goes undetected by ministry monitors.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <GitPullRequest className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Ambiguity in Milestone Completion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contractors claim a section is complete to unlock billing, while essential downstream testing (NDT, hydrostatic test hold) remains incomplete, creating massive legal disputes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <FileWarning className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Lack of Verifiable Audit Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When audits are conducted by the Comptroller and Auditor General (CAG) or state technical examiners, paper registers lack verifiable proof of whether work happened on the reported date.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
