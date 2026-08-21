import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/db';

export const settingsRouter = Router();

const DEFAULT_SETTINGS = {
  whatsappNumber: '62895320603421',
  whatsappDisplay: '0895-3206-03421',
  operatingHours: 'Setiap Hari: 08.00 - 23.00 WIB (Fast Response)',
  contactEmail: 'halo@jokitugasku.id',
  groqApiKey: '',
  groqDefaultModel: 'llama-3.3-70b-versatile',
  groqTemperature: 0.7,
  groqMaxTokens: 3500,
  emailProvider: 'resend',
  resendApiKey: '',
  resendSenderEmail: 'notifikasi@jokitugasku.id',
  resendSenderName: 'JokiTugasKu Official',
  brevoApiKey: '',
  sendWelcomeWorkerEmail: true,
  sendTaskAssignedEmail: true,
  sendArticlePublishedEmail: false,
};

/**
 * Helper to automatically sync API keys and sensitive settings to .env file on VPS
 */
function syncEnvFile(settings: any) {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const envMap: Record<string, string> = {
      GROQ_API_KEY: settings.groqApiKey || '',
      RESEND_API_KEY: settings.resendApiKey || '',
      BREVO_API_KEY: settings.brevoApiKey || '',
      WHATSAPP_NUMBER: settings.whatsappNumber || '',
      CONTACT_EMAIL: settings.contactEmail || ''
    };

    let lines = envContent.split(/\r?\n/);
    for (const [key, val] of Object.entries(envMap)) {
      if (val !== undefined) {
        const idx = lines.findIndex(l => l.startsWith(`${key}=`));
        if (idx >= 0) {
          lines[idx] = `${key}=${val}`;
        } else if (val) {
          lines.push(`${key}=${val}`);
        }
      }
    }

    fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');
  } catch (e) {
    console.warn('⚠️ [Settings] Warning writing to .env:', e);
  }
}

/**
 * Public Endpoint: Returns only public-safe site settings for Landing Page
 */
settingsRouter.get('/public', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'app_settings')
      .single();

    if (error || !data) {
      return res.json({
        success: true,
        data: {
          whatsappNumber: DEFAULT_SETTINGS.whatsappNumber,
          whatsappDisplay: DEFAULT_SETTINGS.whatsappDisplay,
          operatingHours: DEFAULT_SETTINGS.operatingHours,
          contactEmail: DEFAULT_SETTINGS.contactEmail,
        }
      });
    }

    const s = data.value || {};
    return res.json({
      success: true,
      data: {
        whatsappNumber: s.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
        whatsappDisplay: s.whatsappDisplay || DEFAULT_SETTINGS.whatsappDisplay,
        operatingHours: s.operatingHours || DEFAULT_SETTINGS.operatingHours,
        contactEmail: s.contactEmail || DEFAULT_SETTINGS.contactEmail,
      }
    });
  } catch (err: any) {
    return res.json({
      success: true,
      data: {
        whatsappNumber: DEFAULT_SETTINGS.whatsappNumber,
        whatsappDisplay: DEFAULT_SETTINGS.whatsappDisplay,
        operatingHours: DEFAULT_SETTINGS.operatingHours,
        contactEmail: DEFAULT_SETTINGS.contactEmail,
      }
    });
  }
});

/**
 * Admin Endpoint: Get full settings
 */
settingsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'app_settings')
      .single();

    if (error || !data) {
      return res.json({
        success: true,
        data: DEFAULT_SETTINGS
      });
    }

    return res.json({
      success: true,
      data: { ...DEFAULT_SETTINGS, ...(data.value || {}) }
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil pengaturan dari database.'
    });
  }
});

/**
 * Admin Endpoint: Save / update full settings & automatically write to .env
 */
settingsRouter.put('/', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Payload data pengaturan tidak valid.'
      });
    }

    // Fetch existing
    const { data: existingData } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'app_settings')
      .single();

    const current = existingData?.value || DEFAULT_SETTINGS;
    const merged = { ...current, ...updates };

    // 1. Save to Supabase
    const { error: upsertError } = await supabase
      .from('settings')
      .upsert({
        key: 'app_settings',
        value: merged,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (upsertError) {
      return res.status(500).json({
        success: false,
        message: `Gagal menyimpan ke database: ${upsertError.message}`
      });
    }

    // 2. Automatically sync to .env file on VPS
    syncEnvFile(merged);

    return res.json({
      success: true,
      message: 'Pengaturan berhasil disimpan ke Database Supabase dan file .env VPS.',
      data: merged
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Error server: ${err.message}`
    });
  }
});
