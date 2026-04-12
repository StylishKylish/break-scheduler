// TODO: Update these skill categories and badges to reflect your actual skills.
const SKILLS = [
  {
    category: 'Operations',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    items: ['Workforce Scheduling', 'Shift Management', 'SOP Development', 'Coverage Planning', 'KPI Tracking', 'Labor Compliance'],
  },
  {
    category: 'Leadership',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: ['Team Development', 'Performance Reviews', 'Conflict Resolution', 'Training & Onboarding', 'Cross-dept Collaboration', 'Change Management'],
  },
  {
    category: 'Technical',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    items: ['React', 'JavaScript', 'Tailwind CSS', 'Excel / Google Sheets', 'Data Visualization', 'Process Automation'],
  },
  {
    category: 'Tools',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    items: ['ADP / WFM Systems', 'Slack & Teams', 'Notion / Confluence', 'Git & GitHub', 'Vercel', 'VS Code'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="bg-white py-20 sm:py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="section-label">Skills</p>
        <h2 className="section-heading">What I bring to the table</h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {SKILLS.map(group => (
            <div key={group.category} className="card">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600
                  dark:bg-brand-900/30 dark:text-brand-400">
                  {group.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{group.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map(item => (
                  <span key={item} className="skill-badge">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
