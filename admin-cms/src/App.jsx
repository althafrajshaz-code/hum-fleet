import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import StaffLogin from './pages/StaffLogin';
import StaffRegister from './pages/StaffRegister';
import StaffDashboard from './pages/StaffDashboard';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<AdminLogin />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/staff/login" element={<StaffLogin />} />
            <Route path="/staff/register" element={<StaffRegister />} />
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
