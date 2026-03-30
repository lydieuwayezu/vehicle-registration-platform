/**
 * FILE: src/components/ProtectedRoute.jsx
 *
 * KEY FUNCTIONALITY:
 * A route guard component that prevents unauthenticated users from accessing
 * protected pages. It wraps any route that requires login in App.jsx.
 *
 * HOW IT WORKS:
 * - It reads isAuthenticated from AuthContext.
 * - If the user IS logged in  → render the page normally (children).
 * - If the user is NOT logged in → redirect them to /login immediately.
 *
 * USAGE IN App.jsx:
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute><Dashboard /></ProtectedRoute>
 *   } />
 *
 * The `replace` prop on <Navigate> replaces the current history entry
 * so the user cannot press the browser Back button to get back to the
 * protected page after being redirected.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  // Read the current authentication status from global context
  const { isAuthenticated } = useAuth();

  // If authenticated, show the requested page
  // If not, send the user to the login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
