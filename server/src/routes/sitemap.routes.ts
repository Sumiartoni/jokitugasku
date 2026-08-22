import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';

export const sitemapRouter = Router();

interface StaticRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

/**
 * 100% Real Pages matching frontend routes in src/App.tsx and src/data/services.ts
 */
const REAL_STATIC_ROUTES: StaticRoute[] = [
  // 1. Core Landing & Main Pages
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'cara-order', changefreq: 'monthly', priority: '0.8' },
  { path: 'portofolio', changefreq: 'weekly', priority: '0.8' },
  { path: 'harga', changefreq: 'weekly', priority: '0.8' },
  { path: 'faq', changefreq: 'monthly', priority: '0.7' },
  { path: 'tentang', changefreq: 'monthly', priority: '0.7' },
  { path: 'kontak', changefreq: 'monthly', priority: '0.7' },
  { path: 'blog', changefreq: 'daily', priority: '0.9' },

  // 2. 10 Real Services from src/data/services.ts
  { path: 'layanan/joki-tugas', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-tugas-kuliah', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-tugas-smk', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-tugas-sma', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-makalah', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-laporan', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-laporan-pkl', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-proposal', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-ppt', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/joki-skripsi', changefreq: 'weekly', priority: '0.9' },

  // 3. Real Legal & Policy Pages from src/App.tsx
  { path: 'kebijakan-privasi', changefreq: 'yearly', priority: '0.5' },
  { path: 'syarat-ketentuan', changefreq: 'yearly', priority: '0.5' },
  { path: 'kebijakan-refund', changefreq: 'yearly', priority: '0.5' },
  { path: 'kebijakan-revisi', changefreq: 'yearly', priority: '0.5' },
  { path: 'kebijakan-pembatalan', changefreq: 'yearly', priority: '0.5' },
  { path: 'kebijakan-pembayaran', changefreq: 'yearly', priority: '0.5' },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(isoOrDateString?: string): string {
  if (!isoOrDateString) return new Date().toISOString().split('T')[0];
  try {
    const d = new Date(isoOrDateString);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {}
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate Real-Time Dynamic Sitemap XML strictly from live frontend routes & Supabase articles
 */
export async function generateSitemapXml(): Promise<string> {
  const BASE_URL = 'https://jokitugasku.id';
  const today = new Date().toISOString().split('T')[0];

  // Fetch all real live published articles from Supabase PostgreSQL database
  let articles: any[] = [];
  try {
    const { data } = await supabase
      .from('articles')
      .select('slug, updated_at, created_at, date, status')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false });

    if (Array.isArray(data)) {
      articles = data;
    }
  } catch (err) {
    console.warn('⚠️ [Sitemap] Warning querying articles from Supabase:', err);
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // 1. Real Static Pages (Homepage, Real Services, Real Info & Legal Pages)
  for (const route of REAL_STATIC_ROUTES) {
    const loc = route.path ? `${BASE_URL}/${route.path}` : BASE_URL;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // 2. Real Dynamic Articles from Database
  for (const article of articles) {
    if (!article.slug) continue;
    const cleanSlug = article.slug.startsWith('/') ? article.slug.slice(1) : article.slug;
    const loc = `${BASE_URL}/blog/${cleanSlug}`;
    const lastMod = formatDate(article.updated_at || article.created_at || article.date);

    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${lastMod}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

const handleSitemapRequest = async (req: Request, res: Response) => {
  try {
    const xml = await generateSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(xml);
  } catch (err: any) {
    console.error('❌ [Sitemap] Error generating real-time sitemap:', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Error generating sitemap XML');
  }
};

sitemapRouter.get('/sitemap.xml', handleSitemapRequest);
sitemapRouter.get('/', handleSitemapRequest);
