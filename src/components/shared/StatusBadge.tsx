import React from 'react';
import { TaskStatus } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, AlertCircle, AlertOctagon, RotateCcw, SendHorizontal, Eye } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus | string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className }: StatusBadgeProps) {
  const norm = status?.toUpperCase() as TaskStatus;

  const config: Record<
    TaskStatus,
    { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    PLANNED: {
      label: 'Planned',
      classes: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
      icon: Clock,
    },
    IN_PROGRESS: {
      label: 'In Progress',
      classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      icon: Clock,
    },
    SUBMITTED: {
      label: 'Submitted',
      classes: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      icon: SendHorizontal,
    },
    UNDER_REVIEW: {
      label: 'AI / PM Review',
      classes: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      icon: Eye,
    },
    APPROVED: {
      label: 'PM Approved',
      classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: CheckCircle2,
    },
    INCOMPLETE: {
      label: 'Incomplete',
      classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: AlertCircle,
    },
    OVERDUE: {
      label: 'Overdue',
      classes: 'bg-red-500/15 text-red-400 border-red-500/30',
      icon: AlertOctagon,
    },
    COMPLETED: {
      label: 'Completed',
      classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold',
      icon: CheckCircle2,
    },
    REJECTED: {
      label: 'Rejected',
      classes: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: AlertOctagon,
    },
    REVISION_REQUIRED: {
      label: 'Revision Required',
      classes: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      icon: RotateCcw,
    },
  };

  const item = config[norm] || {
    label: status,
    classes: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: Clock,
  };

  const Icon = item.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-md font-mono tracking-tight',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        item.classes,
        className
      )}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {item.label}
    </span>
  );
}
