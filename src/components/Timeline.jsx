import { formatTime, shiftMinutesToClock, timeToMinutes } from '../scheduler';
import { getEmployeeColor } from './EmployeeBreaks';

const BREAK_TYPE_STYLES = {
  rest: { pattern: '', opacity: 0.85 },
  lunch: { pattern: 'striped', opacity: 0.95 },
};

export default function Timeline({ schedule, conflicts, shiftDuration, shiftStart, employees, avoidTimes, use24h }) {
  if (!schedule || schedule.length === 0) return null;

  const markerInterval = shiftDuration > 600 ? 60 : 30;
  const markers = [];
  for (let t = 0; t <= shiftDuration; t += markerInterval) {
    markers.push(t);
  }

  const avoidRanges = (avoidTimes || []).map(a => {
    const startMins = timeToMinutes(a.start);
    const shiftStartMins = timeToMinutes(shiftStart);
    let relStart = startMins - shiftStartMins;
    if (relStart < 0) relStart += 1440;
    const endMins = timeToMinutes(a.end);
    let relEnd = endMins - shiftStartMins;
    if (relEnd < 0) relEnd += 1440;
    return { start: relStart, end: relEnd, note: a.note };
  });

  const empSchedules = {};
  for (const emp of employees) {
    empSchedules[emp.id] = schedule.filter(s => s.employeeId === emp.id);
  }

  const conflictRanges = conflicts.map(c => ({
    start: c.overlapStart,
    end: c.overlapEnd,
  }));

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Timeline</h3>

      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[540px] rounded-lg border border-gray-200 bg-white p-3 sm:min-w-[600px] sm:p-4
          dark:border-gray-700 dark:bg-gray-800">
          {/* Time axis */}
          <div className="relative mb-1 ml-20 h-6 sm:ml-28">
            {markers.map(t => (
              <div
                key={t}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${(t / shiftDuration) * 100}%` }}
              >
                <div className="h-2 w-px bg-gray-300 dark:bg-gray-600" />
                <span className="mt-0.5 whitespace-nowrap text-[9px] text-gray-400 sm:text-[10px] dark:text-gray-500">
                  {formatTime(shiftMinutesToClock(t, shiftStart), use24h)}
                </span>
              </div>
            ))}
          </div>

          {/* Employee rows */}
          <div className="relative">
            {avoidRanges.map((ar, i) => (
              <div
                key={`avoid-${i}`}
                className="pointer-events-none absolute inset-y-0 ml-20 bg-red-50 opacity-40 sm:ml-28
                  dark:bg-red-900/30"
                style={{
                  left: `calc(5rem + ${(ar.start / shiftDuration) * (100)}% * (100% - 5rem) / 100%)`,
                  width: `${((ar.end - ar.start) / shiftDuration) * 100}%`,
                }}
              />
            ))}

            {employees.map((emp, empIdx) => {
              const breaks = empSchedules[emp.id] || [];
              const color = getEmployeeColor(empIdx);

              return (
                <div key={emp.id} className="flex items-center gap-1.5 py-1.5 sm:gap-2">
                  <div className="flex w-20 shrink-0 items-center gap-1.5 sm:w-28 sm:gap-2">
                    <div
                      className="h-2 w-2 shrink-0 rounded-full sm:h-2.5 sm:w-2.5"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate text-[11px] font-medium text-gray-700 sm:text-xs dark:text-gray-300">
                      {emp.name}
                    </span>
                  </div>

                  <div className="relative h-8 flex-1 rounded bg-gray-100 dark:bg-gray-700">
                    {avoidRanges.map((ar, i) => (
                      <div
                        key={`ar-${i}`}
                        className="absolute inset-y-0 rounded bg-red-100/50 dark:bg-red-900/30"
                        style={{
                          left: `${(ar.start / shiftDuration) * 100}%`,
                          width: `${(Math.max(1, ar.end - ar.start) / shiftDuration) * 100}%`,
                        }}
                      />
                    ))}

                    {breaks.map(brk => {
                      const left = (brk.startShiftMin / shiftDuration) * 100;
                      const width = (brk.duration / shiftDuration) * 100;
                      const isConflict = conflictRanges.some(cr =>
                        brk.startShiftMin < cr.end && brk.endShiftMin > cr.start &&
                        brk.employeeId === emp.id
                      );

                      return (
                        <div
                          key={brk.breakId}
                          className={`absolute inset-y-0.5 flex items-center justify-center rounded-md
                            text-[10px] font-semibold text-white shadow-sm transition-all
                            ${isConflict ? 'ring-2 ring-red-400 ring-offset-1 dark:ring-offset-gray-800' : ''}
                            ${brk.type === 'lunch' ? 'bg-stripes' : ''}`}
                          style={{
                            left: `${left}%`,
                            width: `${Math.max(width, 1.5)}%`,
                            backgroundColor: color,
                            opacity: BREAK_TYPE_STYLES[brk.type]?.opacity || 0.85,
                          }}
                          title={`${brk.employeeName}: ${brk.type} (${formatTime(brk.startTime, use24h)} - ${formatTime(brk.endTime, use24h)})`}
                        >
                          <span className="truncate px-1">
                            {brk.type === 'lunch' ? 'L' : 'R'}
                          </span>
                        </div>
                      );
                    })}

                    {conflicts
                      .filter(c => c.employee1 === emp.name || c.employee2 === emp.name)
                      .map((c, i) => (
                        <div
                          key={`conflict-${i}`}
                          className="absolute -top-1 flex h-3 w-3 items-center justify-center"
                          style={{
                            left: `${(c.overlapStart / shiftDuration) * 100}%`,
                          }}
                          title={`Conflict: ${c.employee1} & ${c.employee2}`}
                        >
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3 sm:gap-4 dark:border-gray-700">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-3 w-5 rounded bg-gray-400" />
              Rest (R)
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-3 w-5 rounded bg-gray-500 bg-stripes" />
              Lunch (L)
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              Conflict
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
              <div className="h-3 w-5 rounded bg-red-100 dark:bg-red-900/50" />
              Avoid zone
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
