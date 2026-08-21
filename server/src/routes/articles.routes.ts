import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';
import { requireAdmin } from '../middleware/auth';

export const articlesRouter = Router();

/**
 * Public: Get published articles
 */
articlesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = supabase.from('articles').select('*').eq('status', 'PUBLISHED').order('created_at', { ascending: false });

    if (category && typeof category === 'string' && category !== 'Semua') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      data: data || []
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Public: Get article by slug
 */
articlesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    return res.json({
      success: true,
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Admin: Create article
 */
articlesRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  try {
    const articleData = req.body;
    const slug = articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...articleData,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: 'Artikel berhasil diterbitkan.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Admin: Update article
 */
articlesRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const articleData = req.body;

    const { data, error } = await supabase
      .from('articles')
      .update({
        ...articleData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: 'Artikel berhasil diperbarui.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Admin: Delete article
 */
articlesRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: 'Artikel berhasil dihapus.'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
