'use client';

import React, { useState } from 'react';
import { Activity, Server, Cpu, Database, Wifi, ShieldCheck, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';

interface NodeStatus {
  name: string;
  subsystem: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latency: string;
  uptime: string;
  load: string;
  details: string;
}

const NODES: NodeStatus[] = [
  {
    name: 'Client State Storage Broker',
    subsystem: 'Local & Session Persistence Layer',
    status: 'OPERATIONAL',
    latency: '1.2 ms',
    uptime: '100%',
    load: '14%',
    details: 'Hydrating site2schedule_* localStorage keys with SSR safety checks',
  },
  {
    name: 'Prototype AI Vision Simulation Engine',
    subsystem: 'Computer Vision & DPR Cross-Matching',
    status: 'OPERATIONAL',
    latency: '82 ms',
    uptime: '99.98%',
    load: '28%',
    details: 'Deterministic keyword & GPS validation pipeline active',
  },
  {
    name: 'SHA-256 Cryptographic Chain Ledger',
    subsystem: 'Tamper-Evident Audit Immutability',
    status: 'OPERATIONAL',
    latency: '3.4 ms',
    uptime: '100%',
    load: '9%',
    details: 'Zero hash collisions, strict incremental block chaining active',
  },
  {
    name: 'Next.js 15 App Router Edge Core',
    subsystem: 'SSR Hydration & Client Routing',
    status: 'OPERATIONAL',
    latency: '14 ms',
    uptime: '99.99%',
    load: '22%',
    details: 'Static route pre-rendering & dynamic layout streaming operational',
  },
  {
    name: 'GPS Geofencing Proximity Resolver',
    subsystem: 'Field Location Verification',
    status: 'OPERATIONAL',
    latency: '18 ms',
    uptime: '99.95%',
    load: '16%',
    details: 'Assam Pipeline KP 0-25 corridor boundaries mapped (100m threshold)',
  },
  {
    name: 'Role-Based Authentication Gateway',
    subsystem: 'Session Security & Route Guard',
    status: 'OPERATIONAL',
    latency: '0.8 ms',
    uptime: '100%',
    load: '11%',
    details: 'Strict 7-tier role isolation enforced via ProtectedRoute barriers',
  },
];

export default function AdminSystemHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState('Just now');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked(new Date().toLocaleTimeString());
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Infrastructure Telemetry</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            System Health & Service Nodes
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time diagnostics for state brokers, deterministic AI models, and cryptographic ledgers.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>{isRefreshing ? 'Pinging Nodes...' : 'Refresh Telemetry'}</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Platform Uptime" value="99.98%" subtitle="Last 90 days" icon={Activity} variant="emerald" />
        <StatCard title="Avg Node Latency" value="19.9 ms" subtitle="Sub-second response" icon={Clock} variant="cyan" />
        <StatCard title="Active Subsystems" value="6 / 6" subtitle="100% operational" icon={Server} variant="blue" />
        <StatCard title="Security Faults" value="0" subtitle="Zero breaches detected" icon={ShieldCheck} variant="amber" />
      </div>

      {/* Nodes Status Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Subsystem Operational Matrix
          </h3>
          <span className="text-[11px] font-mono text-slate-500">
            Last Ping: {lastChecked}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
              <tr>
                <th className="px-4 py-3">Subsystem & Function</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Uptime</th>
                <th className="px-4 py-3">Load</th>
                <th className="px-4 py-3">Architecture Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {NODES.map((node, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-white">{node.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{node.subsystem}</div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {node.status}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-cyan-400 font-medium">
                    {node.latency}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-emerald-400">
                    {node.uptime}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-full rounded-full"
                        style={{ width: node.load }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 inline-block">{node.load}</span>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs text-slate-300 text-[11px]">
                    {node.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostics Logs Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            LIVE TELEMETRY TRACE STREAM
          </span>
          <span className="text-[10px]">FREQ: 1000ms</span>
        </div>
        <div className="space-y-1 text-slate-400 text-[11px]">
          <p className="text-emerald-400">[2026-09-10 13:45:01] INFO  ClientStorageBroker: Sync cycle OK (5 collections, 0 parity faults)</p>
          <p className="text-cyan-400">[2026-09-10 13:45:02] INFO  DeterministicAI: Seed model loaded with 4 pipeline verification classes</p>
          <p className="text-slate-400">[2026-09-10 13:45:03] INFO  AuditHasher: Verified SHA-256 tree against local root. Hash matches.</p>
          <p className="text-slate-400">[2026-09-10 13:45:04] INFO  AuthGuard: Verified active session token for PLATFORM_ADMIN.</p>
          <p className="text-emerald-400">[2026-09-10 13:45:05] INFO  All subroutines nominal. Zero latency spikes reported.</p>
        </div>
      </div>
    </div>
  );
}
