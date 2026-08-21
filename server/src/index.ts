import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes';
import { settingsRouter } from './routes/settings.routes';
import { aiRouter } from './routes/ai.routes';
import { emailRouter } from './routes/email.routes';
import { tasksRouter } from './routes/tasks.routes';
import { leadsRouter } from './routes/leads.routes';
import { articlesRouter } from './routes/articles.routes';
import { sitemapRouter } from './routes/sitemap.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// 1. Security Headers via Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// 2. CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow subdomains of jokitugasku.id
    if (origin.endsWith('.jokitugasku.id') || origin === 'https://jokitugasku.id') {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback for seamless dev & prod
  },
  credentials: true
}));

// 3. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Real-time dynamic sitemap (Publicly accessible with zero cache)
app.use('/sitemap.xml', sitemapRouter);
app.use('/api/sitemap.xml', sitemapRouter);
app.use('/api/sitemap', sitemapRouter);

// 5. Rate Limiting (100 requests per minute per IP for general endpoints)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.'
  }
});
app.use('/api/', generalLimiter);

// 6. Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'UP',
    platform: 'JokiTugasKu v2 Dedicated Backend',
    timestamp: new Date().toISOString()
  });
});

// 7. Mount API Routers
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/email', emailRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/articles', articlesRouter);

// 7. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server backend.'
  });
});

// 8. Process Safety Handlers
process.on('uncaughtException', (err) => {
  console.error('⚠️ [Server Safety] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ [Server Safety] Unhandled Rejection:', reason);
});

// 9. Start Express Server (Bind to 0.0.0.0 for reliable local/reverse-proxy communication)
const server = app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 JokiTugasKu Backend Server running on http://127.0.0.1:${PORT}`);
  console.log(`🔒 Security & API Key Proxy active`);
});

server.on('error', (err: any) => {
  console.error('⚠️ [Server Network Error]:', err);
});
