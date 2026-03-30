/**
 * FILE: src/context/AuthContext.jsx
 *
 * KEY FUNCTIONALITY:
 * Provides global authentication state to the entire application using
 * React's Context API. Any component in the app can read whether the user
 * is logged in and call login() or logout() without passing props down manually.
 *
 * HOW IT WORKS:
 * 1. AuthContext is created as a React context object.
 * 2. AuthProvider wraps the whole app (in App.jsx) and holds the auth state.
 * 3. useAuth() is a custom hook that any component calls to access the context.
 *
 * PERSISTENCE:
 * When the user logs in, we save a flag to localStorage so that if they
 * refresh the page, they remain logged in. On logout, the flag is removed.
 *
 * MOCK CREDENTIALS (no real server login):
 * Email:    test@gmail.com
 * Password: Password!234
 */

import { createContext, useContext, useState } from 'react';

// Create the context object — starts as null until the Provider gives it a value
const AuthContext = createContext(null);

// ─── AUTH PROVIDER ────────────────────────────────────────────────────────────
// This component wraps the entire app and makes auth state available everywhere.
// Props: children — everything inside <AuthProvider>...</AuthProvider>
export function AuthProvider({ children }) {

  // Initialize isAuthenticated by checking localStorage on first render.
  // !! converts the string 'true' (or null) into a boolean true/false.
  // This means if the user was logged in before a refresh, they stay logged in.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('auth')
  );

  // ─── LOGIN FUNCTION ─────────────────────────────────────────────────────────
  // Called from the Login page when the user submits the form.
  // Returns true if credentials match, false if they don't.
  const login = (email, password) => {
    // Check against the hardcoded static credentials
    if (email === 'test@gmail.com' && password === 'Password!234') {
      localStorage.setItem('auth', 'true'); // persist session across page refreshes
      setIsAuthenticated(true);             // update state so UI re-renders immediately
      return true;                          // tell the Login page to redirect
    }
    return false; // tell the Login page to show an error message
  };

  // ─── LOGOUT FUNCTION ────────────────────────────────────────────────────────
  // Called from the Navbar when the user clicks Logout.
  const logout = () => {
    localStorage.removeItem('auth'); // clear the session from storage
    setIsAuthenticated(false);       // update state so protected links disappear
  };

  // Provide the auth values to all child components via context
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
