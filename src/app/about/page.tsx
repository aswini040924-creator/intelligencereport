'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Building2, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">About The Project</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            SITE2SCHEDULE AI (SIH26122)
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Developed for Smart India Hackathon 2026, SITE2SCHEDULE AI provides an automated, verifiable intelligence bridge between planned project schedules (L1 to L6) and actual field execution.
          </p>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              National Infrastructure Mission Alignment
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              India is investing over ₹111 Lakh Crore under the National Infrastructure Pipeline (NIP) across roads, railways, natural gas grids, and urban transit. However, schedule slippages cost billions in idle plant equipment and delayed public utility.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              SITE2SCHEDULE AI solves this by transforming site photographs, daily quantity reports, and audio notes into verifiable schedule actuals committed into Earned Value Management (EVM) curves.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Key Architectural Invariants
            </h2>
            <ul className="text-xs text-slate-400 space-y-2.5">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Role Isolation:</strong> Site Managers report; Project Managers validate; Government monitors.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Baseline Preservation:</strong> Government acceptance never alters contractual baseline schedules.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Dual Records:</strong> Original site claims (e.g. 65%) and PM validated progress (e.g. 63%) are maintained separately.</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
