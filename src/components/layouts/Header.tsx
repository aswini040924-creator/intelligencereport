'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Bell,
  LogOut,
  User,
  ChevronDown,
  Building2,
  FolderGit2,
  CheckCheck,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface HeaderProps {
  selectedProjectId?: string;
  onSelectProject?: (id: string) => void;
}

export function Header({ selectedProjectId = 'PRJ-ASSAM-025', onSelectProject }: HeaderProps) {
  const router = useRouter();
  const { session, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Active Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Project:</span>
          <select
            value={selectedProjectId}
            onChange={e => onSelectProject && onSelectProject(e.target.value)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
          >
            <option value="PRJ-ASSAM-025" className="bg-slate-900 text-white">
              Assam Pipeline Expansion – Demo (GAIL-NE-PL-2026)
            </option>
            <option value="PRJ-NHAI-DME-04" className="bg-slate-900 text-white">
              Delhi-Mumbai Expressway Package 14 (NHAI-DME)
            </option>
            <option value="PRJ-METRO-BLR-03" className="bg-slate-900 text-white">
              Bengaluru Metro Phase 2B Airport Link (BMRCL)
            </option>
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sync Active: KP 0–25 Corridor</span>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsUserMenuOpen(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0c1220] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-xs">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-400 font-mono text-[10px]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No new notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markAsRead(n.id);
                        if (n.link) {
                          setIsNotifOpen(false);
                          router.push(n.link);
                        }
                      }}
                      className={cn(
                        'p-3 rounded-xl border text-xs cursor-pointer transition',
                        n.read
                          ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                          : 'bg-blue-950/20 border-blue-500/30 text-slate-200 hover:bg-blue-950/30'
                      )}
                    >
                      <div className="font-medium text-white flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsUserMenuOpen(!isUserMenuOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
              {session?.name ? session.name[0] : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-white leading-tight">
                {session?.name || 'Authenticated User'}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono leading-tight">
                {session?.role || 'Guest'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0c1220] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-800/80 mb-2">
                <div className="font-semibold text-white text-xs">{session?.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{session?.organization}</div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1">ID: {session?.userId}</div>
              </div>

              <div className="space-y-1 text-xs">
                <Link
                  href="/"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800/60 transition"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    Public Website
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout & Clear Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
