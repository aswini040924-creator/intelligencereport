'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, CheckCircle2, Lock, Save } from 'lucide-react';

export default function CompanyAdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Corporate & Platform Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure EVM threshold alerts, baseline schedule locking parameters, and cloud integration keys.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings successfully updated in local state.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Corporate Organization Legal Entity</label>
          <input
            type="text"
            defaultValue="Enterprise Infrastructure Ltd"
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Schedule Variance Threshold for Critical Alert (%)</label>
          <input
            type="number"
            defaultValue={-10}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Primavera Baseline Lock Policy</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              ACTIVE ENFORCEMENT
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Strict isolation guarantees that Government approvals and Site Manager submissions cannot alter baseline dates or quantities. Baseline modification requires corporate change-order consensus.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-900/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
