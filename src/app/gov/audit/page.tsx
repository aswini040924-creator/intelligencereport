'use client';

import React, { useState, useEffect } from 'react';
import { AuditTable } from '@/components/shared/AuditTable';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';
import { AuditLogEntry } from '@/types';
import { ShieldCheck, Filter } from 'lucide-react';

export default function GovAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const saved = storage.getLocal<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    setLogs(saved);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Government Verifiable Execution Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident chronological registry of all field submissions, PM modifications, and government monitoring acceptances.
          </p>
        </div>
      </div>

      <AuditTable logs={logs} title="Statutory & Execution State Audit Records" />
    </div>
  );
}
