import React, { useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ProjectDetailPage } from './components/ProjectDetailPage';
import { ExperienceSection } from './components/ExperienceSection';
import { CertificatesSection } from './components/CertificatesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isAdmin,
    toasts,
    removeToast,
    settings,
  } = usePortfolio();

  // Listen to path or hash for /admin/login or /admin/dashboard
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin/login')) {
      setActivePage('admin-login');
    } else if (path.includes('/admin/dashboard') || path.includes('/admin')) {
      if (isAdmin) {
        setActivePage('admin-dashboard');
      } else {
        setActivePage('admin-login');
      }
    }
  }, [isAdmin, setActivePage]);

  // Sync document title and meta with settings
  useEffect(() => {
    if (settings.seoTitle) {
      document.title = settings.seoTitle;
    }
  }, [settings.seoTitle]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-amber-400 selection:text-zinc-950 font-sans">
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 text-xs backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300 ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-200'
                : toast.type === 'info'
                ? 'bg-zinc-900/90 border-zinc-700 text-zinc-200'
                : 'bg-zinc-900/90 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-zinc-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="font-medium">{toast.title}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Admin Dashboard view */}
      {activePage === 'admin-dashboard' && (
        isAdmin ? <AdminDashboard /> : <AdminLogin />
      )}

      {/* Admin Login view */}
      {activePage === 'admin-login' && <AdminLogin />}

      {/* Project Detail view */}
      {activePage === 'project-detail' && (
        <>
          <Navbar />
          <ProjectDetailPage />
          <Footer />
        </>
      )}

      {/* Main Home / Portfolio view */}
      {activePage === 'home' && (
        <>
          <Navbar />
          <main>
            <Hero />
            <PortfolioSection />
            <AboutSection />
            <SkillsSection />
            <ServicesSection />
            <ExperienceSection />
            <CertificatesSection />
            <TestimonialsSection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}
