import React from 'react';
import { RetentionClassification } from '../lib/retentionEngine';
import { 
  Sparkles, 
  CheckCircle2, 
  Crown, 
  RefreshCw, 
  Clock, 
  AlertTriangle, 
  Moon, 
  UserX 
} from 'lucide-react';

interface RetentionBadgeProps {
  classification: RetentionClassification;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RETENTION_CONFIG: Record<
  RetentionClassification,
  { label: string; icon: React.ComponentType<{ className?: string }>; bgLight: string; textLight: string; borderLight: string; bgDark: string; textDark: string; borderDark: string; description: string }
> = {
  NEW: {
    label: 'NEW',
    icon: Sparkles,
    bgLight: 'bg-emerald-50',
    textLight: 'text-emerald-700',
    borderLight: 'border-emerald-200',
    bgDark: 'dark:bg-emerald-950/60',
    textDark: 'dark:text-emerald-300',
    borderDark: 'dark:border-emerald-800',
    description: 'Recently registered guest within initial onboarding window.',
  },
  ACTIVE: {
    label: 'ACTIVE',
    icon: CheckCircle2,
    bgLight: 'bg-teal-50',
    textLight: 'text-teal-700',
    borderLight: 'border-teal-200',
    bgDark: 'dark:bg-teal-950/60',
    textDark: 'dark:text-teal-300',
    borderDark: 'dark:border-teal-800',
    description: 'Within expected return cadence.',
  },
  LOYAL: {
    label: 'LOYAL VIP',
    icon: Crown,
    bgLight: 'bg-purple-50',
    textLight: 'text-purple-700',
    borderLight: 'border-purple-200',
    bgDark: 'dark:bg-purple-950/60',
    textDark: 'dark:text-purple-300',
    borderDark: 'dark:border-purple-800',
    description: 'Frequent repeat visitor exceeding loyalty threshold.',
  },
  RETURNING: {
    label: 'RETURNING',
    icon: RefreshCw,
    bgLight: 'bg-sky-50',
    textLight: 'text-sky-700',
    borderLight: 'border-sky-200',
    bgDark: 'dark:bg-sky-950/60',
    textDark: 'dark:text-sky-300',
    borderDark: 'dark:border-sky-800',
    description: 'Successfully re-authenticated after a period of dormancy.',
  },
  COOLING: {
    label: 'COOLING',
    icon: Clock,
    bgLight: 'bg-amber-50',
    textLight: 'text-amber-800',
    borderLight: 'border-amber-300',
    bgDark: 'dark:bg-amber-950/60',
    textDark: 'dark:text-amber-300',
    borderDark: 'dark:border-amber-700',
    description: 'Visit frequency slowing down; exceeded expected return interval.',
  },
  AT_RISK: {
    label: 'AT-RISK',
    icon: AlertTriangle,
    bgLight: 'bg-orange-50',
    textLight: 'text-orange-800',
    borderLight: 'border-orange-300',
    bgDark: 'dark:bg-orange-950/60',
    textDark: 'dark:text-orange-300',
    borderDark: 'dark:border-orange-700',
    description: 'Critical gap between visits. Approaching inactive threshold.',
  },
  INACTIVE: {
    label: 'INACTIVE',
    icon: Moon,
    bgLight: 'bg-slate-100',
    textLight: 'text-slate-700',
    borderLight: 'border-slate-300',
    bgDark: 'dark:bg-slate-800/70',
    textDark: 'dark:text-slate-300',
    borderDark: 'dark:border-slate-700',
    description: 'No authenticated Wi-Fi visits within configured period.',
  },
  POTENTIALLY_LOST: {
    label: 'POTENTIALLY LOST',
    icon: UserX,
    bgLight: 'bg-rose-50',
    textLight: 'text-rose-800',
    borderLight: 'border-rose-300',
    bgDark: 'dark:bg-rose-950/60',
    textDark: 'dark:text-rose-300',
    borderDark: 'dark:border-rose-700',
    description: 'Long-term absence exceeding business recovery threshold.',
  },
};

export const RetentionBadge: React.FC<RetentionBadgeProps> = ({
  classification,
  showIcon = true,
  size = 'md',
}) => {
  const config = RETENTION_CONFIG[classification] || RETENTION_CONFIG.ACTIVE;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${config.bgLight} ${config.textLight} ${config.borderLight} ${config.bgDark} ${config.textDark} ${config.borderDark} ${sizeClasses}`}
      title={`${config.label}: ${config.description}`}
      role="status"
      aria-label={`Customer status: ${config.label}`}
    >
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
