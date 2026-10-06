import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, sendContactMessage } = usePortfolio();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setSubmitting(true);
    try {
      await sendContactMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-6 border-t border-zinc-800/80 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase mb-3">
              08. Dialogue & Collaboration
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              Initiate A Project
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Available for selected brand identities, UI/UX systems, and creative direction engagements globally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Inquiries Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Let's create something timeless together.
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Whether you have an upcoming brand launch, digital product vision, or wish to discuss an exhibition commission, feel free to get in touch.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-zinc-800/80">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Direct Email</p>
                  <a
                    href={`mailto:${settings.email || 'hello@mahamjawad.com'}`}
                    className="text-base font-semibold text-white hover:text-amber-400 transition-colors"
                  >
                    {settings.email || 'hello@mahamjawad.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Phone / Studio</p>
                  <p className="text-base font-semibold text-white tabular-nums">
                    {settings.phone || '+1 (555) 382-9400'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Presence</p>
                  <p className="text-base font-semibold text-white">
                    {settings.location || 'New York / London / Lahore'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links List */}
            <div className="pt-6 border-t border-zinc-800/80">
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                Social & Profiles
              </p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(settings.socials || {}).map(([key, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors inline-flex items-center gap-1"
                    >
                      <span className="capitalize">{key}</span>
                      <ArrowUpRight className="w-3 h-3 text-zinc-500" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/50 border border-zinc-800 shadow-xl">
              {submitted ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Message Delivered
                  </h3>
                  <p className="text-sm text-zinc-400 max-w-md mx-auto">
                    Thank you for reaching out. Maham will review your inquiry and respond within 24 to 48 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Elena Rostova"
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="elena@maisonaura.com"
                        className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Subject / Service Area
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brand Identity Architecture / Q3 Engagement"
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details about your vision, timeline, and deliverables..."
                      className="w-full px-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-colors text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Transmitting Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
