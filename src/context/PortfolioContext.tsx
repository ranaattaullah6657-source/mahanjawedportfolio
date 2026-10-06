import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  SiteSettings,
  Skill,
  Service,
  Experience,
  Education,
  Certificate,
  Achievement,
  Testimonial,
  ContactMessage,
  AdminUser,
  ToastMessage,
} from '../types';
import { api } from '../services/api';
import {
  initialProjects,
  initialSiteSettings,
  initialSkills,
  initialServices,
  initialExperience,
  initialEducation,
  initialCertificates,
  initialAchievements,
  initialTestimonials,
} from '../data/initialData';

interface PortfolioContextType {
  settings: SiteSettings;
  projects: Project[];
  allProjects: Project[];
  skills: Skill[];
  services: Service[];
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
  achievements: Achievement[];
  testimonials: Testimonial[];
  messages: ContactMessage[];
  unreadMessagesCount: number;
  user: AdminUser | null;
  isAdmin: boolean;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  activePage: 'home' | 'project-detail' | 'admin-login' | 'admin-dashboard';
  setActivePage: (page: 'home' | 'project-detail' | 'admin-login' | 'admin-dashboard') => void;
  adminSection: string;
  setAdminSection: (sec: string) => void;
  editingProject: Project | null;
  setEditingProject: (proj: Project | null) => void;
  toasts: ToastMessage[];
  showToast: (title: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Actions
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveProject: (project: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  togglePublishProject: (id: string) => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
  updateSkills: (skills: Skill[]) => Promise<void>;
  updateServices: (services: Service[]) => Promise<void>;
  updateExperience: (exp: Experience[]) => Promise<void>;
  updateEducation: (edu: Education[]) => Promise<void>;
  updateCertificates: (certs: Certificate[]) => Promise<void>;
  updateAchievements: (ach: Achievement[]) => Promise<void>;
  updateTestimonials: (test: Testimonial[]) => Promise<void>;
  sendContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => Promise<void>;
  toggleReadMessage: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activePage, setActivePage] = useState<'home' | 'project-detail' | 'admin-login' | 'admin-dashboard'>('home');
  const [adminSection, setAdminSection] = useState<string>('dashboard');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const showToast = (title: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const refreshData = async () => {
    try {
      // Seed backend if empty
      await api.seedInitialDatabase();

      // Load projects
      const projs = await api.getProjects(true);
      if (projs && projs.length > 0) {
        setAllProjects(projs);
      }

      // Load content
      const content = await api.getContent();
      if (content.settings) setSettings(content.settings);
      if (content.skills) setSkills(content.skills);
      if (content.services) setServices(content.services);
      if (content.experience) setExperience(content.experience);
      if (content.education) setEducation(content.education);
      if (content.certificates) setCertificates(content.certificates);
      if (content.achievements) setAchievements(content.achievements);
      if (content.testimonials) setTestimonials(content.testimonials);

      // Check current auth
      const authUser = await api.checkAuth();
      setUser(authUser);

      if (authUser) {
        const msgs = await api.getMessages();
        setMessages(msgs);
      }
    } catch (err) {
      console.warn('Initial load error:', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update messages when user logs in
  useEffect(() => {
    if (user) {
      api.getMessages().then(setMessages).catch(() => {});
    }
  }, [user]);

  // Auth actions
  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setActivePage('admin-dashboard');
      showToast('Welcome back, Maham! You are now logged in.', 'success');
      // fetch messages
      const msgs = await api.getMessages();
      setMessages(msgs);
      return { success: true };
    }
    showToast(res.error || 'Authentication failed', 'error');
    return { success: false, error: res.error };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    setActivePage('home');
    showToast('Logged out successfully', 'info');
  };

  // Projects actions
  const saveProject = async (projData: Partial<Project>): Promise<Project> => {
    let saved: Project;
    if (projData.id && allProjects.some(p => p.id === projData.id)) {
      saved = await api.updateProject(projData.id, projData);
      setAllProjects(prev => prev.map(p => (p.id === saved.id ? saved : p)));
      showToast(`Project "${saved.title}" updated successfully`, 'success');
    } else {
      saved = await api.createProject(projData);
      setAllProjects(prev => [saved, ...prev]);
      showToast(`Project "${saved.title}" created successfully`, 'success');
    }
    return saved;
  };

  const deleteProject = async (id: string) => {
    await api.deleteProject(id);
    setAllProjects(prev => prev.filter(p => p.id !== id));
    showToast('Project deleted successfully', 'info');
  };

  const togglePublishProject = async (id: string) => {
    const updated = await api.togglePublishProject(id);
    setAllProjects(prev => prev.map(p => (p.id === id ? updated : p)));
    showToast(
      updated.published ? 'Project published to live site' : 'Project moved to draft',
      'info'
    );
  };

  // Content actions
  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    await api.updateContentSection('settings', newSettings);
    showToast('Website settings saved successfully', 'success');
  };

  const updateSkills = async (newSkills: Skill[]) => {
    setSkills(newSkills);
    await api.updateContentSection('skills', newSkills);
    showToast('Skills updated successfully', 'success');
  };

  const updateServices = async (newServices: Service[]) => {
    setServices(newServices);
    await api.updateContentSection('services', newServices);
    showToast('Services updated successfully', 'success');
  };

  const updateExperience = async (newExp: Experience[]) => {
    setExperience(newExp);
    await api.updateContentSection('experience', newExp);
    showToast('Experience timeline updated', 'success');
  };

  const updateEducation = async (newEdu: Education[]) => {
    setEducation(newEdu);
    await api.updateContentSection('education', newEdu);
    showToast('Education records updated', 'success');
  };

  const updateCertificates = async (newCerts: Certificate[]) => {
    setCertificates(newCerts);
    await api.updateContentSection('certificates', newCerts);
    showToast('Certificates updated', 'success');
  };

  const updateAchievements = async (newAch: Achievement[]) => {
    setAchievements(newAch);
    await api.updateContentSection('achievements', newAch);
    showToast('Achievements updated', 'success');
  };

  const updateTestimonials = async (newTest: Testimonial[]) => {
    setTestimonials(newTest);
    await api.updateContentSection('testimonials', newTest);
    showToast('Testimonials updated', 'success');
  };

  // Messages actions
  const sendContactMessage = async (msg: { name: string; email: string; subject: string; message: string }) => {
    await api.submitContactMessage(msg);
    showToast('Thank you! Your message has been sent to Maham.', 'success');
    if (user) {
      const updated = await api.getMessages();
      setMessages(updated);
    }
  };

  const toggleReadMessage = async (id: string) => {
    await api.toggleReadMessage(id);
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: !m.read } : m)));
  };

  const deleteMessage = async (id: string) => {
    await api.deleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
    showToast('Message deleted', 'info');
  };

  // Public projects (only published ones)
  const projects = allProjects.filter(p => p.published !== false);

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <PortfolioContext.Provider
      value={{
        settings,
        projects,
        allProjects,
        skills,
        services,
        experience,
        education,
        certificates,
        achievements,
        testimonials,
        messages,
        unreadMessagesCount,
        user,
        isAdmin: !!user,
        activeFilter,
        setActiveFilter,
        selectedProject,
        setSelectedProject,
        activePage,
        setActivePage,
        adminSection,
        setAdminSection,
        editingProject,
        setEditingProject,
        toasts,
        showToast,
        removeToast,
        theme,
        toggleTheme,
        login,
        logout,
        saveProject,
        deleteProject,
        togglePublishProject,
        updateSettings,
        updateSkills,
        updateServices,
        updateExperience,
        updateEducation,
        updateCertificates,
        updateAchievements,
        updateTestimonials,
        sendContactMessage,
        toggleReadMessage,
        deleteMessage,
        refreshData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
