'use client';

import React from 'react';
import { useS3Data } from '@/context/S3DataContext';
import { Database, RefreshCw, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';

interface S3SyncStatusBadgeProps {
  compact?: boolean;
  className?: string;
}

export function S3SyncStatusBadge({ compact = false, className = '' }: S3SyncStatusBadgeProps) {
  const { s3Status, bucketName, totalS3Records, lastSyncTime, isSyncing, syncS3 } = useS3Data();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs ${className}`}>
        <span className="relative flex h-2 w-2">
          {s3Status === 'connected' && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          )}
          {s3Status === 'syncing' && (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 animate-pulse"></span>
          )}
          {s3Status === 'offline' && (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
        </span>
        <span className="font-mono text-[11px] text-slate-300">
          S3: <strong className="text-cyan-400 font-medium">{bucketName}</strong>
        </span>
        <button
          onClick={() => syncS3()}
          disabled={isSyncing}
          title="Force Re-sync from Amazon S3"
          className="p-1 hover:text-white text-slate-400 transition"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 to-blue-950/40 border border-cyan-500/20 shadow-lg flex flex-wrap items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              Amazon S3 Live Bucket Stream
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              s3Status === 'connected' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : s3Status === 'syncing' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {s3Status === 'connected' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
              {s3Status === 'connected' ? 'LIVE DATA' : s3Status === 'syncing' ? 'SYNCING...' : 'OFFLINE CACHE'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
            <span>Bucket: <strong className="text-slate-200 font-mono">{bucketName}</strong></span>
            <span>•</span>
            <span>Rows: <strong className="text-cyan-400 font-mono">{totalS3Records.toLocaleString()}</strong></span>
            {lastSyncTime && (
              <>
                <span>•</span>
                <span>Synced: <strong className="text-slate-300 font-mono">{lastSyncTime}</strong></span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => syncS3()}
        disabled={isSyncing}
        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-center gap-2 transition active:scale-95 disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
        <span>{isSyncing ? 'Fetching S3...' : 'Re-sync S3'}</span>
      </button>
    </div>
  );
}
