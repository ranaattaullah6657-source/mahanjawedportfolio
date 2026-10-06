import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Compass, Lightbulb, Target } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { settings } = usePortfolio();

  return (
    <section id="about" className="py-28 px-6 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              01. Personal Identity & Philosophy
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              About Maham
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Bridging conceptual depth and meticulous craft across digital products, visual systems, and contemporary typography.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait & Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl group">
              <img
                src={settings.profileImage || '/src/assets/images/maham_portrait_1791295794335.jpg'}
                alt="Maham Jawad"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-lg font-bold text-white tracking-tight">Maham Jawad</p>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                  <span>Creative Director</span>
                  <span aria-hidden="true">·</span>
                  <span>MFA Visual Comm</span>
                  <span aria-hidden="true">·</span>
                  <span>Global Practice</span>
                </div>
              </div>
            </div>

            {/* Quick Contact & Info Grid */}
            <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Location</span>
                <span className="text-zinc-200 font-medium">{settings.location || 'New York / London / Lahore'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-800/60">
                <span className="text-zinc-500">Direct Email</span>
                <span className="text-amber-400 font-medium">{settings.email || 'hello@mahamjawad.com'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Focus Areas</span>
                <span className="text-zinc-200 font-medium">Brand Systems, UI/UX, Editorial</span>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Philosophy & Goals */}
          <div className="lg:col-span-7 space-y-10">
            {/* Bio */}
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Crafting visual elegance with mathematical intention.
              </h3>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                {settings.aboutBio}
              </p>
            </div>

            {/* Structured Pillars (Philosophy, Interests, Career Goals) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {/* Design Philosophy */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white">Design Philosophy</h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {settings.aboutPhilosophy ||
                    'Design is not merely aesthetic ornamentation; it is the deliberate orchestration of intention, emotion, and architectural clarity.'}
                </p>
              </div>

              {/* Career Goals */}
              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-white">Career Vision</h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {settings.aboutGoals ||
                    'Continually pushing the vanguard of digital typography and spatial interface aesthetics for visionary founders and cultural museums.'}
                </p>
              </div>
            </div>

            {/* Core Interests List */}
            <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Professional & Research Interests</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Variable Typography</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Spatial OS Interfaces</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Sustainable Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Tactile Print Finishing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Generative 3D Forms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>Curatorial Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
