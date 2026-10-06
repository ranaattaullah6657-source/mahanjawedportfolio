import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Sparkles, Layout, BookOpen, Compass, Package, ArrowUpRight, Check } from 'lucide-react';
import { Service } from '../types';

export const ServicesSection: React.FC = () => {
  const { services } = usePortfolio();

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'Package':
      default:
        return <Package className="w-5 h-5 text-amber-400" />;
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-28 px-6 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              03. Offerings & Solutions
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Design Services
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Partnering with global luxury brands, high-growth technology startups, and cultural institutions on transformative design engagements.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-3">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-light">
                  {service.description}
                </p>

                {/* Features checklist */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-8 pt-4 border-t border-zinc-800/80">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors cursor-pointer pt-2"
              >
                <span>Inquire About Service</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          ))}

          {/* Custom Collaboration Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-amber-950/20 border border-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Custom Advisory
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3 mb-3">
                Bespoke Design Retainer
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-light">
                For fast-paced founders and design studios seeking ongoing creative direction, brand stewardship, or quarterly design sprints.
              </p>
              <div className="space-y-2 mb-6 pt-4 border-t border-zinc-800/80 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dedicated weekly sprint allocation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct Slack/Figma collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Priority turnarounds</span>
                </div>
              </div>
            </div>

            <button
              onClick={scrollToContact}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs transition-colors text-center cursor-pointer"
            >
              Discuss Retainer Availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
