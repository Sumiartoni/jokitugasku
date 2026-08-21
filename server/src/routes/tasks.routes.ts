import { Router, Response } from 'express';
import { supabase } from '../config/db';
import { requireAuth, AuthRequest } from '../middleware/auth';

export const tasksRouter = Router();

/**
 * Get tasks (Workers see their own tasks, Admins see all)
 */
tasksRouter.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

    if (user?.role === 'WORKER') {
      query = query.eq('worker_id', user.id);
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
 * Create new task (Admin only)
 */
tasksRouter.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const taskData = req.body;
    const taskCode = `JT-${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        ...taskData,
        task_code: taskData.task_code || taskCode,
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
      message: 'Tugas berhasil dibuat.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * Update task status
 */
tasksRouter.put('/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, revision_count } = req.body;

    const { data, error } = await supabase
      .from('tasks')
      .update({
        status,
        ...(revision_count !== undefined ? { revision_count } : {}),
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
      message: 'Status tugas berhasil diperbarui.',
      data
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
