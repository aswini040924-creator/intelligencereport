'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function SolutionPage() {
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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">The Innovation</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            The SITE2SCHEDULE AI Solution
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            A comprehensive, multi-modal pipeline delivering real-time schedule alignment from the trench to the ministry.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">1. Field-First Mobile Capture</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Site Managers use an ultra-low latency mobile interface with direct camera integration (<code className="text-cyan-400 font-mono">capture=&quot;environment&quot;</code>) that attaches geotags, bearing angle, and timestamp to every photo.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">2. Multi-Modal Activity Matching</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI parses physical objects, chainage corridors, and technical terms to correlate field progress with specific Level 6 WBS activities, generating confidence metrics and detected object tags.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">3. Governance Without Disruption</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Government officers review monitored actuals and accept or question incomplete works with full photographic backing, while the engineering baseline schedule remains contractually stable.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
