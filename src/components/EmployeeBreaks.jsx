import { useState } from 'react';
import { formatTime, getShiftDuration } from '../scheduler';

let nextEmpId = 4;
let nextBreakId = 100;

const BREAK_PRESETS = [
  { type: 'rest', label: '15-min Rest', duration: 15 },
  { type: 'rest', label: '10-min Rest', duration: 10 },
  { type: 'lunch', label: '30-min Lunch', duration: 30 },
  { type: 'lunch', label: '45-min Lunch', duration: 45 },
  { type: 'lunch', label: '60-min Lunch', duration: 60 },
];

const BREAK_COLORS = {
  rest: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700',
  lunch: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700',
};

function BreakPill({ brk, onRemove, onUpdate }) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${BREAK_COLORS[brk.type] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'}`}>
      <span className="capitalize">{brk.type}</span>
      <input
        type="number"
        min="5"
        max="120"
        step="5"
        value={brk.duration}
        onChange={e => onUpdate({ ...brk, duration: Math.max(5, Number(e.target.value)) })}
        className="w-10 rounded bg-white/60 px-1 py-0 text-center text-xs font-semibold
          dark:bg-white/10 dark:text-inherit"
      />
      <span className="text-[10px] opacity-60">min</span>
      <button
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors dark:hover:bg-white/10"
        aria-label="Remove break"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function EmployeeBreaks({ employees, onChange, globalShiftStart, globalShiftEnd, use24h }) {
  const [addingPreset, setAddingPreset] = useState(null);

  function addEmployee() {
    const id = nextEmpId++;
    onChange([
      ...employees,
      {
        id,
        name: `Employee ${id}`,
        shiftStart: '',
        shiftEnd: '',
        breaks: [
          { id: nextBreakId++, type: 'rest', duration: 15 },
          { id: nextBreakId++, type: 'rest', duration: 15 },
          { id: nextBreakId++, type: 'lunch', duration: 30 },
        ],
      },
    ]);
  }

  function removeEmployee(empId) {
    onChange(employees.filter(e => e.id !== empId));
  }

  function updateEmployeeName(empId, name) {
    onChange(employees.map(e => e.id === empId ? { ...e, name } : e));
  }

  function updateEmployeeShift(empId, field, value) {
    onChange(employees.map(e => e.id === empId ? { ...e, [field]: value } : e));
  }

  function addBreak(empId, type, duration) {
    onChange(employees.map(e => {
      if (e.id !== empId) return e;
      return { ...e, breaks: [...e.breaks, { id: nextBreakId++, type, duration }] };
    }));
    setAddingPreset(null);
  }

  function removeBreak(empId, breakId) {
    onChange(employees.map(e => {
      if (e.id !== empId) return e;
      return { ...e, breaks: e.breaks.filter(b => b.id !== breakId) };
    }));
  }

  function updateBreak(empId, updatedBreak) {
    onChange(employees.map(e => {
      if (e.id !== empId) return e;
      return { ...e, breaks: e.breaks.map(b => b.id === updatedBreak.id ? updatedBreak : b) };
    }));
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Employees</h2>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600
          dark:bg-gray-700 dark:text-gray-300">
          {employees.length}
        </span>
      </div>

      <div className="space-y-3">
        {employees.map(emp => (
          <div key={emp.id} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3
            dark:border-gray-600 dark:bg-gray-700/50">
            <div className="mb-2 flex items-center gap-2">
              <div
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: getEmployeeColor(employees.indexOf(emp)) }}
              />
              <input
                type="text"
                value={emp.name}
                onChange={e => updateEmployeeName(emp.id, e.target.value)}
                className="min-w-0 flex-1 rounded border-0 bg-transparent px-1 py-0.5 text-sm font-semibold
                  text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-300
                  dark:text-gray-100 dark:focus:bg-gray-700"
              />
              {employees.length > 1 && (
                <button
                  onClick={() => removeEmployee(emp.id)}
                  className="btn-danger shrink-0"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Per-employee shift times */}
            <div className="mb-2 grid grid-cols-[auto_1fr] items-center gap-x-1.5 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Start</label>
              <input
                type="time"
                value={emp.shiftStart || ''}
                placeholder={globalShiftStart}
                onChange={e => updateEmployeeShift(emp.id, 'shiftStart', e.target.value)}
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-xs
                  text-gray-700 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-300
                  sm:w-[7rem] sm:py-0.5
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-brand-400"
              />
              <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">End</label>
              <input
                type="time"
                value={emp.shiftEnd || ''}
                placeholder={globalShiftEnd}
                onChange={e => updateEmployeeShift(emp.id, 'shiftEnd', e.target.value)}
                className="w-full rounded border border-gray-200 bg-white px-1.5 py-1 text-xs
                  text-gray-700 focus:border-brand-400 focus:outline-none focus:ring-1 focus:ring-brand-300
                  sm:w-[7rem] sm:py-0.5
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-brand-400"
              />
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                {(emp.shiftStart || emp.shiftEnd) ? (
                  <>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {(() => {
                        const s = emp.shiftStart || globalShiftStart;
                        const e = emp.shiftEnd || globalShiftEnd;
                        const dur = getShiftDuration(s, e);
                        const h = Math.floor(dur / 60);
                        const m = dur % 60;
                        return `${h}h${m > 0 ? ` ${m}m` : ''}`;
                      })()}
                    </span>
                    <button
                      onClick={() => {
                        onChange(employees.map(e => e.id === emp.id ? { ...e, shiftStart: '', shiftEnd: '' } : e));
                      }}
                      className="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      reset
                    </button>
                  </>
                ) : (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">uses global shift</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {emp.breaks.map(brk => (
                <BreakPill
                  key={brk.id}
                  brk={brk}
                  onRemove={() => removeBreak(emp.id, brk.id)}
                  onUpdate={updated => updateBreak(emp.id, updated)}
                />
              ))}

              {addingPreset === emp.id ? (
                <div className="flex flex-wrap gap-1">
                  {BREAK_PRESETS.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => addBreak(emp.id, preset.type, preset.duration)}
                      className="rounded-full border border-dashed border-gray-300 px-2 py-0.5
                        text-[11px] text-gray-500 transition-colors hover:border-brand-400
                        hover:bg-brand-50 hover:text-brand-700
                        dark:border-gray-500 dark:text-gray-400 dark:hover:border-brand-400
                        dark:hover:bg-brand-900/30 dark:hover:text-brand-300"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setAddingPreset(null)}
                    className="px-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingPreset(emp.id)}
                  className="rounded-full border border-dashed border-gray-300 px-2.5 py-1
                    text-xs text-gray-400 transition-colors hover:border-brand-400
                    hover:text-brand-600
                    dark:border-gray-500 dark:text-gray-500 dark:hover:border-brand-400
                    dark:hover:text-brand-400"
                >
                  + break
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addEmployee} className="btn-secondary w-full py-2.5 sm:py-2">
        + Add Employee
      </button>
    </div>
  );
}

const EMPLOYEE_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6',
  '#e11d48', '#84cc16', '#0ea5e9', '#d946ef', '#64748b',
];

export function getEmployeeColor(index) {
  return EMPLOYEE_COLORS[index % EMPLOYEE_COLORS.length];
}
