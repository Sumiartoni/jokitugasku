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
  whatsappNumber: '6281234567890',
  whatsappDisplay: '+62 812-3456-7890',
  emailPlaceholder: 'halo@jokitugasku.id',
  operatingHours: 'Setiap Hari: 08.00 - 22.00 WIB (Fast Response)',
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

/**
 * Get dynamic site config synchronized with Admin Panel settings
 */
export function getSiteConfig(): SiteConfig {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('jt_app_settings') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSiteConfig,
        whatsappNumber: parsed.whatsappNumber || defaultSiteConfig.whatsappNumber,
        whatsappDisplay: parsed.whatsappDisplay || defaultSiteConfig.whatsappDisplay,
        operatingHours: parsed.operatingHours || defaultSiteConfig.operatingHours,
        emailPlaceholder: parsed.contactEmail || defaultSiteConfig.emailPlaceholder,
      };
    }
  } catch {
    // Fallback to default
  }
  return defaultSiteConfig;
}

export const siteConfig: SiteConfig = getSiteConfig();

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
