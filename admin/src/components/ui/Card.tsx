import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge('bg-white rounded-2xl border border-slate-200/90 shadow-subtle', className)} {...props}>
      {children}
    </div>
  );
}
