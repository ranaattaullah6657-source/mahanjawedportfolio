export type ProjectCategory = 
  | 'All'
  | 'Branding'
  | 'UI/UX'
  | 'Graphic Design'
  | 'Posters'
  | 'Packaging'
  | 'Illustration'
  | 'Motion Graphics'
  | 'Other';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  client: string;
  date: string;
  tools: string[];
  tags: string[];
  thumbnail: string;
  coverImage: string;
  galleryImages: string[];
  projectUrl?: string;
  challenge?: string;
  designProcess?: string;
  finalResult?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  iconName?: string;
  description: string;
  category?: 'Design' | 'Technical' | 'Direction';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institute: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuingOrg: string;
  date: string;
  imageUrl?: string;
  url?: string;
  published: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company?: string;
  profileImage?: string;
  rating: number;
  testimonial: string;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  behance?: string;
  dribbble?: string;
  pinterest?: string;
  youtube?: string;
  tiktok?: string;
  twitter?: string;
  github?: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  heroBio: string;
  profileImage: string;
  email: string;
  phone: string;
  location: string;
  aboutBio: string;
  aboutPhilosophy: string;
  aboutGoals: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  socials: SocialLinks;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'error' | 'info';
}
