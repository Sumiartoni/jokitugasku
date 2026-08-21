import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';
import { requireAuth } from '../middleware/auth';

export const emailRouter = Router();

/**
 * Send email helper using configured provider in database
 */
export async function sendEmailDirect(params: {
  toEmail: string;
  toName: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}): Promise<{ success: boolean; message: string; providerUsed: string }> {
  const { data } = await supabase.from('settings').select('value').eq('key', 'app_settings').single();
  const settings = data?.value || {};
  const provider = settings.emailProvider || 'resend';

  // 1. Resend Provider
  if (provider === 'resend') {
    if (!settings.resendApiKey) {
      return {
        success: true,
        message: `(Simulasi Sandbox) Email '${params.subject}' berhasil disiapkan untuk ${params.toEmail}. Tambahkan Resend API Key di Settings untuk pengiriman live.`,
        providerUsed: 'Resend (Sandbox / Simulasi)'
      };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: `${settings.resendSenderName || 'JokiTugasKu'} <${settings.resendSenderEmail || 'notifikasi@jokitugasku.id'}>`,
          to: [params.toEmail],
          subject: params.subject,
          html: params.htmlContent,
          text: params.textContent || params.subject
        })
      });

      if (!res.ok) {
        const err: any = await res.json().catch(() => ({}));
        return {
          success: false,
          message: `Resend Error: ${err.message || res.statusText}`,
          providerUsed: 'Resend API'
        };
      }

      return {
        success: true,
        message: `Email resmi berhasil dikirim ke ${params.toEmail} via Resend.`,
        providerUsed: 'Resend API'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Gagal mengirim email via Resend: ${e.message}`,
        providerUsed: 'Resend API'
      };
    }
  }

  // 2. Brevo API Provider
  if (provider === 'brevo_api') {
    if (!settings.brevoApiKey) {
      return {
        success: true,
        message: `(Simulasi Brevo) Email '${params.subject}' berhasil disiapkan untuk ${params.toEmail}.`,
        providerUsed: 'Brevo API (Simulasi)'
      };
    }

    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': settings.brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { 
            name: settings.brevoSenderName || 'JokiTugasKu System', 
            email: settings.brevoSenderEmail || 'admin@jokitugasku.id' 
          },
          to: [{ email: params.toEmail, name: params.toName }],
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent
        })
      });

      if (!res.ok) {
        const err: any = await res.json().catch(() => ({}));
        return {
          success: false,
          message: `Brevo Error: ${err.message || res.statusText}`,
          providerUsed: 'Brevo API'
        };
      }

      return {
        success: true,
        message: `Email resmi berhasil dikirim ke ${params.toEmail} via Brevo API.`,
        providerUsed: 'Brevo API'
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Gagal mengirim email via Brevo: ${e.message}`,
        providerUsed: 'Brevo API'
      };
    }
  }

  return {
    success: true,
    message: `Notifikasi email untuk ${params.toEmail} berhasil diproses.`,
    providerUsed: 'Email Service'
  };
}

/**
 * Test email endpoint (requires Auth)
 */
emailRouter.post('/test', requireAuth, async (req: Request, res: Response) => {
  const { toEmail } = req.body;
  if (!toEmail || !toEmail.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Format email tujuan tidak valid.'
    });
  }

  const result = await sendEmailDirect({
    toEmail: toEmail.trim(),
    toName: 'Tester JokiTugasKu',
    subject: 'Uji Coba Integrasi Email - JokiTugasKu Production',
    htmlContent: `
      <h2>Halo dari JokiTugasKu Server!</h2>
      <p>Email ini dikirim dari server backend mandiri untuk memverifikasi konfigurasi email transaksional Anda.</p>
      <p>Waktu kirim: ${new Date().toLocaleString('id-ID')}</p>
    `
  });

  return res.json(result);
});

/**
 * General send email endpoint (requires Auth)
 */
emailRouter.post('/send', requireAuth, async (req: Request, res: Response) => {
  const { toEmail, toName, subject, htmlContent, textContent } = req.body;

  if (!toEmail || !subject || !htmlContent) {
    return res.status(400).json({
      success: false,
      message: 'Parameter toEmail, subject, dan htmlContent wajib diisi.'
    });
  }

  const result = await sendEmailDirect({
    toEmail,
    toName: toName || 'Klien JokiTugasKu',
    subject,
    htmlContent,
    textContent
  });

  return res.json(result);
});
