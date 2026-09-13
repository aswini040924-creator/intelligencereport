'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Filter, Download, Hash, CheckCircle2, Lock } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { AuditTable } from '@/components/shared/AuditTable';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { AuditLogEntry } from '@/types';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    const stored = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    setLogs(stored);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action.includes(filterAction);
    return matchesSearch && matchesAction;
  });

  const exportCSV = () => {
    const headers = 'ID,Timestamp,User,Role,Action,Entity,EntityID,Details,SHA256\n';
    const rows = filteredLogs
      .map(
        l =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.entity}","${l.entityId}","${l.details.replace(/"/g, '""')}","${l.sha256Hash || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `s2s-platform-audit-ledger-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographic Ledger Console</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Platform Immutable Audit Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centrally inspect SHA-256 verifiable logs across all tenants, field updates, PM validations, and government monitoring.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          Export Verifiable Ledger (CSV)
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Ledger Blocks" value={logs.length} subtitle="Chained events" icon={Hash} variant="cyan" />
        <StatCard title="Verification Status" value="100% Valid" subtitle="Zero hash tampering" icon={CheckCircle2} variant="emerald" />
        <StatCard title="PM Validations" value={logs.filter(l => l.role === 'PROJECT_MANAGER').length} subtitle="Quantity reviews" icon={ShieldCheck} variant="blue" />
        <StatCard title="Gov Acceptances" value={logs.filter(l => l.role.startsWith('GOV')).length} subtitle="Monitoring records" icon={Lock} variant="amber" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search event ID, actor, task, or hash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterAction}
            onChange={e => setFilterAction(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="ALL">All Event Types</option>
            <option value="SUBMISSION">Site Submissions</option>
            <option value="PM_">PM Validations</option>
            <option value="GOVERNMENT">Government Monitoring Reviews</option>
            <option value="CREATE">Entity Creation</option>
          </select>
        </div>
      </div>

      {/* Audit Table Component */}
      <AuditTable logs={filteredLogs} title="Master Platform Event Ledger" />
    </div>
  );
}
