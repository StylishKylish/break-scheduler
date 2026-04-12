import { formatTime } from '../scheduler';
import { getEmployeeColor } from './EmployeeBreaks';

export default function ScheduleTable({ schedule, employees, use24h }) {
  if (!schedule || schedule.length === 0) return null;

  const grouped = {};
  for (const emp of employees) {
    grouped[emp.id] = {
      name: emp.name,
      breaks: schedule
        .filter(s => s.employeeId === emp.id)
        .sort((a, b) => a.startShiftMin - b.startShiftMin),
    };
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Schedule Table</h3>

      <div className="-mx-4 overflow-x-auto sm:mx-0">
        <div className="min-w-[420px] sm:min-w-0">
          <div className="rounded-lg border border-gray-200 sm:rounded-lg dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4
                    dark:text-gray-400">
                    Employee
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4
                    dark:text-gray-400">
                    Type
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4
                    dark:text-gray-400">
                    Start
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4
                    dark:text-gray-400">
                    End
                  </th>
                  <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-4
                    dark:text-gray-400">
                    Dur.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-700 dark:bg-gray-800/50">
                {employees.map((emp, empIdx) => {
                  const empBreaks = grouped[emp.id]?.breaks || [];
                  return empBreaks.map((brk, brkIdx) => (
                    <tr
                      key={`${emp.id}-${brk.breakId}`}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      {brkIdx === 0 ? (
                        <td
                          className="px-3 py-2 font-medium sm:px-4 dark:text-gray-200"
                          rowSpan={empBreaks.length}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: getEmployeeColor(empIdx) }}
                            />
                            <span className="truncate">{emp.name}</span>
                          </div>
                        </td>
                      ) : null}
                      <td className="px-3 py-2 sm:px-4">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize
                          ${brk.type === 'lunch'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                          {brk.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 tabular-nums sm:px-4 dark:text-gray-300">
                        {formatTime(brk.startTime, use24h)}
                      </td>
                      <td className="px-3 py-2 tabular-nums sm:px-4 dark:text-gray-300">
                        {formatTime(brk.endTime, use24h)}
                      </td>
                      <td className="px-3 py-2 tabular-nums sm:px-4 dark:text-gray-300">{brk.duration}m</td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
