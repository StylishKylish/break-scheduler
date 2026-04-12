import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <Nav darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400
        dark:border-gray-800 dark:bg-gray-900 dark:text-gray-500">
        &copy; {new Date().getFullYear()} Kyle Schuermyer &mdash; Built with React &amp; Tailwind CSS
      </footer>
    </div>
  );
}
