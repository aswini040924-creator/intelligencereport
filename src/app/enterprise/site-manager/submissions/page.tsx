'use client';

import React from 'react';
import Link from 'next/link';
import { useSubmissions } from '@/hooks/useSubmissions';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Camera, Image as ImageIcon, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function SiteManagerSubmissionsPage() {
  const { submissions } = useSubmissions('PRJ-ASSAM-025');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Daily Field Submissions
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track submitted reports, AI matching results, and Project Manager validation remarks.
          </p>
        </div>

        <Link
          href="/enterprise/site-manager/capture"
          className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>Capture Evidence</span>
        </Link>
      </div>

      <div className="space-y-4">
        {submissions.map(sub => (
          <div
            key={sub.id}
            className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-cyan-400 text-xs font-bold">{sub.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{sub.taskName}</h3>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sub.location}</span>
                </p>
              </div>

              <StatusBadge status={sub.status} />
            </div>

            <p className="text-xs text-slate-300 p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
              {sub.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">Reported %</span>
                <span className="text-cyan-400 font-bold">{sub.reportedProgress}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Reported Qty</span>
                <span className="text-white font-bold">{sub.quantity} {sub.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PM Validated %</span>
                <span className="text-emerald-400 font-bold">
                  {sub.validatedProgress !== undefined ? `${sub.validatedProgress}%` : 'Pending'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">AI Confidence</span>
                <span className="text-purple-400 font-bold">{Math.round(sub.aiConfidence * 100)}%</span>
              </div>
            </div>

            {sub.pmComment && (
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300">
                <strong className="text-blue-300 block mb-0.5">PM Validation Comment:</strong>
                <p className="italic text-slate-400">{sub.pmComment}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800 font-mono">
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{sub.photos.length} photos uploaded</span>
              </span>
              <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
