'use client';

import React, { useState, useEffect } from 'react';
import { AuditTable } from '@/components/shared/AuditTable';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_AUDIT_LOGS } from '@/lib/mock/audit';
import { AuditLogEntry } from '@/types';

export default function PMAuditPage() {
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
            Project Manager Execution & Review Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete cryptographic audit trail of all field validations, task creations, and value modifications.
          </p>
        </div>
      </div>

      <AuditTable logs={logs} title="Project Manager Operational Audit Log" />
    </div>
  );
}
