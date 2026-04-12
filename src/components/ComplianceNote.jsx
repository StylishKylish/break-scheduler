import { useState } from 'react';

export default function ComplianceNote() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card overflow-hidden border-brand-200 bg-brand-50/50
      dark:border-brand-800 dark:bg-brand-900/20">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="flex w-full items-center gap-2 text-left"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-brand-600
          dark:bg-brand-900/50 dark:text-brand-400">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="flex-1 text-xs font-semibold text-brand-800 dark:text-brand-300">
          Oregon &amp; Federal Labor Law Compliance
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-brand-400 transition-transform duration-200
            ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-brand-200/60 pt-3 dark:border-brand-800/60">
          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Meal Periods (OAR 839-020-0050)
            </h4>
            <ul className="space-y-1 text-xs leading-relaxed text-brand-900/80 dark:text-brand-200/80">
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                30-min meal required when shift is 6+ hours
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                6&ndash;7h shifts: meal starts after hour 2, completed before hour 5
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                7+h shifts: meal starts after hour 3, completed before hour 6
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                14+h shifts require 2 meal periods; 22+h require 3
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Rest Breaks (OAR 839-020-0050)
            </h4>
            <ul className="space-y-1 text-xs leading-relaxed text-brand-900/80 dark:text-brand-200/80">
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                10-min paid rest per 4-hour segment (or major portion &gt;2h01m)
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Must be taken approximately in the middle of each work segment
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Cannot be combined with or placed adjacent to meal periods
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Cannot be added to the start or end of a shift
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              Algorithm Enforcement
            </h4>
            <ul className="space-y-1 text-xs leading-relaxed text-brand-900/80 dark:text-brand-200/80">
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Minimum 30-minute gap enforced between any employee's own breaks
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Meal periods auto-constrained to legal timing windows
              </li>
              <li className="flex gap-1.5">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                Rest breaks target midpoints of work segments between meals
              </li>
            </ul>
          </div>

          <p className="border-t border-brand-200/60 pt-2 text-[10px] italic text-brand-600/70
            dark:border-brand-800/60 dark:text-brand-400/60">
            This tool is a scheduling aid, not legal advice. Verify compliance with your organization's
            policies and BOLI guidance. Federal (FLSA) does not mandate breaks but defers to state law
            where it provides greater protection.
          </p>
        </div>
      )}
    </div>
  );
}
