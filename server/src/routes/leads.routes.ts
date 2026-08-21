import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';
import { requireAuth } from '../middleware/auth';

export const leadsRouter = Router();

/**
 * Public: Create lead from Landing Page
 */
leadsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, wa, service, institution, notes } = req.body;

    if (!wa || !name) {
      return res.status(400).json({
        success: false,
        message: 'Nama dan nomor WhatsApp wajib diisi.'
      });
    }

    const { data, error } = await supabase
      .from('crm_leads')
      .insert({
        name: name.trim(),
        wa: wa.trim(),
        service: service || 'Umum',
        institution: institution || '',
        notes: notes || '',
        status: 'NEW',
        source: 'Website',
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
      message: 'Konsultasi Anda telah diterima. Tim kami akan segera menghubungi via WhatsApp.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Admin: Get all CRM Leads
 */
leadsRouter.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

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
 * Admin: Update lead status
 */
leadsRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const { data, error } = await supabase
      .from('crm_leads')
      .update({
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
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
      message: 'Status prospek berhasil diperbarui.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
