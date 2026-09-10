import React from 'react';
import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, ShieldCheck, AlertCircle, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function RiskBadge({ level, size = 'sm', showIcon = true, className }: RiskBadgeProps) {
  const norm = level?.toUpperCase() as RiskLevel;

  const config = {
    LOW: {
      label: 'Low Risk',
      classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: ShieldCheck,
    },
    MEDIUM: {
      label: 'Medium Risk',
      classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: AlertCircle,
    },
    HIGH: {
      label: 'High Risk',
      classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: AlertTriangle,
    },
    CRITICAL: {
      label: 'Critical Risk',
      classes: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: Flame,
    },
  }[norm] || {
    label: level,
    classes: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-md',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.classes,
        className
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {config.label}
    </span>
  );
}
