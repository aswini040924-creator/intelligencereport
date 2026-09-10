import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  target?: number;
  showLabels?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'blue' | 'cyan' | 'emerald' | 'amber' | 'gradient';
  className?: string;
}

export function ProgressBar({
  value,
  target,
  showLabels = false,
  label,
  size = 'md',
  variant = 'blue',
  className,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const clampedTarget = target !== undefined ? Math.min(100, Math.max(0, target)) : undefined;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gradient: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-slate-300">{label || 'Progress'}</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-white font-bold">{clampedValue}%</span>
            {clampedTarget !== undefined && (
              <span className="text-slate-400">(Target: {clampedTarget}%)</span>
            )}
          </div>
        </div>
      )}

      <div className={cn('w-full bg-slate-800 rounded-full overflow-hidden relative', heights[size])}>
        <div
          className={cn('h-full transition-all duration-500 rounded-full', colors[variant])}
          style={{ width: `${clampedValue}%` }}
        />
        {clampedTarget !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-10"
            style={{ left: `${clampedTarget}%` }}
            title={`Target: ${clampedTarget}%`}
          />
        )}
      </div>
    </div>
  );
}
