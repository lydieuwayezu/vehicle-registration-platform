import react from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterVehicle from './pages/RegisterVehicle';
import EditVehicle from './pages/EditVehicle';
import VehicleDetails from './pages/VehicleDetails';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/vehicle/new" element={<ProtectedRoute><RegisterVehicle /></ProtectedRoute>} />
              <Route path="/vehicle/:id/edit" element={<ProtectedRoute><EditVehicle /></ProtectedRoute>} />
              <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
