import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'default' | 'cyan' | 'blue' | 'amber' | 'emerald' | 'red';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-slate-800/80 bg-slate-900/60 text-slate-100',
    cyan: 'border-cyan-500/20 bg-cyan-950/20 text-cyan-200',
    blue: 'border-blue-500/20 bg-blue-950/20 text-blue-200',
    amber: 'border-amber-500/20 bg-amber-950/20 text-amber-200',
    emerald: 'border-emerald-500/20 bg-emerald-950/20 text-emerald-200',
    red: 'border-red-500/20 bg-red-950/20 text-red-200',
  };

  const iconBg = {
    default: 'bg-slate-800/60 text-slate-300',
    cyan: 'bg-cyan-500/10 text-cyan-400',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    red: 'bg-red-500/10 text-red-400',
  };

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border transition-all duration-200 hover:border-slate-700 shadow-sm relative overflow-hidden',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
            {trend && (
              <span
                className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded',
                  trend.isPositive
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-amber-400 bg-amber-500/10'
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={cn('p-2.5 rounded-xl border border-slate-700/30', iconBg[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
