'use client';

import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck, CheckCircle2, AlertTriangle, EyeOff, Hash, Server } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';

export default function AdminSecurityPage() {
  const securityControls = [
    {
      title: 'SHA-256 Tamper-Evident Hashing',
      category: 'Data Integrity',
      status: 'ACTIVE',
      description:
        'Every site submission, PM validation, and government acceptance generates a cryptographic SHA-256 checksum chained to the prior log entry.',
      compliant: true,
    },
    {
      title: 'Government Monitoring Isolation Barrier',
      category: 'Process Compliance',
      status: 'ACTIVE',
      description:
        'Prevents government acceptance routines from modifying baseline start dates, baseline finish dates, or planned quantities. Guarantees immutable contractual schedules.',
      compliant: true,
    },
    {
      title: 'Geofencing & EXIF Metadata Verification',
      category: 'Evidence Security',
      status: 'ACTIVE',
      description:
        'Validates that photos submitted from site fall within KP 0-25 corridor coordinates (lat 26.15-26.25, lon 91.75-91.85) to eliminate fraudulent remote uploads.',
      compliant: true,
    },
    {
      title: 'Role-Based Access Isolation (7 Roles)',
      category: 'Access Control',
      status: 'ACTIVE',
      description:
        'Strict runtime separation preventing Site Managers from accessing PM review desks, and restricting Enterprise Admins from overriding Government compliance flags.',
      compliant: true,
    },
    {
      title: 'Local & Edge Storage Sandboxing',
      category: 'Storage Protection',
      status: 'ACTIVE',
      description:
        'Safe SSR-friendly browser storage brokers with automatic session termination and token invalidation on browser close.',
      compliant: true,
    },
    {
      title: 'Non-Repudiation Audit Logs',
      category: 'Governance & Legal',
      status: 'ACTIVE',
      description:
        'Complete chronological audit trail recording user IDs, IP signatures, timestamp offsets, and previous-vs-new value diffs for national infrastructure compliance.',
      compliant: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cybersecurity & Regulatory Compliance</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Security Architecture & Compliance Posture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise-grade protections safeguarding national infrastructure project execution data.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Compliance Score" value="100%" subtitle="National Infra Guidelines" icon={ShieldCheck} variant="emerald" />
        <StatCard title="Tamper Resistance" value="SHA-256" subtitle="Chained event ledger" icon={Hash} variant="cyan" />
        <StatCard title="Active Policies" value="18" subtitle="Strictly enforced" icon={Lock} variant="blue" />
        <StatCard title="Vulnerabilities" value="0 Critical" subtitle="Continuous verification" icon={Key} variant="amber" />
      </div>

      {/* Security Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityControls.map((ctrl, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                  {ctrl.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {ctrl.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">
                {ctrl.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {ctrl.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>National Cyber Standards</span>
              <span className="text-emerald-400 font-mono font-medium">COMPLIANT</span>
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory Standards Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400" />
          Regulatory Standards Alignment
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-white">GFR 2017 Compliance</div>
            <div className="text-slate-400 text-[11px] mt-1">General Financial Rules adherence for public expenditure tracking and progress validation.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-white">ISO 27001 Framework</div>
            <div className="text-slate-400 text-[11px] mt-1">Information security controls for access segregation and audit trail preservation.</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-bold text-white">National Cyber Security Policy</div>
            <div className="text-slate-400 text-[11px] mt-1">Critical national infrastructure defense guidelines for public works corridors.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
