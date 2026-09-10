'use client';

import React from 'react';
import { FileText, Download, BarChart3 } from 'lucide-react';

export default function PMReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Project Manager Earned Value & Progress Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Weekly and monthly EVM curves, contractor progress billing statements, and site weld tallies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <BarChart3 className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Earned Value Analysis (EVA)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cost Performance Index (CPI = 0.94) and Schedule Performance Index (SPI = 0.81) for Assam Gas Grid corridor.
            </p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
            Generate EVA PDF
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <FileText className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Daily Weld Tally Reconciliation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Summary of root pass, hot pass, and capping welds across KP 17–18 with welder ID stencils.
            </p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
            Export Weld Sheet
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <Download className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Monthly Billing Certificate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interim Payment Certificate (IPC #8) based on PM-validated actuals and verified photo evidence.
            </p>
          </div>
          <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition">
            Prepare IPC #8
          </button>
        </div>
      </div>
    </div>
  );
}
