import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersManagementPage } from '@/pages/UsersManagementPage';
import { AiBlogWriterPage } from '@/pages/AiBlogWriterPage';
import { ArticlesManagementPage } from '@/pages/ArticlesManagementPage';
import { SeoCenterPage } from '@/pages/SeoCenterPage';
import { CrmLeadsPage } from '@/pages/CrmLeadsPage';
import { TaskManagementPage } from '@/pages/TaskManagementPage';
import { ContentCmsPage } from '@/pages/ContentCmsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { WorkerPortalPage } from '@/pages/WorkerPortalPage';

export function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Worker Portal View (Protected for Super Admin, Operator, & Worker) */}
            <Route
              path="/worker"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR', 'WORKER']}>
                  <WorkerPortalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR', 'WORKER']}>
                  <WorkerPortalPage />
                </ProtectedRoute>
              }
            />

            {/* Super Admin Exclusive: User & Worker Management */}
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <AdminLayout><UsersManagementPage /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* AI Blog Writer (Groq) */}
            <Route
              path="/ai-blog"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><AiBlogWriterPage /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Kelola Artikel Blog (Super Admin & Operator) */}
            <Route
              path="/articles"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><ArticlesManagementPage /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Management Views (Protected for Super Admin & Operator) */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><DashboardPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><DashboardPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/seo"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><SeoCenterPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crm"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><CrmLeadsPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><TaskManagementPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/content"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><ContentCmsPage /></AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN_OPERATOR']}>
                  <AdminLayout><SettingsPage /></AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
