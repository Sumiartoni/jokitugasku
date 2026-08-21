import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';

export const sitemapRouter = Router();

interface StaticRoute {
  path: string;
  changefreq: string;
  priority: string;
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: '', changefreq: 'daily', priority: '1.0' },
  { path: 'layanan', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/skripsi-tesis', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/makalah-jurnal', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/olah-data-statistik', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/pemrograman-it', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/desain-presentasi', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/parafrase-turnitin', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/terjemahan-akademik', changefreq: 'weekly', priority: '0.9' },
  { path: 'layanan/tugas-kuliah-harian', changefreq: 'weekly', priority: '0.9' },
  { path: 'blog', changefreq: 'daily', priority: '0.9' },
  { path: 'cara-kerja', changefreq: 'monthly', priority: '0.8' },
  { path: 'harga', changefreq: 'monthly', priority: '0.8' },
  { path: 'portfolio', changefreq: 'monthly', priority: '0.8' },
  { path: 'testimoni', changefreq: 'monthly', priority: '0.8' },
  { path: 'faq', changefreq: 'monthly', priority: '0.7' },
  { path: 'tentang-kami', changefreq: 'monthly', priority: '0.7' },
  { path: 'kebijakan-privasi', changefreq: 'yearly', priority: '0.5' },
  { path: 'syarat-ketentuan', changefreq: 'yearly', priority: '0.5' },
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
 * Generate Real-Time Dynamic Sitemap XML from Supabase PostgreSQL Database
 */
export async function generateSitemapXml(): Promise<string> {
  const BASE_URL = 'https://jokitugasku.id';
  const today = new Date().toISOString().split('T')[0];

  // Fetch all live published articles from Supabase
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

  // 1. Static Core Pages
  for (const route of STATIC_ROUTES) {
    const loc = route.path ? `${BASE_URL}/${route.path}` : BASE_URL;
    xml += '  <url>\n';
    xml += `    <loc>${escapeXml(loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  // 2. Dynamic Live Articles from Database
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
    console.error('❌ [Sitemap] Error generating sitemap:', err);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('Error generating sitemap XML');
  }
};

sitemapRouter.get('/sitemap.xml', handleSitemapRequest);
sitemapRouter.get('/', handleSitemapRequest);
