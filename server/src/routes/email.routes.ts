import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';

export const emailRouter = Router();

export interface SendEmailPayload {
  provider?: 'resend' | 'brevo_api' | 'brevo_smtp';
  apiKey?: string;
  senderEmail?: string;
  senderName?: string;
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * Core email sender for both Resend and Brevo
 */
export async function sendEmailDirect(params: SendEmailPayload): Promise<{ success: boolean; message: string; providerUsed: string }> {
  // Fetch fallback settings from database
  const { data } = await supabase.from('settings').select('value').eq('key', 'app_settings').single();
  const dbSettings = data?.value || {};

  const provider = params.provider || dbSettings.emailProvider || 'resend';

  // 1. RESEND PROVIDER
  if (provider === 'resend') {
    const apiKey = params.apiKey || dbSettings.resendApiKey;
    const senderEmail = params.senderEmail || dbSettings.resendSenderEmail || 'onboarding@resend.dev';
    const senderName = params.senderName || dbSettings.resendSenderName || 'JokiTugasKu';

    if (!apiKey) {
      return {
        success: false,
        message: 'Resend API Key belum diisi. Masukkan API Key Resend di Pengaturan.',
        providerUsed: 'Resend'
      };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${senderName} <${senderEmail}>`,
          to: [params.toEmail],
          subject: params.subject,
          html: params.htmlContent,
          text: params.textContent || params.subject
        })
      });

      const resJson: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        let errMsg = resJson.message || resJson.error?.message || `HTTP ${res.status}: ${res.statusText}`;
        if (errMsg.includes('domain') || errMsg.includes('verify')) {
          errMsg += ' (Tips: Pastikan domain email pengirim telah diverifikasi di Dashboard Resend, atau gunakan sender default onboarding@resend.dev untuk pengujian ke email akun Resend Anda).';
        }
        return {
          success: false,
          message: `Resend Error: ${errMsg}`,
          providerUsed: 'Resend API'
        };
      }

      return {
        success: true,
        message: `Email berhasil dikirim ke ${params.toEmail} via Resend (ID: ${resJson.id || 'OK'}).`,
        providerUsed: 'Resend API'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Gagal menghubungkan ke Resend API: ${e.message}`,
        providerUsed: 'Resend API'
      };
    }
  }

  // 2. BREVO PROVIDER
  if (provider === 'brevo_api') {
    const apiKey = params.apiKey || dbSettings.brevoApiKey;
    const senderEmail = params.senderEmail || dbSettings.brevoSenderEmail || dbSettings.contactEmail || 'admin@jokitugasku.id';
    const senderName = params.senderName || dbSettings.brevoSenderName || 'JokiTugasKu';

    if (!apiKey) {
      return {
        success: false,
        message: 'Brevo API Key belum diisi. Masukkan API Key Brevo di Pengaturan.',
        providerUsed: 'Brevo'
      };
    }

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey.trim(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { 
            name: senderName, 
            email: senderEmail 
          },
          to: [{ email: params.toEmail, name: params.toName || 'Pelanggan JokiTugasKu' }],
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent || params.subject
        })
      });

      const resJson: any = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errMsg = resJson.message || `HTTP ${res.status}: ${res.statusText}`;
        return {
          success: false,
          message: `Brevo Error: ${errMsg}`,
          providerUsed: 'Brevo API'
        };
      }

      return {
        success: true,
        message: `Email berhasil dikirim ke ${params.toEmail} via Brevo API (ID: ${resJson.messageId || 'OK'}).`,
        providerUsed: 'Brevo API'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Gagal menghubungkan ke Brevo API: ${e.message}`,
        providerUsed: 'Brevo API'
      };
    }
  }

  return {
    success: false,
    message: `Provider email '${provider}' tidak dikenali. Pilih 'resend' atau 'brevo_api'.`,
    providerUsed: provider
  };
}

/**
 * POST /api/email/test
 * Quick endpoint to test email configuration from admin settings
 */
emailRouter.post('/test', async (req: Request, res: Response) => {
  const { toEmail, provider, apiKey, senderEmail, senderName } = req.body;
  if (!toEmail || !toEmail.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Format email tujuan tidak valid.'
    });
  }

  const result = await sendEmailDirect({
    toEmail: toEmail.trim(),
    toName: 'Admin Tester',
    provider,
    apiKey,
    senderEmail,
    senderName,
    subject: `Uji Coba Integrasi Email [${provider || 'Default'}] - JokiTugasKu Live`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #6366f1;">✅ Integrasi Email Berhasil!</h2>
        <p>Email uji coba ini berhasil dikirim dari sistem backend <strong>JokiTugasKu</strong>.</p>
        <p><strong>Provider:</strong> ${provider || 'Default'}</p>
        <p><strong>Waktu Kirim:</strong> ${new Date().toLocaleString('id-ID')}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">JokiTugasKu - Solusi Akademik &amp; Pembuatan Tugas Terpercaya.</p>
      </div>
    `
  });

  return res.json(result);
});

/**
 * POST /api/email/send
 * General transactional email endpoint
 */
emailRouter.post('/send', async (req: Request, res: Response) => {
  const { toEmail, toName, subject, htmlContent, textContent, provider, apiKey, senderEmail, senderName } = req.body;

  if (!toEmail || !subject || !htmlContent) {
    return res.status(400).json({
      success: false,
      message: 'Parameter toEmail, subject, dan htmlContent wajib diisi.'
    });
  }

  const result = await sendEmailDirect({
    toEmail,
    toName: toName || 'Pelanggan JokiTugasKu',
    subject,
    htmlContent,
    textContent,
    provider,
    apiKey,
    senderEmail,
    senderName
  });

  return res.json(result);
});
