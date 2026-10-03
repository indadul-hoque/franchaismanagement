import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import { roleMeta } from './config/navigation';

/**
 * ProtectedRoute — Role-Aware Route Guard
 * ────────────────────────────────────────
 * Props:
 *   children     {ReactNode}  - The component to render if auth passes
 *   allowedRoles {string[]}   - Roles permitted to access this route.
 *                               Leave undefined / empty to allow all authenticated users.
 *
 * Behavior:
 *   1. Not authenticated → redirect to /login (preserves intended URL)
 *   2. Authenticated but wrong role → redirect to own role's home dashboard
 *   3. Authenticated + correct role (or no restriction) → render children
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  // ── Guard 1: Must be logged in ─────────────────────────────────────
  if (!isAuthenticated) {
    // Preserve the attempted URL so we can redirect back after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ── Guard 2: Role check (only when allowedRoles is specified) ───────
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect the user to their own correct dashboard home
    const homePath = roleMeta[userRole]?.home || '/login';
    return <Navigate to={homePath} replace />;
  }

  // ── All checks passed → render the protected component ─────────────
  return children;
};

export default ProtectedRoute;
