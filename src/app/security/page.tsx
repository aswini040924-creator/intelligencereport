'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, KeyRound, Database, FileCheck } from 'lucide-react';

export default function SecurityPage() {
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
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Zero-Trust Security & Audit</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Security Architecture & Cryptographic Integrity
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Ensuring every field claim and schedule modification is tamper-evident and strictly isolated across roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Lock className="w-6 h-6 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strict client and route guards prevent privilege escalation. Site Managers cannot access PM validation queues, and Government Officers review monitored actuals without altering engineering baselines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Cryptographic SHA-256 Audit Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every state change, modification of validated progress, and government review generates an immutable log entry with timestamp, actor ID, and simulated SHA-256 verification hash.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <FileCheck className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Dual Data Model Preservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Site Manager reported progress (65%) is stored in an immutable column, while PM validated progress (63%) is stored in an independent validation attribute, ensuring non-repudiation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Database className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-2">Enterprise Cloud Ready</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Architected for seamless migration to Azure Blob Storage for photo binary payloads, PostgreSQL for relational EVM schemas, and Azure Active Directory for government SSO.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
