/**
 * FILE: src/components/Navbar.jsx
 *
 * KEY FUNCTIONALITY:
 * The top navigation bar that appears on every page of the application.
 * It reads the authentication state and conditionally shows different links
 * depending on whether the user is logged in or not.
 *
 * BEHAVIOR:
 * - Guest (not logged in):  shows Home + Login links only
 * - Logged in user:         shows Home + Dashboard + Register Vehicle + Logout button
 *
 * This ensures guests cannot see or click links to protected pages.
 */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  // Get auth state and the logout function from global context
  const { isAuthenticated, logout } = useAuth();

  // useNavigate lets us programmatically redirect after logout
  const navigate = useNavigate();

  // Called when the user clicks the Logout button
  const handleLogout = () => {
    logout();      // clears localStorage and sets isAuthenticated to false
    navigate('/'); // send the user back to the public home page
  };

  return (
    <nav className="navbar">
      {/* Brand logo / home link — always visible */}
      <Link to="/" className="nav-brand">🚗 VehicleReg</Link>

      <div className="nav-links">
        {/* Home is always visible to everyone */}
        <Link to="/">Home</Link>

        {/* Dashboard and Register Vehicle only appear when logged in */}
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        {isAuthenticated && <Link to="/vehicle/new">Register Vehicle</Link>}

        {/* Show Logout button if logged in, or Login link if not */}
        {isAuthenticated
          ? <button onClick={handleLogout} className="btn-link">Logout</button>
          : <Link to="/login">Login</Link>
        }
      </div>
    </nav>
  );
}
