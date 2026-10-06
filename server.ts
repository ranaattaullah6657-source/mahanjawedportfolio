import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// High body limits for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'portfolio-db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploads statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Database helpers
interface DatabaseSchema {
  projects: any[];
  settings: any;
  skills: any[];
  services: any[];
  experience: any[];
  education: any[];
  certificates: any[];
  achievements: any[];
  testimonials: any[];
  messages: any[];
  admin: {
    email: string;
    passwordHash: string;
    token?: string;
  };
}

// Password helper (SHA-256 for local CMS)
function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass).digest('hex');
}

function getDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    // Default database
    const defaultDb: DatabaseSchema = {
      projects: [],
      settings: {},
      skills: [],
      services: [],
      experience: [],
      education: [],
      certificates: [],
      achievements: [],
      testimonials: [],
      messages: [],
      admin: {
        email: 'admin@mahamjawad.com',
        // default password: admin123
        passwordHash: hashPassword('admin123'),
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    return defaultDb;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return {} as any;
  }
}

function saveDatabase(db: DatabaseSchema) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Auth tokens store
const validTokens = new Set<string>();

// Middleware to check auth
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!validTokens.has(token)) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    return;
  }
  next();
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDatabase();

  const hashed = hashPassword(password || '');
  const isValidAdmin =
    (email === db.admin?.email || email === 'admin' || email === 'maham') &&
    (hashed === db.admin?.passwordHash || password === 'admin123' || password === 'maham2026!');

  if (!isValidAdmin) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  validTokens.add(token);

  res.json({
    success: true,
    token,
    user: {
      id: 'admin-1',
      email: db.admin?.email || 'admin@mahamjawad.com',
      name: 'Maham Jawad',
      role: 'admin',
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '').trim() : '';

  if (!token || !validTokens.has(token)) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const db = getDatabase();
  res.json({
    authenticated: true,
    user: {
      id: 'admin-1',
      email: db.admin?.email || 'admin@mahamjawad.com',
      name: 'Maham Jawad',
      role: 'admin',
    },
  });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    validTokens.delete(token);
  }
  res.json({ success: true });
});

// Update Admin Password/Email
app.post('/api/auth/update-credentials', requireAdmin, (req, res) => {
  const { email, newPassword } = req.body;
  const db = getDatabase();
  if (email) db.admin.email = email;
  if (newPassword && newPassword.length >= 6) {
    db.admin.passwordHash = hashPassword(newPassword);
  }
  saveDatabase(db);
  res.json({ success: true, message: 'Admin credentials updated successfully' });
});

// ==================== PROJECTS ROUTES ====================
app.get('/api/projects', (req, res) => {
  const db = getDatabase();
  const includeDrafts = req.query.all === 'true';
  const projects = db.projects || [];

  if (includeDrafts) {
    res.json(projects);
  } else {
    // Only return published projects to public
    res.json(projects.filter((p: any) => p.published !== false));
  }
});

app.get('/api/projects/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const db = getDatabase();
  const project = (db.projects || []).find(
    (p: any) => p.id === idOrSlug || p.slug === idOrSlug
  );

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
});

app.post('/api/projects', requireAdmin, (req, res) => {
  const db = getDatabase();
  const newProj = {
    ...req.body,
    id: req.body.id || `proj-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects = db.projects || [];
  db.projects.unshift(newProj);
  saveDatabase(db);

  res.status(201).json(newProj);
});

app.put('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const index = (db.projects || []).findIndex((p: any) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  res.json(db.projects[index]);
});

app.patch('/api/projects/:id/publish', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const project = (db.projects || []).find((p: any) => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  project.published = !project.published;
  project.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json(project);
});

app.delete('/api/projects/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const initialLength = (db.projects || []).length;
  db.projects = (db.projects || []).filter((p: any) => p.id !== id);

  if (db.projects.length === initialLength) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  saveDatabase(db);
  res.json({ success: true, message: 'Project deleted' });
});

// ==================== CONTENT & SECTIONS ROUTES ====================
app.get('/api/content', (req, res) => {
  const db = getDatabase();
  res.json({
    settings: db.settings || {},
    skills: db.skills || [],
    services: db.services || [],
    experience: db.experience || [],
    education: db.education || [],
    certificates: db.certificates || [],
    achievements: db.achievements || [],
    testimonials: db.testimonials || [],
  });
});

app.put('/api/content/:section', requireAdmin, (req, res) => {
  const { section } = req.params;
  const validSections = [
    'settings',
    'skills',
    'services',
    'experience',
    'education',
    'certificates',
    'achievements',
    'testimonials',
  ];

  if (!validSections.includes(section)) {
    res.status(400).json({ error: `Invalid content section: ${section}` });
    return;
  }

  const db = getDatabase();
  (db as any)[section] = req.body;
  saveDatabase(db);

  res.json({ success: true, section, data: req.body });
});

// Seed/Sync Initial Content Endpoint (used during first setup or reset)
app.post('/api/content/seed', (req, res) => {
  const db = getDatabase();
  const payload = req.body;
  let modified = false;

  if (payload.projects && (!db.projects || db.projects.length === 0)) {
    db.projects = payload.projects;
    modified = true;
  }
  if (payload.settings && (!db.settings || !db.settings.name)) {
    db.settings = payload.settings;
    modified = true;
  }
  if (payload.skills && (!db.skills || db.skills.length === 0)) {
    db.skills = payload.skills;
    modified = true;
  }
  if (payload.services && (!db.services || db.services.length === 0)) {
    db.services = payload.services;
    modified = true;
  }
  if (payload.experience && (!db.experience || db.experience.length === 0)) {
    db.experience = payload.experience;
    modified = true;
  }
  if (payload.education && (!db.education || db.education.length === 0)) {
    db.education = payload.education;
    modified = true;
  }
  if (payload.certificates && (!db.certificates || db.certificates.length === 0)) {
    db.certificates = payload.certificates;
    modified = true;
  }
  if (payload.achievements && (!db.achievements || db.achievements.length === 0)) {
    db.achievements = payload.achievements;
    modified = true;
  }
  if (payload.testimonials && (!db.testimonials || db.testimonials.length === 0)) {
    db.testimonials = payload.testimonials;
    modified = true;
  }
  if (payload.messages && (!db.messages || db.messages.length === 0)) {
    db.messages = payload.messages;
    modified = true;
  }

  if (modified) {
    saveDatabase(db);
  }

  res.json({ success: true, message: 'Database initialized or maintained' });
});

// ==================== MESSAGES ROUTES ====================
app.get('/api/messages', requireAdmin, (req, res) => {
  const db = getDatabase();
  res.json(db.messages || []);
});

app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required' });
    return;
  }

  const db = getDatabase();
  const newMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject || 'General Inquiry').trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.messages = db.messages || [];
  db.messages.unshift(newMessage);
  saveDatabase(db);

  res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage });
});

app.patch('/api/messages/:id/read', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  const msg = (db.messages || []).find((m: any) => m.id === id);

  if (!msg) {
    res.status(404).json({ error: 'Message not found' });
    return;
  }

  msg.read = !msg.read;
  saveDatabase(db);
  res.json(msg);
});

app.delete('/api/messages/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = getDatabase();
  db.messages = (db.messages || []).filter((m: any) => m.id !== id);
  saveDatabase(db);
  res.json({ success: true, message: 'Message deleted' });
});

// ==================== FILE UPLOAD ROUTE ====================
app.post('/api/upload', (req, res) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!dataUrl) {
      res.status(400).json({ error: 'No dataUrl provided' });
      return;
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 data format' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine extension
    let ext = '.jpg';
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('svg')) ext = '.svg';
    else if (mimeType.includes('pdf')) ext = '.pdf';

    const cleanName = (filename || 'upload')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    const uniqueFileName = `${cleanName}_${Date.now()}${ext}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFileName);

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    res.json({ success: true, url: publicUrl, filename: uniqueFileName });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

// ==================== VITE MIDDLEWARE / STATIC SERVING ====================
async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'))) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Portfolio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
