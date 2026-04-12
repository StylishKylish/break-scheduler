export default function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-24 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <p className="section-label">About</p>
        <h2 className="section-heading">A little about me</h2>

        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2">
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            {/* TODO: Replace with your actual bio */}
            <p className="text-base leading-relaxed">
              I'm an operations professional with a passion for identifying inefficiencies and
              building practical solutions. My work sits at the intersection of people management,
              process design, and technology — I don't just spot problems, I build the tools to
              fix them.
            </p>
            <p className="text-base leading-relaxed">
              Whether it's automating a scheduling headache, designing a new workflow, or
              training a team on better processes, I bring a builder's mindset to every
              operational challenge.
            </p>
            <p className="text-base leading-relaxed">
              Outside of work, I'm sharpening my development skills to bridge the gap between
              operations thinking and technical execution — because the best ops tools are the
              ones built by someone who actually does the job.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Shifts scheduled', value: '500+' },
              { label: 'Team members managed', value: '20+' },
              // TODO: Update these stats with real numbers
              { label: 'Tools built', value: '3' },
              { label: 'Years in operations', value: '5+' },
            ].map(stat => (
              <div key={stat.label} className="card flex flex-col">
                <span className="mb-1 text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {stat.value}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
