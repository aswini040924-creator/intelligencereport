'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <div className="tricolor-ribbon" />
      <header className="px-6 py-4 border-b border-slate-800/80 bg-[#070b14]/90 sticky top-0 z-30 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/login" className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-medium text-xs">
          Open Portal
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">SIH 2026 Secretariat</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">
            Contact Team SITE2SCHEDULE AI
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Get in touch with the development team regarding SIH26122 prototype demonstrations, pilot integration, or technical evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 text-xs text-slate-300">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Direct Inquiries:</span>
                  <span className="text-white font-mono font-medium">sih2026.s2s@gov.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Prototype Pilot Hotline:</span>
                  <span className="text-white font-mono font-medium">+91 11 2345 6789</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Operational Evaluation Site:</span>
                  <span className="text-white">Assam Pipeline Corridor (Guwahati - Silchar Section)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">Message Transmitted</h3>
                <p className="text-xs text-slate-400">
                  Your inquiry has been logged in the prototype demonstration registry.
                </p>
              </div>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Organization / Agency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NHAI / Ministry of Petroleum / EPC Contractor"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter inquiry details..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-900/30"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
