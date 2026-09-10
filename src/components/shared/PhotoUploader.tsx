'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Eye, Image as ImageIcon, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  taskId?: string;
  activityCode?: string;
  uploaderName?: string;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 8,
  taskId,
  activityCode,
  uploaderName = 'Site Manager',
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newUrls: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        // Prototype only: create local object URL
        // In production, upload actual binary file to Azure Blob Storage
        const objUrl = URL.createObjectURL(file);
        newUrls.push(objUrl);
      }
    });

    const combined = [...photos, ...newUrls].slice(0, maxPhotos);
    onPhotosChange(combined);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons: Desktop upload vs Mobile Camera capture */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Mobile Camera Direct Capture */}
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium text-sm transition"
        >
          <Camera className="w-5 h-5 text-cyan-400" />
          <span>Capture Live Field Photo</span>
        </button>

        {/* Desktop / Gallery File Picker */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-sm transition"
        >
          <Upload className="w-5 h-5 text-blue-400" />
          <span>Upload From Device</span>
        </button>
      </div>

      {/* Hidden File Inputs */}
      {/* Mobile Camera: capture="environment" targets the rear camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Gallery / File Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition flex flex-col items-center justify-center',
          isDragging
            ? 'border-cyan-400 bg-cyan-950/20'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
        )}
      >
        <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
        <p className="text-xs text-slate-300 font-medium">
          Drag and drop photo evidence here, or tap buttons above
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Supported: JPG, PNG, WEBP. Maximum {maxPhotos} photos.
        </p>
      </div>

      {/* Photo Previews Gallery */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Attached Evidence ({photos.length}/{maxPhotos})</span>
            <span className="text-cyan-400 font-mono text-[11px]">Geotag & Timestamp Auto-Attached</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos.map((url, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-md"
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Field evidence capture ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedPhotoPreview(url);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-blue-600 transition"
                    title="View Enlarged Photo"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      removePhoto(idx);
                    }}
                    className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-500 transition"
                    title="Remove Photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Badge */}
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                  IMG #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Prototype disclaimer */}
          <p className="text-[11px] text-slate-500 italic">
            * Prototype Note: Captured images are stored locally in client state. When deployed to production, images stream directly to Azure Blob Storage with SHA-256 integrity hashing.
          </p>
        </div>
      )}

      {/* Enlarged Photo Modal */}
      <Modal
        isOpen={!!selectedPhotoPreview}
        onClose={() => setSelectedPhotoPreview(null)}
        title="Field Photo Evidence Detail"
        subtitle={`${activityCode || 'WBS Activity'} — Uploaded by ${uploaderName}`}
        maxWidth="4xl"
      >
        {selectedPhotoPreview && (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPhotoPreview}
                alt="Enlarged field evidence"
                className="w-full max-h-[65vh] object-contain mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>KP 17.4 Cachar Valley (24.8333° N, 92.7789° E)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Captured: {new Date().toLocaleTimeString()} IST</span>
              </div>
              <div className="text-right text-emerald-400 font-medium">
                AI Consistency: HIGH (Simulated)
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
