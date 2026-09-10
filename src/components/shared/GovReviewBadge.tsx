import React from 'react';
import { GovReviewStatus } from '@/types';
import { cn } from '@/lib/utils';
import { ShieldCheck, Clock, HelpCircle, XCircle } from 'lucide-react';

interface GovReviewBadgeProps {
  status: GovReviewStatus | string;
  size?: 'sm' | 'md';
  detailed?: boolean;
  className?: string;
}

export function GovReviewBadge({
  status,
  size = 'sm',
  detailed = false,
  className,
}: GovReviewBadgeProps) {
  const norm = status as GovReviewStatus;

  switch (norm) {
    case 'GOVERNMENT_APPROVED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-medium rounded-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
            className
          )}
          title="Government Acceptance: The reported field evidence has been officially reviewed and accepted. Engineering baseline schedule remains intact."
        >
          <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>{detailed ? 'Gov Monitoring Accepted (Baseline Intact)' : 'Gov Approved'}</span>
        </span>
      );

    case 'CLARIFICATION_REQUESTED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-medium rounded-md border bg-amber-500/10 text-amber-400 border-amber-500/30',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
            className
          )}
          title="Government Authority has requested formal engineering clarification before acceptance."
        >
          <HelpCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Clarification Requested</span>
        </span>
      );

    case 'GOVERNMENT_REJECTED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-medium rounded-md border bg-red-500/10 text-red-400 border-red-500/30',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
            className
          )}
          title="Government rejected the reported field claim due to lack of verifiable evidence."
        >
          <XCircle className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Gov Rejected</span>
        </span>
      );

    case 'PENDING_REVIEW':
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-medium rounded-md border bg-slate-800/80 text-slate-400 border-slate-700/60',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
            className
          )}
          title="Awaiting Government Compliance Officer Review"
        >
          <Clock className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          <span>Gov Review Pending</span>
        </span>
      );
  }
}
