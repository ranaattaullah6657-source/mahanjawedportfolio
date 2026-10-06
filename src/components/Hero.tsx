import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings } = usePortfolio();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between pt-32 pb-16 px-6 overflow-hidden">
      {/* Ambient background glows & subtle moving gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-amber-600/15 via-orange-500/10 to-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse duration-10000" />
      <div className="absolute -top-10 right-10 w-[350px] h-[350px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main hero grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber-400 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Portfolio & Visual Direction</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white uppercase leading-[0.95]">
              {settings.heroHeading || 'MAHAM JAWAD'}
            </h1>
            <p className="text-xl sm:text-2xl font-light text-zinc-300 tracking-tight">
              {settings.heroSubheading || 'Creative Professional & Designer'}
            </p>
          </div>

          <p className="text-base sm:text-lg text-zinc-400 max-w-xl font-normal leading-relaxed">
            {settings.heroBio ||
              'Creating meaningful visual experiences through creativity, design and innovation.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollTo('work')}
              className="px-8 py-4 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-all transform hover:-translate-y-0.5 shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <span>View My Work</span>
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 bg-zinc-900/60 backdrop-blur-md text-white font-medium text-sm transition-all hover:bg-zinc-800/80 flex items-center gap-2 cursor-pointer"
            >
              <span>Contact Me</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Key metrics / proof bar */}
          <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">7+ yrs</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Experience</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">40+</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Major Projects</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight tabular-nums">12</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">Global Awards</p>
            </div>
          </div>
        </div>

        {/* Right Column: High-End Visual Feature */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-800/90 shadow-2xl bg-zinc-900 group">
            {/* Visual Portrait Image */}
            <img
              src={settings.profileImage || '/src/assets/images/maham_portrait_1791295794335.jpg'}
              alt="Maham Jawad"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center filter grayscale-[15%] group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent pointer-events-none" />

            {/* Floating Glass Label */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-zinc-700/40">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight">Maham Jawad</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Art Direction & Brand Architecture</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" title="Available for Select Commissions" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="max-w-7xl mx-auto w-full pt-12 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>London · New York · Lahore</span>
        </div>
        <button
          onClick={() => scrollTo('work')}
          className="flex items-center gap-2 hover:text-zinc-300 transition-colors cursor-pointer group"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:text-amber-400" />
        </button>
      </div>
    </section>
  );
};
