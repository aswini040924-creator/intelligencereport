'use client';

import React from 'react';
import { StatCard } from '@/components/shared/StatCard';
import { Building2, Users, Lock, Activity, ShieldCheck, Server } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Server className="w-3.5 h-3.5" />
            <span>National Platform Infrastructure Console</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Platform Administrator Master Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Super administrative controls: Tenants, RBAC policies, distributed node health, and audit immutability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard title="Active Tenants" value="8" subtitle="EPC & Ministries" icon={Building2} variant="cyan" />
        <StatCard title="Registered Users" value="142" subtitle="Across tiers" icon={Users} variant="blue" />
        <StatCard title="RBAC Roles" value="7" subtitle="Strict isolation" icon={Lock} variant="emerald" />
        <StatCard title="System Health" value="99.98%" subtitle="API uptime" icon={Activity} variant="emerald" />
        <StatCard title="Audit Blocks" value="1,842" subtitle="SHA-256 hashed" icon={ShieldCheck} variant="amber" />
        <StatCard title="Active Corridors" value="12" subtitle="Live tracking" variant="cyan" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Provisioned Tenants
          </h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Government Infrastructure Authority</div>
                <div className="text-slate-500 text-[11px]">Nodal Monitoring Agency</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">ACTIVE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Enterprise Infrastructure Ltd</div>
                <div className="text-slate-500 text-[11px]">EPC Contractor (GAIL Corridor)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">ACTIVE</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">National Highway Builders Corp</div>
                <div className="text-slate-500 text-[11px]">EPC Contractor (NHAI Expressway)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Distributed System Health
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-sans">Frontend Local Storage Broker:</span>
              <span className="text-emerald-400 font-bold">OPERATIONAL</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-sans">Deterministic AI Inference Engine:</span>
              <span className="text-cyan-400 font-bold">SIMULATED (95% CONFIDENCE)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 font-sans">SHA-256 Audit Integrity Hasher:</span>
              <span className="text-emerald-400 font-bold">ACTIVE & TAMPER-EVIDENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
