import { formatTime } from '../scheduler';

export default function ConflictBanner({ conflicts, use24h }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4
      dark:border-red-800 dark:bg-red-900/30">
      <div className="mb-2 flex items-center gap-2">
        <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
          {conflicts.length} Break Conflict{conflicts.length > 1 ? 's' : ''} Detected
        </h3>
      </div>
      <p className="mb-3 text-xs text-red-600 dark:text-red-400">
        These employees have overlapping breaks. Try increasing the spacing parameter or adjusting break times.
      </p>
      <ul className="space-y-1">
        {conflicts.map((c, i) => (
          <li key={i} className="flex flex-wrap items-center gap-1 text-xs text-red-700 sm:gap-2 dark:text-red-300">
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            <strong>{c.employee1}</strong>
            <span>&amp;</span>
            <strong>{c.employee2}</strong>
            <span className="text-red-500 dark:text-red-400">
              {formatTime(c.overlapStartTime, use24h)} - {formatTime(c.overlapEndTime, use24h)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
