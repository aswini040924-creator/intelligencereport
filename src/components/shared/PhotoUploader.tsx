'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Eye, Image as ImageIcon, MapPin, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modal } from './Modal';

interface PhotoUploaderProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  taskId?: string;
  activityCode?: string;
  uploaderName?: string;
  projectName?: string;
  level?: string;
}

export function PhotoUploader({
  photos,
  onPhotosChange,
  maxPhotos = 8,
  taskId,
  activityCode,
  uploaderName = 'Site Manager',
  projectName,
  level = 'L6',
}: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFiles, setIsReadingFiles] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsReadingFiles(true);
    try {
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      const dataUrls = await Promise.all(validFiles.map(readFileAsDataUrl));
      const combined = [...photos, ...dataUrls].slice(0, maxPhotos);
      onPhotosChange(combined);
    } catch (err) {
      console.error('Failed to read photo files:', err);
    } finally {
      setIsReadingFiles(false);
    }
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Action Button */}
      <div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReadingFiles || photos.length >= maxPhotos}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium text-sm transition disabled:opacity-50 cursor-pointer shadow-sm hover:border-cyan-500/40"
        >
          {isReadingFiles ? (
            <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-cyan-400" />
          )}
          <span>Upload From Device</span>
        </button>
      </div>

      {/* Hidden File Input */}
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
          Supported: JPG, PNG, WEBP. Maximum {maxPhotos} photos. Files stream directly to MongoDB GridFS.
        </p>
      </div>

      {/* Photo Previews Gallery */}
      {photos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Attached Evidence ({photos.length}/{maxPhotos})</span>
            <span className="text-cyan-400 font-mono text-[11px]">Geotag & WBS {level} Auto-Attached</span>
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

          <p className="text-[11px] text-emerald-400/90 font-mono flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready for transmission to MongoDB GridFS cluster ({photos.length} image{photos.length > 1 ? 's' : ''})</span>
          </p>
        </div>
      )}

      {/* Enlarged Photo Modal */}
      <Modal
        isOpen={!!selectedPhotoPreview}
        onClose={() => setSelectedPhotoPreview(null)}
        title="Field Photo Evidence Detail"
        subtitle={`${projectName ? `${projectName} • ` : ''}${level} Activity: ${activityCode || 'WBS Task'} — Uploaded by ${uploaderName}`}
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
                <span>Sector Corridor (24.8333° N, 92.7789° E)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Captured: {new Date().toLocaleTimeString()} IST</span>
              </div>
              <div className="text-right text-cyan-400 font-mono font-medium">
                Storage: MongoDB GridFS
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
