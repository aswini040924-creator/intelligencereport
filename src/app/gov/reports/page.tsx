'use client';

import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Calendar, FileSpreadsheet } from 'lucide-react';

export default function GovReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: 'REP-2026-W36',
      title: 'Weekly Executive Physical Progress & Variance Report (Week 36)',
      date: '08 Sep 2026',
      period: '01 Sep – 07 Sep 2026',
      size: '2.4 MB PDF',
      summary: 'Detailed reconciliation of KP 0–25 welding, NDT clearance, and Barak River HDD reaming metrics.',
    },
    {
      id: 'REP-2026-M08',
      title: 'Monthly Ministry Compliance & Earned Value Certificate (August 2026)',
      date: '01 Sep 2026',
      period: '01 Aug – 31 Aug 2026',
      size: '8.1 MB PDF',
      summary: 'Cumulative financial expenditure vs committed EVM physical progress; CAG audit compliance annexure.',
    },
    {
      id: 'REP-2026-RISK-Q3',
      title: 'Specialized Monsoon Slippage & Risk Intelligence Audit',
      date: '28 Aug 2026',
      period: 'Q3 Forecast',
      size: '3.6 MB PDF',
      summary: 'Geotechnical analysis of Cachar hillsides and flood protection measures along Barak river crossing.',
    },
  ];

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Government Compliance Reports & EVM Documentation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generated statutory progress summaries and certified audit annexures for ministry inspection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reports.map(rep => (
          <div
            key={rep.id}
            className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-cyan-400 border border-blue-500/20 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono text-cyan-400 text-xs font-semibold">{rep.id}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{rep.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{rep.summary}</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 font-mono">
                  <span>Published: {rep.date}</span>
                  <span>Period: {rep.period}</span>
                  <span>Size: {rep.size}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(rep.id)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{downloading === rep.id ? 'Generating PDF...' : 'Download Document'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
