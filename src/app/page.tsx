'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Building2,
  HardHat,
  ArrowRight,
  Layers,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Lock,
  ChevronRight,
  BarChart3,
  GitPullRequest,
  Clock,
  Compass,
  Zap,
} from 'lucide-react';
import { WBSHierarchyVisualizer } from '@/components/shared/WBSHierarchyVisualizer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Tricolor National Identity Ribbon */}
      <div className="tricolor-ribbon" />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-sm">
              S2S
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight">SITE2SCHEDULE</span>
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono">
                AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <Link href="#problem" className="hover:text-white transition">The Problem</Link>
            <Link href="#workflow" className="hover:text-white transition">3-Tier Workflow</Link>
            <Link href="#wbs-workflow" className="hover:text-white transition text-cyan-300 font-medium">L1–L6 WBS</Link>
            <Link href="#ai-matching" className="hover:text-white transition">AI Matching</Link>
            <Link href="#government-value" className="hover:text-white transition">Government Value</Link>
            <Link href="#security" className="hover:text-white transition">Audit & Security</Link>
            <Link href="/about" className="hover:text-white transition">About</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition shadow-lg shadow-blue-900/30 flex items-center gap-1.5"
            >
              <span>Access Portals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-medium text-slate-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Smart India Hackathon 2026 Prototype — Problem Statement SIH26122</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Bridging the gap between planned{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              L5/L6 schedules
            </span>{' '}
            and real-world site execution.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            SITE2SCHEDULE AI transforms unstructured field photographs, Daily Progress Reports (DPRs), and supervisor voice updates into verifiable, audit-backed schedule actuals — providing complete transparency for Site Managers, Project Managers, and Government Authorities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
            >
              <span>Launch Live Multi-Tier Prototype</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#workflow"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 font-medium text-sm border border-slate-800 transition flex items-center justify-center gap-2"
            >
              <span>Explore 3-Tier Workflow</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mt-12 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="font-semibold text-slate-300">Quick Portal Logins:</span>
            <span className="flex items-center gap-1 font-mono text-cyan-400">
              <Shield className="w-3.5 h-3.5" /> Gov Officer: GOV-7F4K9M21
            </span>
            <span className="flex items-center gap-1 font-mono text-blue-400">
              <Building2 className="w-3.5 h-3.5" /> Project Manager: PM-A82LQ4P7
            </span>
            <span className="flex items-center gap-1 font-mono text-emerald-400">
              <HardHat className="w-3.5 h-3.5" /> Site Manager: SM-X72K91AB
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM */}
      <section id="problem" className="py-20 px-6 bg-slate-950/60 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">The Infrastructure Bottleneck</span>
            <h2 className="text-3xl font-bold text-white mt-2">Why Mega Infrastructure Projects Slip</h2>
            <p className="text-sm text-slate-400 mt-3">
              Modern EPC projects utilize sophisticated Level 1 to Level 6 Primavera schedules, but actual daily construction progress remains isolated on site.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Unverifiable Paper DPRs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Daily progress reports are compiled as static PDF or paper sheets hours after work finishes, without geotagged visual proof or tamper-evident validation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Schedule Disconnect</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Planners update master Level 5/6 schedules weekly or monthly, meaning critical path delays like HDD mud loss or casing delays are discovered weeks too late.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Contested Claims</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Contractors report 65% while site reality is 63%. Without dual tracking of reported vs validated numbers, disputes halt payments and tie projects in litigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 & 4: 3-TIER WORKFLOW */}
      <section id="workflow" className="py-20 px-6 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Multi-Tier Architecture</span>
            <h2 className="text-3xl font-bold text-white mt-2">The Closed-Loop Execution Chain</h2>
            <p className="text-sm text-slate-400 mt-3">
              Role-segregated operational authority ensuring every millimeter of work is validated by engineers and accepted by authorities without modifying baseline schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Step 1: Site Manager */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-semibold">
                  TIER 01: FIELD
                </div>
                <HardHat className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Site Manager</h3>
              <p className="text-xs text-cyan-300 font-mono mb-4">Reports Field Reality</p>
              <ul className="text-xs text-slate-400 space-y-2.5 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Captures live multi-angle field photos via camera input</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Reports daily progress % (e.g. 65%) & physical quantities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Logs obstacles, voice updates & automatic GPS coordinates</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono">
                Original report stored permanently and never overwritten.
              </div>
            </div>

            {/* Step 2: Project Manager */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-semibold">
                  TIER 02: VALIDATION
                </div>
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Project Manager</h3>
              <p className="text-xs text-blue-300 font-mono mb-4">Validates & Updates Schedule</p>
              <ul className="text-xs text-slate-400 space-y-2.5 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Reviews AI match confidence (e.g. 95% match to L6-PIP-0245)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Validates progress (e.g. 63% validated vs 65% reported)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Creates official daily tasks & updates Earned Value actuals</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 font-mono">
                Stores validatedProgress separately with full audit log.
              </div>
            </div>

            {/* Step 3: Government Authority */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                  TIER 03: GOVERNANCE
                </div>
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Government Officer</h3>
              <p className="text-xs text-emerald-300 font-mono mb-4">Reviews & Approves Reports</p>
              <ul className="text-xs text-slate-400 space-y-2.5 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Monitors project progress, variance & incomplete works</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Approves, rejects, or requests engineering clarification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Reviews field photos & DPRs at authorized monitoring tier</span>
                </li>
              </ul>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-400 font-mono">
                Baseline schedule remains strictly intact upon approval.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 6-LEVEL WBS HIERARCHY WORKFLOW (L1 -> L6) */}
      <section id="wbs-workflow" className="py-20 px-6 bg-[#080d1a] border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              Planning to Execution WBS Architecture
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mt-2 mb-3">
              Standard 6-Level Work Breakdown Structure
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Understand the complete pipeline lifecycle: from L1 macro-contractual milestones down to daily L6 construction activities.
              Our platform primarily targets <strong className="text-cyan-400 font-semibold">Level 5 (Pipeline Erection)</strong> and <strong className="text-cyan-400 font-semibold">Level 6 (Specific Activities)</strong>.
            </p>
          </div>

          <WBSHierarchyVisualizer initialExpandedLevel="L6" showTree={true} />
        </div>
      </section>

      {/* SECTION 5: AI MATCHING EXPLANATION */}
      <section id="ai-matching" className="py-20 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Simulated AI Core</span>
              <h2 className="text-3xl font-bold text-white mt-2 mb-4">
                How Field Evidence Matches L6 Schedule Activities
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                When a Site Manager takes photos and submits a field update, the SITE2SCHEDULE AI inference pipeline analyzes text semantics, geotags, and visual objects against the Bill of Quantities (BoQ) and WBS dictionary.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Multi-Modal Object Detection</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Identifies pipe diameters (24-inch), welding root/hot passes, induction heating coils, and safety cordons.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">GIS Corridor Alignment</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Verifies mobile coordinates match the assigned pipeline chainage polygon (e.g. KP 17.2–18.1).
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                  <Layers className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Confidence Scoring & Human-in-the-Loop</h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Generates a 0-100% confidence score. AI recommendations never overwrite actuals without human PM approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated AI Card Demo */}
            <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white font-mono">PROTOTYPE AI INFERENCE</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  95% Match Confidence
                </span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Matched WBS Activity:</span>
                  <span className="text-cyan-400 font-mono font-bold text-sm">
                    L6-PIP-0245 — 24-inch CS Pipeline Welding
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-white block mb-1">Detected Computer Vision Objects:</strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">24-inch pipeline</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">welding_arc</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">induction_preheating_band</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">worker_ppe</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Reported</span>
                    <span className="text-white font-bold font-mono">65%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">AI Score</span>
                    <span className="text-cyan-400 font-bold font-mono">95%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">PM Validated</span>
                    <span className="text-emerald-400 font-bold font-mono">63%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 & 9: VALUE PROPOSITIONS */}
      <section id="government-value" className="py-20 px-6 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Stakeholder Value</span>
            <h2 className="text-3xl font-bold text-white mt-2">Tailored For Both Government & Enterprise</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Government Value */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-slate-900/60 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">For Government Authorities</h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Authorized Monitoring Clearance</strong>
                    Review and approve reported states without modifying contractual baseline engineering schedules.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Incomplete Works Oversight</strong>
                    Immediate visibility into high-risk incomplete tasks with discrepancy breakdowns between contractor claims and engineer actuals.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Objective Fund Disbursement</strong>
                    Tie escrow disbursements and milestone certificates strictly to validated field evidence rather than verbal promises.
                  </div>
                </li>
              </ul>
            </div>

            {/* Enterprise Value */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/20 to-slate-900/60 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">For EPC Contractors & PMs</h3>
              </div>
              <ul className="text-xs text-slate-300 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Daily Task Command Center</strong>
                    Project Managers retain full control over official daily task assignments, priorities, and assigned site managers.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">AI-Assisted Manual Review</strong>
                    Reduce manual verification time from hours to seconds with side-by-side comparison of site claims vs AI suggestions.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Dispute Elimination</strong>
                    Separate tracking of reportedProgress and validatedProgress protects the contractor against arbitrary rejections.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: SECURITY & AUDIT */}
      <section id="security" className="py-20 px-6 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Zero-Trust Architecture</span>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Verifiable Auditability for Every Action</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto mb-8">
            Every field submission, PM validation, and government review creates an immutable, SHA-256 hashed audit log record. Unauthorized cross-tier access is prevented by strict client and server authorization guards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-cyan-400 font-mono text-xs font-bold block mb-1">SHA-256 Hashes</span>
              <p className="text-[11px] text-slate-400">Cryptographically verifiable evidence chains across all state transitions.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-blue-400 font-mono text-xs font-bold block mb-1">Role-Based RBAC</span>
              <p className="text-[11px] text-slate-400">Strict separation preventing unauthorized schedule tampering by non-PM roles.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 font-mono text-xs font-bold block mb-1">Dual-Value Records</span>
              <p className="text-[11px] text-slate-400">Preserves original Site Manager report alongside final Project Manager validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section className="py-20 px-6 border-t border-slate-800/80 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Experience Planning-to-Execution Intelligence
          </h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
            Test the complete end-to-end prototype workflow from field photo capture to PM review and government monitoring approval.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-2xl shadow-blue-900/50"
          >
            <span>Open Authentication Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-900 bg-[#050810] text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-4">
        <div>
          <span className="font-bold text-slate-400">SITE2SCHEDULE AI</span> — Smart India Hackathon 2026 Prototype
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-slate-300">About</Link>
          <Link href="/problem" className="hover:text-slate-300">Problem</Link>
          <Link href="/solution" className="hover:text-slate-300">Solution</Link>
          <Link href="/how-it-works" className="hover:text-slate-300">How It Works</Link>
          <Link href="/security" className="hover:text-slate-300">Security</Link>
          <Link href="/contact" className="hover:text-slate-300">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
