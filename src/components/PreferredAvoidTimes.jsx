export default function PreferredAvoidTimes({ preferred, avoid, onPreferredChange, onAvoidChange }) {
  return (
    <div className="card space-y-5">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Time Preferences</h2>

      {/* Preferred Times */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Preferred Break Times
        </h3>
        <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">Algorithm will try to schedule breaks near these times</p>
        <div className="space-y-2">
          {preferred.map((pref, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="time"
                value={pref.time}
                onChange={e => {
                  const updated = [...preferred];
                  updated[i] = { ...pref, time: e.target.value };
                  onPreferredChange(updated);
                }}
                className="input-field w-28 sm:w-32"
              />
              <input
                type="text"
                placeholder="Note (optional)"
                value={pref.note}
                onChange={e => {
                  const updated = [...preferred];
                  updated[i] = { ...pref, note: e.target.value };
                  onPreferredChange(updated);
                }}
                className="input-field min-w-0 flex-1"
              />
              <button
                onClick={() => onPreferredChange(preferred.filter((_, j) => j !== i))}
                className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600
                  dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => onPreferredChange([...preferred, { time: '12:00', note: '' }])}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700
              dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            + Add preferred time
          </button>
        </div>
      </div>

      {/* Avoid Times */}
      <div>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728l-12.728-12.728" />
          </svg>
          Times to Avoid
        </h3>
        <p className="mb-2 text-xs text-gray-400 dark:text-gray-500">Breaks will only be placed here as a last resort</p>
        <div className="space-y-2">
          {avoid.map((av, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <input
                type="time"
                value={av.start}
                onChange={e => {
                  const updated = [...avoid];
                  updated[i] = { ...av, start: e.target.value };
                  onAvoidChange(updated);
                }}
                className="input-field w-[calc(50%-2rem)] sm:w-28"
              />
              <span className="text-xs text-gray-400 dark:text-gray-500">to</span>
              <input
                type="time"
                value={av.end}
                onChange={e => {
                  const updated = [...avoid];
                  updated[i] = { ...av, end: e.target.value };
                  onAvoidChange(updated);
                }}
                className="input-field w-[calc(50%-2rem)] sm:w-28"
              />
              <div className="flex w-full items-center gap-2 sm:w-auto sm:flex-1">
                <input
                  type="text"
                  placeholder="Reason"
                  value={av.note}
                  onChange={e => {
                    const updated = [...avoid];
                    updated[i] = { ...av, note: e.target.value };
                    onAvoidChange(updated);
                  }}
                  className="input-field min-w-0 flex-1"
                />
                <button
                  onClick={() => onAvoidChange(avoid.filter((_, j) => j !== i))}
                  className="shrink-0 rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600
                    dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => onAvoidChange([...avoid, { start: '12:00', end: '13:00', note: '' }])}
            className="text-xs font-medium text-red-600 hover:text-red-700
              dark:text-red-400 dark:hover:text-red-300"
          >
            + Add time to avoid
          </button>
        </div>
      </div>
    </div>
  );
}
