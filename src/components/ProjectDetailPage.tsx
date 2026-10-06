import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Calendar,
  User,
  Layers,
  Sparkles,
  X,
  Maximize2,
} from 'lucide-react';
import { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { selectedProject, setSelectedProject, projects, setActivePage } = usePortfolio();
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);

  if (!selectedProject) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <button
          onClick={() => setActivePage('home')}
          className="px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-xs hover:bg-zinc-200 transition-colors"
        >
          Return to Portfolio
        </button>
      </div>
    );
  }

  // Find index in published projects for Next / Prev navigation
  const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  const handleNavigate = (proj: Project) => {
    setSelectedProject(proj);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const gallery = selectedProject.galleryImages && selectedProject.galleryImages.length > 0
    ? selectedProject.galleryImages
    : [selectedProject.coverImage || selectedProject.thumbnail];

  return (
    <article className="min-h-screen pt-28 pb-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              setActivePage('home');
              setTimeout(() => {
                const el = document.getElementById('work');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Works</span>
          </button>

          {/* Zero-Pill Unboxed Category & Year */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span className="text-amber-400">{selectedProject.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{selectedProject.date}</span>
          </div>
        </div>

        {/* Project Header & Title */}
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05]">
            {selectedProject.title}
          </h1>
          <p className="text-lg sm:text-xl text-zinc-300 max-w-3xl font-light leading-relaxed">
            {selectedProject.description}
          </p>
        </div>

        {/* Metadata Grid (Client, Timeline, Tools, Link) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-xs">
          <div>
            <span className="text-zinc-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
              <User className="w-3.5 h-3.5 text-amber-400" /> Client
            </span>
            <span className="text-sm font-semibold text-white">{selectedProject.client}</span>
          </div>

          <div>
            <span className="text-zinc-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Timeline
            </span>
            <span className="text-sm font-semibold text-white tabular-nums">{selectedProject.date}</span>
          </div>

          <div>
            <span className="text-zinc-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Tools & Stack
            </span>
            <span className="text-sm font-medium text-zinc-300">
              {selectedProject.tools ? selectedProject.tools.join(', ') : 'Creative Suite'}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider text-[10px]">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" /> Live Prototype
            </span>
            {selectedProject.projectUrl ? (
              <a
                href={selectedProject.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-sm text-zinc-500">Private Commission</span>
            )}
          </div>
        </div>

        {/* Cinematic Main Hero Image */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl group">
          <img
            src={selectedProject.coverImage || selectedProject.thumbnail}
            alt={selectedProject.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <button
            onClick={() => setActiveLightboxImage(selectedProject.coverImage || selectedProject.thumbnail)}
            className="absolute bottom-6 right-6 p-3 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700 text-white hover:bg-zinc-800 transition-colors"
            title="Inspect in Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Case Study Deep-Dive: Challenge, Process & Result */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {/* 01. The Challenge */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              01. The Challenge
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Context & Mandate</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              {selectedProject.challenge ||
                'Navigating high-stakes brand repositioning across tactile physical media and high-resolution digital flagships without compromising editorial integrity.'}
            </p>
          </div>

          {/* 02. Design Process */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              02. Design Process
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Methodology & Craft</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              {selectedProject.designProcess ||
                'Rigorous typographic prototyping, iterative micro-interaction tuning in Figma, and tactile substrate curation resulting in an unmistakable brand voice.'}
            </p>
          </div>

          {/* 03. Final Result */}
          <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              03. Final Result
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">Impact & Recognition</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
              {selectedProject.finalResult ||
                'Delivered an internationally celebrated design system adopted globally, featured in leading design publications, and driving measurable client growth.'}
            </p>
          </div>
        </div>

        {/* Project Gallery */}
        <div className="space-y-8 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-1">
                Visual Documentation
              </p>
              <h2 className="text-3xl font-bold text-white tracking-tight">Project Gallery</h2>
            </div>
            <span className="text-xs text-zinc-500 tabular-nums">{gallery.length} Images</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gallery.map((imgUrl, i) => (
              <div
                key={i}
                onClick={() => setActiveLightboxImage(imgUrl)}
                className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 cursor-pointer group shadow-xl"
              >
                <img
                  src={imgUrl}
                  alt={`${selectedProject.title} frame ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white text-zinc-950 shadow-2xl">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous / Next Project Navigation Bar */}
        <div className="pt-16 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {prevProject && (
            <button
              onClick={() => handleNavigate(prevProject)}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-left transition-all group cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-zinc-500 flex items-center gap-1.5 mb-1 group-hover:text-amber-400">
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Project
                </span>
                <p className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {prevProject.title}
                </p>
              </div>
            </button>
          )}

          {nextProject && (
            <button
              onClick={() => handleNavigate(nextProject)}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-right transition-all group cursor-pointer flex items-center justify-between sm:justify-end gap-4"
            >
              <div>
                <span className="text-xs text-zinc-500 flex items-center justify-end gap-1.5 mb-1 group-hover:text-amber-400">
                  Next Project <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <p className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  {nextProject.title}
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-200"
          onClick={() => setActiveLightboxImage(null)}
        >
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImage}
            alt="Fullscreen view"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
};
