export default function CoverageChart({ coverageData, employeeCount }) {
  if (!coverageData || coverageData.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Floor Coverage</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        Shows how many employees are working vs. on break throughout the shift
      </p>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[420px] rounded-lg border border-gray-200 bg-white p-3 sm:min-w-[500px] sm:p-4
          dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-end gap-0.5 sm:gap-1" style={{ height: '100px' }}>
            {coverageData.map((slot, i) => {
              const barHeight = employeeCount > 0
                ? (slot.working / employeeCount) * 100
                : 100;
              const isLow = slot.working <= 1 && employeeCount > 1;

              return (
                <div
                  key={i}
                  className="group relative flex-1"
                  style={{ height: '100%' }}
                >
                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2
                    whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[10px] text-white
                    opacity-0 shadow-lg transition-opacity group-hover:opacity-100
                    dark:bg-gray-200 dark:text-gray-900">
                    {slot.time}: {slot.working} working, {slot.onBreak} on break
                  </div>

                  <div className="flex h-full flex-col justify-end">
                    {slot.onBreak > 0 && (
                      <div
                        className={`w-full rounded-t transition-all ${isLow ? 'bg-red-400' : 'bg-amber-400 dark:bg-amber-500'}`}
                        style={{
                          height: `${(slot.onBreak / employeeCount) * 100}%`,
                          minHeight: slot.onBreak > 0 ? '2px' : '0',
                        }}
                      />
                    )}
                    <div
                      className={`w-full transition-all ${isLow ? 'bg-red-200 dark:bg-red-800' : 'bg-brand-400 dark:bg-brand-500'}`}
                      style={{
                        height: `${barHeight}%`,
                        minHeight: '2px',
                        borderRadius: slot.onBreak > 0 ? '0' : '4px 4px 0 0',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 flex gap-0.5 sm:gap-1">
            {coverageData.map((slot, i) => (
              <div key={i} className="flex-1 text-center">
                {i % Math.max(1, Math.floor(coverageData.length / 8)) === 0 ? (
                  <span className="text-[8px] text-gray-400 sm:text-[9px] dark:text-gray-500">
                    {slot.time.slice(0, 5)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-2 sm:gap-4 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-2.5 w-4 rounded bg-brand-400 dark:bg-brand-500" />
              Working
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-2.5 w-4 rounded bg-amber-400 dark:bg-amber-500" />
              On break
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-2.5 w-4 rounded bg-red-400" />
              Low coverage
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
