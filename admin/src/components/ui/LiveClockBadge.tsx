import React, { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { formatLiveDateTime } from '@/utils/date';

export function LiveClockBadge({ className }: { className?: string }) {
  const [currentDateTime, setCurrentDateTime] = useState<string>(() => formatLiveDateTime(new Date()));

  useEffect(() => {
    // Tick every 1 second
    const interval = setInterval(() => {
      setCurrentDateTime(formatLiveDateTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-mono font-semibold shadow-sm ${className || ''}`}>
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <Clock className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
      <span className="truncate">{currentDateTime}</span>
    </div>
  );
}
