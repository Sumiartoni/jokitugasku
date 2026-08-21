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

    const systemPrompt = `Anda adalah Lead Academic Editor & SEO Content Strategist senior untuk platform JokiTugasKu.
Tugas Anda adalah menulis artikel blog akademik, panduan tugas kuliah/sekolah, dan edukasi ilmiah dengan kualitas penulisan setara jurnal dan publikasi resmi kampus.

ATURAN STRUKTUR & KERAPIAN (WAJIB DIPATUHI):
1. Gaya Bahasa: Bahasa Indonesia baku, ilmiah, edukatif, profesional, bebas jargon membingungkan, dan mudah dipahami mahasiswa/pelajar.
2. Jangan pernah menaruh '# Judul' di dalam isi 'content', karena judul sudah tampil di header halaman. Mulai langsung dengan '## 1. Pendahuluan & Latar Belakang'.
3. Format Markdown Wajib Mencakup:
   - Heading hirarki rapi (## untuk bab utama, ### untuk sub-poin).
   - Pemisah seksi menggunakan '---'.
   - Kotak sorotan tips dengan format blockquote: '> 💡 **Tips Praktis:** ...'
   - Tabel Markdown komparasi atau checklist penilaian (minimal 1 tabel per artikel).
   - Poin berpenomoran dengan kata kunci ditebalkan: '1. **Identifikasi Variabel**: ...'
   - Bagian penutup/kesimpulan yang merangkum solusi dan menyisipkan rekomendasi layanan JokiTugasKu secara elegan.
4. Output HANYA JSON murni yang valid tanpa teks pembuka atau markdown wrapper di luar JSON.

FORMAT JSON OUTPUT:
{
  "title": "Judul Artikel Menarik, Jelas & Ramah SEO (55-65 karakter)",
  "slug": "url-slug-kebab-case",
  "excerpt": "Ringkasan 2 kalimat persuasif & informatif (140-160 karakter)",
  "readTime": "5 menit baca",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "content": "Isi artikel lengkap berformat Markdown...",
  "faqs": [
    {"question": "Pertanyaan 1?", "answer": "Jawaban jelas dan ringkas."},
    {"question": "Pertanyaan 2?", "answer": "Jawaban jelas dan ringkas."}
  ]
}`;

    const userPrompt = `Tuliskan artikel blog akademik yang sangat rapi dan mendalam:
- Topik: "${topic}"
- Kategori Layanan: "${category}"
- Target Pembaca: "${targetAudience || 'Mahasiswa & Pelajar'}"
- Gaya Bahasa: "${tone || 'Formal Akademik'}"
- Target Panjang: ±${wordCount || 1000} kata
${customKeywords ? `- Kata Kunci Wajib (Keywords): "${customKeywords}"` : ''}

Pastikan artikel memiliki struktur yang kaya:
1. ## 1. Pendahuluan & Konsep Dasar (Latar belakang fenomena dan urgensi topik)
2. ## 2. Kerangka Kerja & Sistematika Penulisan
3. ## 3. Langkah-Langkah Praktis / Panduan Implementasi (Disertai contoh konkret)
4. Tabel Markdown Perbandingan / Rubrik Penilaian
5. > 💡 **Tips Akademik Eksklusif:** (Callout blockquote bermanfaat)
6. ## 4. Kesalahan Umum yang Harus Dihindari
7. ## 5. Kesimpulan & Rekomendasi Solusi Tugas`;

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
