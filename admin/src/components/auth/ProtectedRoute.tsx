import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-ink-muted font-medium">Memuat sesi keamanan...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If worker tries to access admin pages, redirect to /worker
    if (user.role === 'WORKER') {
      return <Navigate to="/worker" replace />;
    }
    // If admin tries to access worker-only, redirect to dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
