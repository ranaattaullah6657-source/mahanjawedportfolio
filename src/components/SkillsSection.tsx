import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Palette,
  Layout,
  Sparkles,
  Type,
  Film,
  Compass,
  CheckCircle2,
  Sliders,
  Layers,
  Wand2,
  Box,
  MonitorSmartphone,
  Eye,
} from 'lucide-react';
import { Skill } from '../types';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'bars' | 'gauges'>('bars');

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Palette':
        return <Palette className="w-5 h-5 text-amber-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Type':
        return <Type className="w-5 h-5 text-amber-400" />;
      case 'Film':
        return <Film className="w-5 h-5 text-amber-400" />;
      case 'Wand2':
        return <Wand2 className="w-5 h-5 text-amber-400" />;
      case 'Box':
        return <Box className="w-5 h-5 text-amber-400" />;
      case 'MonitorSmartphone':
        return <MonitorSmartphone className="w-5 h-5 text-amber-400" />;
      case 'Compass':
      default:
        return <Compass className="w-5 h-5 text-amber-400" />;
    }
  };

  const getMasteryTier = (pct: number) => {
    if (pct >= 95) return 'Master Tier';
    if (pct >= 90) return 'Principal';
    if (pct >= 85) return 'Advanced';
    return 'Proficient';
  };

  const categories = ['All', 'Design', 'Technical', 'Direction'];

  const filteredSkills = skills.filter(s => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <section id="skills" className="py-28 px-6 border-t border-zinc-800/80 bg-zinc-950/60 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              02. Visual Disciplines & Mastery
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Skills & Interactive Index
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            {/* View Mode Toggle: Interactive Visualization style */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              <button
                onClick={() => setViewMode('bars')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'bars' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Linear Progress Bars"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Bars</span>
              </button>
              <button
                onClick={() => setViewMode('gauges')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'gauges' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Circular Metric Gauges"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Gauges</span>
              </button>
            </div>

            {/* Category Filter segmented control */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Skill Cards Grid with Interactive Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map(skill => {
            const isHovered = hoveredSkillId === skill.id;
            const radius = 34;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (skill.percentage / 100) * circumference;

            return (
              <div
                key={skill.id}
                onMouseEnter={() => setHoveredSkillId(skill.id)}
                onMouseLeave={() => setHoveredSkillId(null)}
                className={`p-7 rounded-3xl bg-zinc-900/60 border transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
                  isHovered
                    ? 'border-amber-500/50 bg-zinc-900/90 shadow-2xl -translate-y-1'
                    : 'border-zinc-800/90 hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Top Bar: Icon & Gauge / Number */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isHovered
                          ? 'bg-amber-400 text-zinc-950 scale-110 shadow-lg shadow-amber-500/20'
                          : 'bg-zinc-800/80 border border-zinc-700/60 text-amber-400'
                      }`}
                    >
                      {getIcon(skill.iconName)}
                    </div>

                    {viewMode === 'gauges' ? (
                      /* Circular Gauge Visualization */
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="5"
                            className="text-zinc-800"
                            fill="transparent"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="5"
                            className={`text-amber-400 transition-all duration-1000 ease-out ${
                              isHovered ? 'filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : ''
                            }`}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-white tabular-nums tracking-tighter">
                          {skill.percentage}%
                        </span>
                      </div>
                    ) : (
                      /* Header Number with Tier */
                      <div className="text-right">
                        <div className="text-2xl font-extrabold text-white tabular-nums tracking-tight">
                          {skill.percentage}%
                        </div>
                        <span className="text-[10px] text-amber-400/90 font-medium tracking-wide uppercase">
                          {getMasteryTier(skill.percentage)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Category (Zero-Pill Metadata) */}
                  <div className="mb-2">
                    <span className="text-xs text-zinc-500 font-medium">
                      {skill.category || 'Visual Design'}
                    </span>
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {skill.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-400 font-light leading-relaxed mb-6">
                    {skill.description}
                  </p>
                </div>

                {/* Linear Visualization Track with Glow Indicator */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5 font-medium">
                    <span>Proficiency Index</span>
                    <span className="text-zinc-400 tabular-nums">{skill.percentage} / 100</span>
                  </div>

                  <div className="relative w-full h-2 bg-zinc-800/90 rounded-full overflow-hidden p-[1px]">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 ${
                        isHovered ? 'shadow-[0_0_12px_rgba(251,191,36,0.9)] brightness-110' : ''
                      }`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>

                  {/* Micro-interaction highlight on hover */}
                  <div
                    className={`mt-3 flex items-center justify-between text-[10px] transition-opacity duration-200 ${
                      isHovered ? 'opacity-100 text-amber-400' : 'opacity-0'
                    }`}
                  >
                    <span>Dynamic Level Calibrated</span>
                    <span className="font-semibold">Validated in Studio Work</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Stats Footer */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/70 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Total Active Skills</p>
              <p className="text-xl font-bold text-white tabular-nums tracking-tight">{skills.length} Specialties</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Average Proficiency</p>
              <p className="text-xl font-bold text-white tabular-nums tracking-tight">
                {skills.length > 0
                  ? Math.round(skills.reduce((acc, s) => acc + s.percentage, 0) / skills.length)
                  : 0}
                % Cumulative
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400">Live Synchronization</p>
              <p className="text-xl font-bold text-white tracking-tight">100% Real-Time CMS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
