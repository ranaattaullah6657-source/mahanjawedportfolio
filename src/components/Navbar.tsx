import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, ArrowUpRight, Lock, LayoutDashboard, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, isAdmin, logout, activePage, setActivePage } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            setActivePage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl md:text-2xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors text-left"
        >
          {settings.name || 'Maham Jawad'}
        </button>

        {/* Zone 2: Navigation Links (4-6 links, single line) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button
            onClick={() => scrollTo('work')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Work
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => scrollTo('skills')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Skills
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Services
          </button>
          <button
            onClick={() => scrollTo('experience')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Experience
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Primary Actions (1-2 actions) */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage(activePage === 'admin-dashboard' ? 'home' : 'admin-dashboard')}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{activePage === 'admin-dashboard' ? 'View Site' : 'CMS Dashboard'}</span>
              </button>
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo('contact')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm"
              >
                <span>Let's Talk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage('admin-login')}
                title="Admin Portal"
                className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-800/50"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setActivePage(activePage === 'admin-dashboard' ? 'home' : 'admin-dashboard')}
              className="p-2 text-amber-400 bg-amber-500/10 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090b] border-b border-zinc-800 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-4 text-base font-medium text-zinc-300">
            <button
              onClick={() => scrollTo('work')}
              className="text-left py-1 hover:text-white"
            >
              Work
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="text-left py-1 hover:text-white"
            >
              About
            </button>
            <button
              onClick={() => scrollTo('skills')}
              className="text-left py-1 hover:text-white"
            >
              Skills
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="text-left py-1 hover:text-white"
            >
              Services
            </button>
            <button
              onClick={() => scrollTo('experience')}
              className="text-left py-1 hover:text-white"
            >
              Experience
            </button>
            <button
              onClick={() => scrollTo('testimonials')}
              className="text-left py-1 hover:text-white"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-left py-1 hover:text-white"
            >
              Contact
            </button>
          </nav>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollTo('contact');
              }}
              className="px-5 py-2.5 text-xs font-semibold rounded-full bg-white text-zinc-950 hover:bg-zinc-200 w-full text-center"
            >
              Contact Maham
            </button>
            {!isAdmin ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setActivePage('admin-login');
                }}
                className="ml-3 p-2 text-zinc-500 hover:text-zinc-300"
              >
                <Lock className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="ml-3 p-2 text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
