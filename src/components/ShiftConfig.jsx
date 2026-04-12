import { getShiftDuration, formatTime } from '../scheduler';

export default function ShiftConfig({ config, onChange, use24h }) {
  const duration = getShiftDuration(config.shiftStart, config.shiftEnd);
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Shift Details</h2>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Shift Start
          </label>
          <input
            type="time"
            className="input-field"
            value={config.shiftStart}
            onChange={e => onChange({ ...config, shiftStart: e.target.value })}
          />
          {!use24h && (
            <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
              {formatTime(config.shiftStart, false)}
            </span>
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Shift End
          </label>
          <input
            type="time"
            className="input-field"
            value={config.shiftEnd}
            onChange={e => onChange({ ...config, shiftEnd: e.target.value })}
          />
          {!use24h && (
            <span className="mt-0.5 block text-xs text-gray-400 dark:text-gray-500">
              {formatTime(config.shiftEnd, false)}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800
        dark:bg-brand-900/30 dark:text-brand-300">
        Shift duration: <strong>{hours}h {mins > 0 ? `${mins}m` : ''}</strong>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          First Break Delay
        </label>
        <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
          Minimum time after shift start before first break
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="30"
            max="180"
            step="15"
            value={config.firstBreakDelay}
            onChange={e => onChange({ ...config, firstBreakDelay: Number(e.target.value) })}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600
              dark:bg-gray-600 dark:accent-brand-400"
          />
          <span className="w-14 rounded-md bg-gray-100 px-2 py-1 text-center text-sm font-semibold tabular-nums
            dark:bg-gray-700 dark:text-gray-200">
            {config.firstBreakDelay >= 60
              ? `${Math.floor(config.firstBreakDelay / 60)}h${config.firstBreakDelay % 60 > 0 ? ` ${config.firstBreakDelay % 60}m` : ''}`
              : `${config.firstBreakDelay}m`}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Break Spacing (minutes)
        </label>
        <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">
          Minimum gap between breaks for different employees
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={config.spacingMinutes}
            onChange={e => onChange({ ...config, spacingMinutes: Number(e.target.value) })}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-brand-600
              dark:bg-gray-600 dark:accent-brand-400"
          />
          <span className="w-14 rounded-md bg-gray-100 px-2 py-1 text-center text-sm font-semibold tabular-nums
            dark:bg-gray-700 dark:text-gray-200">
            {config.spacingMinutes}m
          </span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Separation Rules
        </label>
        <div className="space-y-2">
          <Toggle
            label="Stagger lunch breaks"
            description="No two employees on lunch at the same time"
            checked={config.separateLunches}
            onChange={v => onChange({ ...config, separateLunches: v })}
            color="amber"
          />
          <Toggle
            label="Stagger rest breaks"
            description="No two employees on a rest break at the same time"
            checked={config.separateRests}
            onChange={v => onChange({ ...config, separateRests: v })}
            color="teal"
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, checked, onChange, color }) {
  const colors = {
    amber: {
      track: checked ? 'bg-amber-500 dark:bg-amber-400' : 'bg-gray-200 dark:bg-gray-600',
      thumb: 'bg-white',
    },
    teal: {
      track: checked ? 'bg-teal-500 dark:bg-teal-400' : 'bg-gray-200 dark:bg-gray-600',
      thumb: 'bg-white',
    },
  };
  const c = colors[color] ?? colors.teal;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5
        text-left transition-colors hover:border-gray-300
        dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
    >
      {/* Track */}
      <span className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${c.track}`}>
        <span className={`inline-block h-3.5 w-3.5 rounded-full shadow transition-transform ${c.thumb}
          ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        <span className="block text-[11px] text-gray-400 dark:text-gray-500">{description}</span>
      </span>
    </button>
  );
}
