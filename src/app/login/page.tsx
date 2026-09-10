'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PortalTab, UserRole } from '@/types';
import { DEMO_PORTAL_TABS, DEMO_USERS } from '@/lib/demoUsers';
import { loginWithCredentials } from '@/lib/auth';
import {
  Shield,
  Building2,
  HardHat,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();

  // Active Tab: 'government' | 'enterprise' | 'site-manager' | 'admin'
  const [activeTab, setActiveTab] = useState<PortalTab>('government');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentTabConfig = DEMO_PORTAL_TABS.find(t => t.id === activeTab) || DEMO_PORTAL_TABS[0];

  // Tab change handler resets input and clears errors
  const handleTabChange = (tabId: PortalTab) => {
    setActiveTab(tabId);
    setIdentifier('');
    setPassword('');
    setErrorMessage(null);
  };

  // Quick autofill demo credentials
  const handleAutofill = (userKey: string) => {
    const user = DEMO_USERS[userKey];
    if (user) {
      setIdentifier(user.identifier);
      setPassword(user.password);
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both your Service Identifier and Password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = loginWithCredentials(identifier, password, activeTab);

      if (!result.success || !result.redirectUrl) {
        setErrorMessage(result.error || 'Invalid credentials for this portal.');
        setIsSubmitting(false);
        return;
      }

      // Success: redirect based on authenticated role
      router.push(result.redirectUrl);
    } catch {
      setErrorMessage('An unexpected error occurred during authentication.');
      setIsSubmitting(false);
    }
  };

  const getTabIcon = (id: PortalTab) => {
    switch (id) {
      case 'government':
        return Shield;
      case 'enterprise':
        return Building2;
      case 'site-manager':
        return HardHat;
      case 'admin':
        return Lock;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Banner with Tricolor Ribbon */}
      <div>
        <div className="tricolor-ribbon" />
        <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 text-sm">
              S2S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-cyan-400 transition">
                  SITE2SCHEDULE
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                AI-Powered Planning-to-Execution Intelligence
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60"
          >
            ← Public Website
          </Link>
        </header>
      </div>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 z-10">
        <div className="w-full max-w-xl bg-slate-900/70 border border-slate-800/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Header Description */}
          <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 text-center">
            <span className="inline-block text-[11px] font-semibold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20 mb-2">
              National Infrastructure Monitoring & Execution Grid
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Single Multi-Tier Portal Access
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Authenticate into your designated operational clearance level. Select your operational tier below to proceed.
            </p>
          </div>

          {/* TAB SELECTION INTERFACE */}
          <div className="p-4 bg-slate-950/70 border-b border-slate-800/80">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_PORTAL_TABS.map(tab => {
                const TabIcon = getTabIcon(tab.id);
                const isSelected = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-150',
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    )}
                  >
                    <TabIcon className={cn('w-4 h-4', isSelected ? 'text-white' : 'text-slate-400')} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Tab Brief */}
            <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div>
                <strong className="text-slate-200">{currentTabConfig.label} Tier: </strong>
                {currentTabConfig.description}
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono shrink-0 ml-2">
                {currentTabConfig.badge}
              </span>
            </div>
          </div>

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Authentication Failed</span>
                  {errorMessage}
                </div>
              </div>
            )}

            {/* Identifier Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {currentTabConfig.identifierLabel}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={currentTabConfig.identifierPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500">Security: Tier Clearance PIN</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter authorized password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>

            {/* DEMO CREDENTIALS AREA WITH SHOW/HIDE TOGGLE */}
            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  Prototype Demo Credentials ({currentTabConfig.label})
                </span>
                {showDemoCredentials ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showDemoCredentials && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">
                        {currentTabConfig.primaryDemoUser.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {currentTabConfig.primaryDemoUser.organization}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutofill(currentTabConfig.primaryDemoUser.role)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium transition cursor-pointer"
                    >
                      Autofill
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px]">ID:</span>
                      <span className="text-cyan-400 select-all font-semibold">
                        {currentTabConfig.primaryDemoUser.identifier}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Password:</span>
                      <span className="text-slate-300 select-all font-semibold">
                        {currentTabConfig.primaryDemoUser.password}
                      </span>
                    </div>
                  </div>

                  {/* Secondary Demo User if available for Enterprise tab */}
                  {currentTabConfig.secondaryDemoUser && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">
                        Or login as Company Admin: <strong className="text-slate-300">Sunita Majumdar</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAutofill('COMPANY_ADMIN')}
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        Fill Admin Credentials
                      </button>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 italic mt-1 pt-1 border-t border-slate-800/60">
                    {/* DEMO ONLY - replace with backend authentication in production. */}
                    DEMO ONLY - Prototype authentication with simulated roles. Connect to production IAM / OAuth backend in production.
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500 border-t border-slate-800/80 bg-slate-950/60">
        SITE2SCHEDULE AI — Smart India Hackathon 2026 (Problem Statement SIH26122)
      </footer>
    </div>
  );
}
