export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-brand-50/40 to-white
      py-24 sm:py-32 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Background grid decoration */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]
        bg-[size:4rem_4rem] opacity-30 dark:opacity-10" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200
            bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700
            dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Open to new opportunities
          </div>
          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-gray-900
            sm:text-6xl dark:text-gray-100">
            Kyle Schuermyer
          </h1>
          <p className="mb-3 text-xl font-semibold text-brand-600 dark:text-brand-400">
            {/* TODO: Update with your actual title */}
            Operations Professional &amp; Toolmaker
          </p>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-gray-500 dark:text-gray-400">
            {/* TODO: Update with your personal tagline */}
            I solve operational inefficiencies by building practical tools that make teams more
            effective — from scheduling automation to workflow optimization.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm
                transition-all hover:bg-brand-700 hover:shadow-md dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              See My Work
            </a>
            <a
              href="#contact"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold
                text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow-md
                dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
