'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { checkBackendHealth, HealthResponse, API_BASE_URL } from '@/lib/api';
import { Server, RefreshCw, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface BackendStatusBadgeProps {
  compact?: boolean;
}

export function BackendStatusBadge({ compact = false }: BackendStatusBadgeProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const performCheck = useCallback(async () => {
    setIsChecking(true);
    const result = await checkBackendHealth();
    setHealth(result);
    setIsChecking(false);
  }, []);

  useEffect(() => {
    performCheck();
    // Poll health every 30 seconds
    const interval = setInterval(performCheck, 30000);
    return () => clearInterval(interval);
  }, [performCheck]);

  if (!health) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-slate-500 animate-ping" />
        <span>Connecting backend...</span>
      </div>
    );
  }

  const isOnline = health.isOnline;

  if (compact) {
    return (
      <button
        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
        title={isOnline ? `Express Backend Online (${health.latencyMs}ms)` : 'Express Backend Offline'}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border transition ${
          isOnline
            ? 'bg-emerald-950/50 border-emerald-800/60 text-emerald-400 hover:bg-emerald-900/50'
            : 'bg-amber-950/50 border-amber-800/60 text-amber-400 hover:bg-amber-900/50'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <span className="font-mono">
          {isOnline ? `Backend: ${health.latencyMs}ms` : 'Backend: Offline'}
        </span>
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs backdrop-blur-md transition shadow-sm ${
          isOnline
            ? 'bg-slate-900/90 border-emerald-500/30 text-slate-200'
            : 'bg-slate-900/90 border-amber-500/30 text-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50' : 'bg-amber-400'
            }`}
          />
          <Server className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-200 tracking-tight">Express API</span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-medium ${
              isOnline
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isOnline ? `4500 • ${health.latencyMs}ms` : 'Port 4500 Offline'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-700/60">
          <Link
            href="/gov/s3-live"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition font-medium flex items-center gap-1"
          >
            <span>Live S3 Data</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={performCheck}
            disabled={isChecking}
            title="Check backend connection"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Details dropdown if offline */}
      {!isOnline && (
        <div className="mt-1.5 text-[11px] text-amber-400/90 bg-amber-950/40 border border-amber-900/50 rounded-lg p-2 max-w-sm">
          <div className="flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <span>Backend server is offline. Run </span>
              <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200 font-mono text-[10px]">
                cd intelligencereport-backend &amp;&amp; npm start
              </code>
              <span> to activate live AWS S3 streaming on port 4500.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
