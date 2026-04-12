// TODO: Replace ALL entries below with your real work history.
// Add or remove objects as needed. Keep start/end as month + year strings.
const EXPERIENCE = [
  {
    company: 'Your Most Recent Employer',
    role: 'Operations Manager',
    start: 'Jan 2022',
    end: 'Present',
    bullets: [
      'Led a team of 15 across multiple shifts, improving scheduling efficiency by 30%.',
      'Designed and launched internal tooling to reduce manual break scheduling from 45 min to under 5 min per shift.',
      'Partnered with HR to revise onboarding process, cutting ramp time for new hires by 2 weeks.',
    ],
  },
  {
    company: 'Previous Employer',
    role: 'Team Lead / Supervisor',
    start: 'Jun 2019',
    end: 'Dec 2021',
    bullets: [
      'Managed daily floor operations for a 24/7 facility with overnight and rotating shifts.',
      'Identified and resolved recurring coverage gaps that had persisted across two previous managers.',
      'Trained 10+ new team members on SOPs and compliance procedures.',
    ],
  },
  {
    company: 'Earlier Role',
    role: 'Operations Associate',
    start: 'Mar 2017',
    end: 'May 2019',
    bullets: [
      'Supported shift supervisors with scheduling, inventory, and floor coordination.',
      'Recognized for consistently identifying process improvements and documenting new procedures.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="bg-gray-50 py-20 sm:py-24 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="section-label">Experience</p>
        <h2 className="section-heading">Work history</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-2 hidden h-full w-px bg-gray-200 sm:block dark:bg-gray-800" />

          <div className="space-y-10">
            {EXPERIENCE.map((job, i) => (
              <div key={i} className="sm:pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 hidden h-2 w-2 -translate-x-[3px] translate-y-2 rounded-full
                  bg-brand-500 ring-4 ring-gray-50 sm:block dark:ring-gray-950" />

                <div className="card">
                  <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">{job.role}</h3>
                      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">{job.company}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500
                      dark:bg-gray-700 dark:text-gray-400">
                      {job.start} &mdash; {job.end}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {job.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
