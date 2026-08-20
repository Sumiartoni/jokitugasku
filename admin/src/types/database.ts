/**
 * Database Entity Types for JokiTugasKu.id Admin & Worker Hub
 * Exactly matching Notion 08 — ERD & Database Specification
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_OPERATOR' | 'WORKER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  specialization?: string;
  status?: 'ACTIVE' | 'SUSPENDED';
  created_at: string;
  last_login_at?: string;
}

export interface ServiceEntity {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  long_desc: string;
  target_audience: string;
  estimated_time: string;
  is_active: boolean;
}

export interface LeadEntity {
  id: string;
  whatsapp_number: string;
  customer_name?: string;
  service_interest: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes?: string;
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

export interface TaskSubmission {
  notes: string;
  driveLink?: string;
  fileName?: string;
  fileSize?: string;
  submittedAt: string;
  submittedBy?: string;
}

export interface TaskEntity {
  id: string;
  task_code: string;
  customer_name: string;
  customer_phone?: string;
  service_title: string;
  title: string;
  brief: string;
  deadline: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: TaskStatus;
  price: string;
  worker_id?: string;
  worker_email?: string;
  worker_name?: string;
  revision_count: number;
  admin_feedback?: string;
  submission?: TaskSubmission;
  created_at: string;
}
