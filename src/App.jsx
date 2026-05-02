import { useState, useCallback, useEffect } from 'react';
import ShiftConfig from './components/ShiftConfig';
import EmployeeBreaks from './components/EmployeeBreaks';
import PreferredAvoidTimes from './components/PreferredAvoidTimes';
import Timeline from './components/Timeline';
import ScheduleTable from './components/ScheduleTable';
import CoverageChart from './components/CoverageChart';
import ConflictBanner from './components/ConflictBanner';
import ComplianceNote from './components/ComplianceNote';
import { generateSchedule, formatTime } from './scheduler';

const DEFAULT_CONFIG = {
  shiftStart: '18:30',
  shiftEnd: '05:00',
  spacingMinutes: 45,
  firstBreakDelay: 120,
  separateLunches: true,
  separateRests: true,
};

const DEFAULT_EMPLOYEES = [
  {
    id: 1,
    name: 'Alice',
    shiftStart: '',
    shiftEnd: '',
    breaks: [
      { id: 1, type: 'rest', duration: 15 },
      { id: 2, type: 'rest', duration: 15 },
      { id: 3, type: 'lunch', duration: 30 },
    ],
  },
  {
    id: 2,
    name: 'Bob',
    shiftStart: '',
    shiftEnd: '',
    breaks: [
      { id: 4, type: 'rest', duration: 15 },
      { id: 5, type: 'rest', duration: 15 },
      { id: 6, type: 'lunch', duration: 30 },
    ],
  },
  {
    id: 3,
    name: 'Charlie',
    shiftStart: '',
    shiftEnd: '',
    breaks: [
      { id: 7, type: 'rest', duration: 15 },
      { id: 8, type: 'rest', duration: 15 },
      { id: 9, type: 'lunch', duration: 30 },
    ],
  },
];

export default function App() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [employees, setEmployees] = useState(DEFAULT_EMPLOYEES);
  const [preferredTimes, setPreferredTimes] = useState([]);
  const [avoidTimes, setAvoidTimes] = useState([]);
  const [result, setResult] = useState(null);
  const [activeView, setActiveView] = useState('timeline');
  const [use24h, setUse24h] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleGenerate = useCallback(() => {
    const res = generateSchedule({
      ...config,
      employees,
      preferredTimes,
      avoidTimes,
    });
    setResult(res);
  }, [config, employees, preferredTimes, avoidTimes]);

  const handleClear = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand-50/30
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm
        dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm sm:h-9 sm:w-9
              dark:bg-brand-500">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 sm:text-xl dark:text-gray-100">Waterfall Break Scheduler</h1>
              <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Space out employee breaks to maintain floor coverage</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Military time toggle */}
            <button
              onClick={() => setUse24h(prev => !prev)}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold
                transition-all sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs ${use24h
                  ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/50 dark:text-brand-300'
                  : 'border-gray-200 bg-white text-gray-500 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              aria-label="Toggle military time"
            >
              <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {use24h ? '24H' : '12H'}
            </button>
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition-colors
                hover:text-gray-600 sm:p-2
                dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <a
              href="https://github.com/StylishKylish/break-scheduler"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 p-1.5 text-gray-400 transition-colors
                hover:text-gray-600 sm:p-2
                dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="View source on GitHub"
            >
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Context Blurb */}
      <section className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 sm:pt-6 lg:pt-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 sm:px-6 sm:py-5
          dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-gray-100">
            Why this tool exists
          </h2>
          <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            In high-volume fulfillment environments like Amazon warehouses, operations run 24/7
            on staggered "waterfall" shift patterns. Floor coverage is critical — when too many
            associates go on break at the same time, rate drops, work backs up, and downstream
            processes stall. Manually scheduling breaks for a shift of 15–30+ employees is
            tedious, error-prone, and often unfair. This tool automates that process: it
            staggers rest breaks and meal periods across employees while respecting Oregon &amp;
            federal labor laws, minimum spacing rules, and preferred/blackout times — so
            managers can generate a compliant, coverage-optimized break schedule in seconds
            instead of spending the first 30 minutes of every shift doing it by hand.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6 lg:py-8">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left Column: Configuration */}
          <div className="space-y-4 sm:space-y-5">
            <ShiftConfig config={config} onChange={setConfig} use24h={use24h} />
            <EmployeeBreaks
              employees={employees}
              onChange={setEmployees}
              globalShiftStart={config.shiftStart}
              globalShiftEnd={config.shiftEnd}
              use24h={use24h}
            />
            <PreferredAvoidTimes
              preferred={preferredTimes}
              avoid={avoidTimes}
              onPreferredChange={setPreferredTimes}
              onAvoidChange={setAvoidTimes}
            />
            {/* Generate Button */}
            <div className="flex gap-3">
              <button onClick={handleGenerate} className="btn-primary flex-1 py-3 sm:py-2.5">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Schedule
              </button>
              {result && (
                <button onClick={handleClear} className="btn-secondary">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-4 sm:space-y-5">
            {!result ? (
              <div className="card flex flex-col items-center justify-center py-12 text-center sm:py-16">
                <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-700">
                  <svg className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">No Schedule Generated</h3>
                <p className="max-w-xs text-xs text-gray-400 dark:text-gray-500">
                  Configure your shift, employees, and breaks, then click "Generate Schedule" to see the waterfall break layout.
                </p>
              </div>
            ) : (
              <>
                <ConflictBanner conflicts={result.conflicts} use24h={use24h} />

                {/* View Toggle */}
                <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                  <button
                    onClick={() => setActiveView('timeline')}
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all sm:py-1.5
                      ${activeView === 'timeline'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setActiveView('table')}
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-all sm:py-1.5
                      ${activeView === 'table'
                        ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    Table
                  </button>
                </div>

                {activeView === 'timeline' ? (
                  <Timeline
                    schedule={result.schedule}
                    conflicts={result.conflicts}
                    shiftDuration={result.shiftDuration}
                    shiftStart={config.shiftStart}
                    employees={employees}
                    avoidTimes={avoidTimes}
                    use24h={use24h}
                  />
                ) : (
                  <ScheduleTable
                    schedule={result.schedule}
                    employees={employees}
                    use24h={use24h}
                  />
                )}

                <CoverageChart
                  coverageData={result.coverageData}
                  employeeCount={employees.length}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-gray-200 bg-white/60 sm:mt-12 dark:border-gray-800 dark:bg-gray-900/60">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <ComplianceNote />
          <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            Waterfall Break Scheduler &mdash; Built with React &amp; Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
