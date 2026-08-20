import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface SiteConfig {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  whatsappNumber: string; // Format: 628xxxxxxxxxx
  whatsappDisplay: string;
  emailPlaceholder: string;
  operatingHours: string;
  socials: {
    instagram: string;
    tiktok: string;
    telegram: string;
  };
  navigation: Array<{
    name: string;
    href: string;
  }>;
}

export const defaultSiteConfig: SiteConfig = {
  name: 'JokiTugasKu',
  domain: 'https://jokitugasku.id',
  tagline: 'Jasa Joki Tugas Kuliah & Sekolah Terpercaya',
  description: 'Solusi terpercaya untuk pengerjaan tugas kuliah, makalah, laporan PKL, proposal, slide PPT, dan skripsi dengan proses transparan dan komunikasi langsung via WhatsApp.',
  whatsappNumber: '62895320603421',
  whatsappDisplay: '0895-3206-03421',
  emailPlaceholder: 'halo@jokitugasku.id',
  operatingHours: 'Setiap Hari: 08.00 - 23.00 WIB (Fast Response)',
  socials: {
    instagram: 'https://instagram.com/jokitugasku.id',
    tiktok: 'https://tiktok.com/@jokitugasku.id',
    telegram: 'https://t.me/jokitugasku_id',
  },
  navigation: [
    { name: 'Layanan', href: '/#layanan' },
    { name: 'Cara Order', href: '/cara-order' },
    { name: 'Portofolio', href: '/portofolio' },
    { name: 'Harga', href: '/harga' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kontak', href: '/kontak' },
  ],
};

// In-memory cache for Supabase settings
let _cachedConfig: SiteConfig | null = null;
let _fetchPromise: Promise<SiteConfig> | null = null;

/**
 * Fetch live settings from Supabase and merge with defaults.
 * Caches the result for the session so it only fetches once.
 */
export async function fetchSiteConfig(): Promise<SiteConfig> {
  if (_cachedConfig) return _cachedConfig;

  // Deduplicate concurrent calls
  if (_fetchPromise) return _fetchPromise;

  _fetchPromise = (async () => {
    try {
      if (!isSupabaseConfigured || !supabase) return defaultSiteConfig;

      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'app_settings')
        .single();

      if (error || !data) return defaultSiteConfig;

      const s = data.value as Record<string, any>;
      _cachedConfig = {
        ...defaultSiteConfig,
        whatsappNumber: s.whatsappNumber || defaultSiteConfig.whatsappNumber,
        whatsappDisplay: s.whatsappDisplay || defaultSiteConfig.whatsappDisplay,
        operatingHours: s.operatingHours || defaultSiteConfig.operatingHours,
        emailPlaceholder: s.contactEmail || defaultSiteConfig.emailPlaceholder,
      };
      return _cachedConfig;
    } catch {
      return defaultSiteConfig;
    }
  })();

  return _fetchPromise;
}

/**
 * Get site config synchronously (returns cached or default).
 * For initial render — use fetchSiteConfig() for guaranteed live data.
 */
export function getSiteConfig(): SiteConfig {
  return _cachedConfig || defaultSiteConfig;
}

export const siteConfig: SiteConfig = defaultSiteConfig;

/**
 * Generate a WhatsApp deep link with encoded message synchronized with live admin settings
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const currentConfig = getSiteConfig();
  const defaultMessage = `Halo Admin JokiTugasKu, saya ingin konsultasi dan tanya-tanya mengenai pengerjaan tugas.`;
  const text = encodeURIComponent(customMessage || defaultMessage);
  return `https://wa.me/${currentConfig.whatsappNumber}?text=${text}`;
}

/**
 * Generate service-specific WhatsApp link
 */
export function getServiceWhatsAppUrl(serviceTitle: string): string {
  const message = `Halo Admin JokiTugasKu, saya ingin tanya dan konsultasi untuk layanan *${serviceTitle}*. Mohon informasi estimasi pengerjaan dan cara pengiriman materinya.`;
  return getWhatsAppUrl(message);
}
