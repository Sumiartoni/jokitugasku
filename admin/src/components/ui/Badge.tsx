import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'brand', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide';
  
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/80',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}
