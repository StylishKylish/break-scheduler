// TODO: Update the liveUrl for the Break Scheduler once deployed to Vercel.
// Add more projects by duplicating the object structure below.
const PROJECTS = [
  {
    name: 'Waterfall Break Scheduler',
    tagline: 'Automated break scheduling for overnight & shift-based teams',
    description:
      'Built to solve a real problem: manually spacing out employee breaks on overnight shifts is tedious, error-prone, and often unfair. This tool takes a shift window and employee list, then automatically generates a staggered break schedule that maintains floor coverage, respects labor rules (5-hour lunch rule), and avoids blackout times.',
    tech: ['React', 'Tailwind CSS', 'Vite', 'Scheduling Algorithm'],
    highlights: [
      'Handles overnight shifts and per-employee start times',
      'Visual Gantt-style timeline + clean table view',
      'Floor coverage chart with low-coverage warnings',
      'Dark mode, mobile-first, deploy-ready',
    ],
    liveUrl: 'https://break-scheduler-gamma.vercel.app',
    githubUrl: 'https://github.com/StylishKylish/break-scheduler',
    accent: 'brand',
  },
  // TODO: Add more projects here. Example structure:
  // {
  //   name: 'Your Next Project',
  //   tagline: 'Short one-liner',
  //   description: 'What it does and why you built it.',
  //   tech: ['Tool 1', 'Tool 2'],
  //   highlights: ['Key feature 1', 'Key feature 2'],
  //   liveUrl: 'https://...',
  //   githubUrl: 'https://...',
  //   accent: 'emerald',
  // },
];

const accentMap = {
  brand:   { bg: 'bg-brand-600',   text: 'text-brand-600',   light: 'bg-brand-50 text-brand-700 border-brand-200',   darkLight: 'dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50 text-emerald-700 border-emerald-200', darkLight: 'dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' },
  violet:  { bg: 'bg-violet-600',  text: 'text-violet-600',  light: 'bg-violet-50 text-violet-700 border-violet-200',  darkLight: 'dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800' },
};

export default function Projects() {
  return (
    <section id="projects" className="bg-gray-50 py-20 sm:py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="section-label">Projects</p>
        <h2 className="section-heading">Things I've built</h2>

        <div className="space-y-6">
          {PROJECTS.map(proj => {
            const a = accentMap[proj.accent] ?? accentMap.brand;
            return (
              <div key={proj.name} className="card overflow-hidden">
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* Left: accent bar + info */}
                  <div className="flex gap-5 lg:flex-1">
                    <div className={`hidden w-1 shrink-0 rounded-full sm:block ${a.bg}`} />
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-extrabold text-gray-900 dark:text-gray-100">
                        {proj.name}
                      </h3>
                      <p className={`mb-3 text-sm font-semibold ${a.text}`}>{proj.tagline}</p>
                      <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {proj.description}
                      </p>

                      {/* Tech badges */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {proj.tech.map(t => (
                          <span key={t} className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${a.light} ${a.darkLight}`}>
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-lg ${a.bg} px-4 py-2 text-xs font-semibold text-white
                            shadow-sm transition-all hover:opacity-90 hover:shadow-md`}
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2
                            text-xs font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow-md
                            dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          Source Code
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right: highlights */}
                  <div className="shrink-0 rounded-xl bg-gray-50 p-4 dark:bg-gray-700/50 lg:w-64">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      Highlights
                    </p>
                    <ul className="space-y-2">
                      {proj.highlights.map(h => (
                        <li key={h} className="flex gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${a.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
