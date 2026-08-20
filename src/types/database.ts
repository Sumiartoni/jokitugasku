/**
 * Database Entity Types for JokiTugasKu.id
 * Exactly matching Notion 08 — ERD & Database Specification
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_OPERATOR' | 'WORKER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  last_login_at?: string;
}

export interface ServiceCategoryEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ServiceEntity {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  icon_name: string;
  badge?: string;
  target_audience: string;
  estimated_time: string;
  is_active: boolean;
}

export interface SeoMetadataEntity {
  id: string;
  target_type: 'PAGE' | 'SERVICE' | 'BLOG';
  target_id: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  robots: string; // 'index, follow' | 'noindex, follow'
  og_image?: string;
  schema_json?: string;
}

export interface LeadEntity {
  id: string;
  whatsapp_number: string;
  customer_name?: string;
  service_interest: string;
  source: string; // 'HOMEPAGE', 'SERVICE_PAGE', 'BLOG'
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes?: string;
  assigned_admin_id?: string;
  created_at: string;
  last_contact_at?: string;
}

export interface CustomerEntity {
  id: string;
  whatsapp_number: string;
  name: string;
  institution?: string;
  total_orders: number;
  total_spend: number;
  created_at: string;
}

export type TaskStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'REVISION'
  | 'APPROVED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface TaskEntity {
  id: string;
  task_code: string; // e.g. 'JT-2026-001'
  customer_id: string;
  customer_name: string;
  service_slug: string;
  service_title: string;
  title: string;
  brief: string;
  deadline: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: TaskStatus;
  price: number;
  worker_id?: string;
  worker_name?: string;
  revision_count: number;
  result_file_url?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuditLogEntity {
  id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  timestamp: string;
}

export interface SeoAuditEntity {
  id: string;
  url: string;
  h1_status: 'PASS' | 'FAIL' | 'WARN';
  meta_title_len: number;
  meta_desc_len: number;
  canonical_match: boolean;
  schema_valid: boolean;
  crawlable: boolean;
  last_checked_at: string;
}
