/**
 * Analytics and Conversion Event Tracker for JokiTugasKu.id
 * Implements events defined in Notion 14 — Analytics & Measurement Specification
 */

export type AnalyticsEventName =
  | 'whatsapp_click'
  | 'service_view'
  | 'blog_view'
  | 'faq_interaction'
  | 'portfolio_view'
  | 'lead_created'
  | 'task_created'
  | 'task_completed';

export interface EventParams {
  source?: string;
  service_title?: string;
  service_slug?: string;
  faq_id?: string;
  blog_title?: string;
  portfolio_category?: string;
  [key: string]: any;
}

export function trackEvent(eventName: AnalyticsEventName, params?: EventParams): void {
  const timestamp = new Date().toISOString();
  const payload = {
    event: eventName,
    timestamp,
    ...params,
  };

  // 1. Log in development mode
  if (import.meta.env.DEV) {
    console.log(`[Analytics Event] ${eventName}:`, payload);
  }

  // 2. Push to Google Tag Manager / GA4 dataLayer if present
  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.dataLayer && Array.isArray(win.dataLayer)) {
      win.dataLayer.push(payload);
    }
  }
}
