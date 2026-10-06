import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  User,
  Sliders,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Eye,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Upload,
  Globe,
  Star,
  Mail,
  Calendar,
  Layers,
  ArrowUpRight,
  Search,
  Command,
  X,
} from 'lucide-react';
import { Project, Skill, Service, Experience, Education, Certificate, Achievement, Testimonial } from '../../types';
import { api } from '../../services/api';

export const AdminDashboard: React.FC = () => {
  const {
    allProjects,
    saveProject,
    deleteProject,
    togglePublishProject,
    settings,
    updateSettings,
    skills,
    updateSkills,
    services,
    updateServices,
    experience,
    updateExperience,
    education,
    updateEducation,
    certificates,
    updateCertificates,
    achievements,
    updateAchievements,
    testimonials,
    updateTestimonials,
    messages,
    toggleReadMessage,
    deleteMessage,
    adminSection,
    setAdminSection,
    editingProject,
    setEditingProject,
    setSelectedProject,
    setActivePage,
    logout,
    showToast,
  } = usePortfolio();

  const [uploading, setUploading] = useState(false);

  // Global Command Palette & Search State
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut listener: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      } else if (e.key === 'Escape' && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen]);

  // Stats calculation
  const totalProjects = allProjects.length;
  const publishedProjects = allProjects.filter(p => p.published !== false).length;
  const draftProjects = allProjects.filter(p => p.published === false).length;
  const featuredProjects = allProjects.filter(p => p.featured).length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter(m => !m.read).length;

  // Initial empty project form state
  const emptyProjectForm: Partial<Project> = {
    title: '',
    slug: '',
    category: 'Branding',
    client: '',
    date: new Date().getFullYear().toString(),
    description: '',
    tools: ['Adobe Illustrator', 'Figma'],
    tags: ['Brand Identity'],
    thumbnail: '/src/assets/images/project_branding_lux_1791295820674.jpg',
    coverImage: '/src/assets/images/project_branding_lux_1791295820674.jpg',
    galleryImages: [
      '/src/assets/images/project_branding_lux_1791295820674.jpg',
      '/src/assets/images/hero_creative_art_1791295810185.jpg',
    ],
    projectUrl: '',
    challenge: '',
    designProcess: '',
    finalResult: '',
    featured: false,
    published: true,
  };

  const [projectForm, setProjectForm] = useState<Partial<Project>>(emptyProjectForm);
  const [toolsInput, setToolsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Handle Project Form setup when editing
  const handleStartEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm(proj);
    setToolsInput((proj.tools || []).join(', '));
    setTagsInput((proj.tags || []).join(', '));
    setAdminSection('add-project');
  };

  const handleStartNewProject = () => {
    setEditingProject(null);
    setProjectForm(emptyProjectForm);
    setToolsInput('Figma, Illustrator, Photoshop');
    setTagsInput('Brand Identity, Art Direction');
    setAdminSection('add-project');
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title) {
      showToast('Project title is required', 'error');
      return;
    }

    const tools = toolsInput.split(',').map(s => s.trim()).filter(Boolean);
    const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean);
    const slug = (projectForm.slug || projectForm.title).toLowerCase().replace(/[^a-z0-9]+/g, '-');

    await saveProject({
      ...projectForm,
      slug,
      tools,
      tags,
    });

    setEditingProject(null);
    setProjectForm(emptyProjectForm);
    setAdminSection('projects');
  };

  // Image file uploader helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'thumbnail' | 'coverImage' | 'profileImage' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await api.uploadImage(file);
      if (targetField === 'profileImage') {
        updateSettings({ ...settings, profileImage: url });
        showToast('Profile image updated', 'success');
      } else if (targetField === 'gallery') {
        const cur = projectForm.galleryImages || [];
        setProjectForm({ ...projectForm, galleryImages: [...cur, url] });
        showToast('Image added to gallery', 'success');
      } else {
        setProjectForm({ ...projectForm, [targetField]: url });
        showToast(`${targetField} updated`, 'success');
      }
    } catch {
      showToast('Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row">
      {/* CMS Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand & Mode */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight uppercase">
                Maham Jawad
              </h2>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase">
                Admin CMS Core
              </span>
            </div>
            <button
              onClick={() => setActivePage('home')}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setAdminSection('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'dashboard' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setAdminSection('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'projects' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4" />
                <span>Projects Portfolio</span>
              </div>
              <span className="text-[10px] tabular-nums font-bold opacity-80">{totalProjects}</span>
            </button>

            <button
              onClick={handleStartNewProject}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'add-project' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Project</span>
            </button>

            <div className="pt-3 pb-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-3.5">
              Content Sections
            </div>

            <button
              onClick={() => setAdminSection('about')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'about' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>About & Hero</span>
            </button>

            <button
              onClick={() => setAdminSection('skills')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'skills' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4" />
                <span>Skills Management</span>
              </div>
              <span className="text-[10px] tabular-nums font-bold opacity-80">{skills.length}</span>
            </button>

            <button
              onClick={() => setAdminSection('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'services' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Services</span>
              </div>
              <span className="text-[10px] tabular-nums font-bold opacity-80">{services.length}</span>
            </button>

            <button
              onClick={() => setAdminSection('experience')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'experience' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Experience Timeline</span>
            </button>

            <button
              onClick={() => setAdminSection('education')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'education' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Education Records</span>
            </button>

            <button
              onClick={() => setAdminSection('certificates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'certificates' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </button>

            <button
              onClick={() => setAdminSection('achievements')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'achievements' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </button>

            <button
              onClick={() => setAdminSection('testimonials')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'testimonials' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Testimonials</span>
            </button>

            <div className="pt-3 pb-1 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-3.5">
              Inquiries & Settings
            </div>

            <button
              onClick={() => setAdminSection('messages')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'messages' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Messages Inbox</span>
              </div>
              {unreadMessages > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                  {unreadMessages}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminSection('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer ${
                adminSection === 'settings' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Website SEO & Social</span>
            </button>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-2">
          <button
            onClick={() => setActivePage('home')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Switch to Public Site</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main CMS View Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">
        {/* Top Command Bar & Search Trigger */}
        <div className="mb-10 pb-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs w-full sm:w-96 transition-all group cursor-pointer shadow-sm"
          >
            <Search className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
            <span className="flex-1 text-left">Search projects, messages, content...</span>
            <kbd className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-400 group-hover:text-amber-300">
              ⌘K
            </kbd>
          </button>

          <div className="flex items-center gap-4 text-xs text-zinc-500 self-end sm:self-auto">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CMS Active</span>
            </span>
            <span className="text-zinc-700">|</span>
            <span className="tabular-nums text-zinc-400">{allProjects.length} Projects</span>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setActivePage('home')}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Public View
            </button>
          </div>
        </div>

        {/* Global Command Palette Modal Overlay */}
        {isCommandOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
            onClick={() => setIsCommandOpen(false)}
          >
            <div
              className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Search Input Field */}
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                <Search className="w-5 h-5 text-amber-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Type to search projects, messages, skills, services..."
                  className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">
                  ESC
                </kbd>
              </div>

              {/* Categorized Search Results */}
              <div className="p-4 overflow-y-auto space-y-6 text-xs">
                {/* Projects Results */}
                {allProjects.filter(
                  p =>
                    !searchQuery ||
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.client.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
                      Projects ({allProjects.filter(p => !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())).length})
                    </p>
                    <div className="space-y-1">
                      {allProjects
                        .filter(
                          p =>
                            !searchQuery ||
                            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.client.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 5)
                        .map(p => (
                          <div
                            key={p.id}
                            onClick={() => {
                              handleStartEditProject(p);
                              setIsCommandOpen(false);
                            }}
                            className="p-3 rounded-xl hover:bg-zinc-800/80 flex items-center justify-between cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={p.thumbnail || p.coverImage}
                                alt=""
                                className="w-10 h-7 rounded object-cover border border-zinc-800"
                              />
                              <div>
                                <p className="font-semibold text-white group-hover:text-amber-300">
                                  {p.title}
                                </p>
                                <p className="text-[11px] text-zinc-500">
                                  {p.category} · {p.client} · {p.date}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-500 group-hover:text-amber-400 font-mono">
                              Edit Project →
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Messages Results */}
                {messages.filter(
                  m =>
                    !searchQuery ||
                    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
                ).length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
                      Messages & Inquiries
                    </p>
                    <div className="space-y-1">
                      {messages
                        .filter(
                          m =>
                            !searchQuery ||
                            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.subject.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .slice(0, 3)
                        .map(m => (
                          <div
                            key={m.id}
                            onClick={() => {
                              setAdminSection('messages');
                              setIsCommandOpen(false);
                            }}
                            className="p-3 rounded-xl hover:bg-zinc-800/80 flex items-center justify-between cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-amber-400">
                                <Mail className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-white group-hover:text-amber-300">
                                  {m.name} — {m.subject}
                                </p>
                                <p className="text-[11px] text-zinc-500 truncate max-w-md">
                                  {m.email} · {m.message}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-zinc-500 group-hover:text-amber-400 font-mono">
                              View Inbox →
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Navigation Shortcuts */}
                <div>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">
                    Quick Navigation & Actions
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleStartNewProject();
                        setIsCommandOpen(false);
                      }}
                      className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-left flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-amber-400" />
                      <span>+ Create New Project</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminSection('about');
                        setIsCommandOpen(false);
                      }}
                      className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-left flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Edit About & Hero</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminSection('skills');
                        setIsCommandOpen(false);
                      }}
                      className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-left flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>Manage Skills</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminSection('settings');
                        setIsCommandOpen(false);
                      }}
                      className="p-3 rounded-xl bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800/80 text-left flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-amber-400" />
                      <span>Website SEO & Social</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Navigate with click or shortcuts</span>
                <span className="font-mono">ESC to close</span>
              </div>
            </div>
          </div>
        )}
        {/* ================= SECTION: DASHBOARD OVERVIEW ================= */}
        {adminSection === 'dashboard' && (
          <div className="space-y-10">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                CMS Command Center
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome back, Maham
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time management for projects, editorial content, and prospective client inquiries.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-xs text-zinc-400">Total Projects</span>
                <p className="text-3xl font-extrabold text-white mt-2 tabular-nums">{totalProjects}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">Full portfolio archive</span>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-xs text-zinc-400">Live Published</span>
                <p className="text-3xl font-extrabold text-emerald-400 mt-2 tabular-nums">{publishedProjects}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">Visible to public</span>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-xs text-zinc-400">Draft Projects</span>
                <p className="text-3xl font-extrabold text-zinc-400 mt-2 tabular-nums">{draftProjects}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">Unpublished works</span>
              </div>

              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-xs text-zinc-400">Inbound Inquiries</span>
                <p className="text-3xl font-extrabold text-amber-400 mt-2 tabular-nums">{totalMessages}</p>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  {unreadMessages} awaiting review
                </span>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <button
                onClick={handleStartNewProject}
                className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30 text-left hover:border-amber-400 transition-all cursor-pointer group"
              >
                <PlusCircle className="w-6 h-6 text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-bold text-white tracking-tight">Create New Project</h3>
                <p className="text-xs text-zinc-400 mt-1">Upload images, write challenge/process, and publish.</p>
              </button>

              <button
                onClick={() => setAdminSection('messages')}
                className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <MessageSquare className="w-6 h-6 text-zinc-300 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-bold text-white tracking-tight">Read Messages</h3>
                <p className="text-xs text-zinc-400 mt-1">View submissions from potential clients and partners.</p>
              </button>

              <button
                onClick={() => setAdminSection('about')}
                className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800 text-left hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <User className="w-6 h-6 text-zinc-300 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-base font-bold text-white tracking-tight">Update About & Bio</h3>
                <p className="text-xs text-zinc-400 mt-1">Edit philosophy, goals, portrait, and direct info.</p>
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION: PROJECTS LIST ================= */}
        {adminSection === 'projects' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Portfolio Index
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Project Management
                </h1>
              </div>
              <button
                onClick={handleStartNewProject}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add New Project</span>
              </button>
            </div>

            {/* Projects Table */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-6 py-4">Thumbnail</th>
                      <th className="px-6 py-4">Project Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Featured</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {allProjects.map(proj => (
                      <tr key={proj.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <img
                            src={proj.thumbnail || proj.coverImage}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-14 h-10 object-cover rounded-lg border border-zinc-800 bg-zinc-950"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">
                          {proj.title}
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{proj.category}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePublishProject(proj.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                              proj.published !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                          >
                            {proj.published !== false ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{proj.published !== false ? 'Published' : 'Draft'}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          {proj.featured ? (
                            <span className="text-amber-400 font-semibold text-[11px]">★ Yes</span>
                          ) : (
                            <span className="text-zinc-600">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-zinc-400 tabular-nums">{proj.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedProject(proj);
                              setActivePage('project-detail');
                            }}
                            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                            title="Preview Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStartEditProject(proj)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-amber-500/10"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete project "${proj.title}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: ADD / EDIT PROJECT FORM ================= */}
        {adminSection === 'add-project' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  {editingProject ? 'Editing Project' : 'New Project Record'}
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {editingProject ? `Edit: ${editingProject.title}` : 'Add New Portfolio Project'}
                </h1>
              </div>
              <button
                onClick={() => setAdminSection('projects')}
                className="px-4 py-2 text-xs rounded-xl bg-zinc-800 text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-8">
              {/* Basic Details */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                <h2 className="text-lg font-bold text-white">Project Identity & Meta</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projectForm.title || ''}
                      onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. AURA — Haute Joaillerie Visual Identity"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={projectForm.category || 'Branding'}
                      onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    >
                      <option value="Branding">Branding</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Posters">Posters</option>
                      <option value="Packaging">Packaging</option>
                      <option value="Illustration">Illustration</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={projectForm.client || ''}
                      onChange={e => setProjectForm({ ...projectForm, client: e.target.value })}
                      placeholder="Maison Aura Paris"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Timeline / Date
                    </label>
                    <input
                      type="text"
                      value={projectForm.date || ''}
                      onChange={e => setProjectForm({ ...projectForm, date: e.target.value })}
                      placeholder="2026"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Summary Description
                    </label>
                    <textarea
                      rows={3}
                      value={projectForm.description || ''}
                      onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Brief overview of the creative engagement..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tools & Tags */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                <h2 className="text-lg font-bold text-white">Tools, Software & Tags</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Tools Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={toolsInput}
                      onChange={e => setToolsInput(e.target.value)}
                      placeholder="Figma, Adobe Illustrator, InDesign"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={e => setTagsInput(e.target.value)}
                      placeholder="Brand Identity, Luxury Packaging, Swiss Grid"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      External Project / Live URL
                    </label>
                    <input
                      type="url"
                      value={projectForm.projectUrl || ''}
                      onChange={e => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                      placeholder="https://example.com/project"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Imagery Management with Real Upload */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                <h2 className="text-lg font-bold text-white">Visual Assets & Gallery</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Thumbnail */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Project Thumbnail
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-16 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 shrink-0">
                        {projectForm.thumbnail && (
                          <img src={projectForm.thumbnail} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={projectForm.thumbnail || ''}
                          onChange={e => setProjectForm({ ...projectForm, thumbnail: e.target.value })}
                          placeholder="Image URL"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, 'thumbnail')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div className="space-y-3">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Cover Image (Cinematic Banner)
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-16 rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 shrink-0">
                        {projectForm.coverImage && (
                          <img src={projectForm.coverImage} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={projectForm.coverImage || ''}
                          onChange={e => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                          placeholder="Cover Image URL"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleFileUpload(e, 'coverImage')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Gallery Images ({projectForm.galleryImages?.length || 0})
                    </label>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs font-bold text-zinc-950 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>+ Upload Gallery Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'gallery')}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {projectForm.galleryImages?.map((url, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 group bg-zinc-950">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const next = (projectForm.galleryImages || []).filter((_, idx) => idx !== i);
                            setProjectForm({ ...projectForm, galleryImages: next });
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case Study Sections (Challenge, Process, Result) */}
              <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
                <h2 className="text-lg font-bold text-white">Case Study Deep Dive</h2>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                      The Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={projectForm.challenge || ''}
                      onChange={e => setProjectForm({ ...projectForm, challenge: e.target.value })}
                      placeholder="What was the core creative or technical obstacle?"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                      Design Process & Methodology
                    </label>
                    <textarea
                      rows={3}
                      value={projectForm.designProcess || ''}
                      onChange={e => setProjectForm({ ...projectForm, designProcess: e.target.value })}
                      placeholder="How did you approach research, typography, grids, and prototyping?"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                      Final Result & Impact
                    </label>
                    <textarea
                      rows={3}
                      value={projectForm.finalResult || ''}
                      onChange={e => setProjectForm({ ...projectForm, finalResult: e.target.value })}
                      placeholder="Metrics, award recognitions, press mentions, or client outcomes..."
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Visibility Toggles */}
              <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-wrap gap-8 items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectForm.published !== false}
                    onChange={e => setProjectForm({ ...projectForm, published: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-950 border-zinc-800"
                  />
                  <span className="text-xs font-semibold text-white">Publish to Live Website</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!projectForm.featured}
                    onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-950 border-zinc-800"
                  />
                  <span className="text-xs font-semibold text-white">Mark as Featured Showcase</span>
                </label>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl"
                >
                  {editingProject ? 'Save Project Changes' : 'Publish Project Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminSection('projects')}
                  className="px-6 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= SECTION: ABOUT & HERO ================= */}
        {adminSection === 'about' && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                Content Management
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Hero & About Configuration
              </h1>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
              <h2 className="text-lg font-bold text-white">Hero Identity</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Hero Heading
                  </label>
                  <input
                    type="text"
                    value={settings.heroHeading || ''}
                    onChange={e => updateSettings({ ...settings, heroHeading: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={settings.heroSubheading || ''}
                    onChange={e => updateSettings({ ...settings, heroSubheading: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Hero Short Introduction
                  </label>
                  <textarea
                    rows={2}
                    value={settings.heroBio || ''}
                    onChange={e => updateSettings({ ...settings, heroBio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
              <h2 className="text-lg font-bold text-white">About & Philosophy</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Main Biography
                  </label>
                  <textarea
                    rows={4}
                    value={settings.aboutBio || ''}
                    onChange={e => updateSettings({ ...settings, aboutBio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Design Philosophy
                  </label>
                  <textarea
                    rows={3}
                    value={settings.aboutPhilosophy || ''}
                    onChange={e => updateSettings({ ...settings, aboutPhilosophy: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Career Vision & Goals
                  </label>
                  <textarea
                    rows={3}
                    value={settings.aboutGoals || ''}
                    onChange={e => updateSettings({ ...settings, aboutGoals: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
              <h2 className="text-lg font-bold text-white">Contact & Profile Image</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={e => updateSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Phone / Studio Line
                  </label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={e => updateSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Studio Location
                  </label>
                  <input
                    type="text"
                    value={settings.location || ''}
                    onChange={e => updateSettings({ ...settings, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-3 sm:col-span-2 pt-2">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Profile Portrait Image
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={settings.profileImage}
                      alt="Profile"
                      className="w-16 h-16 rounded-2xl object-cover border border-zinc-800"
                    />
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white cursor-pointer">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{uploading ? 'Uploading...' : 'Upload New Portrait'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'profileImage')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: SKILLS MANAGEMENT ================= */}
        {adminSection === 'skills' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Proficiency & Capabilities
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Skills Management
                </h1>
              </div>
              <button
                onClick={() => {
                  const newSkill: Skill = {
                    id: `skill-${Date.now()}`,
                    name: 'New Creative Skill',
                    percentage: 90,
                    iconName: 'Sparkles',
                    category: 'Design',
                    description: 'Description of design capability and applied tools.',
                  };
                  updateSkills([...skills, newSkill]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div key={skill.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={e => {
                        const updated = [...skills];
                        updated[index].name = e.target.value;
                        updateSkills(updated);
                      }}
                      className="text-base font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => {
                        updateSkills(skills.filter(s => s.id !== skill.id));
                      }}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Proficiency (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={skill.percentage}
                        onChange={e => {
                          const updated = [...skills];
                          updated[index].percentage = Number(e.target.value);
                          updateSkills(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Category</label>
                      <select
                        value={skill.category || 'Design'}
                        onChange={e => {
                          const updated = [...skills];
                          updated[index].category = e.target.value as any;
                          updateSkills(updated);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                      >
                        <option value="Design">Design</option>
                        <option value="Technical">Technical</option>
                        <option value="Direction">Direction</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={skill.description}
                      onChange={e => {
                        const updated = [...skills];
                        updated[index].description = e.target.value;
                        updateSkills(updated);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: SERVICES MANAGEMENT ================= */}
        {adminSection === 'services' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Offerings
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Design Services
                </h1>
              </div>
              <button
                onClick={() => {
                  const newService: Service = {
                    id: `serv-${Date.now()}`,
                    title: 'New Creative Service',
                    description: 'Comprehensive deliverable packages and design execution.',
                    iconName: 'Sparkles',
                    features: ['Consultation', 'Design System', 'Handoff'],
                  };
                  updateServices([...services, newService]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Service
              </button>
            </div>

            <div className="space-y-6">
              {services.map((service, index) => (
                <div key={service.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={service.title}
                      onChange={e => {
                        const next = [...services];
                        next[index].title = e.target.value;
                        updateServices(next);
                      }}
                      className="text-lg font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => updateServices(services.filter(s => s.id !== service.id))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase">Service Description</label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={e => {
                        const next = [...services];
                        next[index].description = e.target.value;
                        updateServices(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: EXPERIENCE TIMELINE ================= */}
        {adminSection === 'experience' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Career History
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Experience Timeline
                </h1>
              </div>
              <button
                onClick={() => {
                  const newExp: Experience = {
                    id: `exp-${Date.now()}`,
                    jobTitle: 'Creative Director',
                    company: 'Studio Name',
                    location: 'New York, NY',
                    startDate: '2024',
                    endDate: 'Present',
                    description: 'Leading visual design engagements and editorial narratives.',
                  };
                  updateExperience([newExp, ...experience]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Experience
              </button>
            </div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={e => {
                        const next = [...experience];
                        next[index].jobTitle = e.target.value;
                        updateExperience(next);
                      }}
                      className="text-lg font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => updateExperience(experience.filter(e => e.id !== exp.id))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => {
                          const next = [...experience];
                          next[index].company = e.target.value;
                          updateExperience(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={e => {
                          const next = [...experience];
                          next[index].location = e.target.value;
                          updateExperience(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Date Range</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={e => {
                            const next = [...experience];
                            next[index].startDate = e.target.value;
                            updateExperience(next);
                          }}
                          className="w-1/2 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={e => {
                            const next = [...experience];
                            next[index].endDate = e.target.value;
                            updateExperience(next);
                          }}
                          className="w-1/2 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={exp.description}
                      onChange={e => {
                        const next = [...experience];
                        next[index].description = e.target.value;
                        updateExperience(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: EDUCATION RECORDS ================= */}
        {adminSection === 'education' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Academic Degrees
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Education Credentials
                </h1>
              </div>
              <button
                onClick={() => {
                  const newEdu: Education = {
                    id: `edu-${Date.now()}`,
                    degree: 'Master of Fine Arts (MFA)',
                    institute: 'Royal College of Art',
                    location: 'London, UK',
                    startDate: '2019',
                    endDate: '2021',
                    description: 'Visual communication and typographic research.',
                  };
                  updateEducation([newEdu, ...education]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Degree
              </button>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => {
                        const next = [...education];
                        next[index].degree = e.target.value;
                        updateEducation(next);
                      }}
                      className="text-lg font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => updateEducation(education.filter(e => e.id !== edu.id))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Institute</label>
                      <input
                        type="text"
                        value={edu.institute}
                        onChange={e => {
                          const next = [...education];
                          next[index].institute = e.target.value;
                          updateEducation(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={e => {
                          const next = [...education];
                          next[index].location = e.target.value;
                          updateEducation(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Date Range</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={e => {
                            const next = [...education];
                            next[index].startDate = e.target.value;
                            updateEducation(next);
                          }}
                          className="w-1/2 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                        <input
                          type="text"
                          value={edu.endDate}
                          onChange={e => {
                            const next = [...education];
                            next[index].endDate = e.target.value;
                            updateEducation(next);
                          }}
                          className="w-1/2 px-2 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: CERTIFICATES ================= */}
        {adminSection === 'certificates' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Certifications
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Certificates Management
                </h1>
              </div>
              <button
                onClick={() => {
                  const newCert: Certificate = {
                    id: `cert-${Date.now()}`,
                    name: 'Design Systems Certification',
                    issuingOrg: 'Nielsen Norman Group',
                    date: '2024',
                    url: 'https://nngroup.com',
                    published: true,
                  };
                  updateCertificates([newCert, ...certificates]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Certificate
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert, index) => (
                <div key={cert.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={e => {
                        const next = [...certificates];
                        next[index].name = e.target.value;
                        updateCertificates(next);
                      }}
                      className="text-base font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none w-full"
                    />
                    <button
                      onClick={() => updateCertificates(certificates.filter(c => c.id !== cert.id))}
                      className="text-zinc-500 hover:text-red-400 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Issuing Organization</label>
                      <input
                        type="text"
                        value={cert.issuingOrg}
                        onChange={e => {
                          const next = [...certificates];
                          next[index].issuingOrg = e.target.value;
                          updateCertificates(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Issue Date</label>
                      <input
                        type="text"
                        value={cert.date}
                        onChange={e => {
                          const next = [...certificates];
                          next[index].date = e.target.value;
                          updateCertificates(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cert.published !== false}
                        onChange={e => {
                          const next = [...certificates];
                          next[index].published = e.target.checked;
                          updateCertificates(next);
                        }}
                        className="rounded text-amber-500 bg-zinc-950"
                      />
                      <span>Published to site</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: ACHIEVEMENTS ================= */}
        {adminSection === 'achievements' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Honors
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Achievements & Awards
                </h1>
              </div>
              <button
                onClick={() => {
                  const newAch: Achievement = {
                    id: `ach-${Date.now()}`,
                    title: 'New International Award',
                    organization: 'Design Jury',
                    date: '2025',
                    description: 'Honored for creative craftsmanship.',
                  };
                  updateAchievements([newAch, ...achievements]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Achievement
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach, index) => (
                <div key={ach.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={ach.title}
                      onChange={e => {
                        const next = [...achievements];
                        next[index].title = e.target.value;
                        updateAchievements(next);
                      }}
                      className="text-base font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none w-full"
                    />
                    <button
                      onClick={() => updateAchievements(achievements.filter(a => a.id !== ach.id))}
                      className="text-zinc-500 hover:text-red-400 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Awarding Organization</label>
                      <input
                        type="text"
                        value={ach.organization}
                        onChange={e => {
                          const next = [...achievements];
                          next[index].organization = e.target.value;
                          updateAchievements(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Date</label>
                      <input
                        type="text"
                        value={ach.date}
                        onChange={e => {
                          const next = [...achievements];
                          next[index].date = e.target.value;
                          updateAchievements(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={ach.description}
                      onChange={e => {
                        const next = [...achievements];
                        next[index].description = e.target.value;
                        updateAchievements(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: TESTIMONIALS ================= */}
        {adminSection === 'testimonials' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  Social Proof
                </p>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  Testimonials Management
                </h1>
              </div>
              <button
                onClick={() => {
                  const newTest: Testimonial = {
                    id: `test-${Date.now()}`,
                    clientName: 'Client Name',
                    clientRole: 'VP of Marketing',
                    company: 'Studio Global',
                    rating: 5,
                    testimonial: 'Maham was a transformative creative partner.',
                    published: true,
                  };
                  updateTestimonials([newTest, ...testimonials]);
                }}
                className="px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                + Add Testimonial
              </button>
            </div>

            <div className="space-y-6">
              {testimonials.map((item, index) => (
                <div key={item.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.clientName}
                      onChange={e => {
                        const next = [...testimonials];
                        next[index].clientName = e.target.value;
                        updateTestimonials(next);
                      }}
                      className="text-base font-bold text-white bg-transparent border-b border-transparent focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => updateTestimonials(testimonials.filter(t => t.id !== item.id))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Role</label>
                      <input
                        type="text"
                        value={item.clientRole}
                        onChange={e => {
                          const next = [...testimonials];
                          next[index].clientRole = e.target.value;
                          updateTestimonials(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Company</label>
                      <input
                        type="text"
                        value={item.company || ''}
                        onChange={e => {
                          const next = [...testimonials];
                          next[index].company = e.target.value;
                          updateTestimonials(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={item.rating}
                        onChange={e => {
                          const next = [...testimonials];
                          next[index].rating = Number(e.target.value);
                          updateTestimonials(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-500 uppercase">Testimonial Quote</label>
                    <textarea
                      rows={3}
                      value={item.testimonial}
                      onChange={e => {
                        const next = [...testimonials];
                        next[index].testimonial = e.target.value;
                        updateTestimonials(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: MESSAGES INBOX ================= */}
        {adminSection === 'messages' && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                Inquiries & Leads
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Messages Inbox ({messages.length})
              </h1>
            </div>

            {messages.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl">
                <p className="text-zinc-500">No contact messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                      msg.read
                        ? 'bg-zinc-900/30 border-zinc-800/80 text-zinc-400'
                        : 'bg-zinc-900/80 border-amber-500/30 text-zinc-200 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {msg.name}
                          </h3>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-zinc-950 font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{msg.email}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500">
                        <span className="tabular-nums">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => toggleReadMessage(msg.id)}
                          className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1 text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className="text-xs font-semibold text-zinc-300">
                        Subject: {msg.subject}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-wrap bg-zinc-950/60 p-4 rounded-xl border border-zinc-800/60">
                      {msg.message}
                    </p>

                    <div className="mt-4 pt-3 flex justify-end">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200"
                      >
                        <span>Reply Via Email</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION: WEBSITE SETTINGS & SEO ================= */}
        {adminSection === 'settings' && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
                Metadata & Social Channels
              </p>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Website Settings & SEO
              </h1>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
              <h2 className="text-lg font-bold text-white">Search Engine Optimization (SEO)</h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={settings.seoTitle || ''}
                    onChange={e => updateSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.seoDescription || ''}
                    onChange={e => updateSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Keywords (comma separated)
                  </label>
                  <input
                    type="text"
                    value={settings.seoKeywords || ''}
                    onChange={e => updateSettings({ ...settings, seoKeywords: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-6">
              <h2 className="text-lg font-bold text-white">Social Media Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {['instagram', 'linkedin', 'behance', 'dribbble', 'pinterest', 'twitter'].map(platform => (
                  <div key={platform} className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider capitalize">
                      {platform} URL
                    </label>
                    <input
                      type="url"
                      value={(settings.socials as any)?.[platform] || ''}
                      onChange={e =>
                        updateSettings({
                          ...settings,
                          socials: { ...settings.socials, [platform]: e.target.value },
                        })
                      }
                      placeholder={`https://${platform}.com/...`}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
