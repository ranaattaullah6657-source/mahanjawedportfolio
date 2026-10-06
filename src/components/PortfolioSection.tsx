import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUpRight, Sparkles, Search, X } from 'lucide-react';
import { Project } from '../types';

export const PortfolioSection: React.FC = () => {
  const {
    projects,
    activeFilter,
    setActiveFilter,
    setSelectedProject,
    setActivePage,
  } = usePortfolio();

  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    'All',
    'Branding',
    'UI/UX',
    'Graphic Design',
    'Posters',
    'Packaging',
    'Illustration',
  ];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeFilter === 'All' || p.category.toLowerCase() === activeFilter.toLowerCase();
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.client.toLowerCase().includes(query) ||
      p.tools?.some(t => t.toLowerCase().includes(query)) ||
      p.tags?.some(t => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setActivePage('project-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="work" className="py-28 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              04. Selected Works & Case Studies
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Featured Portfolio
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            A curated archive of identity systems, digital architectures, and contemporary print engagements.
          </p>
        </div>

        {/* Filter Controls Bar (Category Segments + Search Box) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-12">
          {/* Category Filters (Interactive segmented buttons with zero-pill discipline) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter.toLowerCase() === cat.toLowerCase()
                    ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Quick Real-Time Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search works by title or tool..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Bento & Masonry Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800 rounded-3xl p-12">
            <p className="text-zinc-400 text-base">No projects found in this category.</p>
            <button
              onClick={() => setActiveFilter('All')}
              className="mt-4 px-4 py-2 text-xs font-medium text-amber-400 hover:underline cursor-pointer"
            >
              Reset to all projects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {filteredProjects.map((project, idx) => {
              // Create dynamic visual pacing: first item in every 3 is a larger featured card
              const isLarge = idx % 3 === 0;
              const colSpan = isLarge ? 'lg:col-span-8' : 'lg:col-span-4';

              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className={`${colSpan} group cursor-pointer flex flex-col justify-between rounded-3xl overflow-hidden bg-zinc-900/50 border border-zinc-800/90 hover:border-zinc-700 transition-all duration-500`}
                >
                  {/* Media Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950">
                    <img
                      src={project.thumbnail || project.coverImage}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Contrast scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Featured label (clean unboxed text) */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-amber-300 font-medium px-2.5 py-1 bg-zinc-950/80 backdrop-blur-md rounded-lg border border-amber-500/20">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Featured</span>
                      </div>
                    )}

                    {/* Hover action circle */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 text-zinc-950 flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Clean unboxed metadata and title */}
                  <div className="p-6 sm:p-8 space-y-3">
                    {/* Zero-Pill Metadata */}
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                      <span className="text-amber-400">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.client}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{project.date}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-400 font-light line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tools list */}
                    {project.tools && project.tools.length > 0 && (
                      <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
                        {project.tools.slice(0, 4).map((tool, i) => (
                          <React.Fragment key={i}>
                            <span>{tool}</span>
                            {i < Math.min(project.tools.length, 4) - 1 && (
                              <span aria-hidden="true" className="text-zinc-700">·</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
