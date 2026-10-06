import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, GraduationCap, MapPin, Calendar } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  const { experience, education } = usePortfolio();
  const [tab, setTab] = useState<'experience' | 'education'>('experience');

  return (
    <section id="experience" className="py-28 px-6 border-t border-zinc-800/80 bg-zinc-950/40">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              05. Career & Academic Journey
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Experience & Education
            </h2>
          </div>

          {/* Interactive Switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setTab('experience')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                tab === 'experience'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Professional Experience</span>
            </button>
            <button
              onClick={() => setTab('education')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                tab === 'education'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Degrees</span>
            </button>
          </div>
        </div>

        {/* Timeline Content */}
        {tab === 'experience' ? (
          <div className="relative border-l border-zinc-800/90 ml-4 md:ml-32 space-y-12">
            {experience.map(item => (
              <div key={item.id} className="relative pl-8 md:pl-12 group">
                {/* Timeline Node */}
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-amber-400 group-hover:scale-125 transition-all shadow-sm" />

                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {item.jobTitle}
                      </h3>
                      <p className="text-sm font-semibold text-amber-400 mt-0.5">
                        {item.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="tabular-nums">{item.startDate} — {item.endDate}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative border-l border-zinc-800/90 ml-4 md:ml-32 space-y-12">
            {education.map(item => (
              <div key={item.id} className="relative pl-8 md:pl-12 group">
                {/* Timeline Node */}
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-amber-400 group-hover:scale-125 transition-all shadow-sm" />

                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {item.degree}
                      </h3>
                      <p className="text-sm font-semibold text-amber-400 mt-0.5">
                        {item.institute}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="tabular-nums">{item.startDate} — {item.endDate}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.location}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
