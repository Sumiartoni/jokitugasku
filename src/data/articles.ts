import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tags: string[];
  contentMarkdown: string;
  faqs?: Array<{ question: string; answer: string }>;
  status: 'PUBLISHED' | 'DRAFT';
}

let _cachedArticles: ArticleItem[] = [];
let _isLoaded = false;

function mapDatabaseRow(row: any): ArticleItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    category: row.category || 'Panduan Akademik',
    readTime: row.read_time || '5 menit baca',
    date: row.date || new Date(row.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    tags: Array.isArray(row.tags) ? row.tags : [],
    contentMarkdown: row.content_markdown || row.contentMarkdown || '',
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    status: row.status || 'PUBLISHED'
  };
}

/**
 * Fetch published articles directly from Backend API or Supabase (100% Dynamic)
 */
export async function fetchPublishedArticles(): Promise<ArticleItem[]> {
  // 1. Try Backend API first
  try {
    const res = await fetch('/api/articles');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        _cachedArticles = json.data.map(mapDatabaseRow);
        _isLoaded = true;
        return _cachedArticles;
      }
    }
  } catch {
    // Fallback to Supabase client
  }

  // 2. Fallback to Supabase client
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false });

      if (!error && data) {
        _cachedArticles = data.map(mapDatabaseRow);
        _isLoaded = true;
        return _cachedArticles;
      }
    }
  } catch {
    // Return cached
  }

  _isLoaded = true;
  return _cachedArticles;
}

export function getAllArticles(): ArticleItem[] {
  return _cachedArticles;
}

export async function fetchArticleBySlug(slug: string): Promise<ArticleItem | undefined> {
  // 1. Check in cache
  const found = _cachedArticles.find(a => a.slug === slug || a.id === slug);
  if (found) return found;

  // 2. Try Backend API
  try {
    const res = await fetch(`/api/articles/${slug}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const item = mapDatabaseRow(json.data);
        _cachedArticles = [item, ..._cachedArticles.filter(a => a.slug !== item.slug)];
        return item;
      }
    }
  } catch {
    // Fallback to Supabase client
  }

  // 3. Fallback to Supabase client
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const item = mapDatabaseRow(data);
        _cachedArticles = [item, ..._cachedArticles.filter(a => a.slug !== item.slug)];
        return item;
      }
    }
  } catch {
    // Ignored
  }

  return undefined;
}

export function getArticleBySlug(slug: string): ArticleItem | undefined {
  return _cachedArticles.find(a => a.slug === slug || a.id === slug);
}
