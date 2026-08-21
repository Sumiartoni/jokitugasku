import { Router, Request, Response } from 'express';
import { supabase } from '../config/db';
import { requireAdmin } from '../middleware/auth';

export const aiRouter = Router();

/**
 * Helper to get Groq API key from settings in database or payload override
 */
async function getActiveGroqKey(overrideKey?: string): Promise<string> {
  if (overrideKey && overrideKey.trim().startsWith('gsk_')) {
    return overrideKey.trim();
  }
  const { data } = await supabase.from('settings').select('value').eq('key', 'app_settings').single();
  return data?.value?.groqApiKey || '';
}

/**
 * Test Groq API Key
 */
aiRouter.post('/test', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    const key = await getActiveGroqKey(apiKey);

    if (!key || !key.startsWith('gsk_')) {
      return res.status(400).json({
        success: false,
        message: 'Groq API Key tidak ditemukan atau formatnya salah (harus diawali "gsk_").'
      });
    }

    // Step 1: Validate key via /models endpoint (free, no chat quota used)
    const modelsRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${key}` }
    });

    if (!modelsRes.ok) {
      const errData: any = await modelsRes.json().catch(() => ({}));
      return res.status(400).json({
        success: false,
        message: `API Key tidak valid: ${errData.error?.message || 'Key expired atau salah'}`
      });
    }

    const modelsData: any = await modelsRes.json();
    const availableIds: string[] = (modelsData.data || []).map((m: any) => m.id);

    // Filter out non-chat models (whisper, tts, playai)
    const chatModels = availableIds.filter((id: string) => 
      !id.includes('whisper') && !id.includes('tts') && !id.includes('playai') && !id.includes('distil-')
    );

    const preferred = ['llama-3.3-70b-versatile', 'deepseek-r1-distill-llama-70b', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
    const modelToUse = preferred.find(m => chatModels.includes(m)) || chatModels[0];

    if (!modelToUse) {
      return res.status(400).json({
        success: false,
        message: 'API Key valid, namun tidak ada model chat yang aktif di akun Groq Anda.'
      });
    }

    // Step 2: Minimal test chat
    const chatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [{ role: 'user', content: 'Ping: JokiTugasKu AI check. Jawab 1 kata: Aktif.' }],
        max_tokens: 5
      })
    });

    if (chatRes.ok) {
      return res.json({
        success: true,
        message: `✅ Koneksi Groq API Berhasil! Model aktif: ${modelToUse}.`,
        modelUsed: modelToUse
      });
    } else {
      const errData: any = await chatRes.json().catch(() => ({}));
      return res.status(400).json({
        success: false,
        message: `Gagal menjalankan model ${modelToUse}: ${errData.error?.message || 'Unknown error'}`
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Error jaringan backend ke Groq: ${err.message}`
    });
  }
});

/**
 * Generate Article with Groq AI (Server-side proxy)
 */
aiRouter.post('/generate-article', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { topic, category, targetAudience, tone, wordCount, customKeywords, apiKeyOverride } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        message: 'Topik dan Kategori artikel wajib diisi.'
      });
    }

    const key = await getActiveGroqKey(apiKeyOverride);
    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Groq API Key belum dikonfigurasi. Masukkan API Key di Settings.'
      });
    }

    // Fetch default settings for model selection
    const { data: settingsData } = await supabase.from('settings').select('value').eq('key', 'app_settings').single();
    const settings = settingsData?.value || {};
    const model = settings.groqDefaultModel || 'llama-3.3-70b-versatile';
    const temperature = settings.groqTemperature || 0.7;
    const maxTokens = settings.groqMaxTokens || 3500;

    const systemPrompt = `Anda adalah pakar penulisan artikel akademik, edukasi, dan SEO spesialis brand JokiTugasKu. 
Tuliskan artikel komprehensif, terstruktur, berbasis riset, faktual, dan ramah SEO dengan gaya bahasa Indonesia formal namun mudah dipahami oleh mahasiswa dan pelajar.

ATURAN OUTPUT:
1. Keluarkan HANYA JSON valid tanpa teks pengantar atau penutup.
2. Format JSON persis seperti ini:
{
  "title": "Judul Artikel Menarik & SEO-Friendly",
  "excerpt": "Ringkasan 2-3 kalimat menarik untuk preview",
  "readTime": "5 menit baca",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "content": "Isi lengkap artikel dalam format Markdown baku...",
  "faqs": [
    {"question": "Pertanyaan 1?", "answer": "Jawaban 1"},
    {"question": "Pertanyaan 2?", "answer": "Jawaban 2"}
  ]
}`;

    const userPrompt = `Tuliskan artikel blog akademik lengkap:
- Topik: ${topic}
- Kategori: ${category}
- Target Pembaca: ${targetAudience || 'Mahasiswa'}
- Gaya Bahasa / Tone: ${tone || 'Formal Akademik'}
- Perkiraan Panjang: ±${wordCount || 1000} kata
${customKeywords ? `- Kata Kunci Wajib (Keywords): ${customKeywords}` : ''}

Pastikan artikel memiliki:
1. Heading struktur yang jelas (##, ###)
2. Tips praktis atau studi kasus singkat
3. Bagian kesimpulan dengan call-to-action halus ke layanan JokiTugasKu
4. Format markdown yang rapi`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      })
    });

    if (!groqRes.ok) {
      const errData: any = await groqRes.json().catch(() => ({}));
      return res.status(groqRes.status).json({
        success: false,
        message: `Groq Error (${groqRes.status}): ${errData.error?.message || groqRes.statusText}`
      });
    }

    const groqData: any = await groqRes.json();
    const rawContent = groqData.choices?.[0]?.message?.content || '{}';
    const parsedArticle = JSON.parse(rawContent);

    return res.json({
      success: true,
      data: parsedArticle,
      modelUsed: model
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Gagal men-generate artikel: ${err.message}`
    });
  }
});
