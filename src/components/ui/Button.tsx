import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-glow focus-visible:ring-brand-500',
    secondary: 'bg-white hover:bg-slate-50 text-ink-primary border border-slate-200 shadow-subtle hover:border-slate-300 focus-visible:ring-slate-400',
    outline: 'bg-transparent border-2 border-brand-500 text-brand-600 hover:bg-brand-50 focus-visible:ring-brand-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-ink-secondary hover:text-ink-primary',
    whatsapp: 'bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-md hover:shadow-lg focus-visible:ring-[#25D366]',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
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
