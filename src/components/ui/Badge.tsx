import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'success' | 'outline';
}

export function Badge({ className, variant = 'brand', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full tracking-wide';
  
  const variants = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
}
