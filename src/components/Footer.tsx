import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Lock, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setActivePage, activePage } = usePortfolio();

  const scrollTo = (id: string) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-800 bg-[#09090b] text-zinc-400 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          {/* Brand & Quote */}
          <div className="md:col-span-6 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
              {settings.name || 'MAHAM JAWAD'}
            </h2>
            <p className="text-base text-zinc-300 font-light italic">
              "Creative ideas. Meaningful design."
            </p>
            <p className="text-xs text-zinc-500 max-w-sm">
              International creative direction, brand systems, and digital product experiences designed with architectural discipline.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <p className="font-semibold text-white uppercase tracking-wider">Navigation</p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollTo('work')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Maham
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('skills')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Skills & Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Design Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Connect & Admin */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <p className="font-semibold text-white uppercase tracking-wider">Direct Access</p>
            <div className="space-y-2 text-zinc-400">
              <p>{settings.email || 'hello@mahamjawad.com'}</p>
              <p>{settings.location || 'New York · London · Lahore'}</p>
              <div className="pt-2">
                <button
                  onClick={() => setActivePage('admin-login')}
                  className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin CMS Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} Maham Jawad. All Rights Reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
