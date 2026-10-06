import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);

  const publishedTestimonials = testimonials.filter(t => t.published !== false);

  if (publishedTestimonials.length === 0) return null;

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % publishedTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(prev => (prev - 1 + publishedTestimonials.length) % publishedTestimonials.length);
  };

  const current = publishedTestimonials[currentIndex];

  return (
    <section id="testimonials" className="py-28 px-6 border-t border-zinc-800/80 bg-zinc-950/60 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
            07. Client Endorsements & Trust
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            What Collaborators Say
          </h2>
        </div>

        {/* Featured Testimonial Card */}
        <div className="p-8 sm:p-14 rounded-3xl bg-zinc-900/60 border border-zinc-800 relative shadow-2xl">
          <Quote className="w-12 h-12 text-amber-400/20 mb-8" />

          <blockquote className="text-xl sm:text-3xl text-zinc-100 font-light leading-relaxed mb-10 tracking-tight">
            "{current.testimonial}"
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-zinc-800/80">
            {/* Author info */}
            <div className="flex items-center gap-4">
              {current.profileImage ? (
                <img
                  src={current.profileImage}
                  alt={current.clientName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-bold text-lg">
                  {current.clientName.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {current.clientName}
                </h3>
                <p className="text-xs text-zinc-400">
                  {current.clientRole} {current.company ? `· ${current.company}` : ''}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Carousel Navigation buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-zinc-500 font-mono tabular-nums px-2">
                0{currentIndex + 1} / 0{publishedTestimonials.length}
              </span>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
