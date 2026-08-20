import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-glow focus-visible:ring-brand-500',
    secondary: 'bg-white hover:bg-slate-50 text-ink-primary border border-slate-200 shadow-subtle hover:border-slate-300',
    outline: 'bg-transparent border border-slate-300 text-ink-secondary hover:bg-slate-50',
    ghost: 'bg-transparent hover:bg-slate-100 text-ink-secondary hover:text-ink-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5',
  };

  const classes = twMerge(clsx(baseStyles, variants[variant], sizes[size], className));

  if (href) {
    return (
      <a href={href} className={classes} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
