import React from 'react';
import { AuditLogEntry } from '@/types';
import { ShieldCheck, Hash, User, Calendar, FileText } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AuditTableProps {
  logs: AuditLogEntry[];
  title?: string;
  limit?: number;
}

export function AuditTable({ logs, title = 'Verifiable Execution Audit Trail', limit }: AuditTableProps) {
  const displayLogs = limit ? logs.slice(0, limit) : logs;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically structured change records for field updates, PM validations, and government acceptance.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          {logs.length} Logged Events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800/80">
            <tr>
              <th className="px-4 py-3">Event ID & Time</th>
              <th className="px-4 py-3">Actor & Role</th>
              <th className="px-4 py-3">Action & Entity</th>
              <th className="px-4 py-3">Details & State Change</th>
              <th className="px-4 py-3">SHA-256 Hash</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {displayLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/30 transition">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-mono text-cyan-400 font-medium">{log.id}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {log.timestamp}
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {log.user}
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                    {log.role}
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium">
                    {log.action}
                  </span>
                  <div className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    {log.entity}: {log.entityId}
                  </div>
                </td>

                <td className="px-4 py-3 max-w-xs">
                  <div className="text-slate-200 line-clamp-2">{log.details}</div>
                  {log.previousValue && log.newValue && (
                    <div className="mt-1 text-[11px] text-slate-400 font-mono bg-slate-950/40 p-1.5 rounded border border-slate-800/50">
                      <span className="text-red-400 line-through mr-2">{log.previousValue}</span>
                      <span className="text-emerald-400">→ {log.newValue}</span>
                    </div>
                  )}
                </td>

                <td className="px-4 py-3 font-mono text-[11px] text-slate-500 max-w-[120px] truncate" title={log.sha256Hash}>
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{log.sha256Hash || 'e3b0c44298fc1c149afbf4c8...'}</span>
                  </div>
                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
