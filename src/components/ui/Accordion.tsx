import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId || items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={twMerge('space-y-3.5', className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={clsx(
              'border rounded-xl transition-all duration-200 overflow-hidden bg-white',
              isOpen ? 'border-brand-300 shadow-subtle ring-1 ring-brand-100' : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <button
              type="button"
              id={`faq-btn-${item.id}`}
              aria-expanded={isOpen}
              aria-controls={`faq-content-${item.id}`}
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left font-semibold text-ink-primary hover:text-brand-600 transition-colors"
            >
              <span className="text-base sm:text-lg">{item.question}</span>
              <div
                className={clsx(
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-200',
                  isOpen ? 'bg-brand-50 text-brand-600 rotate-180' : 'bg-slate-100 text-slate-500'
                )}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
            {isOpen && (
              <div
                id={`faq-content-${item.id}`}
                role="region"
                aria-labelledby={`faq-btn-${item.id}`}
                className="px-4 sm:px-5 pb-5 pt-0 text-sm sm:text-base text-ink-secondary leading-relaxed border-t border-slate-100 pt-3.5"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
