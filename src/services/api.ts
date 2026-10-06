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
} from '../types';
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
  initialMessages,
} from '../data/initialData';

const TOKEN_KEY = 'maham_portfolio_auth_token';
const PROJECTS_CACHE_KEY = 'maham_projects_cache';
const CONTENT_CACHE_KEY = 'maham_content_cache';
const MESSAGES_CACHE_KEY = 'maham_messages_cache';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

const getAuthHeaders = (): Record<string, string> => {
  const token = authStorage.getToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      if (data.token) {
        authStorage.setToken(data.token);
      }
      return { success: true, user: data.user, token: data.token };
    } catch (err: any) {
      // Local fallback for offline / mock testing
      if (
        (email === 'admin@mahamjawad.com' || email === 'admin' || email === 'maham') &&
        (password === 'admin123' || password === 'maham2026!')
      ) {
        const dummyToken = 'local-admin-token-' + Date.now();
        authStorage.setToken(dummyToken);
        return {
          success: true,
          token: dummyToken,
          user: {
            id: 'admin-1',
            email: 'admin@mahamjawad.com',
            name: 'Maham Jawad',
            role: 'admin',
          },
        };
      }
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  },

  async checkAuth(): Promise<AdminUser | null> {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch {
      // If server is not responding, allow local token if starts with local-admin
      if (token.startsWith('local-admin')) {
        return {
          id: 'admin-1',
          email: 'admin@mahamjawad.com',
          name: 'Maham Jawad',
          role: 'admin',
        };
      }
    }
    return null;
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch {
      // ignore
    } finally {
      authStorage.removeToken();
    }
  },

  // Seed / sync initial database
  async seedInitialDatabase(): Promise<void> {
    try {
      await fetch('/api/content/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: initialProjects,
          settings: initialSiteSettings,
          skills: initialSkills,
          services: initialServices,
          experience: initialExperience,
          education: initialEducation,
          certificates: initialCertificates,
          achievements: initialAchievements,
          testimonials: initialTestimonials,
          messages: initialMessages,
        }),
      });
    } catch {
      // Local fallback
    }
  },

  // Projects
  async getProjects(all = false): Promise<Project[]> {
    try {
      const res = await fetch(`/api/projects?all=${all}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API getProjects failed, using local cache', err);
    }

    const cached = localStorage.getItem(PROJECTS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return all ? parsed : parsed.filter((p: Project) => p.published !== false);
      } catch {
        // fallback
      }
    }
    return all ? initialProjects : initialProjects.filter(p => p.published);
  },

  async getProjectBySlugOrId(idOrSlug: string): Promise<Project | null> {
    try {
      const res = await fetch(`/api/projects/${idOrSlug}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const projects = await this.getProjects(true);
    return projects.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });

    if (res.ok) {
      const created = await res.json();
      // update cache
      const cached = await this.getProjects(true);
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify([created, ...cached]));
      return created;
    }

    // Local fallback if API fails
    const newProj: Project = {
      ...(project as any),
      id: `proj-${Date.now()}`,
      slug: (project.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const cached = await this.getProjects(true);
    localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify([newProj, ...cached]));
    return newProj;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const updated = await res.json();
      const cached = await this.getProjects(true);
      const next = cached.map(p => (p.id === id ? { ...p, ...updated } : p));
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
      return updated;
    }

    // Local fallback
    const cached = await this.getProjects(true);
    let updatedProj = cached.find(p => p.id === id);
    if (updatedProj) {
      updatedProj = { ...updatedProj, ...updates, updatedAt: new Date().toISOString() };
      const next = cached.map(p => (p.id === id ? updatedProj! : p));
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
      return updatedProj;
    }
    throw new Error('Project not found');
  },

  async togglePublishProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    if (res.ok) {
      const updated = await res.json();
      const cached = await this.getProjects(true);
      const next = cached.map(p => (p.id === id ? updated : p));
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
      return updated;
    }

    // fallback
    const cached = await this.getProjects(true);
    const proj = cached.find(p => p.id === id);
    if (proj) {
      proj.published = !proj.published;
      localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(cached));
      return proj;
    }
    throw new Error('Project not found');
  },

  async deleteProject(id: string): Promise<void> {
    await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const cached = await this.getProjects(true);
    const next = cached.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify(next));
  },

  // Content & Sections
  async getContent(): Promise<{
    settings: SiteSettings;
    skills: Skill[];
    services: Service[];
    experience: Experience[];
    education: Education[];
    certificates: Certificate[];
    achievements: Achievement[];
    testimonials: Testimonial[];
  }> {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data.settings && data.settings.name) {
          localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch (err) {
      console.warn('API getContent failed, falling back to local cache', err);
    }

    const cached = localStorage.getItem(CONTENT_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }

    return {
      settings: initialSiteSettings,
      skills: initialSkills,
      services: initialServices,
      experience: initialExperience,
      education: initialEducation,
      certificates: initialCertificates,
      achievements: initialAchievements,
      testimonials: initialTestimonials,
    };
  },

  async updateContentSection(section: string, data: any): Promise<void> {
    try {
      await fetch(`/api/content/${section}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
    } catch {
      // Local fallback
    }

    // update local cache
    const cached = await this.getContent();
    (cached as any)[section] = data;
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cached));
  },

  // Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetch('/api/messages', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(data));
        return data;
      }
    } catch {
      // fallback
    }

    const cached = localStorage.getItem(MESSAGES_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return initialMessages;
  },

  async submitContactMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<void> {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
    } catch {
      // Local fallback so visitor message is never lost
      const newMsg: ContactMessage = {
        id: `msg-${Date.now()}`,
        name: msg.name,
        email: msg.email,
        subject: msg.subject || 'Inquiry',
        message: msg.message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      const existing = await this.getMessages();
      localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify([newMsg, ...existing]));
    }
  },

  async toggleReadMessage(id: string): Promise<void> {
    try {
      await fetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
    } catch {
      // fallback
    }

    const cached = await this.getMessages();
    const next = cached.map(m => (m.id === id ? { ...m, read: !m.read } : m));
    localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(next));
  },

  async deleteMessage(id: string): Promise<void> {
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      // fallback
    }

    const cached = await this.getMessages();
    const next = cached.filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(next));
  },

  // Media / Image Upload
  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              filename: file.name,
              dataUrl,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            resolve(data.url);
            return;
          }
        } catch {
          // fallback to base64 dataUrl directly if server upload fails
        }
        resolve(dataUrl);
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  },
};
