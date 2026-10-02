import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero-search-section');
      if (heroElement) {
        const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 50);
      } else {
        setIsVisible(window.scrollY > 380);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top of page"
      title="Back to Top"
      className="fixed z-40 bottom-20 md:bottom-8 right-4 sm:right-6 p-3 rounded-2xl bg-slate-900/90 dark:bg-sky-600/90 hover:bg-slate-900 dark:hover:bg-sky-500 text-white shadow-xl shadow-slate-900/20 backdrop-blur-md border border-white/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center gap-1.5 text-xs font-bold group animate-fade-in"
    >
      <ArrowUp className="w-4 h-4 stroke-[2.5] group-hover:-translate-y-0.5 transition-transform" />
      <span className="hidden sm:inline text-[11px] pr-1">Top</span>
    </button>
  );
};
