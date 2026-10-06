import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, Trophy, CheckCircle, Calendar } from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const { certificates, achievements } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'awards' | 'certificates'>('awards');

  const publishedCerts = certificates.filter(c => c.published !== false);

  return (
    <section id="credentials" className="py-28 px-6 border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              06. Honors & Credentials
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Awards & Certificates
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('awards')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'awards'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>International Awards</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'certificates'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Verified Certificates</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Achievements & Awards */}
        {activeTab === 'awards' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((item, index) => (
              <div
                key={item.id || index}
                className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 tabular-nums">{item.date}</span>
                  </div>

                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    {item.organization}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight mt-1 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Juried International Honor</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Tab 2: Certificates */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedCerts.map((cert, index) => (
              <div
                key={cert.id || index}
                className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-zinc-500 tabular-nums flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cert.date}
                    </span>
                  </div>

                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    {cert.issuingOrg}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-1 mb-2">
                    {cert.name}
                  </h3>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Official Credential</span>
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:underline"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-zinc-500">Archived Record</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
