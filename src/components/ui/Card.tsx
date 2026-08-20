import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, children, ...props }: CardProps) {
  const baseStyles = 'bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 transition-all duration-300';
  const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-1' : '';

  return (
    <div className={twMerge(clsx(baseStyles, hoverStyles, className))} {...props}>
      {children}
    </div>
  );
}
