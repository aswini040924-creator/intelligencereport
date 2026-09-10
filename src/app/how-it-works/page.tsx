'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Camera, CheckSquare, Eye, ShieldCheck } from 'lucide-react';
import { WBSHierarchyVisualizer } from '@/components/shared/WBSHierarchyVisualizer';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Project Manager Creates Official Daily Tasks',
      role: 'Project Manager',
      desc: 'Sets daily activity targets (e.g. L6-PIP-0245 Welding, Planned 400 joints, High Priority) and assigns them to specific field Site Managers.',
      icon: CheckSquare,
    },
    {
      num: '02',
      title: 'Site Manager Captures Live Evidence',
      role: 'Site Manager',
      desc: 'Supervisors take photos directly using mobile cameras, input reported quantities (e.g. 260 joints), reported progress (65%), and record voice notes.',
      icon: Camera,
    },
    {
      num: '03',
      title: 'AI Matches Evidence & Detects Objects',
      role: 'Deterministic AI',
      desc: 'Simulates high-confidence matching (95%), detects pipe diameters, weld puddles, and verifies that GPS coordinates fall within the corridor.',
      icon: Eye,
    },
    {
      num: '04',
      title: 'Project Manager Validates & Approves',
      role: 'Project Manager',
      desc: 'Reviews side-by-side: original site claim (65%) vs AI suggestion vs engineer measurement. Sets validated progress to 63% and commits to schedule.',
      icon: CheckSquare,
    },
    {
      num: '05',
      title: 'Government Reviews & Accepts Monitoring State',
      role: 'Government Officer',
      desc: 'Reviews incomplete works and validated progress. Approves the reported state without modifying contractual engineering baselines.',
      icon: ShieldCheck,
    },
  ];

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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Step-by-Step Architecture</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            How SITE2SCHEDULE AI Works
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From field capture to PM validation and government acceptance — an end-to-end audit-backed lifecycle.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                <div className="text-2xl font-bold font-mono text-cyan-400/60 shrink-0">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-white">{step.title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                      {step.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6-Level WBS Architecture Section */}
        <div className="mt-14 space-y-4">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              The Engineering Foundation
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Standard 6-Level Work Breakdown Structure (L1 → L6)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
              Our core technological focus operates at <strong>Level 5 (Pipeline Erection)</strong> and <strong>Level 6 (Specific Activities)</strong>, aggregating real field evidence into master schedules.
            </p>
          </div>

          <WBSHierarchyVisualizer initialExpandedLevel="L6" showTree={true} />
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-900/40"
          >
            <span>Test the Workflow in the Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
