'use client';

import React, { useState } from 'react';
import { INITIAL_PHOTO_EVIDENCE } from '@/lib/mock/evidence';
import { Modal } from '@/components/shared/Modal';
import { Image as ImageIcon, Eye, MapPin, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function PMEvidencePage() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof INITIAL_PHOTO_EVIDENCE)[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Field Photographic Evidence Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Geotagged high-resolution visual evidence with simulated computer vision object detections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INITIAL_PHOTO_EVIDENCE.map(evd => (
          <div
            key={evd.id}
            onClick={() => setSelectedPhoto(evd)}
            className="group rounded-2xl overflow-hidden bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={evd.url}
                  alt={evd.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-cyan-400 font-mono text-[10px] font-bold">
                  {evd.activityCode}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-emerald-500/80 text-white font-mono text-[10px]">
                  {evd.evidenceStatus}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-white line-clamp-2">{evd.caption}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{evd.location}</span>
                </p>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>{evd.uploadedBy}</span>
              <span>{evd.capturedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Inspection Modal */}
      <Modal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        title={selectedPhoto ? `${selectedPhoto.activityCode}: ${selectedPhoto.filename}` : ''}
        subtitle={selectedPhoto?.caption}
        maxWidth="4xl"
      >
        {selectedPhoto && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full max-h-[60vh] object-contain mx-auto"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">AI Consistency Assessment:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {selectedPhoto.aiConsistency} (Simulated)
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed italic">{selectedPhoto.aiRemarks}</p>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Detected Computer Vision Objects:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPhoto.aiDetectedObjects.map((obj, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
                    >
                      {obj}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
